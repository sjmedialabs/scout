import { type NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Review from "@/models/Review";
import Provider from "@/models/Provider";
import Project from "@/models/Project";
import { getCurrentUser } from "@/lib/auth/jwt";
import mongoose from "mongoose";
import Requirement from "@/models/Requirement";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const isAdmin = user.role === "admin";

    // 🔹 Build match condition dynamically
    const matchStage: any = {
      isPublic: true,
    };

    // 🔹 Only providers are restricted by providerId
    if (!isAdmin) {
      const id = user.userId;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
          { error: "Invalid provider ID" },
          { status: 400 },
        );
      }

      matchStage.providerId = new mongoose.Types.ObjectId(id);
    }

    const reviews = await Review.aggregate([
      {
        $match: matchStage,
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

      // 🔹 Final response shape (UNCHANGED)
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


export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (user.role !== "client") {
      return NextResponse.json(
        { error: "Only clients can submit reviews" },
        { status: 403 },
      );
    }

    await connectToDatabase();

    const body = await request.json();

    const {
      providerId,
      projectId,

      rating,

      // ⭐ Old optional ratings (keep)
      qualityRating,
      scheduleRating,
      costRating,

      // ⭐ New required ratings
      communicationRating,
      ontimeDeliveryRating,
      strategicThinkingRating,
      ROIClarityRating,
      willingToReferRating,
      transparencyRating,
      flexibilityRating,
      valueForMoneyRating,
      postLaunchSupportRating,

      // ⭐ Other fields
      projectStartDate,
      projectEndDate,

      title,
      content,
      pros,
      cons,
      keyHighLights,
    } = body;

    // ✅ Required field validation
    if (
      !providerId ||
      !projectId ||
      !rating ||
      !content ||

      !communicationRating ||
      !ontimeDeliveryRating ||
      !strategicThinkingRating ||
      !ROIClarityRating ||
      !willingToReferRating ||
      !transparencyRating ||
      !flexibilityRating ||
      !valueForMoneyRating ||
      !postLaunchSupportRating
    ) {
      return NextResponse.json(
        { error: "Missing required review fields" },
        { status: 400 },
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(providerId) ||
      !mongoose.Types.ObjectId.isValid(projectId)
    ) {
      return NextResponse.json(
        { error: "Invalid provider or project ID" },
        { status: 400 },
      );
    }

    // 🔹 Verify project ownership
    const project = await Requirement.findById(projectId);

    if (!project || project.clientId.toString() !== user.userId) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 },
      );
    }

    // 🔹 Prevent duplicate review
    const existingReview = await Review.findOne({
      clientId: user.userId,
      providerId,
      projectId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this provider" },
        { status: 409 },
      );
    }

    // Create Review (UPDATED)
    const review = await Review.create({
      providerId,
      clientId: user.userId,
      projectId,

      rating,

      qualityRating: qualityRating,

      // New ratings
      communicationRating,
      ontimeDeliveryRating,
      strategicThinkingRating,
      ROIClarityRating,
      willingToReferRating,
      transparencyRating,
      flexibilityRating,
      valueForMoneyRating,
      postLaunchSupportRating,

      projectStartDate,
      projectEndDate,

      title,
      content,

      pros: pros || [],
      cons: cons || [],
      keyHighLights: keyHighLights || [],

      isVerified: false,
      isPublic: true,
    });

    // 🔹 Mark project reviewed
    await Requirement.findByIdAndUpdate(projectId, {
      isReviewed: true,
    });

    // 🔹 Update provider ratings (UNCHANGED logic)
    // 🔹 Update provider ratings (UPDATED FOR ALL FIELDS)

const reviews = await Review.find({
  providerId,
  isPublic: true,
});

// helper function
const avg = (field: string) =>
  reviews.reduce((sum, r) => sum + (r[field] || 0), 0) /
  reviews.length;

//  Calculate averages
const avgRating = avg("rating");

const avgCommunicationRating = avg("communicationRating");
const avgOntimeDeliveryRating = avg("ontimeDeliveryRating");
const avgQualityRating = avg("qualityRating");
const avgStrategicThinkingRating = avg("strategicThinkingRating");
const avgROIClarityRating = avg("ROIClarityRating");
const avgWillingToReferRating = avg("willingToReferRating");
const avgTransparencyRating = avg("transparencyRating");
const avgFlexibilityRating = avg("flexibilityRating");
const avgValueForMoneyRating = avg("valueForMoneyRating");
const avgPostLaunchSupportRating = avg("postLaunchSupportRating");

//  Update provider
const providerToupdate = await Provider.findOneAndUpdate(
  { userId: providerId },
  {
    rating: Math.round(avgRating * 10) / 10,

    reviewCount: reviews.length,

    communicationRating:
      Math.round(avgCommunicationRating * 10) / 10,

    ontimeDeliveryRating:
      Math.round(avgOntimeDeliveryRating * 10) / 10,

    qualityRating:
      Math.round(avgQualityRating * 10) / 10,

    strategicThinkingRating:
      Math.round(avgStrategicThinkingRating * 10) / 10,

    ROIClarityRating:
      Math.round(avgROIClarityRating * 10) / 10,

    willingToReferRating:
      Math.round(avgWillingToReferRating * 10) / 10,

    transparencyRating:
      Math.round(avgTransparencyRating * 10) / 10,

    flexibilityRating:
      Math.round(avgFlexibilityRating * 10) / 10,

    valueForMoneyRating:
      Math.round(avgValueForMoneyRating * 10) / 10,

    postLaunchSupportRating:
      Math.round(avgPostLaunchSupportRating * 10) / 10,
  },
  { new: true },
);

console.log("--Updated provider ratings:", providerToupdate);

    return NextResponse.json({
      success: true,
      review: {
        id: review._id.toString(),
        rating: review.rating,
        title: review.title,
        content: review.content,
        createdAt: review.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating review:", error);

    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}
