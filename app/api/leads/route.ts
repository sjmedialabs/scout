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
  email,
  contactNumber,
  countryCode,
  country,
  message,
  projectTitle,
  category,
  description,
  minbudget,
  maxbudget,
  timeline,
  attachmentUrls,
}: {
  to: string
  agencyName: string
  name: string
  email: string
  contactNumber: string
  countryCode: string
  country: string
  message?: string
  projectTitle?: string
  category?: string
  description?: string
  minbudget?: string
  maxbudget?: string
  timeline?: string
  attachmentUrls?: string[]
}) => {

  //  Escape HTML to prevent injection
  const escapeHtml = (text?: string) =>
    text
      ? text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
      : ""

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
    <div style="max-width:650px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

      <!-- Header -->
      <div style="background:#111827; padding:20px 30px; color:white;">
        <h2 style="margin:0;">Thank You for Contacting ${escapeHtml(agencyName)}</h2>
      </div>

      <div style="padding:30px;">
        
        <p style="font-size:16px;">Hi <strong>${escapeHtml(name)}</strong>,</p>
        
        <p style="font-size:15px; color:#555;">
          We’ve received your inquiry. Here are the details you submitted:
        </p>

        <!-- Contact Details -->
        <div style="margin-top:20px; border-top:1px solid #eee; padding-top:20px;">
          <h3 style="margin-bottom:10px; font-size:16px;">Contact Details</h3>
          <p style="margin:4px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p style="margin:4px 0;"><strong>Phone:</strong> ${escapeHtml(countryCode)} ${escapeHtml(contactNumber)}</p>
          <p style="margin:4px 0;"><strong>Country:</strong> ${escapeHtml(country)}</p>
        </div>

        ${
          projectTitle || category || description || minbudget || maxbudget || timeline
            ? `
        <!-- Project Details -->
        <div style="margin-top:25px; border-top:1px solid #eee; padding-top:20px;">
          <h3 style="margin-bottom:10px; font-size:16px;">Project Details</h3>

          ${projectTitle ? `<p><strong>Project Title:</strong> ${escapeHtml(projectTitle)}</p>` : ""}
          ${category ? `<p><strong>Category:</strong> ${escapeHtml(category)}</p>` : ""}
          ${description ? `<p><strong>Description:</strong><br/>${escapeHtml(description)}</p>` : ""}
          ${
            minbudget && maxbudget
              ? `<p><strong>Budget:</strong> ${escapeHtml(minbudget)} - ${escapeHtml(maxbudget)}</p>`
              : ""
          }
          ${timeline ? `<p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>` : ""}
        </div>
        `
            : ""
        }

        ${
          attachmentUrls && attachmentUrls.length > 0
            ? `
        <!-- Attachments -->
        <div style="margin-top:25px; border-top:1px solid #eee; padding-top:20px;">
          <h3 style="margin-bottom:10px; font-size:16px;">Attachments</h3>
          ${attachmentUrls
            .map(
              (url) =>
                `<p><a href="${url}" target="_blank" style="color:#2563eb;">View Attachment</a></p>`
            )
            .join("")}
        </div>
        `
            : ""
        }

        ${
          message
            ? `
        <!-- Message -->
        <div style="background:#f9fafb; padding:15px; border-radius:8px; margin:25px 0;">
          <p style="margin:0; font-size:14px; color:#333;">
            <strong>Your Message:</strong><br/>
            ${escapeHtml(message)}
          </p>
        </div>
        `
            : ""
        }

        <p style="font-size:14px; color:#666; margin-top:25px;">
          Our team will review your request and get back to you shortly.
        </p>

        <p style="font-size:14px; color:#666; margin-top:30px;">
          Best Regards,<br/>
          <strong>${escapeHtml(agencyName)}</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:12px; color:#888;">
        © ${new Date().getFullYear()} ${escapeHtml(agencyName)}. All rights reserved.
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
      email,
      contactNumber,
      countryCode,
      country,
      message,
      projectTitle,
      category,
      description,
      minbudget,
      maxbudget,
      timeline,
      attachmentUrls,
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