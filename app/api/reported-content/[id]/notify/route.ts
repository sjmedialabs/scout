import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";
import ReportedContent from "@/models/ReportedContent";
import { getCurrentUser } from "@/lib/auth/jwt";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getCurrentUser();

    if (!admin || admin.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid report id" }, { status: 400 });
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    await connectToDatabase();

    const report = await ReportedContent.findById(id)
      .populate("reportedTo", "name email")
      .lean();

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlTemplate = `
    <div style="font-family:Arial;background:#f6f7fb;padding:40px">
      <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:10px;padding:30px">
        
        <h2 style="color:#333">Account Notification</h2>

        <p>Hello <b>${report.reportedTo.name}</b>,</p>

        <p>
        Our moderation team has reviewed activity related to your account.
        Please see the message below from the administrator.
        </p>

        <div style="
          background:#f3f4f6;
          padding:15px;
          border-radius:6px;
          margin:20px 0;
          font-size:14px;
        ">
        ${message}
        </div>

        <p style="font-size:14px;color:#666">
        If you believe this message was sent in error, please contact support.
        </p>

        <hr style="margin:30px 0"/>

        <p style="font-size:12px;color:#888">
        This email was sent automatically by the moderation system.
        </p>

      </div>
    </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: report.reportedTo.email,
      subject: "Important Notification About Your Account",
      html: htmlTemplate,
    });

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}