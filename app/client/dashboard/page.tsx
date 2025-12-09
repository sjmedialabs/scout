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
      category: newRequirement.category,
      budgetMin: newRequirement.budgetMin,
      budgetMax: newRequirement.budgetMax,
      timeline: newRequirement.timeline,
      description: newRequirement.description,
      createdBy: user.id, // depends on your auth context
    }

    // API CALL
    const res = await fetch("/api/requirements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error(data.error)
      alert(data.error || "Failed to create requirement")
      return
    }

    // Use the requirement returned from API
    const created = {
      id: data.requirement._id,
      title: data.requirement.title,
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

  const handleProjectProposalAction = (proposalId: string, action: "shortlist" | "accept" | "reject") => {
    setProjectProposals((prev) =>
      prev.map((proposal) =>
        proposal.id === proposalId
          ? { ...proposal, status: action === "shortlist" ? "shortlisted" : action }
          : proposal,
      ),
    )
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

  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the profile
    console.log("Saving profile:", profileData)
    setIsEditingProfile(false)
    // Show success message or toast
  }

  const handleCancelEdit = () => {
    // Reset to original data if needed
    setIsEditingProfile(false)
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
      <div className="w-80 bg-card border-r border-border flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold">Client Dashboard</h2>
          <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>
          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-green-100 text-green-800">Active Client</Badge>
            <Badge variant="secondary">Verified</Badge>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-2">
            {menuItems.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="h-4 w-4" />
                    {section.label}
                  </div>
                  {section.children &&
                    (expandedSections.includes(section.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ))}
                </button>

                {section.children && expandedSections.includes(section.id) && (
                  <div className="ml-4 mt-2 space-y-1">
                    {section.children.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id, section.id)}
                        className={`w-full flex items-center gap-3 p-2 text-sm rounded-lg transition-colors ${
                          activeSection === item.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <Button onClick={() => setShowPostForm(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Post New Requirement
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeSection === "dashboard" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
              <p className="text-muted-foreground">Welcome to your client dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vendor Matches</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.vendorMatches}</div>
                  <p className="text-xs text-muted-foreground">Providers matched to projects</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Proposal Count</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.proposalCount}</div>
                  <p className="text-xs text-muted-foreground">Vendors submitted proposals</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Shortlisted Vendors</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.shortlistedVendors}</div>
                  <p className="text-xs text-muted-foreground">Agencies shortlisted</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Proposal</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${costAnalytics.avgProposalAmount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Average proposal amount</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Comparison</CardTitle>
                  <CardDescription>Compare vendors side-by-side with rating breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground border-b pb-2">
                      <div>Vendor</div>
                      <div className="text-center">Quality</div>
                      <div className="text-center">Schedule</div>
                      <div className="text-center">Cost</div>
                      <div className="text-center">Refer</div>
                    </div>
                    {vendorComparisonData.slice(0, 4).map((vendor) => (
                      <div key={vendor.id} className="grid grid-cols-5 gap-2 items-center text-sm">
                        <div className="font-medium truncate">{vendor.name}</div>
                        <div className="text-center">
                          <Badge variant="secondary" className="text-xs">
                            {vendor.qualityRating.toFixed(1)}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <Badge variant="secondary" className="text-xs">
                            {vendor.scheduleRating.toFixed(1)}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <Badge variant="secondary" className="text-xs">
                            {vendor.costRating.toFixed(1)}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <Badge variant="secondary" className="text-xs">
                            {vendor.willingToRefer.toFixed(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cost Distribution</CardTitle>
                  <CardDescription>Proposal budget ranges vs your stated budget</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Budget Range</span>
                      <span className="text-muted-foreground">Proposals</span>
                    </div>
                    {costAnalytics.budgetRanges.map((range, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{range.range}</span>
                          <span className="font-bold">{range.count}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2 transition-all"
                            style={{
                              width: `${(range.count / mockProjectProposals.length) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Range</span>
                        <span className="font-bold">
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
              <Card>
                <CardHeader>
                  <CardTitle>Top Vendor Locations</CardTitle>
                  <CardDescription>Geographic distribution of responding vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {locationAnalytics.map((location, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{location.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{location.count}</span>
                            <span className="text-xs text-muted-foreground">({location.percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-blue-500 rounded-full h-2 transition-all"
                            style={{ width: `${location.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Vendor Specialties</CardTitle>
                  <CardDescription>Expertise areas of responding vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {specialtyAnalytics.map((specialty, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{specialty.specialty}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{specialty.count}</span>
                            <span className="text-xs text-muted-foreground">({specialty.percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-green-500 rounded-full h-2 transition-all"
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
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Requirements</CardTitle>
                    <CardDescription>Your latest posted requirements</CardDescription>
                  </CardHeader>
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
        )}

        {/* My Requirements */}
        {activeSection === "requirements" && (
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
        )}

        {/* Proposals */}
        {activeSection === "proposals" && !selectedProjectId && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">
                Proposals
                {selectedRequirement && (
                  <span className="text-muted-foreground font-normal text-xl">
                    {" "}
                    for "{requirements.find((r) => r.id === selectedRequirement)?.title}"
                  </span>
                )}
              </h1>
              <p className="text-muted-foreground">
                {selectedRequirement
                  ? "Review and manage proposals for the selected requirement"
                  : "All proposals received for your projects and requirements"}
              </p>
            </div>

            <div className="flex gap-4 border-b">
              <button
                className={`pb-2 px-1 border-b-2 transition-colors ${
                  !selectedRequirement
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setSelectedRequirement(null)}
              >
                Project Proposals ({projectProposals.length})
              </button>
              <button
                className={`pb-2 px-1 border-b-2 transition-colors ${
                  selectedRequirement
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setSelectedRequirement(requirements[0]?.id || null)}
              >
                Requirement Proposals
              </button>
            </div>

            <Card>
              <CardContent className="max-h-[600px] overflow-y-auto p-6">
                {selectedRequirement ? (
                  <ProposalList
                    proposals={getProposalsForRequirement(selectedRequirement)}
                    onShortlist={handleShortlist}
                    onAccept={handleAccept}
                    onReject={handleReject}
                    onRequestRevision={handleRequestRevision}
                  />
                ) : (
                  <div className="space-y-6">
                    {projectProposals.length > 0 ? (
                      projectProposals.map((proposal) => {
                        const project = projects.find((p) => p.id === proposal.projectId)
                        return (
                          <Card key={proposal.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs">
                                      {project?.title || "Unknown Project"}
                                    </Badge>
                                  </div>
                                  <h3
                                    className="text-xl font-semibold cursor-pointer hover:text-primary transition-colors"
                                    onClick={() => handleViewProfile(proposal.providerId)}
                                  >
                                    {proposal.providerName}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`h-4 w-4 ${
                                            i < Math.floor(proposal.providerRating)
                                              ? "fill-yellow-400 text-yellow-400"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                      <span className="ml-1 text-sm text-muted-foreground">
                                        {proposal.providerRating}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-green-600">
                                    ${proposal.proposalAmount.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-muted-foreground">{proposal.timeline}</div>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Cover Letter</h4>
                                  <p className="text-muted-foreground text-sm">{proposal.coverLetter}</p>
                                </div>

                                <div>
                                  <h4 className="font-medium mb-2">Proposal Description</h4>
                                  <p className="text-muted-foreground text-sm">{proposal.description}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant={
                                        proposal.status === "accepted"
                                          ? "default"
                                          : proposal.status === "shortlisted"
                                            ? "secondary"
                                            : proposal.status === "rejected"
                                              ? "destructive"
                                              : "outline"
                                      }
                                    >
                                      {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground">
                                      Submitted on {new Date(proposal.submittedAt).toLocaleDateString()}
                                    </span>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewPortfolio(proposal.providerId)}
                                    >
                                      View Portfolio
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedProjectId(proposal.projectId)
                                        setActiveSection("proposals")
                                      }}
                                    >
                                      View Project Details
                                    </Button>
                                    {proposal.status === "pending" && (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleProjectProposalAction(proposal.id, "shortlist")}
                                        >
                                          Shortlist
                                        </Button>
                                        <Button
                                          variant="default"
                                          size="sm"
                                          onClick={() => handleProjectProposalAction(proposal.id, "accept")}
                                        >
                                          Accept
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => handleProjectProposalAction(proposal.id, "reject")}
                                        >
                                          Reject
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No Proposals Yet</h3>
                        <p className="text-muted-foreground">No proposals have been received for your projects yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Projects */}
        {activeSection === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Projects</h1>
                <p className="text-muted-foreground">Manage your projects and track progress</p>
              </div>
              <Button onClick={() => setShowCreateProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="grid gap-6">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-muted-foreground mb-3">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Budget: {project.budget}</span>
                          <span>Category: {project.category}</span>
                          <span>Created: {project.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            project.status === "Completed"
                              ? "default"
                              : project.status === "In Progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteProject(project.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{project.proposalsCount} proposals received</span>
                      <Button variant="outline" size="sm" onClick={() => handleViewProjectProposals(project.id)}>
                        View Proposals
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {showCreateProject && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md mx-4">
                  <CardHeader>
                    <CardTitle>{editingProject ? "Edit Project" : "Create New Project"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Project Title</label>
                      <Input
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="Enter project title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        className="w-full p-2 border rounded-md resize-none"
                        rows={3}
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Describe your project"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Budget Range</label>
                      <Input
                        value={newProject.budget}
                        onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                        placeholder="e.g., $5,000 - $10,000"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      >
                        <option value="">Select category</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Business Services">Business Services</option>
                      </select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateProject(false)
                        setEditingProject(null)
                        setNewProject({ title: "", description: "", budget: "", category: "" })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={editingProject ? handleUpdateProject : handleCreateProject}>
                      {editingProject ? "Update" : "Create"} Project
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Project Proposals */}
        {activeSection === "proposals" && selectedProjectId && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  Project Proposals
                  <span className="text-muted-foreground font-normal text-xl">
                    {" "}
                    for "{projects.find((p) => p.id === selectedProjectId)?.title}"
                  </span>
                </h1>
                <p className="text-muted-foreground">Review and manage proposals received for this project</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setActiveSection("projects")
                  setSelectedProjectId(null)
                }}
              >
                Back to Projects
              </Button>
            </div>

            <div className="grid gap-6">
              {getProposalsForProject(selectedProjectId).length > 0 ? (
                getProposalsForProject(selectedProjectId).map((proposal) => (
                  <Card key={proposal.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{proposal.providerName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(proposal.providerRating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className="ml-1 text-sm text-muted-foreground">{proposal.providerRating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ${proposal.proposalAmount.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">{proposal.timeline}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Cover Letter</h4>
                          <p className="text-muted-foreground">{proposal.coverLetter}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Proposal Description</h4>
                          <p className="text-muted-foreground">{proposal.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                proposal.status === "accepted"
                                  ? "default"
                                  : proposal.status === "shortlisted"
                                    ? "secondary"
                                    : proposal.status === "rejected"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Submitted on {new Date(proposal.submittedAt).toLocaleDateString()}
                            </span>
                          </div>

                          {proposal.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleProjectProposalAction(proposal.id, "shortlist")}
                              >
                                Shortlist
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleProjectProposalAction(proposal.id, "accept")}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleProjectProposalAction(proposal.id, "reject")}
                              >
                                Reject
                              </Button>
                            </div>
                          )}

                          {proposal.status === "shortlisted" && (
                            <div className="flex gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleProjectProposalAction(proposal.id, "accept")}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleProjectProposalAction(proposal.id, "reject")}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Proposals Yet</h3>
                    <p className="text-muted-foreground">No proposals have been received for this project yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Find Agencies */}
        {activeSection === "providers" && (
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
        )}

        {/* Profile Section */}
        {activeSection === "profile" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your client profile information</p>
              </div>
              <div className="flex gap-2">
                {isEditingProfile ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditingProfile(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Overview Card */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{profileData.name}</h3>
                    <p className="text-sm text-muted-foreground">{profileData.position}</p>
                    <p className="text-sm text-muted-foreground">{profileData.company}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge className="bg-green-100 text-green-800">Active Client</Badge>
                      <Badge variant="secondary">Verified</Badge>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {profileData.joinedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.companySize}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    {isEditingProfile ? "Edit your profile information" : "Your profile information"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditingProfile ? (
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleProfileUpdate("name", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm py-2">{profileData.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditingProfile ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileUpdate("email", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-sm py-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {profileData.email}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditingProfile ? (
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleProfileUpdate("phone", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-sm py-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {profileData.phone}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      {isEditingProfile ? (
                        <Input
                          id="company"
                          value={profileData.company}
                          onChange={(e) => handleProfileUpdate("company", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm py-2">{profileData.company}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      {isEditingProfile ? (
                        <Input
                          id="position"
                          value={profileData.position}
                          onChange={(e) => handleProfileUpdate("position", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm py-2">{profileData.position}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      {isEditingProfile ? (
                        <Select
                          value={profileData.industry}
                          onValueChange={(value) => handleProfileUpdate("industry", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Retail">Retail</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2">{profileData.industry}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      {isEditingProfile ? (
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => handleProfileUpdate("location", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm py-2">{profileData.location}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      {isEditingProfile ? (
                        <Input
                          id="website"
                          value={profileData.website}
                          onChange={(e) => handleProfileUpdate("website", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-sm py-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={profileData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {profileData.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditingProfile ? (
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                        rows={4}
                        placeholder="Tell us about yourself and your company..."
                      />
                    ) : (
                      <p className="text-sm py-2 leading-relaxed">{profileData.bio}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      {isEditingProfile ? (
                        <Select
                          value={profileData.timezone}
                          onValueChange={(value) => handleProfileUpdate("timezone", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="Europe/London">GMT</SelectItem>
                            <SelectItem value="Europe/Paris">CET</SelectItem>
                            <SelectItem value="Asia/Tokyo">JST</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2">{profileData.timezone.replace("_", " ")}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="communication">Preferred Communication</Label>
                      {isEditingProfile ? (
                        <Select
                          value={profileData.preferredCommunication}
                          onValueChange={(value) => handleProfileUpdate("preferredCommunication", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="chat">Chat</SelectItem>
                            <SelectItem value="video">Video Call</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2 capitalize">{profileData.preferredCommunication}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Typical Project Budget</Label>
                      {isEditingProfile ? (
                        <Select
                          value={profileData.projectBudgetRange}
                          onValueChange={(value) => handleProfileUpdate("projectBudgetRange", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="$1,000 - $5,000">$1,000 - $5,000</SelectItem>
                            <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                            <SelectItem value="$10,000 - $50,000">$10,000 - $50,000</SelectItem>
                            <SelectItem value="$50,000 - $100,000">$50,000 - $100,000</SelectItem>
                            <SelectItem value="$100,000+">$100,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2">{profileData.projectBudgetRange}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      {isEditingProfile ? (
                        <Select
                          value={profileData.companySize}
                          onValueChange={(value) => handleProfileUpdate("companySize", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                            <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                            <SelectItem value="51-200 employees">51-200 employees</SelectItem>
                            <SelectItem value="201-500 employees">201-500 employees</SelectItem>
                            <SelectItem value="500+ employees">500+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2">{profileData.companySize}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === "company-portfolio" && selectedCompanyId && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleBackToProposals}>
                ← Back to Proposals
              </Button>
              <div>
                <h1 className="text-3xl font-bold">
                  {projectProposals.find((p) => p.providerId === selectedCompanyId)?.providerName} - Portfolio
                </h1>
                <p className="text-muted-foreground">View previous work and projects completed by this agency</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mock portfolio projects */}
              {[
                {
                  id: "1",
                  title: "E-commerce Platform",
                  description: "Modern e-commerce solution with payment integration",
                  image: "/ecommerce-website-homepage.png",
                  technologies: ["React", "Node.js", "MongoDB"],
                  completedDate: "2024-01-15",
                },
                {
                  id: "2",
                  title: "Healthcare Management System",
                  description: "Comprehensive patient management and scheduling system",
                  image: "/healthcare-dashboard.jpg",
                  technologies: ["Vue.js", "Python", "PostgreSQL"],
                  completedDate: "2023-11-20",
                },
                {
                  id: "3",
                  title: "Real Estate Portal",
                  description: "Property listing and management platform",
                  image: "/real-estate-website-hero.png",
                  technologies: ["Angular", "Java", "MySQL"],
                  completedDate: "2023-09-10",
                },
                {
                  id: "4",
                  title: "Educational Learning Platform",
                  description: "Online learning management system with video streaming",
                  image: "/education-platform.png",
                  technologies: ["React", "Express", "AWS"],
                  completedDate: "2023-07-05",
                },
                {
                  id: "5",
                  title: "Financial Dashboard",
                  description: "Investment tracking and portfolio management tool",
                  image: "/financial-dashboard.png",
                  technologies: ["Next.js", "TypeScript", "Prisma"],
                  completedDate: "2023-05-18",
                },
                {
                  id: "6",
                  title: "Social Media App",
                  description: "Mobile-first social networking application",
                  image: "/social-media-app-interface.png",
                  technologies: ["React Native", "Firebase", "Redux"],
                  completedDate: "2023-03-22",
                },
              ].map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Completed: {new Date(project.completedDate).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeSection === "company-profile" && selectedCompanyId && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleBackToProposals}>
                ← Back to Proposals
              </Button>
              <div>
                <h1 className="text-3xl font-bold">
                  {projectProposals.find((p) => p.providerId === selectedCompanyId)?.providerName}
                </h1>
                <p className="text-muted-foreground">Company profile and information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Company Overview */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">About the Company</h2>
                    <p className="text-muted-foreground mb-4">
                      We are a leading digital agency specializing in web development, mobile applications, and digital
                      transformation solutions. With over 8 years of experience, we have successfully delivered 200+
                      projects across various industries including healthcare, finance, e-commerce, and education.
                    </p>
                    <p className="text-muted-foreground">
                      Our team of 25+ skilled developers, designers, and project managers work collaboratively to
                      deliver high-quality solutions that drive business growth and enhance user experiences.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Web Development",
                        "Mobile App Development",
                        "UI/UX Design",
                        "E-commerce Solutions",
                        "Cloud Integration",
                        "Digital Marketing",
                        "Maintenance & Support",
                        "Consulting Services",
                      ].map((service) => (
                        <div key={service} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Client Testimonials</h2>
                    <div className="space-y-4">
                      {[
                        {
                          client: "Sarah Johnson, CEO at TechStart",
                          feedback:
                            "Exceptional work quality and timely delivery. The team understood our requirements perfectly and delivered beyond expectations.",
                        },
                        {
                          client: "Michael Chen, CTO at FinanceFlow",
                          feedback:
                            "Professional approach and excellent communication throughout the project. Highly recommend for complex development projects.",
                        },
                      ].map((testimonial, index) => (
                        <div key={index} className="border-l-4 border-primary pl-4">
                          <p className="text-muted-foreground italic mb-2">"{testimonial.feedback}"</p>
                          <p className="text-sm font-medium">- {testimonial.client}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Company Stats */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Company Stats</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Founded</span>
                        <span className="font-medium">2016</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Team Size</span>
                        <span className="font-medium">25+ Members</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Projects Completed</span>
                        <span className="font-medium">200+</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Client Rating</span>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="font-medium">4.9</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Response Time</span>
                        <span className="font-medium">{"<"} 2 hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Technologies</h2>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "React",
                        "Node.js",
                        "Python",
                        "Java",
                        "Angular",
                        "Vue.js",
                        "MongoDB",
                        "PostgreSQL",
                        "AWS",
                        "Docker",
                        "Kubernetes",
                        "TypeScript",
                      ].map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
                    <div className="space-y-3">
                      <div>
                        <span className="text-muted-foreground text-sm">Email</span>
                        <p className="font-medium">contact@agency.com</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">Phone</span>
                        <p className="font-medium">+1 (555) 123-4567</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">Location</span>
                        <p className="font-medium">San Francisco, CA</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">Website</span>
                        <p className="font-medium text-primary">www.agency.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Page */}
        {activeSection === "analytics" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Project Analytics</h1>
              <p className="text-muted-foreground">Insights into vendor demographics and proposal trends</p>
            </div>

            {/* Top Locations Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Top Vendor Locations
                </CardTitle>
                <CardDescription>Geographic distribution of vendors responding to your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { location: "San Francisco, CA", count: 12, percentage: 30 },
                    { location: "New York, NY", count: 10, percentage: 25 },
                    { location: "Austin, TX", count: 8, percentage: 20 },
                    { location: "Seattle, WA", count: 6, percentage: 15 },
                    { location: "Boston, MA", count: 4, percentage: 10 },
                  ].map((item) => (
                    <div key={item.location} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.location}</span>
                        <span className="text-muted-foreground">
                          {item.count} vendors ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Specialties Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Top Vendor Specialties
                </CardTitle>
                <CardDescription>Expertise areas of vendors responding to your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { specialty: "Web Development", count: 15, percentage: 35 },
                    { specialty: "Mobile Apps", count: 12, percentage: 28 },
                    { specialty: "UI/UX Design", count: 10, percentage: 23 },
                    { specialty: "Cloud Services", count: 4, percentage: 9 },
                    { specialty: "DevOps", count: 2, percentage: 5 },
                  ].map((item) => (
                    <div key={item.specialty} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.specialty}</span>
                        <span className="text-muted-foreground">
                          {item.count} vendors ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Distribution Analysis
                </CardTitle>
                <CardDescription>Budget ranges of proposals received vs. your stated budget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Your Stated Budget</span>
                      <span className="text-lg font-bold text-primary">$50,000</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Proposal Budget Ranges</h4>
                    {[
                      { range: "Under $30,000", count: 3, percentage: 15, color: "bg-green-500" },
                      { range: "$30,000 - $50,000", count: 8, percentage: 40, color: "bg-blue-500" },
                      { range: "$50,000 - $70,000", count: 6, percentage: 30, color: "bg-yellow-500" },
                      { range: "Over $70,000", count: 3, percentage: 15, color: "bg-red-500" },
                    ].map((item) => (
                      <div key={item.range} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.range}</span>
                          <span className="text-muted-foreground">
                            {item.count} proposals ({item.percentage}%)
                          </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} transition-all`}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Average</p>
                      <p className="text-lg font-bold">$52,500</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Median</p>
                      <p className="text-lg font-bold">$48,000</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Range</p>
                      <p className="text-lg font-bold">$25K - $85K</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Provider Comparison Page */}
        {activeSection === "provider-comparison" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Provider Comparison</h1>
              <p className="text-muted-foreground">Compare vendors side-by-side to make informed decisions</p>
            </div>

            {/* Vendor Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Vendors to Compare</CardTitle>
                <CardDescription>Choose up to 4 vendors to compare their ratings and proposals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockProjectProposals.slice(0, 6).map((proposal) => (
                    <Button key={proposal.id} variant="outline" size="sm">
                      {proposal.providerName}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {mockProjectProposals.slice(0, 3).map((proposal) => (
                <Card key={proposal.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{proposal.providerName}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{proposal.providerRating}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Proposal Details */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Proposal Amount</span>
                        <span className="font-bold text-lg">${proposal.proposalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Timeline</span>
                        <span className="font-medium">{proposal.timeline}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Location</span>
                        <span className="font-medium">{proposal.providerId}</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Rating Breakdown */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm">Rating Breakdown</h4>

                      {/* Quality Rating */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Quality</span>
                          <span className="font-medium">4.8/5.0</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "96%" }} />
                        </div>
                      </div>

                      {/* Schedule Rating */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Schedule</span>
                          <span className="font-medium">4.5/5.0</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: "90%" }} />
                        </div>
                      </div>

                      {/* Cost Rating */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Cost</span>
                          <span className="font-medium">4.3/5.0</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500" style={{ width: "86%" }} />
                        </div>
                      </div>

                      {/* Willing to Refer */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Willing to Refer</span>
                          <span className="font-medium">95%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: "95%" }} />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Key Strengths */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Key Strengths</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Fast Delivery</Badge>
                        <Badge variant="secondary">Great Communication</Badge>
                        <Badge variant="secondary">High Quality</Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Comparison Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Criteria</th>
                        {mockProjectProposals.slice(0, 3).map((proposal) => (
                          <th key={proposal.id} className="text-center p-3 font-medium">
                            {proposal.providerName}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 text-sm text-muted-foreground">Overall Rating</td>
                        {mockProjectProposals.slice(0, 3).map((proposal) => (
                          <td key={proposal.id} className="text-center p-3 font-medium">
                            {proposal.providerRating}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 text-sm text-muted-foreground">Proposal Amount</td>
                        {mockProjectProposals.slice(0, 3).map((proposal) => (
                          <td key={proposal.id} className="text-center p-3 font-medium">
                            ${proposal.proposalAmount.toLocaleString()}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 text-sm text-muted-foreground">Timeline</td>
                        {mockProjectProposals.slice(0, 3).map((proposal) => (
                          <td key={proposal.id} className="text-center p-3 font-medium">
                            {proposal.timeline}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 text-sm text-muted-foreground">Quality Score</td>
                        <td className="text-center p-3 font-medium">4.8</td>
                        <td className="text-center p-3 font-medium">4.6</td>
                        <td className="text-center p-3 font-medium">4.7</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 text-sm text-muted-foreground">Schedule Score</td>
                        <td className="text-center p-3 font-medium">4.5</td>
                        <td className="text-center p-3 font-medium">4.7</td>
                        <td className="text-center p-3 font-medium">4.4</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-sm text-muted-foreground">Cost Score</td>
                        <td className="text-center p-3 font-medium">4.3</td>
                        <td className="text-center p-3 font-medium">4.5</td>
                        <td className="text-center p-3 font-medium">4.2</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Spending Insights Page */}
        {activeSection === "spending" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Spending Insights</h1>
              <p className="text-muted-foreground">Track your project spending and budget utilization</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>Detailed spending analytics and budget tracking features</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This page will provide comprehensive insights into your project spending, budget allocation, and cost
                  trends.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Other sections with placeholder content */}
        {(activeSection === "billing" || activeSection === "notifications" || activeSection === "account-settings") && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold capitalize">{activeSection.replace("-", " ")}</h1>
              <p className="text-muted-foreground">This section is coming soon</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Feature under development</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Modals - keeping existing modal components */}
      <RequirementDetailsModal
        requirement={selectedRequirementForDetails}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onViewProposals={handleViewProposals}
      />

      <NegotiationChat
        isOpen={showNegotiationChat}
        onClose={() => setShowNegotiationChat(false)}
        proposalId={negotiationProposal || ""}
        providerName="TechSolutions Inc."
      />

      <ProviderProfileModal
        provider={selectedProvider}
        isOpen={showProviderProfile}
        onClose={() => setShowProviderProfile(false)}
        onContact={handleContactProvider}
      />

      <ProjectSubmissionForm
        isOpen={showProjectSubmission}
        onClose={() => setShowProjectSubmission(false)}
        onSubmit={handleProjectSubmissionComplete}
        projectId={selectedProjectId || ""}
      />

      <ReviewSubmissionForm
        isOpen={showReviewSubmission}
        onClose={() => setShowReviewSubmission(false)}
        onSubmit={handleSubmitReview}
        providerId={selectedProviderId || ""}
        providerName={selectedProvider?.companyName || "Provider"}
      />

      <ProviderComparison
        providers={comparisonProviders}
        isOpen={showProviderComparison}
        onClose={() => setShowProviderComparison(false)}
        onSelectProvider={handleSelectProviderFromComparison}
      />
    </div>
  )
}
