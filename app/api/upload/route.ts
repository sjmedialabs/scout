import { NextResponse } from "next/server"
import path from "path"
import { writeFile } from "fs/promises"
import { randomUUID } from "crypto"
import fs from "fs"

/**
 * Sanitize filename: remove special chars, replace spaces with hyphens,
 * and ensure the filename is URL-safe.
 */
function sanitizeFileName(name: string): string {
  const ext = path.extname(name)
  const base = path.basename(name, ext)

  const sanitized = base
    .replace(/[^a-zA-Z0-9._-]/g, "-") // replace non-safe chars with hyphens
    .replace(/-+/g, "-")               // collapse multiple hyphens
    .replace(/^-|-$/g, "")             // trim leading/trailing hyphens
    .substring(0, 100)                 // limit length

  return `${sanitized}${ext.toLowerCase()}`
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    console.log("[Upload] Received file:", {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), "public", "uploads")

    // Create folder if not exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const sanitized = sanitizeFileName(file.name)
    const fileName = `${randomUUID()}-${sanitized}`
    const filePath = path.join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    // Return URL-encoded path to handle any remaining special chars
    const fileUrl = `/uploads/${encodeURIComponent(fileName)}`

    console.log("[Upload] Saved file:", {
      originalName: file.name,
      savedAs: fileName,
      path: filePath,
      url: fileUrl,
    })

    return NextResponse.json({ url: fileUrl })
  } catch (err) {
    console.error("[Upload] Error:", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
