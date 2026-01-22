
import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

import { getCurrentUser } from "@/lib/auth/jwt"
import mongoose from "mongoose"

import SearchKeyword from "@/models/SearchKeyword"
import SearchLog from "@/models/SearchLog"



export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const user = await getCurrentUser()
    const body = await req.json()

    const keyword = body.keyword?.trim().toLowerCase()

    if (!keyword) {
      return NextResponse.json(
        { error: "Keyword is required" },
        { status: 400 },
      )
    }

    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown"

    const today = new Date().toISOString().split("T")[0]

    // 1️⃣ Try inserting log (once per day)
    const log = await SearchLog.findOneAndUpdate(
      {
        keyword,
        ipAddress,
        searchedDate: today,
      },
      {
        keyword,
        ipAddress,
        searchedDate: today,
      },
      {
        upsert: true,
        new: false, // IMPORTANT
      },
    )

    // 2️⃣ Increment only if NEW log
    if (!log) {
      await SearchKeyword.findOneAndUpdate(
        { keyword },
        { $inc: { searchCount: 1 } },
        { upsert: true },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to track search" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    await connectToDatabase()

    const trending = await SearchKeyword.find()
      .sort({ searchCount: -1 })
      .limit(5)   // 🔥 TOP 5 only
      .lean()

    return NextResponse.json({ success: true, trending })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch trending searches" },
      { status: 500 },
    )
  }
}