import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Provider from "@/models/Provider"
import Review from "@/models/Review"
import { getCurrentUser } from "@/lib/auth/jwt"
import mongoose from "mongoose"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()

    const { id } = await params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid provider ID" }, { status: 400 })
    }

    const provider = await Provider.findById(id).lean()

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    // Increment profile views
    await Provider.findByIdAndUpdate(id, { $inc: { profileViews: 1 } })

    // Get reviews for this provider
    const reviews = await Review.find({ providerId: id, isPublic: true })
      .populate("clientId", "name company")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    const formattedReviews = reviews.map((r: any) => ({
      id: r._id.toString(),
      clientName: r.clientId?.name || "Anonymous",
      clientCompany: r.clientId?.company || "",
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
      provider: {
        id: (provider as any)._id.toString(),
        userId: (provider as any).userId?.toString(),
        name: (provider as any).name,
        tagline: (provider as any).tagline,
        description: (provider as any).description,
        logo: (provider as any).logo,
        coverImage: (provider as any).coverImage,
        location: (provider as any).location,
        website: (provider as any).website,
        email: (provider as any).email,
        salesEmail: (provider as any).salesEmail,
        phone: (provider as any).phone,
        adminContactPhone: (provider as any).adminContactPhone,
        services: (provider as any).services,
        technologies: (provider as any).technologies,
        industries: (provider as any).industries,
        rating: (provider as any).rating,
        reviewCount: (provider as any).reviewCount,
        projectsCompleted: (provider as any).projectsCompleted,
        hourlyRate: (provider as any).hourlyRate,
        minProjectSize: (provider as any).minProjectSize,
        teamSize: (provider as any).teamSize,
        foundedYear: (provider as any).foundedYear,
        portfolio: (provider as any).portfolio,
        testimonials: (provider as any).testimonials,
        certifications: (provider as any).certifications,
        awards: (provider as any).awards,
        socialLinks: (provider as any).socialLinks,
        isFeatured: (provider as any).isFeatured,
        isVerified: (provider as any).isVerified,
        profileViews: ((provider as any).profileViews || 0) + 1,
        createdAt: (provider as any).createdAt,
      },
      reviews: formattedReviews,
    })
  } catch (error) {
    console.error("Error fetching provider:", error)
    return NextResponse.json({ error: "Failed to fetch provider" }, { status: 500 })
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
      return NextResponse.json({ error: "Invalid provider ID" }, { status: 400 })
    }

    const provider = await Provider.findById(id)

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    if (provider.userId.toString() !== user.userId && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }

    const body = await request.json()
    const allowedUpdates = [
      "name",
      "tagline",
      "description",
      "logo",
      "coverImage",
      "location",
      "website",
      "email",
      "salesEmail",
      "phone",
      "adminContactPhone",
      "services",
      "technologies",
      "industries",
      "hourlyRate",
      "minProjectSize",
      "teamSize",
      "foundedYear",
      "portfolio",
      "testimonials",
      "certifications",
      "awards",
      "socialLinks",
    ]

    const updates: any = {}
    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key]
      }
    }

    // Admin-only updates
    if (user.role === "admin") {
      if (body.isFeatured !== undefined) updates.isFeatured = body.isFeatured
      if (body.isVerified !== undefined) updates.isVerified = body.isVerified
      if (body.isActive !== undefined) updates.isActive = body.isActive
    }

    const updated = await Provider.findByIdAndUpdate(id, updates, { new: true })

    return NextResponse.json({
      success: true,
      provider: {
        id: updated!._id.toString(),
        name: updated!.name,
        tagline: updated!.tagline,
        description: updated!.description,
        services: updated!.services,
        rating: updated!.rating,
        isFeatured: updated!.isFeatured,
        isVerified: updated!.isVerified,
        updatedAt: updated!.updatedAt,
      },
    })
  } catch (error) {
    console.error("Error updating provider:", error)
    return NextResponse.json({ error: "Failed to update provider" }, { status: 500 })
  }
}
