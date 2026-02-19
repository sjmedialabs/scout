import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import crypto from "crypto"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Account already verified" },
        { status: 400 }
      )
    }

    // 🚫 BLOCK RESEND IF OTP STILL VALID
    if (user.otp?.expiresAt && user.otp.expiresAt > new Date()) {
      const remainingTime = Math.ceil(
        (user.otp.expiresAt.getTime() - Date.now()) / 1000
      )

      return NextResponse.json(
        {
          error: `OTP still valid. Please wait ${remainingTime} seconds before requesting a new one.`,
        },
        { status: 400 }
      )
    }

    // ✅ Generate new 4-digit OTP
    const rawOtp = Math.floor(1000 + Math.random() * 9000).toString()

    // // 🔐 Hash OTP before saving
    // const hashedOtp = crypto
    //   .createHash("sha256")
    //   .update(rawOtp)
    //   .digest("hex")

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 mins

    user.otp = {
      code: rawOtp,
      expiresAt,
    }

    await user.save()

    // 📧 Send OTP Email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

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
                     ${rawOtp}
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

    return NextResponse.json({
      success: true,
      message: "New OTP sent successfully",
    })
  } catch (error) {
    console.error("Resend OTP error:", error)

    return NextResponse.json(
      { error: "Failed to resend OTP" },
      { status: 500 }
    )
  }
}
