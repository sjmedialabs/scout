"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function Footer() {
  const pathname = usePathname()
  const isAgencyDashboard = pathname?.startsWith("/agency/dashboard")
  const [email, setEmail] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setEmail("")
        alert("Successfully subscribed to newsletter!")
      } else {
        alert("Failed to subscribe. Please try again.")
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      alert("Failed to subscribe. Please try again.")
    }
  }

  return (
    <footer className="bg-muted/30 border-t">
      <div className={`max-w-6xl mx-auto px-4 py-12 ${isAgencyDashboard ? "ml-80" : ""}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-12 justify-center">
          <Link href={"/"}>
          <img src="/images/footer-logo.png" alt="" className="col-span-1 py-2 h-24"/></Link>
          <div className="md:items-center md:col-span-3 flex md:flex-row flex-col md:gap-4 md:border-l border-gray-300 lg:mr-36">
            <div className="basis-1/3 flex md:justify-end">
            <h3 className="text-white font-semibold text-2xl">Subscribe</h3>
            </div>
            <div className="basis-2/3">
          <form onSubmit={handleSubscribe} className="flex gap-2 relative rounded-full items-center px-1 w-full h-full">
              <Input
                placeholder="Enter your email"
                className="text-sm"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button size="sm" type="submit">
                Subscribe
              </Button>
            </form>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/browse" className="text-muted-foreground hover:text-foreground">
                  Browse Requirements
                </Link>
              </li>
              <li>
                <Link href="/providers" className="text-muted-foreground hover:text-foreground">
                  Find Agencies
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-muted-foreground hover:text-foreground">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-muted-foreground hover:text-foreground">
                  Become an Agency
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-muted-foreground hover:text-foreground">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2024 Spark. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="https://facebook.com/sparkplatform"
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
            <img src="/images/Facebook.png" alt="" className="h-8"/>
            </Link>
            <Link
              href="https://twitter.com/sparkplatform"
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
            <img src="/images/twitter.png" alt="" className="h-8"/>
            </Link>
            <Link
              href="https://linkedin.com/company/sparkplatform"
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
            <img src="/images/Linkedin.png" alt="" className="h-8"/>
            </Link>
            <Link
              href="https://youtube.com/sparkplatform"
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
            <img src="/images/youtube.png" alt="" className="h-8"/>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
