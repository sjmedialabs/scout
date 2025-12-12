"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PostRequirementForm } from "@/components/seeker/post-requirement-form"
import { RequirementList } from "@/components/seeker/requirement-list"
import { ProposalList } from "@/components/seeker/proposal-list"
import { RequirementDetailsModal } from "@/components/seeker/requirement-details-modal"
import { NegotiationChat } from "@/components/negotiation-chat"
import { FiltersPanel } from "@/components/filters-panel"
import { ProviderProfileModal } from "@/components/provider-profile-modal"
import { ProjectSubmissionForm } from "@/components/project-submission-form"
import { ReviewSubmissionForm } from "@/components/review-submission-form"
import { ProviderComparison } from "@/components/provider-comparison"
import { NotificationsWidget } from "@/components/seeker/notifications-widget"
import {
  Plus,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Eye,
  Home,
  User,
  Briefcase,
  BarChart3,
  Settings,
  CreditCard,
  Bell,
  Shield,
  GitCompare,
  ChevronDown,
  ChevronRight,
  Edit,
  Save,
  X,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  MoreHorizontal,
  Trash2,
  DollarSign,
  Target,
  Heart,
  SeparatorVertical as Separator,
} from "lucide-react"
import { mockRequirements, mockProposals, mockProviders } from "@/lib/mock-data"
import type { Requirement, Proposal, Provider, Notification } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
interface ProjectProposal {
  id: string
  projectId: string
  providerId: string
  providerName: string
  providerRating: number
  proposalAmount: number
  timeline: string
  description: string
  submittedAt: string
  status: "pending" | "shortlisted" | "accepted" | "rejected"
  coverLetter: string
}

