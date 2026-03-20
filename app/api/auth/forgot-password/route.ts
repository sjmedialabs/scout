import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success (security best practice)
    if (!user) {
      return NextResponse.json({
        message: "If the email exists, a reset link has been sent",
      });
    }

    // ✅ Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;

    // ✅ Nodemailer Transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ✅ Beautiful Email Template
    const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:40px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:30px;">
        
        <h2 style="color:#111; text-align:center;">🔐 Reset Your Password</h2>
        
        <p style="font-size:16px; color:#555;">
          Hi ${user.name || "User"},
        </p>

        <p style="font-size:16px; color:#555;">
          We received a request to reset your password. Click the button below to set a new password.
        </p>

        <div style="text-align:center; margin:30px 0;">
          <a href="${resetUrl}" 
             style="background:#000; color:#fff; padding:12px 20px; text-decoration:none; border-radius:5px; font-size:16px;">
             Reset Password
          </a>
        </div>

        <p style="font-size:14px; color:#999;">
          This link will expire in 15 minutes.
        </p>

        <p style="font-size:14px; color:#999;">
          If you didn’t request this, you can safely ignore this email.
        </p>

        <hr style="margin:30px 0;" />

        <p style="font-size:12px; color:#aaa; text-align:center;">
          © ${new Date().getFullYear()} Your Company. All rights reserved.
        </p>

      </div>
    </div>
    `;

    // ✅ Send Email
    await transporter.sendMail({
      from: `"Support Team" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: htmlTemplate,
    });

    return NextResponse.json({
      message: "Reset link sent to email",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}