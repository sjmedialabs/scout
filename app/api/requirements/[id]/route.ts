import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Requirement from "@/models/Requirement"
import { getCurrentUser } from "@/lib/auth/jwt"   // <-- IMPORTANT
import { error } from "console"
import mongoose from "mongoose"

// GET Requirements


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()

    const { id } = await params

    console.log("---client Id:::",id);

    // ✅ Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid client ID" },
        { status: 400 }
      )
    }

    const clientObjectId = new mongoose.Types.ObjectId(id)

    const search = req.nextUrl.searchParams.get("search") || ""
    const category = req.nextUrl.searchParams.get("category") || ""
    const minBudget = Number(req.nextUrl.searchParams.get("minBudget") || 0)
    const maxBudget = Number(req.nextUrl.searchParams.get("maxBudget") || 9999999)

    // ✅ Build query
    const query: any = {
      clientId: clientObjectId, // ObjectId match
    }

    if (search) {
      query.title = { $regex: search, $options: "i" }
    }

    if (category && category !== "all") {
      query.category = category
    }

    query.budgetMin = { $lte: maxBudget }
    query.budgetMax = { $gte: minBudget }

    const requirements = await Requirement.find(query)
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      requirements,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch requirements" },
      { status: 500 }
    )
  }
}