"use client";

import { useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  // Desktop collapse (icons only)
  const [collapsed, setCollapsed] = useState(false);

  // Mobile drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex">

        <AdminSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCollapseToggle={() => setCollapsed(prev => !prev)}
          onMobileToggle={() => setMobileOpen(prev => !prev)}
        />

        <div
          className={`
            flex-1 flex flex-col transition-all duration-300
            ${collapsed ? "lg:ml-20" : "lg:ml-64"}
          `}
        >
          {/* Header */}
          <AdminHeader onMenuClick={() => setMobileOpen(true)} />

          <main className="p-6">
            {children}
          </main>
        </div>

      </div>
    </ProtectedRoute>
  );
}