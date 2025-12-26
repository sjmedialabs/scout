import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"
import { connectToDatabase } from "@/lib/mongodb"
import Comparision from "@/models/Comparision"

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const body = await req.json()
    const { clientId, agencyId, projectId, proposalId } = body

    // ✅ Validate required fields
    if (!clientId || !agencyId || !projectId || !proposalId) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      )
    }

    // ✅ Validate ObjectIds
    const ids = [clientId, agencyId, projectId, proposalId]
    const isValid = ids.every((id) => mongoose.Types.ObjectId.isValid(id))

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid ObjectId provided" },
        { status: 400 }
      )
    }

    // ✅ Check existing comparisons for clientId
    const comparisonCount = await Comparision.countDocuments({ clientId })

    if (comparisonCount >= 4) {
      return NextResponse.json(
        {
          success: false,
          message: "Maximum 4 comparisons allowed per client",
        },
        { status: 400 }
      )
    }

    // ✅ Prevent duplicate comparison (optional but recommended)
    const alreadyExists = await Comparision.findOne({
      clientId,
      agencyId,
      projectId,
      proposalId,
    })

    if (alreadyExists) {
      return NextResponse.json(
        {
          success: false,
          message: "This comparison already exists",
        },
        { status: 409 }
      )
    }

    // ✅ Create comparison
    const comparison = await Comparision.create({
      clientId,
      agencyId,
      projectId,
      proposalId,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Comparison added successfully",
        data: comparison,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Comparison POST Error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
