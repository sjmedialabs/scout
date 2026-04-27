import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth/jwt";

import ServiceRequest from "@/models/serviceRequests";
import Notification from "@/models/Notification";
import  User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    if (user.role === "agency") {

      //  Populate user info here also
      const serviceRequests = await ServiceRequest
        .find({ userId: user.userId })
        .sort({ createdAt: -1 })
        .populate("userId", "name email");

      return NextResponse.json(
        { serviceRequests },
        { status: 200 }
      );

    }

    else if (user.role === "admin") {

      const serviceRequests = await ServiceRequest
        .find()
        .sort({ createdAt: -1 })
        .populate("userId", "email name");

      return NextResponse.json(
        { serviceRequests },
        { status: 200 }
      );

    }

    else {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

  } catch (error) {

    console.error(
      "Error in GET /api/servicerequests:",
      error
    );

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
    try{
         const user = await getCurrentUser();

        if (!user) {
        return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
        );
        }

        if (user.role !== "agency") {
        return NextResponse.json(
            { error: "Only agencies can submit service requests" },
            { status: 403 }
        );
        }
        await connectToDatabase();
        const { mainCategory, subCategory, childCategory, description } = await request.json();

        if (!mainCategory || !subCategory || !childCategory || !description) {
        return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
        );
        }
        const newServiceRequest = await ServiceRequest.create({
        userId: new mongoose.Types.ObjectId(user.userId),
        mainCategory,
        subCategory,
        childCategory,
        description,
        });
        // await newServiceRequest.save();

         //Notifcation for the superadmin after successfull creation of the user with the otp verification
            const admin = await User.findOne({ role: "admin" });
        
              await Notification.create({
                userId: admin?._id,
                title: "New Service Request!",
                message: `A new service request has been submitted.`,
                type: "service_request",
                userRole: "admin",
                sourceId: user.userId,
                linkUrl: "/admin/service-requests"
              });
        return NextResponse.json({ message: "Service request submitted successfully" }, { status: 201 });

    }catch(error){
        console.error("Error in POST /api/servicerequests:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}