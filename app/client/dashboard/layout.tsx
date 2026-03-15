"use client";

import { useState, useEffect } from "react";
import ClientSidebar from "@/components/seeker/side-bar";
import ClientHeader from "@/components/seeker/clientHeader";
import { ResponsiveLayout } from "@/components/layout";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login");
    }
  }, [user, loading, router]);

  return (
    <>
      {!loading && user && (
        <div className="flex h-screen w-full overflow-hidden">
          
          {/* Sidebar */}
          <ClientSidebar
            user={user}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <div className="flex-1 flex flex-col">

            {/* 👇 Use your ClientHeader here */}
            <ClientHeader
              user={user}
              onMenuClick={() => setSidebarOpen(true)} // pass this
            />

            {/* Main */}
            <main className="flex-1 flex flex-col min-h-0 bg-[#fff]">
              <ResponsiveLayout>{children}</ResponsiveLayout>
            </main>
          </div>
        </div>
      )}
    </>
  );
}
