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
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null)
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [providers, setProviders] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeButton, setActiveButton] = useState<"match" | "browse" | null>(null);

  // Fetch CMS content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [heroRes, categoriesRes, providersRes, projectsRes] = await Promise.all([
          fetch("/api/cms/hero"),
          fetch("/api/cms/categories"),
          fetch("/api/providers?featured=true"),
          fetch("/api/projects?status=open"),
        ])

        if (heroRes.ok) {
          const heroData = await heroRes.json()
          setHeroContent(heroData.content)
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData.categories)
        }

        if (providersRes.ok) {
          const providersData = await providersRes.json()
          setProviders(providersData.providers?.slice(0, 3) || [])
        }

        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          setProjects(projectsData.projects?.slice(0, 3) || [])
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
    router.push(heroContent?.ctaPrimary.link || "/register?type=match")
  }

  const handleBrowseOwn = () => {
    router.push(heroContent?.ctaSecondary.link || "/browse")
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
      <section className="py-16 px-4 bg-gray-50"
      style={{ 
        backgroundImage: "url('/Banner.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
        }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {heroContent?.headline || "Connect with trusted companies for your next project."}
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <div className="relative flex flex-col items-center">
              <Button
                size="lg"
                className={`flex items-center gap-2 rounded-full transitation-all
                ${
                activeButton === "match"
                ? "bg-[#F54A0C] text-white boder-[#F54A0C] shadow-lg"
                : "bg-[#F54A0C] hover:bg-[#d93f0b] text-white"
              } `}
                onClick={() => {
                  setActiveButton("match")
                  handleLetUsMatch()
              }}
              >
                {heroContent?.ctaPrimary.text || "Let us match you"}
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
                ${
                activeButton === "browse"
                ? "bg-white text-[#F54A0C] shadow-lg"
                : "bg-white hover:bg-white/90 hover:text-[#F54A0C] text-[#F54A0C]"
            }`}
                onClick={()=> {
                  setActiveButton("browse")
                handleBrowseOwn()
                }}
              >
                {heroContent?.ctaSecondary.text || "Browse on your own"}
              </Button>
              {activeButton === "browse" && (
                <div
                className = "absolute -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"
                />
              )}
              </div>
            </div>
              

            {/* Search Section */}
            <div className="space-y-4 max-w-2xl mx-auto bg-white-50">
              <div className="relative flex gap-2">
                <Input
                  placeholder={heroContent?.searchPlaceholder || "Search for Agency Name / Service Name?"}
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
                    heroContent?.popularSearches || [
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
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How Spark Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Post Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Describe your project needs, budget, and timeline. Our platform matches you with relevant providers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Receive Proposals</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Get detailed proposals from verified providers. Compare costs, timelines, and approaches.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Get Work Done</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Choose the best provider, manage your project, and leave reviews to help the community.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Categories - CMS Driven */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 mb-6">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-slate-600 uppercase tracking-wide">Service Categories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
              The perfect partner for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                any project
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Whatever your business challenge, browse our most in-demand service categories to find top-ranked
              companies in over <span className="font-semibold text-blue-600">2,000 specialized service lines</span>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon] || Code
              const colors = colorMap[category.color] || colorMap.blue
              const serviceLink = `/services/${category.id}`

              return (
                <div
                  key={category.id}
                  className={`group bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50 ${colors.hover} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <IconComponent className={`h-8 w-8 ${colors.text}`} />
                    </div>
                    <h3 className={`text-2xl font-bold text-slate-800 group-hover:${colors.text} transition-colors`}>
                      {category.name}
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {(category.services || []).slice(0, 6).map((service, index) => (
                      <Link
                        key={index}
                        href={serviceLink}
                        className={`block text-slate-600 hover:${colors.text} hover:translate-x-2 transition-all duration-200 font-medium`}
                      >
                        → {service}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Public Requirements - From API */}
      {projects.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Recent Project Opportunities</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{project.category}</Badge>
                      <span className="text-sm text-muted-foreground">{project.timeline}</span>
                    </div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">{project.budget}</span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/login">View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Providers - From API */}
      {providers.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Agencies</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {providers.map((provider: any) => (
                <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {provider.featured && <Badge className="bg-yellow-500">Featured</Badge>}
                      {provider.verified && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <CardDescription>{provider.tagline || provider.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {provider.services?.slice(0, 3).map((service: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{provider.rating?.toFixed(1) || "New"}</span>
                        <span className="text-sm text-muted-foreground">({provider.reviewCount || 0} reviews)</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/provider/${provider.id}`}>View Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link href="/providers">View All Agencies</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your perfect partner?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of businesses who have found their ideal service providers on Spark.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-slate-800 hover:bg-gray-100" asChild>
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/providers">Browse Agencies</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
