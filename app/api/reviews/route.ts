import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Review from "@/models/Review"
import Provider from "@/models/Provider"
import Project from "@/models/Project"
import { getCurrentUser } from "@/lib/auth/jwt"
import mongoose from "mongoose"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const providerId = searchParams.get("providerId")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const query: any = { isPublic: true }

    if (providerId && mongoose.Types.ObjectId.isValid(providerId)) {
      query.providerId = providerId
    }

    const skip = (page - 1) * limit

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("clientId", "name company")
        .populate("providerId", "name logo")
        .populate("projectId", "title category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
    ])

    const formattedReviews = reviews.map((r: any) => ({
      id: r._id.toString(),
      providerId: r.providerId?._id?.toString(),
      providerName: r.providerId?.name,
      providerLogo: r.providerId?.logo,
      clientName: r.clientId?.name || "Anonymous",
      clientCompany: r.clientId?.company,
      projectTitle: r.projectId?.title,
      projectCategory: r.projectId?.category,
      rating: r.rating,
      qualityRating: r.qualityRating,
      scheduleRating: r.scheduleRating,
      costRating: r.costRating,
      willingToReferRating: r.willingToReferRating,
      title: r.title,
      content: r.content,
      pros: r.pros,
      cons: r.cons,
      isVerified: r.isVerified,
      response: r.response,
      createdAt: r.createdAt,
    }))

    return NextResponse.json({
      reviews: formattedReviews,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (user.role !== "client") {
      return NextResponse.json({ error: "Only clients can submit reviews" }, { status: 403 })
    }

    await connectToDatabase()

    const body = await request.json()
    const {
      providerId,
      projectId,
      rating,
      qualityRating,
      scheduleRating,
      costRating,
      willingToReferRating,
      title,
      content,
      pros,
      cons,
    } = body

    if (!providerId || !projectId || !rating || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: providerId, projectId, rating, title, content" },
        { status: 400 },
      )
    }

    if (!mongoose.Types.ObjectId.isValid(providerId) || !mongoose.Types.ObjectId.isValid(projectId)) {
      return NextResponse.json({ error: "Invalid provider or project ID" }, { status: 400 })
    }

    // Verify project belongs to user
    const project = await Project.findById(projectId)
    if (!project || project.clientId.toString() !== user.userId) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 })
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      clientId: user.userId,
      providerId,
      projectId,
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this provider for this project" }, { status: 409 })
    }

    // Create review
    const review = await Review.create({
      providerId,
      clientId: user.userId,
      projectId,
      rating,
      qualityRating: qualityRating || rating,
      scheduleRating: scheduleRating || rating,
      costRating: costRating || rating,
      willingToReferRating: willingToReferRating || rating,
      title,
      content,
      pros: pros || [],
      cons: cons || [],
      isVerified: false,
      isPublic: true,
    })

    // Update provider rating
    const reviews = await Review.find({ providerId, isPublic: true })
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await Provider.findByIdAndUpdate(providerId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    })

    return NextResponse.json({
      success: true,
      review: {
        id: review._id.toString(),
        rating: review.rating,
        title: review.title,
        content: review.content,
        createdAt: review.createdAt,
      },
    })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
