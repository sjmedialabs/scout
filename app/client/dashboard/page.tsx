

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
import { FaFileAlt } from "react-icons/fa";
import { BiHeartCircle } from "react-icons/bi";
import { BiDollarCircle } from "react-icons/bi";

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

export default function ClientDashboard() {
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

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      userId: user?.id || "1",
      type: "proposal_received",
      title: "New Proposal Received!",
      message: 'TechCraft Solutions submitted a proposal for your "E-commerce Website Development" project.',
      read: false,
      createdAt: new Date("2024-01-20"),
      relatedId: "1",
    },
    {
      id: "2",
      userId: user?.id || "1",
      type: "proposal_received",
      title: "New Proposal Received!",
      message: 'WebDev Pro submitted a proposal for your "E-commerce Website Development" project.',
      read: false,
      createdAt: new Date("2024-01-19"),
      relatedId: "1",
    },
    {
      id: "3",
      userId: user?.id || "1",
      type: "message_received",
      title: "New Message",
      message: "TechCraft Solutions sent you a message about your project requirements.",
      read: true,
      createdAt: new Date("2024-01-18"),
      relatedId: "1",
    },
    {
      id: "4",
      userId: user?.id || "1",
      type: "proposal_received",
      title: "New Proposal Received!",
      message: 'Creative Design Studio submitted a proposal for your "Mobile App UI/UX Design" project.',
      read: false,
      createdAt: new Date("2024-01-17"),
      relatedId: "2",
    },
    {
      id: "5",
      userId: user?.id || "1",
      type: "review_requested",
      title: "Review Requested",
      message: "Please review your completed project with Digital Marketing Pro.",
      read: true,
      createdAt: new Date("2024-01-15"),
      relatedId: "3",
    },
  ])

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

  const [showCreateProject, setShowCreateProject] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
  })

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null)
  const [viewingPortfolio, setViewingPortfolio] = useState(false)
  const [viewingProfile, setViewingProfile] = useState(false)

  const [locationFilter, setLocationFilter] = useState("")
  const [technologyFilter, setTechnologyFilter] = useState("")
  const [ratingFilter, setRatingFilter] = useState("")

  const stats = {
    totalRequirements: requirements.length,
    activeRequirements: requirements.filter((r) => r.status === "active").length,
    totalProposals: proposals.length,
    shortlistedProposals: proposals.filter((p) => p.status === "shortlisted").length,
    // New analytics
    vendorMatches: mockProviders.length, // Total vendors matched
    proposalCount: mockProjectProposals.length, // Total proposals received
    shortlistedVendors: mockProjectProposals.filter((p) => p.status === "shortlisted").length,
  }

  const costAnalytics = {
    avgProposalAmount: Math.round(
      mockProjectProposals.reduce((sum, p) => sum + p.proposalAmount, 0) / mockProjectProposals.length,
    ),
    minProposalAmount: Math.min(...mockProjectProposals.map((p) => p.proposalAmount)),
    maxProposalAmount: Math.max(...mockProjectProposals.map((p) => p.proposalAmount)),
    budgetRanges: [
      { range: "$0-$5k", count: mockProjectProposals.filter((p) => p.proposalAmount < 5000).length },
      {
        range: "$5k-$10k",
        count: mockProjectProposals.filter((p) => p.proposalAmount >= 5000 && p.proposalAmount < 10000).length,
      },
      {
        range: "$10k-$20k",
        count: mockProjectProposals.filter((p) => p.proposalAmount >= 10000 && p.proposalAmount < 20000).length,
      },
      { range: "$20k+", count: mockProjectProposals.filter((p) => p.proposalAmount >= 20000).length },
    ],
  }

  const locationAnalytics = [
    { location: "San Francisco, CA", count: 3, percentage: 30 },
    { location: "New York, NY", count: 2, percentage: 20 },
    { location: "Austin, TX", count: 2, percentage: 20 },
    { location: "Seattle, WA", count: 2, percentage: 20 },
    { location: "Boston, MA", count: 1, percentage: 10 },
  ]

  const specialtyAnalytics = [
    { specialty: "Web Development", count: 4, percentage: 40 },
    { specialty: "Mobile Development", count: 2, percentage: 20 },
    { specialty: "UI/UX Design", count: 2, percentage: 20 },
    { specialty: "Enterprise Solutions", count: 2, percentage: 20 },
  ]

  const [selectedVendorsForComparison, setSelectedVendorsForComparison] = useState<string[]>([])
  const vendorComparisonData = mockProjectProposals.slice(0, 5).map((proposal) => ({
    id: proposal.id,
    name: proposal.providerName,
    overallRating: proposal.providerRating,
    qualityRating: proposal.providerRating - 0.1,
    scheduleRating: proposal.providerRating + 0.1,
    costRating: proposal.providerRating - 0.2,
    willingToRefer: proposal.providerRating + 0.05,
    proposalAmount: proposal.proposalAmount,
    timeline: proposal.timeline,
  }))

  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login")
    }
  }, [user, loading, router])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  const handleMenuClick = (itemId: string, parentId?: string) => {
    setActiveSection(itemId)
    if (parentId && !expandedSections.includes(parentId)) {
      setExpandedSections((prev) => [...prev, parentId])
    }
  }

