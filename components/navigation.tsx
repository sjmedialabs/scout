"use client"

import type React from "react"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Menu, Search, Bookmark, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"



export function Navigation() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()
  const isAgencyDashboard = pathname?.startsWith("/agency/dashboard")

  const [serviceCategories, setServiceCategories] = useState<any[]>([])
const [openMenu, setOpenMenu] = useState<string | null>(null)

const isActive = (slug: string) => {
  return pathname === `/services/${slug}` ||
         pathname?.startsWith(`/services/${slug}/`)
}

// console.log("Active Menu:", activeMenu)

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/service-categories")
      const data = await res.json()
      setServiceCategories(data.data || [])
    } catch (err) {
      console.error("Failed to load service categories", err)
    }
  }

  fetchCategories()
}, [])

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
      setSearchQuery("")
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

  useEffect(() => {
  setOpenMenu(null)
}, [pathname])

  return (
    <div className="bg-background">
      <div className="bg-blueBackground text-gray-500">
        <div className={`max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 ${isAgencyDashboard ? "ml-80" : ""}`}>
          <div className="flex justify-between items-center h-12">
            <div>
              <Link href="/" className="flex items-center space-x-2">
                <img src="/images/spark-nav-logo.png" alt="" className="h-12" />
              </Link>
            </div>
            {/* Search Bar */}
            <div className="lg:flex items-center rounded-full flex-1 max-w-md hidden">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute right-4 top-[25%] flex items-center justify-center pr-3 gap-2">
                  <Search className=" rotate-90 h-5 w-5 text-gray-400" />
                  <Button className="text-orangeButton text-[13px] right-12 top-[45%] p-0 h-0">Search</Button></div>
                <Input
                  placeholder="Search for agency name/service name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-transparent border-slate-300 rounded-full placeholder:text-gray-500 py-0 placeholder:text-xs focus:bg-slate-100"
                />
              </form>
            </div>

            {/* Right Side Links */}
            <div className="flex items-center space-x-6 py-4">
              <Link href="/providers" className="text-sm hover:text-gray-300 font-semibold">
                For Agencies
              </Link>
              <div className="">
                <Button variant="ghost" className="hover:bg-slate-600 h-8 px-4 py-0 bg-transparent border border-orangeButton rounded-full text-orangeButton" asChild>
                  <Link href="/login" className="text-sm">
                    Signin
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav className="border-b border-border">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isAgencyDashboard ? "ml-80" : ""}`}>
          <div className="flex justify-center lg:justify-around items-center h-16">
          <div className="flex items-center rounded-full flex-1 max-w-md lg:hidden">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className="absolute right-4 top-[25%] flex items-center justify-center pr-3 gap-2">
                  <Search className=" rotate-90 h-5 w-5 text-gray-400" />
                  <Button className="text-orangeButton text-[13px] right-12 top-[45%] p-0 h-0">Search</Button></div>
                <Input
                  placeholder="Search for agency name/service name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-transparent border-slate-300 rounded-full placeholder:text-gray-200 py-0 placeholder:text-xs focus:bg-slate-500"
                />
              </form>
            </div>
            {/* Service Categories Navigation */}
            {/* <div className="hidden lg:flex justify-between items-center space-x-8 text-gray-500 hover:text-slate-900 text-xs xl:text-sm font-medium">
              <Link href="/services/development" className="">
                Development
              </Link>
              <Link href="/services/it" className="">
                IT Services
              </Link>
              <Link href="/services/marketing" className="">
                Marketing
              </Link>
              <Link href="/services/design" className="">
                Design
              </Link>
              <Link href="/services/business" className="">
                Business Services
              </Link>
              <Link href="/pricing" className="">
                Pricing & Packages
              </Link>
              <Link href="/about" className="">
                Resources
              </Link>
              <Link href="/pricing" className="">
                Videos,Images
              </Link>
              <Link href="/about" className="">
                Social Media
              </Link>
            </div> */}
        <div className="hidden lg:flex  justify-between  items-center space-x-8 text-xs xl:text-sm font-medium">
 {serviceCategories.map((category) => (
  <DropdownMenu
    key={category.slug}
    open={openMenu === category.slug}
    onOpenChange={(open) =>
      setOpenMenu(open ? category.slug : null)
    }
  >
    <DropdownMenuTrigger asChild>
      <button
        className={`relative pb-4 mt-4 cursor-pointer transition whitespace-nowrap ${
          openMenu === category.slug
            ? "text-[#F4561C] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-[#F4561C]"
            : "text-gray-500 hover:text-slate-900"
        }`}
      >
        {category.title}
      </button>
    </DropdownMenuTrigger>

    {category.children?.length > 0 && (
      <DropdownMenuContent className="w-[900px] p-6 ml-20 mt-3 rounded-2xl">
        <div className="grid grid-cols-5 gap-6">
          {category.children.map((parent: any) => (
            <div key={parent.title}>
              <p className="font-semibold text-sm mb-2 text-slate-900">
                {parent.title}
              </p>
              <ul className="space-y-1">
                {parent.items?.map((child: any) => (
                  <li key={child.slug}>
                    <Link
                      href={`/services/${child.slug}`}
                      className="text-xs text-gray-500 hover:text-slate-900"
                    >
                      {child.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    )}
  </DropdownMenu>
))}


  {/* Static links – apply same active style if needed */}
  <Link 
    href="/pricing" 
    className="text-xs text-gray-500 hover:text-slate-900"
  >
    Pricing & Packages
  </Link>

  <Link 
    href="/about" 
    className="text-xs text-gray-500 hover:text-slate-900"
  >
    About us
  </Link>

  {/* ... other static links ... */}

  

  {/* <Link href="/pricing"className="text-xs text-gray-500 hover:text-slate-900" >
    Videos,Images
  </Link>

  <Link href="/about"  className="text-xs text-gray-500 hover:text-slate-900">
    Social Media
  </Link> */}
</div>


            {/* Post a Project Button */}
            <div className="hidden lg:block rounded-full ml-auto">
              <Button className="bg-orangeButton hover:bg-[#f54607] text-white rounded-full" asChild>
                <Link href={user ? "/client/dashboard?section=projects" : "/register"}>Post A Project</Link>
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
                  <Button className="w-full bg-orangeButton hover:bg-[#f54607] rounded-full text-white" asChild>
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
