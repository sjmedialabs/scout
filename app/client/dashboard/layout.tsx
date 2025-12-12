import ClientSidebar from "@/components/seeker/side-bar"

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = { name: "Client User" } // Replace with actual user

  return (
    <div className="flex h-screen w-full">
      <ClientSidebar user={user} />

      <main className="flex-1 overflow-y-auto p-6 bg-background">
        {children}
      </main>
    </div>
  )
}
