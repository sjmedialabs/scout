import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb";
import Lead from "@/models/leads"
import { getCurrentUser } from "@/lib/auth/jwt";
import mongoose from "mongoose"

interface Params {
  params: {
    id: string
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase()

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = params

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Lead ID" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { status } = body

    // ✅ Validate status
    if (!["pending", "cleared"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      )
    }

    // ✅ Ensure user owns the lead
    const lead = await Lead.findOneAndUpdate(
      { _id: id, userId: user.userId },
      { status },
      { new: true }
    )

    if (!lead) {
      return NextResponse.json(
        { message: "Lead not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Status updated successfully", data: lead },
      { status: 200 }
    )

  } catch (error) {
    console.error("UPDATE LEAD STATUS ERROR:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}