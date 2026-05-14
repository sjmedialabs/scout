import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import User from "@/models/User"
import { transporter } from "@/lib/mail"
import { sendOtpSms } from "@/lib/sms"

const FREE_DOMAINS = [
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com",
  "aol.com", "zoho.com", "protonmail.com", "mail.com", "gmx.com", "yandex.com"
];

function isFreeDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return FREE_DOMAINS.includes(domain);
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const { userId, email, phone, type } = await request.json()

    if (!userId || !type) {
      return NextResponse.json(
        { error: "Missing required fields: userId, type" },
        { status: 400 }
      )
    }

    if (type === "email" && !email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }
    if (type === "mobile" && !phone) {
      return NextResponse.json({ error: "Mobile number is required" }, { status: 400 })
    }

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (type === "email" && user.role === "agency" && isFreeDomain(email)) {
      return NextResponse.json(
        { error: "Please use a company email domain (e.g., @company.com)" },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in user record (overwriting any previous OTP)
    user.otp = {
      code: otp,
      expiresAt,
    }

    await user.save()

    if (type === "email") {
      // Send Email OTP

      await transporter.sendMail({
        from: `"Scout Team" <${process.env.SMTP_FROM}>`,
        to: email,
        subject: "🔐 Your Verification Code - Scout",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; padding: 40px 20px;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="background-color: #000000; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">SCOUT</h1>
              </div>
              <div style="padding: 40px 30px; text-align: center;">
                <h2 style="color: #111827; margin: 0 0 20px; font-size: 22px; font-weight: 700;">Verify Your Email</h2>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
                  Please use the verification code below to complete your dashboard verification. This code is valid for 10 minutes.
                </p>
                <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; display: inline-block; margin-bottom: 30px;">
                  <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #000000;">${otp}</span>
                </div>
                <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                  If you didn't request this code, you can safely ignore this email.
                </p>
              </div>
              <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px; margin: 0;">
                  © ${new Date().getFullYear()} Scout. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        `,
      })
    } else {
      // Send SMS OTP
      try {
        const dltId = process.env.DLT_MOBILE_NO_VERIFY_ID;
        console.log("DLT ID:::", dltId)
        let rawMsg = process.env.DLT_MOBILE_NO_VERIFY_MSG || "Your verification OTP is %s. It is valid for 5 minutes. Do not share with anyone.";
        // Remove surrounding quotes if they exist from the .env
        rawMsg = rawMsg.replace(/^"|"$/g, '');
        const message = rawMsg.replace("%s", otp);

        console.log("Message:::", message)

        const result = await sendOtpSms({
          mobile: phone,
          otp: otp,
          templateId: dltId,
          message: message,
        })

        if (!result.ok) {
          console.error("SMS Failed result:", result);
          return NextResponse.json({ error: "Failed to send SMS OTP" }, { status: 500 })
        }
      } catch (smsError) {
        console.error("Failed to send verification SMS:", smsError)
        return NextResponse.json({ error: "Failed to send SMS OTP" }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to your ${type}`,
    })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
