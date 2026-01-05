import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Proposal from "@/models/Proposal"
import Project from "@/models/Project"
import Provider from "@/models/Provider"
import { getCurrentUser } from "@/lib/auth/jwt"
import mongoose from "mongoose"
import Requirement from "@/models/Requirement"
import Notification from "@/models/Notification"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const requirementId = searchParams.get("requirementId")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const query: any = {}
    const skip = (page - 1) * limit

    // -----------------------------
    // Role-based filtering
    // -----------------------------
    if (user.role === "agency") {
      query.agencyId = user.userId
    }

    if (user.role === "client") {
      query.clientId = user.userId
    }

    if (requirementId) query.requirementId = requirementId
    if (status) query.status = status

    // -----------------------------
    // Fetch proposals
    // -----------------------------
    const [proposals, total] = await Promise.all([
      Proposal.find(query)
        .populate("requirementId", "title category budgetMin budgetMax")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Proposal.countDocuments(query),
    ])

    // -----------------------------
    // Fetch agency details
    // -----------------------------
    const agencyUserIds = [
      ...new Set(proposals.map((p: any) => p.agencyId.toString())),
    ]

    const agencies = await Provider.find({
      userId: { $in: agencyUserIds },
    })
      .select(
        "userId name logo location rating reviewCount services technologies coverImage"
      )
      .lean()

    const agencyMap = new Map(
      agencies.map((a: any) => [a.userId.toString(), a])
    )

    // -----------------------------
    // Format response
    // -----------------------------
    const formattedProposals = proposals.map((p: any) => ({
      id: p._id.toString(),

      requirement: {
        id: p.requirementId?._id?.toString(),
        title: p.requirementId?.title,
        category: p.requirementId?.category,
        budgetMin: p.requirementId?.budgetMin,
        budgetMax: p.requirementId?.budgetMax,
      },

      agency: agencyMap.get(p.agencyId.toString()) || null,
      agencyId:p.agencyId,

      coverLetter: p.coverLetter,
      proposedBudget: p.proposedBudget,
      proposedTimeline: p.proposedTimeline,
      milestones: p.milestones,
      status: p.status,
      clientViewed: p.clientViewed,
      clientViewedAt: p.clientViewedAt,
      clientResponded: p.clientResponded,
      clientRespondedAt: p.clientRespondedAt,
      conversationStarted: p.conversationStarted,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }))

    return NextResponse.json({
      proposals: formattedProposals,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching proposals:", error)
    return NextResponse.json({ error: "Failed to fetch proposals" }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (user.role !== "agency") {
      return NextResponse.json({ error: "Only agencies can submit proposals" }, { status: 403 })
    }

    await connectToDatabase()

    const body = await request.json()
     const { requirementId, proposalDescription, clientId, proposedBudget, proposedTimeline, coverLetter, milestones } = body

    // if (!projectId || !proposedBudget || !coverLetter) {
    //   return NextResponse.json(
    //     { error: "Missing required fields: projectId, proposedBudget, coverLetter" },
    //     { status: 400 },
    //   )
    // }

    if (!mongoose.Types.ObjectId.isValid(requirementId)) {
      return NextResponse.json({ error: "Invalid requirement ID" }, { status: 400 })
    }

    // Get provider profile
    const provider = await Provider.findOne({ userId: user.userId })
    if (!provider) {
      return NextResponse.json(
        { error: "Provider profile not found. Please complete your agency profile first." },
        { status: 404 },
      )
    }

    // Check if project exists and is open
    const project = await Requirement.findById(requirementId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.status.toLocaleLowerCase() === "closed" || project.status.toLocaleLowerCase() === "Allocated") {
      return NextResponse.json({ error: "Project is not accepting proposals" }, { status: 400 })
    }

    // Check if already submitted proposal
    const existingProposal = await Proposal.findOne({
      requirementId,
      agencyId: user.userId,
    })

    if (existingProposal) {
      return NextResponse.json({ error: "You have already submitted a proposal for this project" }, { status: 409 })
    }

    // Create proposal
    const proposal = await Proposal.create({
      requirementId,
      clientId,
      agencyId: user.userId,
      coverLetter,
      proposedBudget,
      proposalDescription,
      proposedTimeline: proposedTimeline || "As discussed",
      milestones: milestones || [],
      status: "pending",
      clientViewed: false,
      clientResponded: false,
      conversationStarted: false,
    })

    // Update project proposal count
     await Requirement.findByIdAndUpdate(requirementId, { $inc: { proposals: 1 } })

     await Notification.create({
          userId: clientId,                 //  RECEIVER (client)
          triggeredBy: user.userId,          // AGENCY who submitted proposal
          title: "New Proposal Received!",
          message: `${provider.name} submitted a proposal for your ${project.title} project.`,
          type: "proposal_submitted",
          userRole: "client",
          linkUrl: `/client/dashboard/projects/${requirementId}`,
          sourceId: proposal._id,
        })


    return NextResponse.json({
      success: true,
      proposal
    })
  } catch (error) {
    console.error("Error creating proposal:", error)
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 })
  }
}