const handlePostRequirement = async (newRequirement: any) => {
  try {
    if (!user || user.role !== "client") {
      alert("Only clients can post requirements.")
      return
    }

    // Prepare payload for API
    const payload = {
      title: newRequirement.title,
      image: newRequirement.image,
      category: newRequirement.category,
      budgetMin: newRequirement.budgetMin,
      budgetMax: newRequirement.budgetMax,
      timeline: newRequirement.timeline,
      description: newRequirement.description,
      createdBy: user.id, // depends on your auth context
    }
    console.log("Requirement payload on main parent:", payload)
    // API CALL
    const res = await fetch("/api/requirements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    console.log("Requirement created on main parent:", data)
    if (!res.ok) {
      console.error(data.error)
      alert(data.error || "Failed to create requirement")
      return
    }

    // Use the requirement returned from API
    const created = {
      id: data.requirement._id,
      title: data.requirement.title,
      image: data.requirement.image,
      category: data.requirement.category,
      budgetMin: data.requirement.budgetMin,
      budgetMax: data.requirement.budgetMax,
      timeline: data.requirement.timeline,
      description: data.requirement.description,
      status: data.requirement.status,
      postedDate: "Today",
      proposals: data.requirement.proposals || 0,
    }

    // Update UI lists
    setRequirements((prev) => [created, ...prev])
    setFilteredRequirements((prev) => [created, ...prev])

    // Close the form
    setShowPostForm(false)
    setActiveSection("requirements")

  } catch (error) {
    console.error("Error posting requirement:", error)
    alert("Something went wrong!")
  }
}


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

  const handleShortlist = (proposalId: string) => {
    setProposals((prev) => prev.map((p) => (p.id === proposalId ? { ...p, status: "shortlisted" as const } : p)))
  }

  const handleAccept = (proposalId: string) => {
    setProposals((prev) => prev.map((p) => (p.id === proposalId ? { ...p, status: "accepted" as const } : p)))
    setNegotiationProposal(proposalId)
    setShowNegotiationChat(true)
  }

  const handleReject = (proposalId: string) => {
    setProposals((prev) => prev.map((p) => (p.id === proposalId ? { ...p, status: "rejected" as const } : p)))
  }

  const handleRequestRevision = (proposalId: string, feedback: string) => {
    console.log("Revision requested for proposal:", proposalId, "Feedback:", feedback)
    // In real app, this would send the revision request to the provider
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

  const getProposalsForRequirement = (requirementId: string) => {
    return proposals.filter((p) => p.requirementId === requirementId)
  }

  const getProposalsForProject = (projectId: string) => {
    return projectProposals.filter((proposal) => proposal.projectId === projectId)
  }

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const handleDismissNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

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

  const handleSubmitProject = (projectId: string) => {
    setSelectedProjectId(projectId)
    setShowProjectSubmission(true)
  }

  const handleProjectSubmissionComplete = (submissionData: any) => {
    console.log("Project submitted:", submissionData)
    setShowProjectSubmission(false)
    setSelectedProjectId(null)
    // Show review form after project submission
    setShowReviewSubmission(true)
  }

  const handleSubmitReview = (reviewData: any) => {
    console.log("Review submitted:", reviewData)
    setShowReviewSubmission(false)
    setSelectedProviderId(null)
  }

  const handleCompareProviders = () => {
    // Get top 3 providers for comparison
    const topProviders = mockProviders.slice(0, 3)
    setComparisonProviders(topProviders)
    setShowProviderComparison(true)
  }

  const handleSelectProviderFromComparison = (providerId: string) => {
    handleViewProvider(providerId)
    setShowProviderComparison(false)
  }

  const handleCreateProject = () => {
    if (newProject.title && newProject.description && newProject.budget && newProject.category) {
      const project = {
        id: Date.now().toString(),
        ...newProject,
        status: "Planning",
        createdAt: new Date().toISOString().split("T")[0],
        proposalsCount: 0,
      }
      setProjects([...projects, project])
      setNewProject({ title: "", description: "", budget: "", category: "" })
      setShowCreateProject(false)
    }
  }

  const handleEditProject = (project: any) => {
    setEditingProject(project)
    setNewProject({
      title: project.title,
      description: project.description,
      budget: project.budget,
      category: project.category,
    })
    setShowCreateProject(true)
  }

  const handleUpdateProject = () => {
    if (editingProject && newProject.title && newProject.description && newProject.budget && newProject.category) {
      setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...newProject } : p)))
      setEditingProject(null)
      setNewProject({ title: "", description: "", budget: "", category: "" })
      setShowCreateProject(false)
    }
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
  }

  const handleViewProjectProposals = (projectId: string) => {
    // Navigate to proposals for this project
    setActiveSection("proposals")
    setSelectedProjectId(projectId)
  }

  

  const handleViewPortfolio = (providerId: string) => {
    setSelectedCompanyId(providerId)
    setViewingPortfolio(true)
    setViewingProfile(false)
    setActiveSection("company-portfolio")
  }

  const handleViewProfile = (providerId: string) => {
    setSelectedCompanyId(providerId)
    setViewingProfile(true)
    setViewingPortfolio(false)
    setActiveSection("company-profile")
  }

  const handleBackToProposals = () => {
    setSelectedCompanyId(null)
    setViewingPortfolio(false)
    setViewingProfile(false)
    setActiveSection("proposals")
  }

 

  const filteredProviders = mockProviders.filter((provider) => {
    const matchesLocation = !locationFilter || provider.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesTechnology =
      !technologyFilter ||
      provider.services.some((service) => service.toLowerCase().includes(technologyFilter.toLowerCase()))
    const matchesRating = !ratingFilter || provider.rating >= Number.parseFloat(ratingFilter)

    return matchesLocation && matchesTechnology && matchesRating
  })

  const clearFilters = () => {
    setLocationFilter("")
    setTechnologyFilter("")
    setRatingFilter("")
  }

  if (loading) {
    return <div className="bg-background flex items-center justify-center">Loading...</div>
  }

  if (!user || user.role !== "client") {
    return null
  }

  if (showPostForm) {
    return (
      <div className="bg-background">
        <div className="container mx-auto max-w-7xl py-8 px-4">
          <PostRequirementForm onSubmit={handlePostRequirement} onCancel={() => setShowPostForm(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
            <div className="border-b boreder-[1px] border-[#707070] pb-8">
              <h1 className="text-3xl font-bold text-[#F4561C] my-custom-class leading-5">Dashboard Overview</h1>
              <p className="text-lg text-[#656565] font-xl">Welcome to your client dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[#fff]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium my-custom-class text-[#000]">Vendor Matches</CardTitle>
                   <div className=" h-8 w-8 flex items-center justify-center rounded-full bg-[#EEF7FE]">
                    <Users className="h-4 w-4" color="#F54A0C" />
                   </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#000]">{stats.vendorMatches}</div>
                  <p className="text-xs text-[#F4561C] font-normal">Providers matched to projects</p>
                </CardContent>
              </Card>

              <Card className="bg-[#fff]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium my-custom-class text-[#000]">Proposal Count</CardTitle>
                  <div className=" h-8 w-8 flex items-center justify-center rounded-full bg-[#EEF7FE]">
                    <FaFileAlt  className="h-4 w-4" color="#F54A0C" />
                   </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#000]">{stats.proposalCount}</div>
                  <p className="text-xs text-[#F4561C] font-normal my-custom-class">Vendors submitted proposals</p>
                </CardContent>
              </Card>

              <Card className="bg-[#fff]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium my-custom-class text-[#000]">Shortlisted Vendors</CardTitle>
                  <div className=" h-8 w-8 flex items-center justify-center rounded-full bg-[#EEF7FE]">
                    <BiHeartCircle  className="h-4 w-4" color="#F54A0C" />
                   </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.shortlistedVendors}</div>
                  <p className="text-xs text-[#F4561C] font-normal my-custom-class">Agencies shortlisted</p>
                </CardContent>
              </Card>

              <Card className="bg-[#fff]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium my-custom-class text-[#000]" >Avg Proposal</CardTitle>
                  <div className=" h-8 w-8 flex items-center justify-center rounded-full bg-[#EEF7FE]">
                    <BiDollarCircle  className="h-4 w-4" color="#F54A0C" />
                   </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${costAnalytics.avgProposalAmount.toLocaleString()}</div>
                  <p className="text-xs text-[#F4561C] font-normal my-custom-class">Average proposal amount</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#fff] rounded-2xl">
                <CardHeader>
                  <CardTitle className="font-bold text-[#F4561C] text-xl leading-4 my-custom-class">Vendor Comparison</CardTitle>
                  <CardDescription className="text-md my-custom-class text-[#656565] font-normal">Compare vendors side-by-side with rating breakdown</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground pb-2 px-6">
                      <div className="font-bold text-sm text-[#6B6B6B] my-custom-class">Vendor</div>
                      <div className="text-center font-bold text-sm text-[#6B6B6B] my-custom-class">Quality</div>
                      <div className="text-center font-bold text-sm text-[#6B6B6B] my-custom-class">Schedule</div>
                      <div className="text-center font-bold text-sm text-[#6B6B6B] my-custom-class">Cost</div>
                      <div className="text-center font-bold text-sm text-[#6B6B6B] my-custom-class">Refer</div>
                    </div>
                    
                    {vendorComparisonData.slice(0, 4).map((vendor) => (
                      <div key={vendor.id} className="grid  border-t-[1px] px-6 pt-4 border-[#E3E3E3] grid-cols-5 gap-2 items-center text-sm">
                        <div className="font-medium teext-sm text-[#6B6B6B] my-custom-class">{vendor.name}</div>
                        <div className="text-center">
                          <Badge variant="secondary" className="text-xs border-1 border-[#B4D2F4] rounded-full bg-[#F2F2F2] min-w-[40px] text-[#000]">
                            {vendor.qualityRating.toFixed(1)}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <Badge variant="secondary" className="text-xs border-1 border-[#B4D2F4] rounded-full bg-[#F2F2F2] min-w-[40px] text-[#000]">
                            {vendor.scheduleRating.toFixed(1)}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <Badge variant="secondary" className="text-xs border-1 border-[#B4D2F4] rounded-full bg-[#F2F2F2] min-w-[40px] text-[#000]">
                            {vendor.costRating.toFixed(1)}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <Badge variant="secondary" className="text-xs border-1 border-[#B4D2F4] rounded-full bg-[#F2F2F2] min-w-[40px] text-[#000]">
                            {vendor.willingToRefer.toFixed(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fff] rounded-2xl">
                <CardHeader>
                  <CardTitle className="font-bold text-[#F4561C] text-xl leading-4 my-custom-class">Cost Distribution</CardTitle>
                  <CardDescription className="text-md my-custom-class text-[#656565] font-normal">Proposal budget ranges vs your stated budget</CardDescription>
                </CardHeader>
                <CardContent className="px-0 py-0 mb-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm px-6">
                      <span className="text-[#6B6B6B] font-bold text-sm">Budget Range</span>
                      <span className="text-[#6B6B6B] font-bold text-sm">Proposals</span>
                    </div>
                    {costAnalytics.budgetRanges.map((range, index) => (
                      <div key={index} className="space-y-1 px-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B6B6B] font-bold text-sm">{range.range}</span>
                          <span className="text-[#6B6B6B] font-bold text-sm">{range.count}</span>
                        </div>
                        <div className="w-full bg-[#DAEDF8] rounded-full h-2">
                          <div
                            className="bg-[#1C96F4] rounded-full h-2 transition-all"
                            style={{
                              width: `${(range.count / mockProjectProposals.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t-[1px] mt-8 border-[#E3E3E3] px-6 pb-0 mb-0">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B6B6B] text-sm font-bold">Range</span>
                        <span className="text-[#6B6B6B] text-sm font-bold">
                          ${costAnalytics.minProposalAmount.toLocaleString()} - $
                          {costAnalytics.maxProposalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#fff] rounded-2xl">
                <CardHeader>
                  <CardTitle className="font-bold text-[#F4561C] text-xl leading-4 my-custom-class">Top Vendor Locations</CardTitle>
                  <CardDescription className="text-md my-custom-class text-[#656565] font-normal">Geographic distribution of responding vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {locationAnalytics.map((location, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                      
                            <span className="text-sm font-normal text-[#6B6B6B] my-custom-class">{location.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-normal text-[#6B6B6B] my-custom-class">{location.count}</span>
                            <span className="text-xs font-normal text-[#6B6B6B] my-custom-class">({location.percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-[#DAEDF8] rounded-full h-2">
                          <div
                            className="bg-[#1C96F4] rounded-full h-2 transition-all"
                            style={{ width: `${location.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#fff] rounded-2xl">
                <CardHeader>
                  <CardTitle className="font-bold text-[#F4561C] text-xl leading-4 my-custom-class">Top Vendor Specialties</CardTitle>
                  <CardDescription className="text-md my-custom-class text-[#656565] font-normal">Expertise areas of responding vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {specialtyAnalytics.map((specialty, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            
                            <span className="text-sm font-normal text-[#6B6B6B] my-custom-class">{specialty.specialty}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-normal text-[#6B6B6B] my-custom-class">{specialty.count}</span>
                            <span className="text-xs font-normal text-[#6B6B6B] my-custom-class">({specialty.percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-[#DAEDF8] rounded-full h-2">
                          <div
                            className="bg-[#1C96F4] rounded-full h-2 transition-all"
                            style={{ width: `${specialty.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-[#fff] rounded-2xl">
                  
                  <CardContent>
                    <RequirementList
                      requirements={requirements.slice(0, 3)}
                      onViewProposals={handleViewProposals}
                      onViewDetails={handleViewDetails}
                    />
                  </CardContent>
                </Card>
              </div>

              <div>
                <NotificationsWidget
                  notifications={notifications}
                  onMarkAsRead={handleMarkNotificationAsRead}
                  onDismiss={handleDismissNotification}
                />
              </div>
            </div>
          </div>

        
      </div>


      

      
    </div>

  )
}
