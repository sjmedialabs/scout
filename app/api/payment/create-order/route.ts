import Razorpay from "razorpay"
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import Payment from "@/models/Payment"
import { getCurrentUser } from "@/lib/auth/jwt"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET
  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay env vars (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are not set"
    )
  }
  return new Razorpay({ key_id, key_secret })
}

export async function POST(req: Request) {
  await connectToDatabase()

  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { planId, amount } = await req.json()

  const razorpay = getRazorpay()
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  })

  await Payment.create({
    userId: user.userId,
    planId,
    razorpayOrderId: order.id,
    amount,
    status: "created",
  })

  return NextResponse.json(order)
}
