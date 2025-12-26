import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/mongodb"
import Comparision from "@/models/Comparision"
import { getCurrentUser } from "@/lib/auth/jwt"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    await connectToDatabase()

    const { id } = params

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid clientId" },
        { status: 400 }
      )
    }

    const clientObjectId = new mongoose.Types.ObjectId(id)

    // ✅ Aggregation pipeline
    const comparisons = await Comparision.aggregate([
      {
        $match: {
          clientId: clientObjectId,
        },
      },

      // 🔗 Join Provider (agency) details
      {
        $lookup: {
          from: "providers",
          localField: "agencyId",
          foreignField: "userId",
          as: "agency",
        },
      },
      {
        $unwind: {
          path: "$agency",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 🔗 Join Proposal details
      {
        $lookup: {
          from: "proposals",
          localField: "proposalId",
          foreignField: "_id",
          as: "proposal",
        },
      },
      {
        $unwind: {
          path: "$proposal",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 🎯 Final response shaping
      {
        $project: {
          _id: 1,
          clientId: 1,

          agency: {
            name: "$agency.name",
            coverImage: "$agency.coverImage",
            rating: "$agency.rating",
            reviewCount: "$agency.reviewCount",
            costRating: "$agency.costRating",
            qualityRating: "$agency.qualityRating",
            scheduleRating: "$agency.scheduleRating",
            willingToReferRating: "$agency.willingToReferRating",
            location: "$agency.location",
          },

          proposal: {
            proposedBudget: "$proposal.proposedBudget",
            proposedTimeline: "$proposal.proposedTimeline",
          },

          createdAt: 1,
        },
      },
    ])

    return NextResponse.json(
      {
        success: true,
        data: comparisons,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("GET Comparison Error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    await connectToDatabase()

    const { id } = params

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid comparison id" },
        { status: 400 }
      )
    }

    // ✅ Delete document
    const deletedComparison = await Comparision.findByIdAndDelete(id)

    if (!deletedComparison) {
      return NextResponse.json(
        { success: false, message: "Comparison not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comparison deleted successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("DELETE Comparison Error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
