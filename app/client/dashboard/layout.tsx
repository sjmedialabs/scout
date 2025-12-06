import type React from "react"

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-full">{children}</div>
}
