"use client"

import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OtpVerifiedSuccess() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      
      {/* Success Icon */}
      <div className="bg-green-100 p-4 rounded-full">
        <CheckCircle size={60} className="text-green-600 animate-scaleIn" />
      </div>

      {/* Title */}
      <h2 className="mt-6 text-xl font-semibold text-gray-800">
        Email Verified Successfully 🎉
      </h2>

      {/* Subtitle */}
      <p className="mt-3 text-sm text-gray-500 max-w-sm">
        Your account has been verified successfully.  
        You can now sign in and start using your account.
      </p>

      {/* Sign In Button */}
      <button
        onClick={() => router.push("/login")}
        className="mt-8 w-full max-w-xs bg-black cursor-pointer text-white py-2 rounded-xl text-sm font-medium hover:bg-gray-900 transition"
      >
        Sign In
      </button>
    </div>
  )
}
