import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import Provider from "@/models/Provider"
import Seeker from "@/models/Seeker"
import { generateToken, setAuthCookie, hashPassword } from "@/lib/auth/jwt"
import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const body = await request.json()
    const { email, password, name, role, companyName } = body

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Missing required fields: email, password, name, role" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Validate role
    if (!["client", "agency", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate 4-digit OTP
      const otp = Math.floor(1000 + Math.random() * 9000).toString()

      const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 mins

      await transporter.sendMail({
        from: `"Scout Team" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "🔐 Verify Your Email - OTP Code",
        html: `
        <div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
          <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 15px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td style="background:#000000;padding:25px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:22px;">Scout</h1>
                <p style="color:#cccccc;margin:5px 0 0;font-size:13px;">
                  Secure Account Verification
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:35px 30px;text-align:center;">
                <h2 style="margin:0 0 15px;color:#111;font-size:20px;">
                  Verify Your Email Address
                </h2>

                <p style="color:#555;font-size:14px;margin-bottom:25px;">
                  Thank you for registering with <strong>Scout</strong>.
                  Please use the verification code below to complete your account setup.
                </p>

                <!-- OTP Box -->
                <div style="
                  display:inline-block;
                  background:#f1f3f6;
                  padding:18px 30px;
                  font-size:28px;
                  letter-spacing:6px;
                  font-weight:bold;
                  color:#000;
                  border-radius:10px;
                  margin-bottom:20px;
                ">
                  ${otp}
                </div>

                <p style="color:#777;font-size:13px;margin-top:15px;">
                  This code will expire in <strong>5 minutes</strong>.
                </p>

                <p style="color:#999;font-size:12px;margin-top:25px;">
                  If you did not create this account, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f8f9fa;padding:20px;text-align:center;">
                <p style="font-size:12px;color:#888;margin:0;">
                  © ${new Date().getFullYear()} Scout. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </div>
        `,
      })



    // Create user in MongoDB
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      company: companyName,
      isVerified: false,
      isActive: true,
       otp: {
        code: otp,
        expiresAt,
      },
    })

    // Create provider profile for agencies
    // if (role === "agency") {
    //   await Provider.create({
    //     userId: user._id,
    //     name: companyName || name,
    //     email: email.toLowerCase(),
    //     description: "New agency profile",
    //     location: "Not specified",
    //     services: [],
    //     technologies: [],
    //     industries: [],
    //     rating: 0,
    //     reviewCount: 0,
    //     projectsCompleted: 0,
    //     portfolio: [],
    //     testimonials: [],
    //     certifications: [],
    //     awards: [],
    //     isFeatured: false,
    //     isVerified: false,
    //     isActive: true,
    //     socialLinks: {
    //       linkedin:"",
    //       twitter:"",
    //       facebook:"",
    //       instagram:"",
    //     },
    //     profileViews: 0,
    //     impressions: 0,
    //     websiteClicks: 0,
    //   })
    // }
    
    //Create Seeker Profile details for the client dashboatrd
    // if(role==="client"){
    //   console.log("---client condition ok:::",user._id)
    //   await Seeker.create({
    //     userId:user._id,
    //     name:user.name,
    // email:user.email,
    // phoneNumber: undefined,
    // companyName: user.company || "",
    // position: "",
    // industry: "Technology",
    // location: "",
    // website: "",
    // bio: "",
    // timeZone:"Asia/Kolkata",
    // preferredCommunication: "email", // FIXED TYPO
    // typicalProjectBudget: "$1,000 - $5,000", // FIXED TYPO
    // companySize: "1-10",
    
    // image: "",
    //   })
    // }


    // Generate JWT token
    // const token = await generateToken(user)

    // Set auth cookie
    // await setAuthCookie(token)

    // Return user data (without password)
    // const userResponse = {
    //   id: user._id.toString(),
    //   email: user.email,
    //   name: user.name,
    //   role: user.role,
    //   company: user.company,
    //   isVerified: user.isVerified,
    //   createdAt: user.createdAt,
    // }

    return NextResponse.json({
      success: true,
      message:"OTP Sent  successfully to your email"
      // user: userResponse,
      // token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
