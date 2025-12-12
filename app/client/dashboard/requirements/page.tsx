
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
import { FiltersPanel } from "@/components/filters-panel"
import { RequirementList } from "@/components/seeker/requirement-list"
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


const RequirementsPage=()=>{
     const { user, loading } = useAuth()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState("dashboard") // Set initial state to "dashboard" so content shows by default
  const [expandedSections, setExpandedSections] = useState<string[]>(["overview"])
  const [showPostForm, setShowPostForm] = useState(false)
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements)
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals)
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null)
  const [selectedRequirementForDetails, setSelectedRequirementForDetails] = useState<Requirement | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showNegotiationChat, setShowNegotiationChat] = useState(false)
  const [negotiationProposal, setNegotiationProposal] = useState<string | null>(null)
  const [filteredRequirements, setFilteredRequirements] = useState<Requirement[]>(mockRequirements)
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [showProviderProfile, setShowProviderProfile] = useState(false)
  const [showProjectSubmission, setShowProjectSubmission] = useState(false)
  const [showReviewSubmission, setShowReviewSubmission] = useState(false)
  const [showProviderComparison, setShowProviderComparison] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)
  const [comparisonProviders, setComparisonProviders] = useState<Provider[]>([])

  // Adding project proposal state
  const [projectProposals, setProjectProposals] = useState<ProjectProposal[]>(mockProjectProposals)

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Smith",
    email: user?.email || "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    company: "Tech Innovations Inc.",
    position: "Chief Technology Officer",
    industry: "Technology",
    location: "San Francisco, CA",
    website: "https://techinnovations.com",
    bio: "Experienced technology leader with over 10 years in software development and digital transformation. Passionate about leveraging cutting-edge solutions to drive business growth.",
    timezone: "America/Los_Angeles",
    preferredCommunication: "email",
    projectBudgetRange: "$10,000 - $50,000",
    companySize: "51-200 employees",
    joinedDate: "January 2024",
  })

 

  const [projects, setProjects] = useState([
    {
      id: "1",
      title: "E-commerce Website Development",
      description: "Modern responsive e-commerce platform with payment integration",
      budget: "$15,000 - $25,000",
      status: "In Progress",
      createdAt: "2024-01-15",
      proposalsCount: 12,
      category: "Web Development",
    },
    {
      id: "2",
      title: "Mobile App UI/UX Design",
      description: "Complete mobile app design for iOS and Android platforms",
      budget: "$8,000 - $12,000",
      status: "Planning",
      createdAt: "2024-01-20",
      proposalsCount: 8,
      category: "Design",
    },
    {
      id: "3",
      title: "Digital Marketing Campaign",
      description: "Comprehensive digital marketing strategy and execution",
      budget: "$5,000 - $10,000",
      status: "Completed",
      createdAt: "2024-01-10",
      proposalsCount: 15,
      category: "Marketing",
    },
  ])

  
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
  })

 

  

  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login")
    }
  }, [user, loading, router])

 


  const handleViewProposals = (requirementId: string) => {
    setSelectedRequirement(requirementId)
    setActiveSection("proposals")
  }

  const handleViewDetails = (requirementId: string) => {
    const requirement = requirements.find((r) => r.id === requirementId)
    if (requirement) {
      setSelectedRequirementForDetails(requirement)
      setShowDetailsModal(true)
    }
  }

  

  const handleFiltersChange = (filters: any) => {
    let filtered = [...requirements]

    if (filters.serviceType) {
      filtered = filtered.filter((r) => r.category === filters.serviceType)
    }

    if (filters.location) {
      filtered = filtered.filter(
        (r) => r.location === filters.location || (!r.location && filters.location === "Remote"),
      )
    }

    if (filters.budgetRange) {
      filtered = filtered.filter((r) => r.budgetMin >= filters.budgetRange[0] && r.budgetMax <= filters.budgetRange[1])
    }

    setFilteredRequirements(filtered)
  }

    return(
       <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">My Requirements</h1>
              <p className="text-muted-foreground">Manage all your posted requirements</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <FiltersPanel onFiltersChange={handleFiltersChange} />
              </div>
              <div className="lg:col-span-3">
                <Card>
                  <CardContent className="max-h-[600px] overflow-y-auto p-6">
                    <RequirementList
                      requirements={filteredRequirements}
                      onViewProposals={handleViewProposals}
                      onViewDetails={handleViewDetails}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
    )
}
export default RequirementsPage;