"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminHeader from "./components/AdminHeader";
import { ResponsiveLayout } from "@/components/layout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  // Desktop collapse (icons only)
  const [collapsed, setCollapsed] = useState(false);

  // Mobile drawer open/close
  const [mobileOpen, setMobileOpen] = useState(false);
  const[cms, setCms] = useState<any>(null);

  const fetchCms = async () => {
    try{
        const res=await fetch("/api/cms");
        if(!res.ok) throw new Error("Failed to fetch CMS data");
        const data = await res.json();
        setCms(data.data);

    }catch(err){
        console.log("Error fetching CMS data:", err);
    }
  }
  useEffect(()=>{
    fetchCms();
  },[]);

  return (
    <ProtectedRoute>
      <div className="flex">

        <AdminSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCollapseToggle={() => setCollapsed(prev => !prev)}
          onMobileToggle={() => setMobileOpen(prev => !prev)}
          cms={cms}
        />

        <div
          className={`
            flex-1 flex flex-col transition-all duration-300
            ${collapsed ? "lg:ml-20" : "lg:ml-64"}
          `}
        >
          {/* Header */}
          <AdminHeader onMenuClick={() => setMobileOpen(true)} />

          <main className="flex-1 flex flex-col min-h-0">
            <ResponsiveLayout>{children}</ResponsiveLayout>
          </main>
        </div>

      </div>
    </ProtectedRoute>
  );
}