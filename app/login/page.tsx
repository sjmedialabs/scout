"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/lib/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("client")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password, role)

      switch (role) {
        case "client":
          router.push("/client/dashboard")
          break
        case "agency":
          router.push("/agency/dashboard")
          break
        case "admin":
          router.push("/admin/dashboard")
          break
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      {/* Modal Card */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* LEFT SECTION (IMAGE + TEXT) */}
          <div className="hidden lg:flex flex-col justify-between bg-[#8b2f3c] p-10 text-white">
            <div>
              <h2 className="text-4xl font-semibold leading-tight">
                Built to Accelerate <br /> Business Success
              </h2>

              <ul className="mt-6 space-y-4 text-sm text-white/90">
                <li>owering Smarter Business Connections</li>
                <li>700+ Categories. One Trusted Platform.</li>
                <li>Quality Work. Accelerated Results.</li>
                <li>Your Gateway to Global Talent & Businesses</li>
              </ul>
            </div>

            <img
              src="/signup-image.jpg"
              alt="Login"
              className="mt-8 rounded-xl object-cover"
            />
          </div>

          {/* RIGHT SECTION (FORM) */}
          <div className="p-8 sm:p-10">
            <h3 className="text-2xl font-semibold text-center">Sign in to your account</h3>
            <p className="mt-1 text-sm text-gray-400 text-center">
              Enter your credentials to access your account
            </p>

            {/* Account Type */}
            <div className="mt-8">
              <label className="text-sm font-medium text-gray-700">Account Type</label>
              <div className="mt-3 flex gap-6 text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={role === "agency"}
                    onChange={() => setRole("agency")}
                  />
                  Service Provider
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={role === "client"}
                    onChange={() => setRole("client")}
                  />
                  Service seeker
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={role === "admin"}
                    onChange={() => setRole("admin")}
                  />
                  Admin
                </label>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seeker@example.com"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                  required
                />
              </div>

              {error && <div className="text-sm text-red-500 text-center">{error}</div>}

              <button
                type="submit"
                className="mt-6 w-full rounded-xl bg-black py-3 text-sm font-medium text-white hover:bg-gray-900 transition"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              Don't have an account?
              <Link href="/register" className="ml-1 font-medium text-black">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
