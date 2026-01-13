"use client"
import type React from "react"

import Sidebar from "@/components/provider/side-bar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useState,useEffect } from "react"

export default function AgencyDashboardLayout({ children }) {
  // const user = { name: "Satya" };
  const { user, loading } = useAuth()
  const router=useRouter();
  const provider = {
    subscriptionTier: "basic",
    isVerified: true,
    isFeatured: false,
  };
  console.log("User details::::::::::",user)
  useEffect(() => {
        if (!loading && (!user || user.role !== "agency")) {
          router.push("/login")
        }
        // if(user && !loading){
        //   loadUserDetails()
        // }
      }, [user, loading, router])
 
  return (
    <div>
      {
        user && !loading && (
          <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar user={user} provider={provider} />

      {/* Main Content */}
      <div className="flex-1 ml-80 p-6">
        {children}
      </div>
    </div>
        )
      }
    </div>
  );
}