"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

// --- NEW MenuItem type with `path` ---
interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path?: string
  children?: MenuItem[]
}

// --- YOUR SAME MENU, but now includes PATHS ---
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


export default function ClientSidebar({ user, setShowPostForm }: any) {
  const router = useRouter()
  const pathname = usePathname()

  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [activeSection, setActiveSection] = useState<string>("")

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleMenuClick = (item: MenuItem, parentId: string) => {
    setActiveSection(item.id)
    router.push(item.path!) // 🔥 THIS IS THE FINAL DESTINATION REDIRECT
  }

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col shrink-0">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Client Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Welcome back, {user.name}
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Badge className="bg-green-100 text-green-800">Active Client</Badge>
          <Badge variant="secondary">Verified</Badge>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {menuItems.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </div>

                {section.children &&
                  (expandedSections.includes(section.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  ))}
              </button>

              {section.children &&
                expandedSections.includes(section.id) && (
                  <div className="ml-4 mt-2 space-y-1">
                    {section.children.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMenuClick(item, section.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-2 text-sm rounded-lg transition-colors",
                          pathname === item.path
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
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

      <div className="p-4 border-t border-border">
        <Button onClick={() => setShowPostForm(true)} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Post New Requirement
        </Button>
      </div>
    </div>
  )
}
