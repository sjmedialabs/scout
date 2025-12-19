"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path?: string
  children?: MenuItem[]
}

import {
  Home,
  User,
  FileText,
  MessageSquare,
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  GitCompare,
  CreditCard,
  Bell,
  Settings,
  BarChart3,
} from "lucide-react"

const menuItems: MenuItem[] = [
  {
    id: "overview",
    label: "OVERVIEW",
    icon: Home,
    children: [
      { id: "dashboard", label: "Dashboard", icon: Home, path: "/client/dashboard" },
      { id: "profile", label: "Profile", icon: User, path: "/client/dashboard/profile" },
      { id: "requirements", label: "My Requirements", icon: FileText, path: "/client/dashboard/requirements" },
      { id: "proposals", label: "Proposals", icon: MessageSquare, path: "/client/dashboard/proposals" },
      { id: "projects", label: "Projects", icon: Briefcase, path: "/client/dashboard/projects" },
      { id: "providers", label: "Find Agencies", icon: Users, path: "/client/dashboard/providers" },
    ],
  },
  {
    id: "performance",
    label: "PERFORMANCE",
    icon: BarChart3,
    children: [
      { id: "analytics", label: "Project Analytics", icon: TrendingUp, path: "/client/dashboard/analytics" },
      { id: "spending", label: "Spending Insights", icon: Eye, path: "/client/dashboard/spending" },
      { id: "provider-comparison", label: "Provider Comparison", icon: GitCompare, path: "/client/dashboard/provider-comparison" },
    ],
  },
  {
    id: "account-settings",
    label: "ACCOUNT & SETTINGS",
    icon: Settings,
    children: [
      { id: "billing", label: "Billing & Payments", icon: CreditCard, path: "/client/dashboard/billing" },
      { id: "notifications", label: "Notifications", icon: Bell, path: "/client/dashboard/notifications" },
      { id: "account-settings", label: "Account Settings", icon: Settings, path: "/client/dashboard/account-settings" },
    ],
  },
]

export default function ClientSidebar({
  user,
  isOpen,
  onClose,
}: {
  user: any
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleMenuClick = (item: MenuItem) => {
    router.push(item.path!)
    onClose() // close sidebar on mobile
  }

  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed z-50 inset-y-0 left-0 w-80 bg-card border-r border-border flex flex-col transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold">Client Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user.name}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Badge className="bg-green-100 text-green-800">Active Client</Badge>
              <Badge variant="secondary">Verified</Badge>
            </div>
          </div>

          {/* Close button (mobile) */}
          <button onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {menuItems.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 text-sm font-medium text-muted-foreground hover:bg-accent rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="h-4 w-4" />
                    {section.label}
                  </div>
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {section.children &&
                  expandedSections.includes(section.id) && (
                    <div className="ml-4 mt-2 space-y-1">
                      {section.children.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleMenuClick(item)}
                          className={cn(
                            "w-full flex items-center gap-3 p-2 text-sm rounded-lg",
                            pathname === item.path
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-accent"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            className="w-full"
            onClick={() => {
              router.push("/client/dashboard/post-requirement")
              onClose()
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Post New Requirement
          </Button>
        </div>
      </aside>
    </>
  )
}
