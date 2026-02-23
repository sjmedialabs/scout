import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import Provider from "@/models/Provider"
import Seeker from "@/models/Seeker"
import { generateToken, setAuthCookie, hashPassword } from "@/lib/auth/jwt"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  await connectToDatabase()

  const { email, otp,companyName,name } = await request.json()

  const user = await User.findOne({ email: email.toLowerCase() })

  if (!user || !user.otp) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (user.otp.code !== otp) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 })
  }

  if (user.otp.expiresAt < new Date()) {
    return NextResponse.json({ error: "OTP expired" }, { status: 400 })
  }

  // Mark verified
  user.isEmailVerified= true
  user.otp = undefined
  await user.save()



   // Create provider profile for agencies
    if (user.role === "agency") {
      await Provider.create({
        userId: user._id,
        name: companyName || "",
        email: email.toLowerCase(),
        description: "New agency profile",
        location: "Not specified",
        services: [],
        technologies: [],
        industries: [],
        rating: 0,
        reviewCount: 0,
        projectsCompleted: 0,
        portfolio: [],
        testimonials: [],
        certifications: [],
        awards: [],
        isFeatured: false,
        isVerified: false,
        isActive: true,
        socialLinks: {
          linkedin:"",
          twitter:"",
          facebook:"",
          instagram:"",
        },
        profileViews: 0,
        impressions: 0,
        websiteClicks: 0,
      })
    }
    
    //Create Seeker Profile details for the client dashboatrd
    if(user.role==="client"){
      console.log("---client condition ok:::",user._id)
      await Seeker.create({
        userId:user._id,
        name:user.name,
    email:user.email,
    phoneNumber: undefined,
    companyName: user?.company || "",
    position: "",
    industry: "",
    location: "",
    website: "",
    bio: "",
    timeZone:"",
    preferredCommunication: "", // FIXED TYPO
    typicalProjectBudget: "", // FIXED TYPO
    companySize: "",
    
    image: "",
      })
    }

  

  return NextResponse.json({
    success: true,
    message:"Successfully Registered"
    
  })
}
