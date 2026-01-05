import type React from "react"

import Sidebar from "@/components/provider/side-bar"

export default function AgencyDashboardLayout({ children }) {
  const user = { name: "Satya" };
  const provider = {
    subscriptionTier: "basic",
    isVerified: true,
    isFeatured: false,
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar user={user} provider={provider} />

      {/* Main Content */}
      <div className="flex-1  p-6">
        {children}
      </div>
    </div>
  );
}