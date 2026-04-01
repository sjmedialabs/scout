import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Review from "@/models/Review";
import { getCurrentUser } from "@/lib/auth/jwt";
import Seeker from "@/models/Seeker";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getCurrentUser();
    // if (!user) {
    //   return NextResponse.json(
    //     { error: "Authentication required" },
    //     { status: 401 }
    //   )
    // }

    await connectToDatabase();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid provider ID" },
        { status: 400 },
      );
    }

    const providerObjectId = new mongoose.Types.ObjectId(id);

    const reviews = await Review.aggregate([
      {
        $match: {
          providerId: providerObjectId,
          isPublic: true,
        },
      },

      // 🔹 Join Seeker (client details)
      {
        $lookup: {
          from: "seekers",
          localField: "clientId",
          foreignField: "userId",
          as: "client",
        },
      },
      {
        $unwind: {
          path: "$client",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 🔹 Join Requirement (project details)
      {
        $lookup: {
          from: "requirements",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: {
          path: "$project",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 🔹 Shape final response
       {
        $project: {
          //  Main rating
          rating: 1,

          //  Old rating fields (KEEP for old data)
          scheduleRating: { $ifNull: ["$scheduleRating", null] },
          costRating: { $ifNull: ["$costRating", null] },

          //  New rating fields
          communicationRating: { $ifNull: ["$communicationRating", null] },
          ontimeDeliveryRating: { $ifNull: ["$ontimeDeliveryRating", null] },
          qualityRating: { $ifNull: ["$qualityRating", null] },
          strategicThinkingRating: { $ifNull: ["$strategicThinkingRating", null] },
          ROIClarityRating: { $ifNull: ["$ROIClarityRating", null] },
          willingToReferRating: { $ifNull: ["$willingToReferRating", null] },
          transparencyRating: { $ifNull: ["$transparencyRating", null] },
          flexibilityRating: { $ifNull: ["$flexibilityRating", null] },
          valueForMoneyRating: { $ifNull: ["$valueForMoneyRating", null] },
          postLaunchSupportRating: { $ifNull: ["$postLaunchSupportRating", null] },

          //  Project timeline
          projectStartDate: { $ifNull: ["$projectStartDate", null] },
          projectEndDate: { $ifNull: ["$projectEndDate", null] },

          //  Review content
          title: 1,
          content: 1,
          pros: 1,
          cons: 1,
          keyHighLights: 1,
          createdAt: 1,

          response: { $ifNull: ["$response", {}] },

          //  Client details
          client: {
            name: "$client.name",
            companyName: "$client.companyName",
            industry: "$client.industry",
            location: "$client.location",
            companySize: "$client.companySize",
            isVerified: "$client.isVerified",
            position: "$client.position",
          },

          //  Project details
          project: {
            title: "$project.title",
            category: "$project.category",
            description: "$project.description",
            budgetMin: "$project.budgetMin",
            budgetMax: "$project.budgetMax",
          },
        },
      },

      {
        $sort: { createdAt: -1 },
      },
    ]);

    return NextResponse.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching provider reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    // ✅ Only agency/provider allowed
    if (user.role !== "agency") {
      return NextResponse.json(
        { error: "Only agencies can respond to reviews" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }

    const body = await req.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Response content is required" },
        { status: 400 },
      );
    }

    // ✅ Find review & verify ownership
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // 🔐 Ensure this review belongs to logged-in provider
    if (review.providerId.toString() !== user.userId) {
      return NextResponse.json(
        { error: "Unauthorized to respond to this review" },
        { status: 403 },
      );
    }

    // ✅ Update response
    review.response = {
      content,
      respondedAt: new Date(),
    };

    await review.save();

    return NextResponse.json({
      success: true,
      message: "Response added successfully",
      response: review.response,
    });
  } catch (error) {
    console.error("Error responding to review:", error);
    return NextResponse.json(
      { error: "Failed to respond to review" },
      { status: 500 },
    );
  }
}
