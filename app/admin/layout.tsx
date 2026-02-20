"use client";

import { useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminHeader from "./components/AdminHeader";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex">
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        <div
  className={`
    flex-1 flex flex-col transition-all duration-300
    ${collapsed ? "lg:ml-20" : "lg:ml-64"}
  `}
>
          {/* 🔹 Header */}
          <AdminHeader />

        <main
          className="p-6"
        >
          {children}
        </main>
      </div>
      </div>
    </ProtectedRoute>
  );
}
