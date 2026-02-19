"use client"

import { useEffect, useState } from "react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"   // ← from shadcn
import { Button } from "@/components/ui/button"   // assuming you have Button too

interface OtpVerifyProps {
  email: string
  onVerified: (user: any) => void
}

export default function OtpVerify({
  email,
  onVerified,
}: OtpVerifyProps) {
  const [otp, setOtp] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 mins
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resendVisible, setResendVisible] = useState(false)
  const[successMsg,setSuccessMsg]=useState("")

  // ⏳ Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setResendVisible(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  // 🔐 Verify OTP
  const handleVerify = async () => {
    if (otp.length !== 4) {
      setError("Please enter all 4 digits")
      return
    }

    setLoading(true)
    setError("")
    const localData = localStorage.getItem("userDetails")

    if (!localData) {
    throw new Error("User data missing")
    }

    const parsedData = JSON.parse(localData)


    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp,companyName:parsedData.companyName,name:parsedData.name }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Verification failed")
      }

      onVerified(data)
      localStorage.removeItem("userDetails")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 🔁 Resend OTP
  const handleResend = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }
        setSuccessMsg("OTP resent successfully!")

      setTimeLeft(300)
      setResendVisible(false)
      setTimeout(() => setSuccessMsg(""), 5000) // Clear success message after 5 seconds
      setOtp("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="mt-6 text-center">
      <h2 className="text-lg font-semibold">Verify OTP</h2>
      <p className="text-xs text-gray-500 mt-1">
        Enter the 4-digit code sent to your email
      </p>

      {/* ── Shadcn Input OTP ── */}
      <div className="flex justify-center mt-5">
        <InputOTP
          maxLength={4}
          value={otp}
          onChange={setOtp}
          inputMode="numeric"
          autoComplete="one-time-code"
          containerClassName="justify-center"
          // Optional: pattern if you ever want letters too → pattern={/[0-9]/}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} className="bg-[#fff] border-1 mr-3 border-gray-400 h-12 w-12 "/>
            <InputOTPSlot index={1} className="bg-[#fff] border-1 mr-3 border-gray-400 h-12 w-12 "/>
            <InputOTPSlot index={2} className="bg-[#fff] border-1 mr-3 border-gray-400 h-12 w-12 "/>
            <InputOTPSlot index={3} className="bg-[#fff] border-1 mr-3 border-gray-400 h-12 w-12 "/>
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* COUNTDOWN */}
      {!resendVisible && (
        <p className="mt-3 text-xs text-gray-500">
          OTP expires in{" "}
          <span className="font-semibold text-black">
            {formatTime(timeLeft)}
          </span>
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-xs mt-3">{error}</p>
      )}

      {/* SUCCESS */}
      {successMsg && (
        <p className="text-green-500 text-xs mt-3">{successMsg}</p>
      )}

      {/* VERIFY BUTTON */}
      <Button
        onClick={handleVerify}
        disabled={loading || otp.length !== 4}
        className="mt-5 w-full bg-black text-white hover:bg-gray-900"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </Button>

      {/* RESEND */}
      {resendVisible && (
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={loading}
          className="mt-3 w-full"
        >
          {loading ? "Sending..." : "Resend OTP"}
        </Button>
      )}
    </div>
  )
}