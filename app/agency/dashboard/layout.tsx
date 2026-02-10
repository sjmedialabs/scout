"use client"
import type React from "react"
import Sidebar from "@/components/provider/side-bar"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { authFetch } from "@/lib/auth-fetch"
import {
  Home,
  User,
  Building2,
  Briefcase,
  Users,
  MessageCircle,
  Award,
  Star,
  MessageSquare,
  FileSearch,
  FileText,
  BarChart3,
  TrendingUp,
  Eye,
  GitCompare,
  Megaphone,
  Download,
  Settings,
  CreditCard,
  Bell,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;        // <== ADDED
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "overview",
    label: "OVERVIEW",
    icon: Home,
    children: [
      { id: "dashboard", label: "Dashboard", icon: Home, path: "/agency/dashboard" },

      {id:"editprofile",label:"EditProfile",icon: Briefcase, path: "/agency/dashboard/editprofile"},

      { id: "portfolio", label: "Portfolio", icon: Briefcase, path: "/agency/dashboard/portfolio" },
      { id: "reviews", label: "Reviews", icon: Star, path: "/agency/dashboard/reviews" },
      { id: "messages", label: "Messages", icon: MessageSquare, path: "/agency/dashboard/messages" },
      { id: "project-inquiries", label: "Project Inquiries", icon: FileSearch, path: "/agency/dashboard/project-inquiries" },
      { id: "proposals", label: "Proposals", icon: FileText, path: "/agency/dashboard/proposals" },
      { id: "projects", label: "Projects", icon: Briefcase, path: "/agency/dashboard/projects" },
    ],
  },

  {
    id: "performance",
    label: "PERFORMANCE",
    icon: BarChart3,
    children: [
      { id: "performance-analytics", label: "Performance Analytics", icon: TrendingUp, path: "/agency/dashboard/performance/analytics" },
      { id: "audience-insights", label: "Audience Insights", icon: Eye, path: "/agency/dashboard/performance/audience-insights" },
      { id: "competitor-comparison", label: "Competitor Comparison", icon: GitCompare, path: "/agency/dashboard/performance/competitor-comparison" },
    ],
  },

  // {
  //   id: "marketing",
  //   label: "MARKETING",
  //   icon: Megaphone,
  //   children: [
  //     { id: "lead-generation", label: "Lead Management", icon: Download, path: "/agency/dashboard/marketing/lead-generation" },
  //   ],
  // },

  {
    id: "account-settings",
    label: "ACCOUNT & SETTINGS",
    icon: Settings,
    children: [
      { id: "billing-subscription", label: "Billing & Subscription", icon: CreditCard, path: "/agency/dashboard/account/billing" },
      { id: "subscription", label: "Subscription", icon:Briefcase, path: "/agency/dashboard/account/subscriptions" },
      { id: "notifications", label: "Notifications", icon: Bell, path: "/agency/dashboard/account/notifications" },
    ],
  },
];

export default function AgencyDashboardLayout({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const [expired, setExpired] = useState<boolean | null>(null)
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([])

  const[freeTrailProposalCount,setFreeTrailProposalCount]=useState(0);

  const isSubscriptionPage =
    pathname.startsWith("/agency/dashboard/account/subscriptions") ||
    pathname === "/agency/dashboard/account/billing"

  useEffect(() => {
    if (!loading && (!user || user.role !== "agency")) {
      router.replace("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user || loading) return

    const loadData = async () => {
      try {
        const res = await authFetch(`/api/users/${user.id}`)
        const freeTrailRes=await authFetch("/api/free-trail-config")
        if (!res.ok || !freeTrailRes.ok) throw new Error()
        const data = await res.json()
        const freeTrailData=await freeTrailRes.json();
        console.log("Free Taril Data::::::",freeTrailData)

        const isExpired = data.user?.subscriptionStartDate
          ? new Date(data.user.subscriptionEndDate) < new Date()
          : (data.user?.proposalCount || 0) >= freeTrailData.proposalLimit

        setExpired(isExpired)

        // 🔑 MENU DECISION HERE
        if (isExpired) {
          setFilteredMenuItems([menuItems[menuItems.length - 1]]) // Account only
        } else {
          setFilteredMenuItems(menuItems)
        }
      } catch {
        setExpired(true)
        setFilteredMenuItems([menuItems[menuItems.length - 1]])
      }
    }

    loadData()
  }, [user, loading])

  useEffect(() => {
    if (expired && !isSubscriptionPage) {
      router.replace("/agency/dashboard/account/subscriptions")
    }
  }, [expired, isSubscriptionPage, router])

  if (loading || expired === null) return null
  if (expired && !isSubscriptionPage) return null

  return (
    <div className="min-h-screen flex">
      <Sidebar user={user} menuItems={filteredMenuItems} />
      <div className="flex-1 ml-80 p-6">{children}</div>
    </div>
  )
}
