"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/lib/toast";
import { Loader2, CheckCircle2, Mail, Phone, ArrowRight, ShieldCheck } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onVerified: () => void;
  initialEmail?: string;
  initialPhone?: string;
  isEmailVerified?: boolean;
  isEmailVerifiedInDashboard?: boolean;
  isMobileNumberVerified?: boolean;
  message?: string;
}

export default function VerificationModal({
  isOpen,
  onClose,
  userId,
  onVerified,
  initialEmail = "",
  initialPhone = "",
  isEmailVerified = false,
  isEmailVerifiedInDashboard = false,
  isMobileNumberVerified = false,
  message = "Verify your details to proceed.",
}: VerificationModalProps) {
  const { user, updateUser } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [emailVerified, setEmailVerified] = useState(isEmailVerified || isEmailVerifiedInDashboard);
  const [phoneVerified, setPhoneVerified] = useState(isMobileNumberVerified);

  const [verifying, setVerifying] = useState<"none" | "email" | "mobile">("none");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sendingType, setSendingType] = useState<"none" | "email" | "mobile">("none");

  // Sync state with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmailVerified(isEmailVerified || isEmailVerifiedInDashboard);
      setPhoneVerified(isMobileNumberVerified);
    }
  }, [isOpen, isEmailVerified, isEmailVerifiedInDashboard, isMobileNumberVerified]);

  const isFreeDomain = (email: string) => {
    const freeDomains = [
      "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com",
      "aol.com", "zoho.com", "protonmail.com", "mail.com", "gmx.com", "yandex.com"
    ];
    const domain = email.split("@")[1];
    return freeDomains.includes(domain?.toLowerCase());
  };

  const handleSendOTP = async (type: "email" | "mobile") => {
    if (type === "email") {
      if (!email) {
        toast.error("Error", "Please enter your company email.");
        return;
      }
      if (user?.role === "agency" && isFreeDomain(email)) {
        toast.error("Invalid Email", "Please use a company domain email (not gmail/yahoo/etc).");
        return;
      }
    } else {
      if (!phone) {
        toast.error("Error", "Please enter your mobile number.");
        return;
      }
    }

    setIsLoading(true);
    setSendingType(type);
    try {
      const res = await fetch("/api/user/verify-dashboard/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, email, phone, type }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("OTP Sent", `Verification code sent to your ${type}.`);
        setVerifying(type);
        setOtp("");
      } else {
        toast.error("Error", data.error || "Failed to send OTP.");
      }
    } catch (error) {
      toast.error("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setSendingType("none");
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      toast.error("Invalid OTP", "Please enter the 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/user/verify-dashboard/confirm-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp, type: verifying, email, phone }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Success", `${verifying === "email" ? "Email" : "Mobile number"} verified successfully.`);
        if (verifying === "email") setEmailVerified(true);
        if (verifying === "mobile") setPhoneVerified(true);
        setVerifying("none");

        // Check if now fully verified
        const nowEmailVerified = verifying === "email" ? true : emailVerified;
        const nowPhoneVerified = verifying === "mobile" ? true : phoneVerified;

        const updates: Partial<any> = {};
        if (verifying === "email") {
          updates.isEmailVerifiedInDashboard = true;
          updates.email = email;
        } else {
          console.log("Entered to mobile number otp veririfesd");
          updates.isMobileNumberVerified = true;
        }

        if (nowEmailVerified && nowPhoneVerified) {
          updates.isVerified = true;
          setTimeout(() => {
            onVerified();
            onClose();
          }, 1000);
        }

        updateUser(updates);
      } else {
        toast.error("Error", data.error || "Invalid OTP.");
      }
    } catch (error) {
      toast.error("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-white rounded-[32px] shadow-2xl">
        {/* Header with Color #2C34A1 */}
        <div style={{ backgroundColor: "#2C34A1" }} className="p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold">Secure Verification</DialogTitle>
          </div>
          <DialogDescription className="text-blue-100 text-base">
            {message}
          </DialogDescription>
        </div>

        <div className="px-8 py-4 space-y-2">
          {verifying === "none" ? (
            <div className="space-y-3">
              {/* EMAIL STEP - Only show if not verified */}
              {!(isEmailVerified || isEmailVerifiedInDashboard) && (
                <div className={cn(
                  "group relative p-6 rounded-2xl border transition-all duration-300",
                  emailVerified ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-400"
                )}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-xl",
                        emailVerified ? "bg-green-100 text-green-600" : "bg-white text-gray-400"
                      )}>
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{user?.role === "agency" ? "Company Email" : "Email Address"}</h3>
                        <p className="text-sm text-gray-500">{user?.role === "agency" ? "Business domain required" : "Enter your email"}</p>
                      </div>
                    </div>
                    {emailVerified && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder={user?.role === "agency" ? "name@company.com" : "name@email.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={emailVerified || isLoading}
                      className="h-11 rounded-xl bg-white border-gray-200 placeholder:text-gray-400"
                    />
                    {!emailVerified && (
                      <Button
                        onClick={() => handleSendOTP("email")}
                        disabled={isLoading}
                        style={{ backgroundColor: "#F54A0C" }}
                        className="h-11 rounded-xl px-4 text-white hover:opacity-90"
                      >
                        {isLoading && sendingType === "email" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* MOBILE STEP - Only show if not verified */}
              {!isMobileNumberVerified && (
                <div className={cn(
                  "group relative p-6 rounded-2xl border transition-all duration-300",
                  phoneVerified ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-400"
                )}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-xl",
                        phoneVerified ? "bg-green-100 text-green-600" : "bg-white text-gray-400"
                      )}>
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Mobile Number</h3>
                        <p className="text-sm text-gray-500">For secure SMS alerts</p>
                      </div>
                    </div>
                    {phoneVerified && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="+91 0000000000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={phoneVerified || isLoading}
                      className="h-11 rounded-xl bg-white border-gray-200 placeholder:text-gray-400"
                    />
                    {!phoneVerified && (
                      <Button
                        onClick={() => handleSendOTP("mobile")}
                        disabled={isLoading}
                        style={{ backgroundColor: "#F54A0C" }}
                        className="h-11 rounded-xl px-4 text-white hover:opacity-90"
                      >
                        {isLoading && sendingType === "mobile" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* <Button
                className="w-full h-14 rounded-2xl text-lg font-bold text-white hover:opacity-90 disabled:bg-gray-200"
                style={{ backgroundColor: (emailVerified && phoneVerified) ? "#2C34A1" : "#F54A0C" }}
                disabled={!emailVerified || !phoneVerified}
                onClick={onClose}
              >
                {emailVerified && phoneVerified ? "Complete Verification" : "Please verify above fields"}
              </Button> */}
            </div>
          ) : (
            <div className="space-y-8 py-4 animate-in fade-in zoom-in duration-300">
              <div className="text-center">
                <div style={{ backgroundColor: "#F54A0C1A" }} className="inline-flex p-4 rounded-full mb-4">
                  {verifying === "email" ? <Mail style={{ color: "#F54A0C" }} className="w-8 h-8" /> : <Phone style={{ color: "#F54A0C" }} className="w-8 h-8" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900">Verify your {verifying}</h3>
                <p className="text-gray-500">We've sent a 6-digit code to <span className="font-medium text-gray-900">{verifying === "email" ? email : phone}</span></p>
              </div>

              <div className="flex flex-col items-center space-y-6">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  onComplete={handleVerifyOTP}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-12 h-14 text-xl font-bold rounded-xl border-gray-200" />
                    <InputOTPSlot index={1} className="w-12 h-14 text-xl font-bold rounded-xl border-gray-200" />
                    <InputOTPSlot index={2} className="w-12 h-14 text-xl font-bold rounded-xl border-gray-200" />
                    <InputOTPSlot index={3} className="w-12 h-14 text-xl font-bold rounded-xl border-gray-200" />
                    <InputOTPSlot index={4} className="w-12 h-14 text-xl font-bold rounded-xl border-gray-200" />
                    <InputOTPSlot index={5} className="w-12 h-14 text-xl font-bold rounded-xl border-gray-200" />
                  </InputOTPGroup>
                </InputOTP>

                <div className="w-full space-y-3">
                  <Button
                    style={{ backgroundColor: "#F54A0C" }}
                    className="w-full h-12 rounded-xl font-bold text-white hover:opacity-90"
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length < 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-500 font-medium"
                    onClick={() => setVerifying("none")}
                    disabled={isLoading}
                  >
                    Go back
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
