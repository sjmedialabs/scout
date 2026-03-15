"use client"

import { useState,useEffect } from "react"
import { LogOut, PanelLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
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
import { RiVerifiedBadgeFill } from "react-icons/ri"

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path?: string
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
  Bell,
  Settings,
  BarChart3,
} from "lucide-react"


/* ✅ Flattened Menu Items */
const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/client/dashboard" },
   { id: "projects", label: "My Projects", icon: Briefcase, path: "/client/dashboard/projects" },
  { id: "proposals", label: "Proposals", icon: MessageSquare, path: "/client/dashboard/proposals" },
 
  { id: "providers", label: "Find Agencies", icon: Users, path: "/client/dashboard/providers" },
  { id: "messages", label: "Chat", icon: MessageSquare, path: "/client/dashboard/chat" },
  { id: "provider-comparison", label: "Provider Comparison", icon: GitCompare, path: "/client/dashboard/provider-comparison" },
  { id: "wishlist", label: "Wish List", icon: Eye, path: "/client/dashboard/wishlist" },
  {id:"notifications",label:"Notifications",icon:Bell,path:"/client/dashboard/notifications"}
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
  const { logout } = useAuth()

  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(false)
      }
    }

    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleMenuClick = (item: MenuItem) => {
    router.push(item.path!)
    onClose()
  }

  const handleLogout = async () => {
    await logout()
    router.replace("/login")
  }

  return (
    <>
      {/* Overlay (mobile only) - smooth animation */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ease-out",
          isOpen ? "bg-black/40 opacity-100" : "bg-transparent opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={cn(
          "fixed z-50 inset-y-0 left-0 bg-card border-r border-border flex flex-col",
          "transform transition-[transform] duration-300 ease-out will-change-transform",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto",
          collapsed ? "lg:w-20" : "lg:w-60",
          "w-[min(80vw,320px)] sm:w-80"
        )}
      >
        {/* Header */}
        <div className="p-1.5 border-b border-gray-300 bg-[#3C3A3E] flex justify-between items-center">
          {!collapsed && (
            <div>
              {/* <h2 className="text-xl font-bold text-[#000]">
                Client Dashboard
              </h2> */}
              <img src="/scoutFooterLogo.png" className="h-[45px] w-[120px] cursor-pointer" onClick={()=>(router.push("/client/dashboard"))}/>
              {/* <p className="text-sm text-[#8B8585]">
                Welcome back, {user.name}
              </p> */}

              {/* <div className="flex items-center gap-2 mt-3">
                <Badge
                  className={`${user.isActive ? "bg-[#39A935]" : "bg-red-500"} min-w-[80px] text-white rounded-full min-h-[30px]`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>

                {user.isVerified && (
                  <Badge
                    variant="secondary"
                    className="bg-white min-h-[30px] rounded-full text-[#2C34A1]"
                  >
                    <RiVerifiedBadgeFill
                      className="h-5 w-5"
                      color="#2C34A1"
                    />
                  </Badge>
                )}
              </div> */}
            </div>
          )}

          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className={cn(
                "hidden lg:flex items-center justify-center min-h-[48px] min-w-[48px] cursor-pointer rounded-lg touch-manipulation",
                collapsed ? "ml-[15px]" : ""
              )}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeft className="h-5 w-5 text-[#8480a8]" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden flex items-center justify-center min-h-[48px] min-w-[48px] rounded-lg touch-manipulation"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto py-4 px-0.5 bg-[#3C3A3E] 
          [scrollbar-width:none] 
          [-ms-overflow-style:none]        
          [&::-webkit-scrollbar]:hidden"
        >
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleMenuClick(item)}
                className={cn(
                  "cursor-pointer flex items-center gap-3 min-h-[48px] px-3 py-3 text-sm rounded-lg text-[#fff] w-full touch-manipulation",
                  pathname === item.path ||
                  (item.path !== "/client/dashboard" && pathname.startsWith(item.path!))
                    ? " text-[#F54A0C] rounded-[8px]"
                    : "",
                  collapsed ? "justify-center px-0" : ""
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="text-left">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#3C3A3E] flex flex-col gap-2">
          {/* <Button
            size="sm"
            className={cn(
              "rounded-2xl bg-[#2C34A1] text-white border-none hover:bg-[#232a85] flex items-center justify-center",
              collapsed ? "w-12 h-12 p-0" : "w-full"
            )}
            onClick={() => {
              if (collapsed) setCollapsed(false)
              router.push("/client/dashboard/post-requirement")
              onClose()
            }}
          >
            <Plus className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Post Requirement</span>}
          </Button> */}

          <Button
            size="sm"
            onClick={handleLogout}
            className={cn(
              "primary-button flex items-center justify-center min-h-[48px] touch-manipulation",
              collapsed ? "w-12 h-12 p-0 min-w-[48px]" : "w-full"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}