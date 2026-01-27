"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

export type UserRole = "client" | "agency" | "admin"



interface User {
  id: string
  email: string
  name: string
  role: UserRole
  isVerified:boolean
  isActive:boolean
  companyName?: string
  avatar?: string
}

// interface AuthContextType {
//   user: User | null
//   login: (email: string, password: string) => Promise<void>
//   register: (email: string, password: string, name: string, role: UserRole, companyName?: string) => Promise<void>
//   logout: () => Promise<void>
//   loading: boolean
//   isAuthenticated: boolean
// }

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    companyName?: string
  ) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // const login = async (email: string, password: string) => {
  //   setLoading(true)
  //   try {
  //     const response = await fetch("/api/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email, password}),
  //     })

  //     const data = await response.json()

  //     if (!response.ok) {
  //       throw new Error(data.error || "Login failed")
  //     }

  //     setUser(data.user)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

 const login = async (
  email: string,
  password: string
): Promise<User> => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  const data = await res.json();

  setUser(data.user);
  return data.user;
};



  const register = async (email: string, password: string, name: string, role: UserRole, companyName?: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role, companyName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      setUser(data.user)
       return data.user
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
