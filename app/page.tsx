"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Search,
  Star,
  Users,
  Zap,
  Sparkles,
  Code,
  Palette,
  TrendingUp,
  Megaphone,
  Briefcase,
  Shield,
  Divide,
} from "lucide-react"
import { match } from "assert"

// CMS Content Types
interface HeroContent {
  headline: string
  subheadline: string
  ctaPrimary: { text: string; link: string }
  ctaSecondary: { text: string; link: string }
  searchPlaceholder: string
  popularSearches: string[]
}

interface ServiceCategory {
  id: string
  name: string
  icon: string
  color: string
  services: string[]
  order: number
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Palette,
  TrendingUp,
  Megaphone,
  Briefcase,
  Shield,
}

// Color mapping
const colorMap: Record<string, { bg: string; hover: string; text: string }> = {
  green: { bg: "from-green-100 to-green-200", hover: "hover:border-green-200", text: "text-green-600" },
  purple: { bg: "from-purple-100 to-purple-200", hover: "hover:border-purple-200", text: "text-purple-600" },
  blue: { bg: "from-blue-100 to-blue-200", hover: "hover:border-blue-200", text: "text-blue-600" },
  orange: { bg: "from-orange-100 to-orange-200", hover: "hover:border-orange-200", text: "text-orange-600" },
  teal: { bg: "from-teal-100 to-teal-200", hover: "hover:border-teal-200", text: "text-teal-600" },
  indigo: { bg: "from-indigo-100 to-indigo-200", hover: "hover:border-indigo-200", text: "text-indigo-600" },
}

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [providers, setProviders] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeButton, setActiveButton] = useState<"match" | "browse" | null>(null);
  const [cms, setcms] = useState<any>(null)
  // Fetch CMS content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [cmsRes, providersRes, projectsRes] = await Promise.all([
          fetch("/api/cms"),
          fetch("/api/providers?featured=true"),
          fetch("/api/requirements"),
        ])

        if (cmsRes.ok) {
          const data = await cmsRes.json()
          setcms(data.data)
          console.log("CMS response data from api", data)
        }

        if (providersRes.ok) {
          const providersData = await providersRes.json()
          setProviders(providersData.providers?.slice(0, 3) || [])
        }

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          setProjects(projectsData.requirements?.slice(0, 3) || [])
          console.log("Requirements response data from api", projectsData.requirements)
        }

      } catch (error) {
        console.error("Failed to fetch CMS content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const handleGetMatched = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/register")
    }
  }

  const handleLetUsMatch = () => {
    router.push("/register?type=match")
  }

  const handleBrowseOwn = () => {
    router.push("/browse")
  }

  const handlePopularSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gray-50 h-[80vh] flex items-center justify-center"
        style={{
          backgroundImage: `url(${cms?.homeBannerImg || "/Banner.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="custom-heading  text-4xl md:text-5xl md:px-8 font-normal text-white mb-6 leading-tight">
              {cms?.homeBannerTitle || "Connect with trusted companies for your next project."}
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <div className="relative flex flex-col items-center">
                <Button
                  size="lg"
                  className={`flex items-center gap-2 rounded-full transitation-all
                ${activeButton === "match"
                      ? "bg-[#F54A0C] text-white boder-[#F54A0C] shadow-lg"
                      : "bg-[#F54A0C] hover:bg-[#d93f0b] text-white"
                    } `}
                  onClick={() => {
                    setActiveButton("match")
                    handleLetUsMatch()
                  }}
                >
                  Let us match you
                </Button>
                {activeButton === "match" && (
                  <div
                    className="absolute -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#F54A0C]"
                  />
                )}
              </div>
              <div className="relative flex flex-col items-center">
                <Button
                  size="lg"
                  variant="outline"
                  className={`flex items-center gap-2 rounded-full px-6 py-3 border transition-all focus-visible:ring-0 focus-visible:ring-offset-0 active:scale-95
                ${activeButton === "browse"
                      ? "bg-white text-[#F54A0C] shadow-lg"
                      : "bg-white hover:bg-white/90 hover:text-[#F54A0C] text-[#F54A0C]"
                    }`}
                  onClick={() => {
                    setActiveButton("browse")
                    handleBrowseOwn()
                  }}
                >
                  Browse on your own
                </Button>
                {activeButton === "browse" && (
                  <div
                    className="absolute -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"
                  />
                )}
              </div>
            </div>


            {/* Search Section */}
            <div className="space-y-4 max-w-2xl mx-auto bg-white-50">
              <div className="relative flex gap-2">
                <Input
                  placeholder="Search for Agency Name / Service Name?"
                  className="flex-1 h-12  text-white placeholder:text-white border-slate-300 bg-white/20 backdrop-blur-md shadow-inner rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}

                />
                <Button
                  onClick={handleGetMatched}
                  className="absolute top-1/2 right-2 -translate-y-1/2 
               flex items-center justify-center 
               h-10 w-10 rounded-full bg-[#F54A0C] hover:bg-[#d93f0b] 
               shadow-md transition-all rotate-90">
                  <Search className="h-5 w-5 text-white" />
                </Button>
              </div>

              {/* Popular Searches */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 justify-center">
                  {(
                    [
                      "Get more qualified leads",
                      "Improve my SEO rankings",
                      "Develop a content strategy",
                    ]
                  ).map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-white border-slate-300 hover:bg-white/30 bg-transparentr rounded-full"
                      onClick={() => handlePopularSearch(search)}
                    >

                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">How Spark Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cms?.homeWorkSection?.map((section: any, index: number) => (
              <div className="flex flex-col gap-4 items-center text-center">
                <img src={section.image} alt="" />
                <div className="">
                  <h3 className="text-2xl font-bold">{section.title}</h3>
                  <p className="text-gray-500">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories - CMS Driven */}
      <section className="py-20 px-4"
        style={{
          backgroundImage: "url('/images/category-background.png')"
        }}
      >
        <div className="max-w-6xl mx-auto flex justify-center flex-col">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-orangeButton mb-2">
              <span className="text-xs font-medium text-slate-600 capitalize">Service Categories</span>
            </div>
            <h2 className="stext-mediun uppercase font-extrabold text-black ">
              The perfect partner for{" "}
              <span className="text-blueButton">
                any project
              </span>
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              Whatever your business challenge, browse our most in-demand service categories to find top-ranked
              companies in over <span className="font-semibold text-blue-600">2,000 specialized service lines</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {(categories && categories.length > 0
              ? categories
              : [
                // 🔥 fallback demo data
                { id: "1", name: "Web Development", image: "/images/icon-1.png", icon: "Code", color: "blue", services: ["Frontend", "Backend", "Full-Stack", "Frontend", "Backend", "Full-Stack"] },
                { id: "2", name: "Graphic Design", image: "/images/icon-2.png", icon: "Palette", color: "purple", services: ["Logo", "Branding", "UI Design", "Frontend", "Backend", "Full-Stack"] },
                { id: "3", name: "Marketing", image: "/images/icon-3.png", icon: "TrendingUp", color: "green", services: ["SEO", "Ads", "Strategy", "Frontend", "Backend", "Full-Stack"] },
                { id: "4", name: "Web Development", image: "/images/icon-4.png", icon: "Code", color: "blue", services: ["Frontend", "Backend", "Full-Stack", "Frontend", "Backend", "Full-Stack"] },
                { id: "5", name: "Graphic Design", image: "/images/icon-5.png", icon: "Palette", color: "purple", services: ["Logo", "Branding", "UI Design", "Frontend", "Backend", "Full-Stack"] },
                { id: "6", name: "Marketing", image: "/images/icon-6.png", icon: "TrendingUp", color: "green", services: ["SEO", "Ads", "Strategy", "Frontend", "Backend", "Full-Stack"] },
              ]
            ).map((category) => {
              const colors = colorMap[category.color] || colorMap.blue;
              const serviceLink = `/services/${category.id}`;

              return (
                <div
                  key={category.id}
                  className={`group bg-white/70 backdrop-blur-sm rounded-4xl px-6 py-6 border pl-12 ${colors.hover} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <img src={category.image} alt="" className="h-10" />
                    <h3 className={`text-2xl font-bold text-slate-800 group-hover:${colors.text} transition-colors`}>
                      {category.name}
                    </h3>
                  </div>

                  {/* Services */}
                  <div className="space-y-3">
                    {(category.services || []).slice(0, 6).map((service, index) => (
                      <Link
                        key={index}
                        href={serviceLink}
                        className={`block text-slate-500 text-sm hover:${colors.text} hover:translate-x-2 transition-all duration-200 font-medium`}
                      >
                        → {service}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

          </div>
          <div className="flex justify-center items-center">
            <Link href="/services">
              <Button className="rounded-full py-2 text-lg font-bold bg-gradient-to-r from-[#F54A0C] to-[#2C34A1]" size={"lg"}>
                Browse all services →
              </Button></Link>
          </div>
        </div>
      </section>

      {/* Public Requirements - From API */}
      {projects.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-orangeButton mb-2">
                <span className="text-xs font-medium text-slate-600 capitalize">Newly added</span>
              </div>
              <h2 className="stext-mediun uppercase font-extrabold text-black ">
                Recent Requirements
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Discover opportunities from businesses lookking for your services
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <div key={project.id} className="hover:shadow-lg transition-shadow rounded-3xl border border-slate-300">
                  <div className="">
                    <div className="text-lg"><img src={project.image} alt="" className="rounded-t-3xl" /></div>
                    <div className="flex items-center justify-between mb-2 px-8 mt-4">
                      <Badge variant="outline" className="rounded-full px-2 bg-gray-100 font-semibold text-[10px]">{project.category}</Badge>
                      <span className="text-sm text-muted-foreground text-orangeButton font-semibold">{project.timeline}</span>
                    </div>
                    <h3 className="text-lg px-8 capitalize">{project.title}</h3>
                  </div>
                  <div className="pb-10 px-8">
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-col gap-4">
                      <span className="font-bold text-lg text-blueButton">{project.budget}</span>
                      <div>
                        <Button variant="outline" size="sm" asChild className="bg-black text-white rounded-full text-xs">
                          <Link href="/login">View Details →</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center">
              <Link href="/browse">
                <Button className="rounded-full py-2 mt-8 text-lg font-bold bg-gradient-to-r from-[#F54A0C] to-[#2C34A1]" size={"lg"}>
                  Browse all requirements →
                </Button></Link>
            </div>
          </div>
        </section>
      )}

      {/* Top Providers - From API */}
      {providers.length > 0 && (
        <section className="py-16 px-4 bg-blueBackground">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full border border-orangeButton mb-2">
                <span className="text-xs font-medium text-slate-600 capitalize">Top Agency</span>
              </div>
              <h2 className="stext-mediun uppercase font-extrabold text-black ">
                Top Providers
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Discover opportunities from businesses lookking for your services
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {providers.map((provider: any) => (
                <div key={provider.id} className="hover:shadow-lg transition-shadow rounded-3xl border border-slate-300 bg-white">
                  <div className="">
                    <div className="text-lg"><img src={provider.coverImage} alt="" className="rounded-t-3xl" /></div>
                    <div className="flex items-center justify-between mb-2 px-8 mt-4">

                      {/* FEATURED & VERIFIED BADGES */}
                      <div className="flex items-center gap-2">
                        {provider.isVerified && (
                          <Badge
                            variant="outline"
                            className="bg-blueButton text-white rounded-full px-3 py-0.5 text-[10px] font-semibold"
                          >
                            Verified
                          </Badge>
                        )}
                        {provider.isFeatured && (
                          <Badge className="bg-orangeButton text-white rounded-full px-3 py-0.5 text-[10px] font-semibold">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* ⭐ RATING STARS */}
                      <div className="flex items-center justify-center gap-0.2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill={i < provider.rating ? "#F59E0B" : "#D1D5DB"} // yellow or gray
                            className="w-4 h-4"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 
        0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 
        1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 
        1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                        ))}

                        <span className="text-xs font-semibold text-gray-700 ml-1">
                          {provider.rating?.toFixed(1) || "0.0"}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg px-8 font-bold capitalize">{provider.name}</h3>
                  </div>
                  <div className="pb-10 px-8">
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{provider.description}</p>
                    <div className="flex flex-col gap-4">

                      {/* SERVICES BADGES */}
                      <div className="flex flex-wrap gap-2">
                        {provider.services?.length > 0 ? (
                          provider.services.slice(0, 4).map((service: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-black px-2 py-1 rounded-full text-xs font-semibold"
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No services listed</span>
                        )}
                      </div>

                      {/* VIEW DETAILS BUTTON */}
                      <div>
                        <Button
                          variant="outline"
                          size="default"
                          asChild
                          className="bg-blueButton text-white rounded-full text-xs"
                        >
                          <Link href={`/provider/${provider.id || provider._id}`}>View Details →</Link>
                        </Button>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" className="rounded-full py-2 mt-8 text-lg font-bold bg-gradient-to-r from-[#F54A0C] to-[#2C34A1] text-white" size={"lg"} asChild>
                <Link href="/providers">View All Providers</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-4xl font-extralight">{cms?.getStartedTitle}</h3>
          <p className="text-base max-w-sm mx-auto text-slate-500">
            {cms?.getStartedSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Button size="lg" className="bg-orangeButton font-semibold text-sm text-white rounded-full hover:bg-gray-100" asChild>
              <Link href="/register">Post a requirement</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-blueButton font-semibold text-sm text-white rounded-full hover:bg-gray-100"
              asChild
            >
              <Link href="/providers">Become a provider</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
