import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb";
import Lead from "@/models/leads"
import { getCurrentUser } from "@/lib/auth/jwt";
import Provider from "@/models/Provider";

import nodemailer from "nodemailer"

export const sendLeadEmail = async ({
  to,
  agencyName,
  name,
  message,
}: {
  to: string
  agencyName: string
  name: string
  message: string
}) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
      
     

      <div style="padding:30px;">
        <p style="font-size:16px;">Hi <strong>${name}</strong>,</p>
        
        <p style="font-size:15px; color:#555;">
          Thank you for contacting <strong>${agencyName}</strong>.
        </p>

        <div style="background:#f9fafb; padding:15px; border-radius:8px; margin:20px 0;">
          <p style="margin:0; font-size:14px; color:#333;">
            <strong>Your Message:</strong><br/>
            ${message}
          </p>
        </div>

        <p style="font-size:14px; color:#666;">
          Our team will review your message and get back to you shortly.
        </p>

        <p style="font-size:14px; color:#666; margin-top:30px;">
          Best Regards,<br/>
          <strong>${agencyName}</strong>
        </p>
      </div>

      <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#888;">
        © ${new Date().getFullYear()} ${agencyName}. All rights reserved.
      </div>
    </div>
  </div>
  `

  await transporter.sendMail({
    from: `"${agencyName}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Thank you for contacting ${agencyName}`,
    html: htmlTemplate,
  })
}


// ==============================
//  POST → Create Lead
// ==============================
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const body = await req.json()

    const {
      name,
      email,
      contactNumber,
      countryCode,
      country,
      message,
      userId,

      // 🔹 New optional fields
      projectTitle,
      category,
      description,
      minbudget,
      maxbudget,
      timeline,
      attachmentUrls,
    } = body

    // ✅ Required field validation (same as before)
    if (
      !name ||
      !email ||
      !contactNumber ||
      !countryCode ||
      !country ||
      
      !userId
    ) {
      return NextResponse.json(
        { message: "All required fields must be filled" },
        { status: 400 }
      )
    }

    // ✅ Find Provider (Agency)
    const provider = await Provider.findOne({ userId })

    if (!provider) {
      return NextResponse.json(
        { message: "Agency not found" },
        { status: 404 }
      )
    }

    const agencyName = provider.name

    // ✅ Send Email BEFORE creating lead
    await sendLeadEmail({
      to: email,
      agencyName,
      name,
      message,
    })

    // ✅ Create Lead (new fields optional)
    const newLead = await Lead.create({
      userId,
      name,
      email,
      contactNumber,
      countryCode,
      country,
      message,

      projectTitle: projectTitle || "",
      category: category || "",
      description: description || "",
      minbudget: minbudget || "",
      maxbudget: maxbudget || "",
      timeline: timeline || "",
      attachmentUrls: attachmentUrls || [],
    })

    return NextResponse.json(
      {
        message: "Lead created & email sent successfully",
        data: newLead,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST LEAD ERROR:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}



// ==============================
// ✅ GET → Get Leads of Logged-in User
// ==============================
export async function GET() {
  try {
    await connectToDatabase()

    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const leads = await Lead.find({ userId: user.userId })
      .sort({ createdAt: -1 })

    return NextResponse.json(
      { data: leads },
      { status: 200 }
    )
  } catch (error) {
    console.error("GET LEADS ERROR:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}