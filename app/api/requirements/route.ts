import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Requirement from "@/models/Requirement"
import { getCurrentUser } from "@/lib/auth/jwt"   // <-- IMPORTANT

// GET Requirements
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const search = req.nextUrl.searchParams.get("search") || ""
    const category = req.nextUrl.searchParams.get("category") || ""
    const minBudget = Number(req.nextUrl.searchParams.get("minBudget") || 0)
    const maxBudget = Number(req.nextUrl.searchParams.get("maxBudget") || 9999999)

    const query: any = {}

    if (search) query.title = { $regex: search, $options: "i" }
    if (category && category !== "all") query.category = category

    query.budgetMin = { $lte: maxBudget }
    query.budgetMax = { $gte: minBudget }

    const requirements = await Requirement.find(query)
      .sort({ createdAt: -1 })
      .lean()

    const formatted = requirements.map((r: any) => ({
      id: r._id,
      title: r.title,
      image: r.image,
      category: r.category,
      budget: `$${r.budgetMin} - $${r.budgetMax}`,
      timeline: r.timeline,
      description: r.description,
      postedDate: formatPostedDate(r.postedDate),
      proposals: r.proposals,
      status: r.status,
    }))

    return NextResponse.json({ requirements: formatted })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to fetch requirements" }, { status: 500 })
  }
}

function formatPostedDate(date: Date) {
  const diff = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  if (diff < 1) return "Today"
  if (diff < 2) return "1 day ago"
  return `${Math.floor(diff)} days ago`
}
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const user = await getCurrentUser()

    // ❌ Not logged in
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    // ❌ Only client can post requirements
    if (user.role !== "client") {
      return NextResponse.json(
        { error: "Only clients can post requirements" },
        { status: 403 },
      )
    }

    const body = await req.json()
    console.log("body",body)
    const newReq = await Requirement.create({
      title: body.title,
      image: body.image,
      category: body.category,
      budgetMin: body.budgetMin,
      budgetMax: body.budgetMax,
      timeline: body.timeline,
      description: body.description,
      createdBy: user.userId, // 👈 IMPORTANT: logged-in client
    })
    console.log("newReq",newReq)
    return NextResponse.json({ success: true,   requirement: {
    ...newReq.toObject(),
    createdAt: newReq.createdAt,
    updatedAt: newReq.updatedAt
  } })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to create requirement" },
      { status: 500 },
    )
  }
}
