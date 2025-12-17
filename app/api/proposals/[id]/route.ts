import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Proposal from "@/models/Proposal"
import Project from "@/models/Project"
import Provider from "@/models/Provider"
import { getCurrentUser } from "@/lib/auth/jwt"
import mongoose from "mongoose"
import Requirement from "@/models/Requirement"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid proposal ID" }, { status: 400 })
    }

    const proposal = await Proposal.findById(id)
      .populate("projectId", "title category budget clientId")
      .populate("providerId", "name logo rating reviewCount location services")
      .lean()

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    // Mark as viewed if client is viewing
    if (user.role === "client" && !(proposal as any).clientViewed) {
      await Proposal.findByIdAndUpdate(id, {
        clientViewed: true,
        clientViewedAt: new Date(),
      })
    }

    return NextResponse.json({
      proposal: {
        id: (proposal as any)._id.toString(),
        projectId: (proposal as any).projectId?._id?.toString(),
        projectTitle: (proposal as any).projectId?.title,
        projectCategory: (proposal as any).projectId?.category,
        projectBudget: (proposal as any).projectId?.budget,
        providerId: (proposal as any).providerId?._id?.toString(),
        providerName: (proposal as any).providerId?.name,
        providerLogo: (proposal as any).providerId?.logo,
        providerRating: (proposal as any).providerId?.rating,
        providerLocation: (proposal as any).providerId?.location,
        providerServices: (proposal as any).providerId?.services,
        coverLetter: (proposal as any).coverLetter,
        proposedBudget: (proposal as any).proposedBudget,
        proposedTimeline: (proposal as any).proposedTimeline,
        milestones: (proposal as any).milestones,
        status: (proposal as any).status,
        clientViewed: true,
        clientViewedAt: (proposal as any).clientViewedAt || new Date(),
        clientResponded: (proposal as any).clientResponded,
        conversationStarted: (proposal as any).conversationStarted,
        createdAt: (proposal as any).createdAt,
        updatedAt: (proposal as any).updatedAt,
      },
    })
  } catch (error) {
    console.error("Error fetching proposal:", error)
    return NextResponse.json({ error: "Failed to fetch proposal" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid proposal ID" }, { status: 400 })
    }

    const proposal = await Proposal.findById(id).populate("requirementId", "clientId")

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    const body = await request.json()
    const updates: any = {}

    // Agency can update their proposal content
    if (user.role === "agency") {
      const provider = await Provider.findOne({ userId: user.userId })
      if (!provider || proposal.agencyId.toString() !== user.userId) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 })
      }

      if (body.coverLetter) updates.coverLetter = body.coverLetter
      if (body.proposedBudget) updates.proposedBudget = body.proposedBudget
      if (body.proposedTimeline) updates.proposedTimeline = body.proposedTimeline
      if (body.milestones) updates.milestones = body.milestones
      if (body.status === "withdrawn") updates.status = "withdrawn"
    }

    // Client can update proposal status
    if (user.role === "client") {
      const project = proposal.requirementId as any
      if (project.clientId.toString() !== user.userId) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 })
      }

      if (body.status && ["viewed", "shortlisted", "accepted", "rejected"].includes(body.status)) {
        updates.status = body.status
        updates.clientResponded = true
        updates.clientRespondedAt = new Date()
        //for the posted requirement status update
        if(body.status.toLocaleLowerCase()==="shortlisted"){
           await Requirement.findByIdAndUpdate(proposal.requirementId, {status:body.status}, { new: true })
        }
        if(body.status.toLocaleLowerCase()==="accepted"){
          await Requirement.findByIdAndUpdate(proposal.requirementId, {status:"Closed"}, { new: true })
          await Proposal.updateMany(
            {
              requirementId:proposal.requirementId,
              _id: { $ne:id } // exclude accepted proposal
            },
            {
              $set: { status: "rejected" }
            }
          )

        }
      }

      if (body.conversationStarted !== undefined) {
        updates.conversationStarted = body.conversationStarted
      }

      if (body.rating) {
        updates.rating = body.rating
      }
    }

    // Admin can update anything
    if (user.role === "admin") {
      Object.assign(updates, body)
    }

    const updated = await Proposal.findByIdAndUpdate(id, updates, { new: true })

    return NextResponse.json({
      success: true,
      proposal: {
        id: updated!._id.toString(),
        status: updated!.status,
        clientViewed: updated!.clientViewed,
        clientResponded: updated!.clientResponded,
        conversationStarted: updated!.conversationStarted,
        updatedAt: updated!.updatedAt,
      },
    })
  } catch (error) {
    console.error("Error updating proposal:", error)
    return NextResponse.json({ error: "Failed to update proposal" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid proposal ID" }, { status: 400 })
    }

    const proposal = await Proposal.findById(id)

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    // Only the agency that submitted or admin can delete
    if (user.role === "agency") {
      const provider = await Provider.findOne({ userId: user.userId })
      if (!provider || proposal.providerId.toString() !== provider._id.toString()) {
        return NextResponse.json({ error: "Not authorized" }, { status: 403 })
      }
    } else if (user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    // Update project proposal count
    await Project.findByIdAndUpdate(proposal.projectId, { $inc: { proposalCount: -1 } })

    // Delete proposal
    await Proposal.findByIdAndDelete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting proposal:", error)
    return NextResponse.json({ error: "Failed to delete proposal" }, { status: 500 })
  }
}
