import http from "http"
import next from "next"
import { Server } from "socket.io"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()
const PORT = Number(process.env.PORT) || 3000

// MIME types for serving uploaded files
const MIME_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
}

/**
 * Serve files from public/uploads directly from disk.
 * Next.js production mode only knows about public files that existed at startup.
 * Files uploaded at runtime are invisible to Next.js, so we handle them here.
 */
function serveUploadedFile(req, res) {
  try {
    const decodedPath = decodeURIComponent(req.url.split("?")[0])
    const filePath = path.join(__dirname, "public", decodedPath)

    // Prevent directory traversal
    const resolved = path.resolve(filePath)
    const uploadsDir = path.resolve(path.join(__dirname, "public", "uploads"))
    if (!resolved.startsWith(uploadsDir)) {
      res.writeHead(403)
      res.end("Forbidden")
      return
    }

    fs.stat(resolved, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404)
        res.end("Not found")
        return
      }

      const ext = path.extname(resolved).toLowerCase()
      const contentType = MIME_TYPES[ext] || "application/octet-stream"

      res.writeHead(200, {
        "Content-Type": contentType,
        "Content-Length": stats.size,
        "Cache-Control": "public, max-age=31536000, immutable",
      })

      fs.createReadStream(resolved).pipe(res)
    })
  } catch (err) {
    console.error("Error serving uploaded file:", err)
    res.writeHead(500)
    res.end("Internal Server Error")
  }
}

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    // Serve uploaded files directly from disk (bypasses Next.js static file set)
    if (req.url && req.url.startsWith("/uploads/")) {
      return serveUploadedFile(req, res)
    }

    handle(req, res)
  })

  const io = new Server(server, {
    path: "/socket.io",
  })

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id)

    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId)
    })

    // THIS IS IMPORTANT
    socket.on("send-message", (message) => {
      // broadcast to everyone in the conversation
      io.to(message.conversationId).emit("receive-message", message)
    })
  })

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
})
