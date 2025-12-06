import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { getCurrentUser } from "@/lib/auth/jwt"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const query: any = {}
    if (role) query.role = role

    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ])

    const formattedUsers = users.map((u: any) => ({
      id: u._id.toString(),
      email: u.email,
      name: u.name,
      role: u.role,
      company: u.company,
      phone: u.phone,
      avatar: u.avatar,
      isVerified: u.isVerified,
      isActive: u.isActive,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt,
    }))

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
