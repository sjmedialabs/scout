"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import ClientSidebar from "@/components/seeker/side-bar"

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = { name: "Client User" } // replace with real user

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ClientSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 p-4 border-b border-border">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Client Dashboard</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
