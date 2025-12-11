"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserManagement } from "@/components/admin/user-management"
import { ContentModeration } from "@/components/admin/content-moderation"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import {
  Users,
  BarChart3,
  FileText,
  AlertTriangle,
  Home,
  Settings,
  CreditCard,
  UserCheck,
  DollarSign,
  Shield,
  Database,
  Bell,
  ChevronDown,
  ChevronRight,
  Building2,
  Activity,
  TrendingUp,
  Eye,
  MessageSquare,
  Globe,
} from "lucide-react"
import {
  mockAdminUsers,
  mockAdminStats,
  mockReportedContent,
  mockSubscriptionStats,
  mockProvider,
  categories,
} from "@/lib/mock-data"
import type { AdminUser, ReportedContent } from "@/lib/types"

interface MenuItem {
  id: string
  label: string
  icon: any
  children?: MenuItem[]
}

const adminMenuItems: MenuItem[] = [
  {
    id: "overview",
    label: "OVERVIEW",
    icon: Home,
    children: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "reports", label: "Reports", icon: FileText },
    ],
  },
  {
    id: "user-management",
    label: "USER MANAGEMENT",
    icon: Users,
    children: [
      { id: "users", label: "All Users", icon: Users },
      { id: "role-management", label: "Role Management", icon: Shield },
      { id: "user-verification", label: "User Verification", icon: UserCheck },
      { id: "user-activity", label: "User Activity", icon: Activity },
    ],
  },
  {
    id: "subscription-management",
    label: "SUBSCRIPTIONS",
    icon: CreditCard,
    children: [
      { id: "subscribers", label: "Subscribers Management", icon: Users },
      { id: "subscription-plans", label: "Subscription Plans", icon: CreditCard },
      { id: "billing", label: "Billing & Invoices", icon: FileText },
      { id: "payment-methods", label: "Payment Methods", icon: DollarSign },
    ],
  },
  {
    id: "revenue-tracking",
    label: "REVENUE & ANALYTICS",
    icon: DollarSign,
    children: [
      { id: "revenue-dashboard", label: "Revenue Dashboard", icon: DollarSign },
      { id: "financial-reports", label: "Financial Reports", icon: BarChart3 },
      { id: "growth-metrics", label: "Growth Metrics", icon: TrendingUp },
      { id: "performance-insights", label: "Performance Insights", icon: Eye },
    ],
  },
  {
    id: "content-moderation",
    label: "CONTENT & MODERATION",
    icon: Shield,
    children: [
      { id: "moderation", label: "Content Moderation", icon: AlertTriangle },
      { id: "reported-content", label: "Reported Content", icon: FileText },
      { id: "content-policies", label: "Content Policies", icon: Shield },
      { id: "automated-filters", label: "Automated Filters", icon: Database },
    ],
  },
  {
    id: "platform-management",
    label: "PLATFORM",
    icon: Globe,
    children: [
      { id: "settings", label: "Platform Settings", icon: Settings },
      { id: "categories", label: "Category Management", icon: Building2 },
      { id: "notifications", label: "System Notifications", icon: Bell },
      { id: "maintenance", label: "Maintenance Mode", icon: Settings },
    ],
  },
  {
    id: "communication",
    label: "COMMUNICATION",
    icon: MessageSquare,
    children: [
      { id: "announcements", label: "Announcements", icon: Bell },
      { id: "support-tickets", label: "Support Tickets", icon: MessageSquare },
      { id: "email-campaigns", label: "Email Campaigns", icon: FileText },
    ],
  },
]

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [expandedSections, setExpandedSections] = useState<string[]>(["overview"])
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers)
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>(mockReportedContent)
  const [managedCategories, setManagedCategories] = useState(categories)
  const [newCategory, setNewCategory] = useState("")

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login")
    }
  }, [user, loading, router])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const handleMenuClick = (itemId: string, parentId?: string) => {
    setActiveSection(itemId)
    if (parentId && !expandedSections.includes(parentId)) {
      setExpandedSections((prev) => [...prev, parentId])
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const handleUpdateUserStatus = (userId: string, status: AdminUser["status"]) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)))
    console.log(`Updated user ${userId} status to ${status}`)
  }

  const handleSendMessage = (userId: string, message: string) => {
    console.log(`Sending message to user ${userId}:`, message)
    // In real app, this would send the message
  }

  const handleResolveReport = (reportId: string, action: "approve" | "reject", notes?: string) => {
    setReportedContent((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: action === "approve" ? "resolved" : "dismissed",
              resolvedAt: new Date(),
              resolvedBy: user.id,
            }
          : r,
      ),
    )
    console.log(`Report ${reportId} ${action}ed with notes:`, notes)
  }

  const handleAddCategory = () => {
    if (newCategory && !managedCategories.includes(newCategory)) {
      setManagedCategories((prev) => [...prev, newCategory])
      setNewCategory("")
    }
  }

  const handleRemoveCategory = (category: string) => {
    setManagedCategories((prev) => prev.filter((c) => c !== category))
  }

  const pendingReports = reportedContent.filter((r) => r.status === "pending").length
  const pendingUsers = users.filter((u) => u.status === "pending").length

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-slate-600">Total Users</h3>
                  <div className="w-12 h-12 bg-linear-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{mockAdminStats.totalUsers}</div>
                <p className="text-xs text-slate-600">{pendingUsers} pending approval</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-slate-600">Active Projects</h3>
                  <div className="w-12 h-12 bg-linear-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{mockAdminStats.totalProjects}</div>
                <p className="text-xs text-slate-600">{mockAdminStats.totalRequirements} requirements posted</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-slate-600">Pending Reports</h3>
                  <div className="w-12 h-12 bg-linear-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{pendingReports}</div>
                <p className="text-xs text-slate-600">Require moderation</p>
              </div>

              <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium text-slate-600">Monthly Revenue</h3>
                  <div className="w-12 h-12 bg-linear-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-800 mb-1">
                  ${mockSubscriptionStats.monthlyRecurring.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600">+{mockAdminStats.monthlyGrowth}% growth</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Recent User Activity</h3>
                  <p className="text-slate-600">Latest user registrations and status changes</p>
                </div>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-slate-100"
                    >
                      <div>
                        <div className="font-medium text-slate-800">{user.name}</div>
                        <div className="text-sm text-slate-600">{user.email}</div>
                      </div>
                      <Badge
                        className={
                          user.status === "active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : user.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                              : "bg-red-100 text-red-800 border-red-200"
                        }
                        variant="secondary"
                      >
                        {user.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 hover:shadow-xl transition-all duration-300">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Content Reports</h3>
                  <p className="text-slate-600">Recent content moderation requests</p>
                </div>
                <div className="space-y-4">
                  {reportedContent.slice(0, 5).map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3 bg-white/50 rounded-xl border border-slate-100"
                    >
                      <div>
                        <div className="font-medium text-slate-800">{report.reason}</div>
                        <div className="text-sm text-slate-600">
                          {report.type} • {report.createdAt.toLocaleDateString()}
                        </div>
                      </div>
                      <Badge
                        className={
                          report.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : report.status === "resolved"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                        variant="secondary"
                      >
                        {report.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case "users":
        return (
          <UserManagement users={users} onUpdateUserStatus={handleUpdateUserStatus} onSendMessage={handleSendMessage} />
        )

      case "moderation":
        return <ContentModeration reportedContent={reportedContent} onResolveReport={handleResolveReport} />

      case "analytics":
        return (
          <AnalyticsDashboard
            stats={mockAdminStats}
            subscriptionStats={mockSubscriptionStats}
            topProviders={[mockProvider]}
          />
        )

      case "settings":
      case "categories":
        return (
          <div className="space-y-6">
            {/* Category Management */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Category Management</h3>
                <p className="text-slate-600">Manage service categories available on the platform</p>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Add new category"
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button
                    onClick={handleAddCategory}
                    className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105"
                  >
                    Add Category
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {managedCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-2 rounded-xl"
                    >
                      {category}
                      <button
                        onClick={() => handleRemoveCategory(category)}
                        className="text-slate-500 hover:text-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Platform Settings */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 hover:shadow-xl transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Platform Settings</h3>
                <p className="text-slate-600">Configure platform-wide settings and policies</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-100">
                  <div>
                    <div className="font-medium text-slate-800">Auto-approve new providers</div>
                    <div className="text-sm text-slate-600">
                      Automatically approve new service provider registrations
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-100">
                  <div>
                    <div className="font-medium text-slate-800">Review moderation</div>
                    <div className="text-sm text-slate-600">Require admin approval for all reviews</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Configure
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-100">
                  <div>
                    <div className="font-medium text-slate-800">Subscription management</div>
                    <div className="text-sm text-slate-600">Manage subscription tiers and pricing</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Configure
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Coming Soon</h3>
              <p className="text-slate-600 mb-4">This section is under development</p>
              <p className="text-slate-500">The {activeSection} section will be available in a future update.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100 mask-[linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

      <div className="fixed left-0 top-0 h-full w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200/50 flex flex-col z-10">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold">Super Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-red-100 text-red-800">Super Admin</Badge>
            <Badge variant="secondary">Full Access</Badge>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {adminMenuItems.map((section) => (
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

                {section.children && expandedSections.includes(section.id) && (
                  <div className="ml-4 mt-2 space-y-1">
                    {section.children.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id, section.id)}
                        className={`w-full flex items-center gap-3 p-2 text-sm rounded-lg transition-colors ${
                          activeSection === item.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
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
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      <div className="ml-80">
        <div className="container mx-auto max-w-7xl py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                {activeSection === "dashboard"
                  ? "Admin Dashboard"
                  : adminMenuItems.flatMap((s) => s.children || []).find((item) => item.id === activeSection)?.label ||
                    "Admin Dashboard"}
              </h1>
              <p className="text-muted-foreground">Platform management and oversight</p>
            </div>
            <div className="flex items-center gap-2">
              {pendingReports > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {pendingReports} Reports
                </Badge>
              )}
              {pendingUsers > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {pendingUsers} Pending
                </Badge>
              )}
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  )
}
