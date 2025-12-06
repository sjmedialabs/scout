"use client"

import type React from "react"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Menu, Search, Bookmark, MessageSquare } from "lucide-react"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"

export function Navigation() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const isAgencyDashboard = pathname?.startsWith("/agency/dashboard")

  const getDashboardLink = () => {
    if (!user) return "/"

    switch (user.role) {
      case "client":
        return "/client/dashboard"
      case "agency":
        return "/agency/dashboard"
      case "admin":
        return "/admin/dashboard"
      default:
        return "/"
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleBookmark = () => {
    if (!user) {
      router.push("/login")
      return
    }
    router.push("/bookmarks")
  }

  const handleMessages = () => {
    if (!user) {
      router.push("/login")
      return
    }

    if (user.role === "agency") {
      router.push("/agency/dashboard?section=messages")
    } else if (user.role === "client") {
      router.push("/client/dashboard?section=messages")
    } else {
      router.push("/messages")
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="bg-background">
      <div className="bg-slate-700 text-white">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isAgencyDashboard ? "ml-80" : ""}`}>
          <div className="flex justify-between items-center h-12">
            {/* Search Bar */}
            <div className="flex items-center flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-600 border-slate-500 text-white placeholder:text-gray-300 focus:bg-slate-500"
                />
              </form>
            </div>

            {/* Right Side Links */}
            <div className="flex items-center space-x-6">
              <Link href="/providers" className="text-sm hover:text-gray-300">
                For Agencies
              </Link>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-slate-600"
                  onClick={handleBookmark}
                  title="Bookmarks"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-slate-600"
                  onClick={handleMessages}
                  title="Messages"
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:bg-slate-600 flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()}>
                        <Settings className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" className="text-white hover:bg-slate-600" asChild>
                    <Link href="/login" className="text-sm">
                      Sign In
                    </Link>
                  </Button>
                  <Button className="bg-white text-slate-700 hover:bg-gray-100" asChild>
                    <Link href="/register" className="text-sm">
                      Join
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="border-b border-border bg-white">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isAgencyDashboard ? "ml-80" : ""}`}>
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">Spark</span>
            </Link>

            {/* Service Categories Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/services/development" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                Development
              </Link>
              <Link href="/services/it" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                IT Services
              </Link>
              <Link href="/services/marketing" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                Marketing
              </Link>
              <Link href="/services/design" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                Design
              </Link>
              <Link href="/services/business" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                Business Services
              </Link>
              <Link href="/pricing" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                Pricing & Packages
              </Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                Resources
              </Link>
            </div>

            {/* Post a Project Button */}
            <div className="hidden lg:block">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href={user ? "/client/dashboard?section=projects" : "/register"}>Post a Project</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-border py-4">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/services/development"
                  className="text-slate-600 hover:text-slate-900 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Development
                </Link>
                <Link
                  href="/services/it"
                  className="text-slate-600 hover:text-slate-900 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  IT Services
                </Link>
                <Link
                  href="/services/marketing"
                  className="text-slate-600 hover:text-slate-900 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Marketing
                </Link>
                <Link
                  href="/services/design"
                  className="text-slate-600 hover:text-slate-900 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Design
                </Link>
                <Link
                  href="/services/business"
                  className="text-slate-600 hover:text-slate-900 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Business Services
                </Link>
                <Link
                  href="/pricing"
                  className="text-slate-600 hover:text-slate-900 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing & Packages
                </Link>
                <Link
                  href="/about"
                  className="text-slate-600 hover:text-slate-900 text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Resources
                </Link>
                <div className="pt-4 border-t border-border">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link
                      href={user ? "/client/dashboard?section=projects" : "/register"}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Post a Project
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
