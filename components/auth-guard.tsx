"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function AuthGuard({
  children,
  allowedRoles,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname() ?? ""

  console.log("AUTH USER:", user)

  // ✅ PUBLIC ROUTES (KEEP)
  const isPublicPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"

  // ✅ ROLE NORMALIZATION (TYPE-SAFE)
  const normalizedRole: UserRole | undefined = (() => {
    const role = user?.role as string | undefined
    if (!role) return undefined

    if (role === "provider" || role === "service_provider") {
      return "agency"
    }

    if (role === "seeker" || role === "service_seeker") {
      return "client"
    }

    if (role === "agency" || role === "client" || role === "admin") {
      return role
    }

    return undefined
  })()

  useEffect(() => {
    if (loading || isPublicPage) return

    if (!isAuthenticated) {
      router.replace(redirectTo)
      return
    }

    if (allowedRoles && normalizedRole && !allowedRoles.includes(normalizedRole)) {
      switch (normalizedRole) {
        case "client":
          router.replace("/client/dashboard")
          break
        case "agency":
          router.replace("/agency/dashboard")
          break
        case "admin":
          router.replace("/admin/dashboard")
          break
        default:
          router.replace("/")
      }
    }
  }, [
    loading,
    isAuthenticated,
    normalizedRole,
    allowedRoles,
    router,
    redirectTo,
    isPublicPage,
  ])

  // ✅ PUBLIC PAGES SHOULD ALWAYS RENDER
  if (isPublicPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (allowedRoles && normalizedRole && !allowedRoles.includes(normalizedRole)) {
    return null
  }

  return <>{children}</>
}
