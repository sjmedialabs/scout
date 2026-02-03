
import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { hashPassword } from "@/lib/auth/jwt"
import jwt from "jsonwebtoken"

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password required" },
        { status: 400 }
      )
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)

    await connectToDatabase()

    const user = await User.findById(decoded.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    user.password = await hashPassword(password)
    user.isVerified = true

    await user.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    )
  }
}

