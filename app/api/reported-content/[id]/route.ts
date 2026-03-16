import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";
import ReportedContent from "@/models/ReportedContent";
import mongoose from "mongoose";
import User from "@/models/User";
import nodemailer from "nodemailer";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
    }

    await connectToDatabase();

    const body = await request.json();
    const { action } = body;

    if (!["approve", "ignore", "dismissed"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use approve, ignore or dismissed" },
        { status: 400 }
      );
    }

    const report = await ReportedContent.findById(id)
      .populate("reportedBy", "name email role")
      .populate("reportedTo", "name email role")
      .lean();
    console.log("Report details are::::",report)

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    let status = "pending";

    if (action === "approve") {
      status = "resolved";
    }

    if (action === "ignore") {
      status = "dismissed";
    }

    //  New Logic: Suspend user when action === dismissed
    if (action === "dismissed") {
      status = "resolved";

      const userDetails=  await User.findByIdAndUpdate(report.reportedTo._id, {
        isActive: false,
      });
      console.log("Suspende user details are::::",userDetails);


      // Send email notification
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const emailTemplate = `
      <div style="font-family: Arial, sans-serif; padding:20px; background:#f9f9f9">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:8px;padding:30px">
          
          <h2 style="color:#e63946;">Account Suspension Notice</h2>

          <p>Hello <b>${report.reportedTo.name}</b>,</p>

          <p>
          We have received multiple reports regarding activity associated with your account.
          After reviewing the reports, our moderation team has temporarily suspended your account.
          </p>

          <p>
          <b>Reason:</b> ${report.reason}
          </p>

          <p>
          If you believe this action was taken in error or you would like to appeal,
          please contact our support team.
          </p>

          <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee">
            <p style="font-size:14px;color:#555">
            This action was taken to maintain a safe and respectful community for all users.
            </p>

            <p style="font-size:14px;color:#777">
            — Support Team
            </p>
          </div>

        </div>
      </div>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: report.reportedTo.email,
        subject: "Your Account Has Been Suspended",
        html: emailTemplate,
      });
    }

    const updatedReport = await ReportedContent.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("reportedBy", "name email role")
      .populate("reportedTo", "name email role")
      .lean();

    return NextResponse.json({ success: true, report: updatedReport });
  } catch (error) {
    console.error("Error updating report:", error);

    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid report ID" }, { status: 400 });
    }

    await connectToDatabase();
    const report = await ReportedContent.findByIdAndDelete(id);

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting report:", error);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}