const mockProjectProposals: ProjectProposal[] = [
  {
    id: "pp1",
    projectId: "proj1",
    providerId: "prov1",
    providerName: "TechSolutions Inc",
    providerRating: 4.8,
    proposalAmount: 15000,
    timeline: "8 weeks",
    description:
      "We propose to develop a comprehensive e-commerce platform using React, Node.js, and MongoDB. Our team has extensive experience in building scalable web applications with modern technologies. We'll implement advanced features like real-time inventory management, secure payment processing, and analytics dashboard.",
    submittedAt: "2024-01-15",
    status: "pending",
    coverLetter:
      "We are excited to work on your e-commerce project and deliver a high-quality solution that meets your business needs. Our portfolio includes 20+ successful e-commerce projects.",
  },
  {
    id: "pp2",
    projectId: "proj1",
    providerId: "prov2",
    providerName: "WebCraft Studios",
    providerRating: 4.6,
    proposalAmount: 12000,
    timeline: "10 weeks",
    description:
      "Our approach focuses on creating a user-friendly e-commerce platform with advanced features like real-time inventory management, payment gateway integration, and responsive design. We'll use Next.js for optimal performance and SEO.",
    submittedAt: "2024-01-16",
    status: "shortlisted",
    coverLetter:
      "With 5+ years of e-commerce development experience, we're confident in delivering exceptional results for your project. We guarantee 99.9% uptime and mobile-first design.",
  },
  {
    id: "pp3",
    projectId: "proj1",
    providerId: "prov3",
    providerName: "Digital Commerce Pro",
    providerRating: 4.7,
    proposalAmount: 18000,
    timeline: "6 weeks",
    description:
      "Premium e-commerce solution with AI-powered recommendations, advanced analytics, multi-vendor support, and integrated CRM. We'll deliver a future-ready platform that scales with your business.",
    submittedAt: "2024-01-18",
    status: "pending",
    coverLetter:
      "We specialize in enterprise-level e-commerce solutions and have helped 100+ businesses increase their online revenue by 300% on average.",
  },
  {
    id: "pp4",
    projectId: "proj2",
    providerId: "prov4",
    providerName: "MobileFirst Dev",
    providerRating: 4.9,
    proposalAmount: 8000,
    timeline: "6 weeks",
    description:
      "We specialize in React Native development and will create a cross-platform mobile app with native performance, push notifications, offline capabilities, and seamless user experience across iOS and Android.",
    submittedAt: "2024-01-17",
    status: "accepted",
    coverLetter:
      "Our team has developed 50+ mobile apps with excellent user ratings. We're excited to bring your vision to life with cutting-edge mobile technology.",
  },
  {
    id: "pp5",
    projectId: "proj2",
    providerId: "prov5",
    providerName: "AppCrafters",
    providerRating: 4.5,
    proposalAmount: 9500,
    timeline: "8 weeks",
    description:
      "Native iOS and Android development with Flutter framework. We'll create a high-performance mobile app with custom animations, biometric authentication, and cloud synchronization.",
    submittedAt: "2024-01-19",
    status: "shortlisted",
    coverLetter:
      "We're a team of certified mobile developers with expertise in Flutter, React Native, and native development. Your app will be optimized for performance and user engagement.",
  },
  {
    id: "pp6",
    projectId: "proj3",
    providerId: "prov6",
    providerName: "BrandVision Agency",
    providerRating: 4.8,
    proposalAmount: 5000,
    timeline: "4 weeks",
    description:
      "Complete brand identity package including logo design, color palette, typography, brand guidelines, business cards, letterheads, and social media templates. We'll create a memorable brand that resonates with your target audience.",
    submittedAt: "2024-01-20",
    status: "pending",
    coverLetter:
      "We've created successful brand identities for 200+ companies across various industries. Our designs are modern, timeless, and strategically crafted to drive business growth.",
  },
  {
    id: "pp7",
    projectId: "proj3",
    providerId: "prov7",
    providerName: "Creative Minds Studio",
    providerRating: 4.6,
    proposalAmount: 4500,
    timeline: "3 weeks",
    description:
      "Professional brand identity design with focus on minimalist aesthetics and strong visual impact. Includes logo variations, brand style guide, and application mockups across different mediums.",
    submittedAt: "2024-01-21",
    status: "rejected",
    coverLetter:
      "Our award-winning design team specializes in creating distinctive brand identities that stand out in competitive markets. We guarantee unlimited revisions until you're 100% satisfied.",
  },
  {
    id: "pp8",
    projectId: "proj4",
    providerId: "prov8",
    providerName: "DataFlow Solutions",
    providerRating: 4.9,
    proposalAmount: 25000,
    timeline: "12 weeks",
    description:
      "Enterprise CRM system with advanced analytics, automated workflows, customer segmentation, email marketing integration, and comprehensive reporting dashboard. Built with scalability and security in mind.",
    submittedAt: "2024-01-22",
    status: "shortlisted",
    coverLetter:
      "We're CRM specialists with 10+ years of experience building enterprise solutions for Fortune 500 companies. Our systems handle millions of customer records with 99.99% uptime.",
  },
  {
    id: "pp9",
    projectId: "proj4",
    providerId: "prov9",
    providerName: "Enterprise Tech Hub",
    providerRating: 4.7,
    proposalAmount: 22000,
    timeline: "10 weeks",
    description:
      "Custom CRM solution with AI-powered lead scoring, automated sales pipeline management, integration with popular tools (Salesforce, HubSpot), and mobile app for field sales teams.",
    submittedAt: "2024-01-23",
    status: "pending",
    coverLetter:
      "We understand the complexity of enterprise CRM requirements and have successfully delivered 30+ CRM projects. Our solution will streamline your sales process and boost productivity by 40%.",
  },
  {
    id: "pp10",
    projectId: "proj5",
    providerId: "prov10",
    providerName: "EduTech Innovators",
    providerRating: 4.8,
    proposalAmount: 18000,
    timeline: "10 weeks",
    description:
      "Comprehensive learning management system with video streaming, interactive quizzes, progress tracking, certificate generation, discussion forums, and mobile-responsive design for seamless learning experience.",
    submittedAt: "2024-01-24",
    status: "pending",
    coverLetter:
      "We specialize in educational technology and have built LMS platforms for universities and corporate training programs. Our solutions support 10,000+ concurrent users with excellent performance.",
  },
]

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    id: "overview",
    label: "OVERVIEW",
    icon: Home,
    children: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "profile", label: "Profile", icon: User },
      { id: "requirements", label: "My Requirements", icon: FileText },
      { id: "proposals", label: "Proposals", icon: MessageSquare },
      { id: "projects", label: "Projects", icon: Briefcase },
      { id: "providers", label: "Find Agencies", icon: Users },
    ],
  },
  {
    id: "performance",
    label: "PERFORMANCE",
    icon: BarChart3,
    children: [
      { id: "analytics", label: "Project Analytics", icon: TrendingUp },
      { id: "spending", label: "Spending Insights", icon: Eye },
      { id: "provider-comparison", label: "Provider Comparison", icon: GitCompare },
    ],
  },
  {
    id: "account-settings",
    label: "ACCOUNT & SETTINGS",
    icon: Settings,
    children: [
      { id: "billing", label: "Billing & Payments", icon: CreditCard },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "account-settings", label: "Account Settings", icon: Shield },
    ],
  },
]

