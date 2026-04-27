import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";

import ServiceRequest from "@/models/serviceRequests";
import User from "@/models/User";

import Notification from "@/models/Notification";

import nodemailer from "nodemailer";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only admin allowed
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Only admin can update status" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { id } = params;
    const { status, reason } = await request.json();

    // Validate status
    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    if (status === "rejected" && !reason) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    // Find request
    const serviceRequest = await ServiceRequest.findById(id);

    if (!serviceRequest) {
      return NextResponse.json(
        { error: "Service request not found" },
        { status: 404 }
      );
    }

    // Update status
    serviceRequest.status = status;
    if (reason) {
      serviceRequest.reason = reason;
    }

    await serviceRequest.save();

    // Get user
    const requestUser = await User.findById(
      serviceRequest.userId
    );

    if (!requestUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // =========================
    //  EMAIL SETUP
    // =========================

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let subject = "";
    let htmlContent = "";

    // =========================
    // ACCEPTED EMAIL
    // =========================

    if (status === "accepted") {
      subject = "🎉 Your Service Request Has Been Approved";

      htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #16a34a;">
          ✅ Service Request Approved
        </h2>

        <p>Hello <b>${requestUser.name}</b>,</p>

        <p>
          Great news! Your service request has been
          <b style="color:#16a34a;">approved</b>.
        </p>

        <p>
          You can now start using this service category.
        </p>

        <div style="
          margin-top:20px;
          padding:15px;
          background:#f0fdf4;
          border-radius:8px;
        ">
          <b>Status:</b> Approved
        </div>

        <p style="margin-top:20px;">
          Thank you for using our platform 🚀
        </p>

        <hr />

        <p style="font-size:12px;color:gray;">
          This is an automated message.
        </p>
      </div>
      `;
    }

    // =========================
    // REJECTED EMAIL
    // =========================

    if (status === "rejected") {
      subject = "⚠️ Your Service Request Was Rejected";

      htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #dc2626;">
          ❌ Service Request Rejected
        </h2>

        <p>Hello <b>${requestUser.name}</b>,</p>

        <p>
          Unfortunately, your service request has been
          <b style="color:#dc2626;">rejected</b>.
        </p>

        <div style="
          margin-top:20px;
          padding:15px;
          background:#fef2f2;
          border-radius:8px;
        ">
          <b>Reason:</b>
          <p>${reason}</p>
        </div>

        <p style="margin-top:20px;">
          Please update your request and submit again.
        </p>

        <hr />

        <p style="font-size:12px;color:gray;">
          This is an automated message.
        </p>
      </div>
      `;
    }

    // Send email
    await transporter.sendMail({
      from: `"Support Team" <${process.env.SMTP_USER}>`,
      to: requestUser.email,
      subject,
      html: htmlContent,
    });

    // Create a notification for the user
    // await Notification.create({
    //   userId:user.userId,
    //   title: `Your service request has been ${status}`,
    //   message: `Your service request for ${serviceRequest.mainCategory} has been ${status}. ${
    //     status === "rejected" ? `Reason: ${reason}` : ""
    //   }`,
    //   type: "service-request", 
    //   userRole:"agency",
    //   linkUrl: `/agency/dashboard/editprofile`,
    //   read: false,
    //   sourceId: serviceRequest._id,
    // })

    return NextResponse.json(
      { message: "Status updated successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error(
      "Error updating service request:",
      error
    );

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}