import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import Job from "@/models/Job"   // ← add this

export const dynamic = "force-dynamic"

export async function GET() {
  await connectToDatabase()

  const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 })

  return NextResponse.json(jobs)
}