const ClientProvidersPage=()=>{
    const { user, loading } = useAuth()
      const router = useRouter()
      const [locationFilter, setLocationFilter] = useState("")
      const [technologyFilter, setTechnologyFilter] = useState("")
      const [ratingFilter, setRatingFilter] = useState("")
    
      useEffect(() => {
        if (!loading && (!user || user.role !== "client")) {
          router.push("/login")
        }
      }, [user, loading, router])
  
      const handleViewProvider = (providerId: string) => {
        const provider = mockProviders.find((p) => p.id === providerId)
        if (provider) {
          setSelectedProvider(provider)
          setShowProviderProfile(true)
        }
      }
    
      const handleContactProvider = (providerId: string) => {
        console.log("Contacting provider:", providerId)
        // In real app, this would open a contact form or chat
        setShowProviderProfile(false)
      }
    
     
     const clearFilters = () => {
    setLocationFilter("")
    setTechnologyFilter("")
    setRatingFilter("")
  }
   const filteredProviders = mockProviders.filter((provider) => {
      const matchesLocation = !locationFilter || provider.location.toLowerCase().includes(locationFilter.toLowerCase())
      const matchesTechnology =
        !technologyFilter ||
        provider.services.some((service) => service.toLowerCase().includes(technologyFilter.toLowerCase()))
      const matchesRating = !ratingFilter || provider.rating >= Number.parseFloat(ratingFilter)
  
      return matchesLocation && matchesTechnology && matchesRating
    })
  
    return(
          <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Find Agencies</h1>
                <p className="text-muted-foreground">Browse and connect with verified agencies</p>
            </div>

            <Card>
                <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <input
                        type="text"
                        placeholder="Enter city or state..."
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Technology/Service</label>
                        <select
                        value={technologyFilter}
                        onChange={(e) => setTechnologyFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                        <option value="">All Technologies</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="WordPress">WordPress</option>
                        <option value="SEO">SEO</option>
                        <option value="Graphic Design">Graphic Design</option>
                        <option value="Branding">Branding</option>
                        <option value="Content Marketing">Content Marketing</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Minimum Rating</label>
                        <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                        <option value="">Any Rating</option>
                        <option value="4.5">4.5+ Stars</option>
                        <option value="4.0">4.0+ Stars</option>
                        <option value="3.5">3.5+ Stars</option>
                        <option value="3.0">3.0+ Stars</option>
                        </select>
                    </div>
                    </div>
                    <div className="flex gap-2">
                    <Button variant="outline" onClick={clearFilters}>
                        Clear Filters
                    </Button>
                    <div className="text-sm text-muted-foreground flex items-center">
                        {filteredProviders.length} agencies found
                    </div>
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="max-h-[600px] overflow-y-auto p-6">
                {filteredProviders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProviders.map((provider) => (
                        <Card key={provider.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Star className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium">{provider.companyName}</h4>
                                <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">
                                    {provider.rating} ({provider.reviewCount})
                                </span>
                                </div>
                            </div>
                            </div>
                            <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1">📍 {provider.location}</p>
                            <div className="flex flex-wrap gap-1">
                                {provider.services.slice(0, 3).map((service, index) => (
                                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {service}
                                </span>
                                ))}
                                {provider.services.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                    +{provider.services.length - 3} more
                                </span>
                                )}
                            </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{provider.description}</p>
                            <div className="flex gap-2 mb-3">
                            <Button size="sm" onClick={() => handleViewProvider(provider.id)} className="flex-1">
                                <Eye className="h-3 w-3 mr-1" />
                                View Profile
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleContactProvider(provider.id)}>
                                Contact
                            </Button>
                            </div>
                        </CardContent>
                        </Card>
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No agencies found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters to see more results</p>
                    <Button variant="outline" onClick={clearFilters}>
                        Clear All Filters
                    </Button>
                    </div>
                )}
                </CardContent>
            </Card>
       </div>
    )
}
export default ClientProvidersPage;