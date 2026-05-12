import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import Provider from "@/models/Provider"
import Seeker from "@/models/Seeker"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const { userId, otp, type, email, phone } = await request.json()

    if (!userId || !otp || !type) {
      return NextResponse.json(
        { error: "Missing required fields: userId, otp, type" },
        { status: 400 }
      )
    }

    const user = await User.findById(userId)

    if (!user || !user.otp) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    if (user.otp.code !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
    }

    if (user.otp.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 })
    }

    // Update User model verification flags
    if (type === "email") {
      user.isEmailVerifiedInDashboard = true
      // user.email = email.toLowerCase() // Also update the email in user model if it changed
    } else if (type === "mobile") {
      user.isMobileNumberVerified = true
      // user.phone = phone
    }

    user.otp = undefined // Clear OTP
    await user.save()

    // Update respective models (Provider or Seeker)
    if (user.role === "agency") {
      const updateData: any = { isVerified: true }
      if (type === "email") updateData.email = email.toLowerCase()
      if (type === "mobile") updateData.phone = phone

      await Provider.findOneAndUpdate(
        { userId: user._id },
        updateData,
        { new: true }
      )
    } else if (user.role === "client") {
      const updateData: any = { isVerified: true }
      if (type === "email") updateData.email = email.toLowerCase()
      if (type === "mobile") updateData.phoneNumber = phone // Seeker uses phoneNumber

      await Seeker.findOneAndUpdate(
        { userId: user._id },
        updateData,
        { new: true }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${type === "email" ? "Email" : "Mobile number"} verified successfully`,
      isEmailVerifiedInDashboard: user.isEmailVerifiedInDashboard,
      isMobileNumberVerified: user.isMobileNumberVerified
    })
  } catch (error) {
    console.error("Confirm OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
