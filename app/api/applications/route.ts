import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Application from "@/models/Application"
import User from "@/models/User"
import Notification from "@/models/Notification"

export async function POST(req: NextRequest) {
  await connectToDatabase()
  const body = await req.json()

  const app = await Application.create(body)

  // 1. Get all admins
    const admins = await User.find(
      { role: "admin" },
      { _id: 1 }
    ).lean();

    // 2. Create notifications
    if (admins.length > 0) {
      const notifications = admins.map((admin) => ({
        userId: admin._id, // receiver (admin)
        triggeredBy: null, // optional (no logged-in user here)
        title: "New Job Application",
        message: `${app.firstName} ${app.lastName} applied for ${app.jobTitle}.`,
        type: "NEW_APPLICATION",
        userRole: "admin",
        linkUrl: `/admin/careers/${app.jobTitle}/applications`, // adjust if needed
        sourceId: app._id,
        isRead: false,
      }));

      await Notification.insertMany(notifications);
    }

  return NextResponse.json(app)
}
 