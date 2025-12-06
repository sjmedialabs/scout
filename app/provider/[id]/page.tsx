"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  MapPin,
  Calendar,
  Award,
  MessageCircle,
  ExternalLink,
  Users,
  Clock,
  DollarSign,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react"
import { mockProviders } from "@/lib/mock-data"

export default async function ProviderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Find provider by ID
  const provider = mockProviders.find((p) => p.id === id)

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Provider Not Found</h1>
          <p className="text-muted-foreground">The provider you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  // Mock additional data
  const companyStats = {
    founded: provider.foundedYear || 2018,
    teamSize: "50-100",
    projectsCompleted: 234,
    clientRating: provider.rating,
    responseTime: "< 2 hours",
    successRate: "98%",
  }

  const testimonials = [
    {
      id: "1",
      client: "Sarah Johnson",
      company: "TechStart Inc",
      rating: 5,
      comment:
        "Outstanding work! The team delivered beyond our expectations and maintained excellent communication throughout the project.",
      date: "2 months ago",
    },
    {
      id: "2",
      client: "Michael Chen",
      company: "Global Solutions",
      rating: 5,
      comment:
        "Professional, efficient, and creative. They transformed our vision into reality with exceptional attention to detail.",
      date: "3 months ago",
    },
    {
      id: "3",
      client: "Emily Rodriguez",
      company: "Innovation Labs",
      rating: 4,
      comment:
        "Great experience working with this team. Highly recommend for complex projects requiring technical expertise.",
      date: "4 months ago",
    },
  ]

  const technologies = [
    "React",
    "Node.js",
    "Python",
    "TypeScript",
    "AWS",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "GraphQL",
    "Next.js",
    "Tailwind CSS",
    "Kubernetes",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
              <Award className="h-12 w-12 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{provider.companyName}</h1>
                {provider.verified && (
                  <Badge className="bg-white/20 backdrop-blur-sm border-white/30">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {provider.featured && (
                  <Badge className="bg-yellow-400/90 text-yellow-900 border-yellow-500/30">
                    <Star className="h-3 w-3 mr-1 fill-yellow-900" />
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-lg text-white/90 mb-4">{provider.tagline || "Professional service provider"}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
                  <span className="font-semibold text-lg">{provider.rating}</span>
                  <span className="text-white/80">({provider.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.location}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="h-4 w-4" />
                  <span>Founded {provider.foundedYear}</span>
                </div>
                <Badge className="bg-white/20 backdrop-blur-sm border-white/30 capitalize">
                  {provider.subscriptionTier} Plan
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Provider
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Website
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">About the Company</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{provider.description}</p>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Services Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {provider.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100"
                    >
                      <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />
                      <span className="font-medium text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Section */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  {provider.portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                        <img
                          src={
                            item.imageUrl ||
                            `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(item.title) || "/placeholder.svg"}`
                          }
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <Badge variant="outline" className="mb-2">
                          {item.category}
                        </Badge>
                        <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.technologies.slice(0, 3).map((tech, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        {item.projectUrl && (
                          <a
                            href={item.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            View Project <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Client Testimonials */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Client Testimonials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{testimonial.client}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground italic mb-2">"{testimonial.comment}"</p>
                    <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Company Stats */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Company Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Founded</span>
                  </div>
                  <span className="font-semibold">{companyStats.founded}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Team Size</span>
                  </div>
                  <span className="font-semibold">{companyStats.teamSize}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm">Projects</span>
                  </div>
                  <span className="font-semibold">{companyStats.projectsCompleted}+</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span className="text-sm">Rating</span>
                  </div>
                  <span className="font-semibold">{companyStats.clientRating}/5.0</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Response Time</span>
                  </div>
                  <span className="font-semibold">{companyStats.responseTime}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Success Rate</span>
                  </div>
                  <span className="font-semibold text-green-600">{companyStats.successRate}</span>
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.salesEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0" />
                    <a href={`mailto:${provider.salesEmail}`} className="text-sm hover:underline break-all">
                      {provider.salesEmail}
                    </a>
                  </div>
                )}
                {provider.adminContactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0" />
                    <a href={`tel:${provider.adminContactPhone}`} className="text-sm hover:underline">
                      {provider.adminContactPhone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{provider.location}</span>
                </div>
                {provider.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 shrink-0" />
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline break-all"
                    >
                      {provider.website}
                    </a>
                  </div>
                )}
                <Button className="w-full mt-4 bg-white text-blue-600 hover:bg-white/90">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            {/* Pricing */}
            {provider.hourlyRate && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <DollarSign className="h-6 w-6 text-muted-foreground" />
                      <span className="text-4xl font-bold text-blue-600">{provider.hourlyRate}</span>
                      <span className="text-muted-foreground">/hour</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Starting rate</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
