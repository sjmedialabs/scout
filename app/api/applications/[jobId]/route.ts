import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Application from "@/models/Application"

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    await connectToDatabase()

    const { jobId } = params

    const apps = await Application.find({ jobId })

    return NextResponse.json(apps)
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch applications" },
      { status: 500 }
    )
  }
}
