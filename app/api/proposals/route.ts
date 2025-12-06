import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Proposal from "@/models/Proposal"
import Project from "@/models/Project"
import Provider from "@/models/Provider"
import { getCurrentUser } from "@/lib/auth/jwt"
import mongoose from "mongoose"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const query: any = {}
    const skip = (page - 1) * limit

    if (user.role === "agency") {
      // Get provider's proposals
      const provider = await Provider.findOne({ userId: user.userId })
      if (provider) {
        query.providerId = provider._id
      } else {
        return NextResponse.json({ proposals: [], pagination: { total: 0, page: 1, limit, pages: 0 } })
      }
    } else if (user.role === "client") {
      // Get proposals for client's projects
      if (projectId) {
        query.projectId = projectId
      } else {
        const clientProjects = await Project.find({ clientId: user.userId }).select("_id")
        query.projectId = { $in: clientProjects.map((p) => p._id) }
      }
    }

    if (status) query.status = status

    const [proposals, total] = await Promise.all([
      Proposal.find(query)
        .populate("projectId", "title category budget")
        .populate("providerId", "name logo rating reviewCount location")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Proposal.countDocuments(query),
    ])

    const formattedProposals = proposals.map((p: any) => ({
      id: p._id.toString(),
      projectId: p.projectId?._id?.toString() || p.projectId,
      projectTitle: p.projectId?.title || "Unknown Project",
      projectCategory: p.projectId?.category || "",
      projectBudget: p.projectId?.budget || "",
      providerId: p.providerId?._id?.toString() || p.providerId,
      providerName: p.providerId?.name || "Unknown Provider",
      providerLogo: p.providerId?.logo || "",
      providerRating: p.providerId?.rating || 0,
      providerReviewCount: p.providerId?.reviewCount || 0,
      providerLocation: p.providerId?.location || "",
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
    const { projectId, proposedBudget, proposedTimeline, coverLetter, milestones } = body

    if (!projectId || !proposedBudget || !coverLetter) {
      return NextResponse.json(
        { error: "Missing required fields: projectId, proposedBudget, coverLetter" },
        { status: 400 },
      )
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
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
    const project = await Project.findById(projectId)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.status !== "open") {
      return NextResponse.json({ error: "Project is not accepting proposals" }, { status: 400 })
    }

    // Check if already submitted proposal
    const existingProposal = await Proposal.findOne({
      projectId,
      providerId: provider._id,
    })

    if (existingProposal) {
      return NextResponse.json({ error: "You have already submitted a proposal for this project" }, { status: 409 })
    }

    // Create proposal
    const proposal = await Proposal.create({
      projectId,
      providerId: provider._id,
      userId: user.userId,
      coverLetter,
      proposedBudget,
      proposedTimeline: proposedTimeline || "As discussed",
      milestones: milestones || [],
      status: "pending",
      clientViewed: false,
      clientResponded: false,
      conversationStarted: false,
    })

    // Update project proposal count
    await Project.findByIdAndUpdate(projectId, { $inc: { proposalCount: 1 } })

    return NextResponse.json({
      success: true,
      proposal: {
        id: proposal._id.toString(),
        projectId: proposal.projectId.toString(),
        providerId: proposal.providerId.toString(),
        proposedBudget: proposal.proposedBudget,
        proposedTimeline: proposal.proposedTimeline,
        status: proposal.status,
        createdAt: proposal.createdAt,
      },
    })
  } catch (error) {
    console.error("Error creating proposal:", error)
    return NextResponse.json({ error: "Failed to create proposal" }, { status: 500 })
  }
}
