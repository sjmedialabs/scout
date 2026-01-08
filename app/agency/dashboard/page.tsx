"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CompanyProfileEditor } from "@/components/provider/company-profile-editor"
import { BrowseRequirements } from "@/components/provider/browse-requirements"
import { SubmitProposalForm } from "@/components/provider/submit-proposal-form"
import { NotificationsWidget } from "@/components/provider/notifications-widget"
import { Input } from "@/components/ui/input"
import {
  Building2,
  FileText,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  MessageSquare,
  Award,
  Edit,
  Settings,
  BarChart3,
  Users,
  Megaphone,
  CreditCard,
  Bell,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Home,
  User,
  Briefcase,
  MessageCircle,
  FileSearch,
  Eye,
  GitCompare,
  Download,
  Phone,
  Video,
  Paperclip,
  Send,
  Mail,
  Clock,
  CheckCircle,
  X,
  Target,
  Handshake,
} from "lucide-react"
import { mockNotifications, mockProviderProjects, mockProviderReviews, mockRequirements } from "@/lib/mock-data"
import { type Provider, type Requirement, type Notification, type Project, type Review, Proposal } from "@/lib/types"

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
      {
        id: "edit-profile",
        label: "Edit Profile",
        icon: User,
        children: [
          { id: "company-details", label: "Company Details", icon: Building2 },
          { id: "services", label: "Services", icon: Briefcase },
          { id: "team", label: "Team", icon: Users },
          { id: "contact-info", label: "Contact Info", icon: MessageCircle },
          { id: "certifications", label: "Certifications", icon: Award },
        ],
      },
      { id: "portfolio", label: "Portfolio", icon: Briefcase },
      { id: "reviews", label: "Reviews", icon: Star },
      { id: "messages", label: "Messages", icon: MessageSquare },
      { id: "project-inquiries", label: "Project Inquiries", icon: FileSearch },
      { id: "proposals", label: "Proposals", icon: FileText },
      { id: "projects", label: "Projects", icon: Briefcase },
    ],
  },
  {
    id: "performance",
    label: "PERFORMANCE",
    icon: BarChart3,
    children: [
      { id: "performance-analytics", label: "Performance Analytics", icon: TrendingUp },
      { id: "audience-insights", label: "Audience Insights", icon: Eye },
      { id: "competitor-comparison", label: "Competitor Comparison", icon: GitCompare },
    ],
  },
  {
    id: "marketing",
    label: "MARKETING",
    icon: Megaphone,
    children: [{ id: "lead-generation", label: "Lead Management", icon: Download }],
  },
  {
    id: "account-settings",
    label: "ACCOUNT & SETTINGS",
    icon: Settings,
    children: [
      { id: "billing-subscription", label: "Billing & Subscription", icon: CreditCard },
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
]

// REMOVED LOCAL REQUIREMENTS ARRAY

export default function AgencyDashboard() {
  console.log("[v0] Agency dashboard rendering")
  const { user, loading } = useAuth()
  const router = useRouter()
  // Changed initial activeSection state to "overview"
  const [activeSection, setActiveSection] = useState("overview")
  
  const [projectTab, setProjectTab] = useState<"active" | "completed" | "invitations">("active")
  const [provider, setProvider] = useState<Provider>({
    id: "1",
    name: "Jane Smith",
    email: "jane@sparkdev.com",
    subscriptionTier: "standard", // Changed from "basic" to "standard"
    isVerified: true,
    isFeatured: true,
    profileCompletion: 85,
    totalProjects: 47,
    activeProjects: 8,
    completedProjects: 39,
    totalEarnings: 125000,
    monthlyEarnings: 12500,
    rating: 4.9,
    responseTime: "2 hours",
    successRate: 98,
    minimumBudget: 500,
    hourlyRate: { min: 25, max: 150 },
  })

  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [projects] = useState<Project[]>(mockProviderProjects)
  const [reviews, setReviews] = useState<Review[]>(mockProviderReviews)
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null)
  const [showProposalForm, setShowProposalForm] = useState(false)
  
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  const [selectedConversation, setSelectedConversation] = useState<string>("john-doe")
  const [newMessage, setNewMessage] = useState("")
  const [conversations, setConversations] = useState([
    {
      id: "john-doe",
      name: "John Doe",
      initials: "JD",
      message: "Thanks for the proposal. When can we start?",
      time: "2m ago",
      project: "E-commerce",
      unread: true,
      color: "bg-blue-500",
      messages: [
        {
          id: "1",
          sender: "client",
          content:
            "Hi! I'm interested in your e-commerce development services. Could you provide a quote for a full online store?",
          timestamp: "Yesterday, 2:30 PM",
          avatar: "JD",
        },
        {
          id: "2",
          sender: "agency",
          content:
            "Hello John! Thanks for reaching out. I'd be happy to help with your e-commerce project. Could you share more details about your requirements?",
          timestamp: "Yesterday, 3:00 PM",
          avatar: "S",
        },
        {
          id: "3",
          sender: "client",
          content:
            "I need a store with about 200 products, payment integration, inventory management, and mobile-responsive design. What would be your timeline and pricing?",
          timestamp: "Yesterday, 4:15 PM",
          avatar: "JD",
        },
        {
          id: "4",
          sender: "agency",
          content:
            "Perfect! Based on your requirements, I can provide a comprehensive solution. I'll send you a detailed proposal with timeline and pricing within 24 hours.",
          timestamp: "Yesterday, 5:30 PM",
          avatar: "S",
        },
        {
          id: "5",
          sender: "client",
          content: "Thanks for the proposal. When can we start?",
          timestamp: "2 minutes ago",
          avatar: "JD",
        },
      ],
    },
    {
      id: "sarah-wilson",
      name: "Sarah Wilson",
      initials: "SW",
      message: "Could you provide more details about the timeline?",
      time: "1h ago",
      project: "Mobile App",
      unread: true,
      color: "bg-purple-500",
      messages: [
        {
          id: "1",
          sender: "client",
          content: "Could you provide more details about the timeline?",
          timestamp: "1 hour ago",
          avatar: "SW",
        },
      ],
    },
    {
      id: "tech-startup",
      name: "Tech Startup Inc",
      initials: "TS",
      message: "We're interested in your web development services",
      time: "3h ago",
      project: "Web Development",
      unread: false,
      color: "bg-orange-500",
      messages: [
        {
          id: "1",
          sender: "client",
          content: "We're interested in your web development services",
          timestamp: "3 hours ago",
          avatar: "TS",
        },
      ],
    },
    {
      id: "marketing-pro",
      name: "Marketing Pro",
      initials: "MP",
      message: "The design looks great! Let's proceed.",
      time: "1d ago",
      project: "Branding",
      unread: false,
      color: "bg-green-500",
      messages: [
        {
          id: "1",
          sender: "client",
          content: "The design looks great! Let's proceed.",
          timestamp: "1 day ago",
          avatar: "MP",
        },
      ],
    },
    {
      id: "david-chen",
      name: "David Chen",
      initials: "DC",
      message: "Can we schedule a call to discuss the project?",
      time: "2d ago",
      project: "Consulting",
      unread: true,
      color: "bg-red-500",
      messages: [
        {
          id: "1",
          sender: "client",
          content: "Can we schedule a call to discuss the project?",
          timestamp: "2 days ago",
          avatar: "DC",
        },
      ],
    },
  ])

  const[providerDetails,setProviderDetails]=useState<Provider[]>();
  const[proposals,setProposals]=useState<Proposal[]>([]);
  const[requirements,setRequirements]=useState<Requirement[]>([]);
  const[dynamicStats,setDynamicStats]=useState({
      profileViews:0,
      profileViewsPercentage:0,
      websiteClicks:0,
      websiteClicksPercentage:0,
      proposals:0,
      proposalResponses:0,
      conversionPercentage:0,
      leadsPercentage:0,
      leads:0
  })
  const[activeProjects,setActiveProjects]=useState<Requirement[]>([]);
  const[dynamicNotifications,setDynamicNotifications]=useState<Notification[]>([])
  const[resLoading,setResLoading]=useState(false);
  const loadData=async()=>{
    setResLoading(true);
    try{
      const [providerDetailRes, proposalRes, requirementRes,notificationRes] = await Promise.all([
        fetch(`/api/providers/${user?.id}`),
        fetch("/api/proposals"),
        fetch("/api/requirements"),
        fetch("/api/notifications")
      ]);
      if(providerDetailRes.ok && proposalRes.ok && requirementRes.ok && notificationRes.ok){
         const[providerDetailsData,proposalData,requirementData,notificationsData]=await Promise.all([
        providerDetailRes.json(),
        proposalRes.json(),
        requirementRes.json(),
        notificationRes.json()

        ])
        console.log("Provider Details Data::::",providerDetailsData);
        console.log("Proposals Data:::",proposalData);
        console.log("Requirements Data::::",requirementData)
        console.log("fetched Notifications:::::",notificationsData);
        let profileViewPercentage=providerDetailsData.provider.currentMonthProfileViews>0?Math.round((providerDetailsData.provider.currentMonthProfileViews/providerDetailsData.provider.profileViews)*100) :0;
        let websiteClicksPercentage=providerDetailsData.provider.currentMonthWebsiteClicks>0?Math.round((providerDetailsData.provider.currentMonthWebsiteClicks/providerDetailsData.provider.websiteClicks)*100) :0;
        let responsesCount=proposalData.proposals.filter((eachItem)=>eachItem.status!="pending").length
        let totalProjectsDone=requirementData.requirements.filter((eachItem)=>eachItem?.allocatedToId===user?.id);
        let conversionPercentage=proposalData.proposals.length>0?Math.round((totalProjectsDone.length/proposalData.proposals.length)*100):0;
        
        console.log("percntage of profile views",profileViewPercentage)
        console.log("percntage of website clicks",websiteClicksPercentage)
        console.log("response Count is::::",responsesCount);
        console.log("total Project allocated::::",totalProjectsDone);
        console.log("conversion percentage is:::",conversionPercentage)

        setDynamicStats({
          profileViews:providerDetailsData.provider.profileViews,
          profileViewsPercentage:profileViewPercentage,
          websiteClicks:providerDetailsData.provider.websiteClicks,
          websiteClicksPercentage:websiteClicksPercentage,
          proposals:proposalData.proposals.length,
          proposalResponses:responsesCount,
          conversionPercentage:conversionPercentage,
          leadsPercentage:0,
          leads:totalProjectsDone.length,
        })

        setActiveProjects(totalProjectsDone)
        //unread notifications
        setDynamicNotifications(notificationsData.data.filter((eachitem)=>!eachitem.isRead))




      }
      else{
        throw new Error();
      }
    }catch(error){
      console.log("Failed to fetch the data:::")
    }finally{
      setResLoading(false)
    }
  }

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId)
    // Mark conversation as read
    setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, unread: false } : conv)))
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const selectedConv = conversations.find((c) => c.id === selectedConversation)
    if (!selectedConv) return

    const newMsg = {
      id: Date.now().toString(),
      sender: "agency" as const,
      content: newMessage,
      timestamp: "Just now",
      avatar: "S",
    }

    // Update conversations with new message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, newMsg],
              message: newMessage,
              time: "Just now",
            }
          : conv,
      ),
    )

    setNewMessage("")

    // TODO: Send to backend API
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation,
          message: newMessage,
          sender: "agency",
        }),
      })

      if (!response.ok) {
        console.error("Failed to send message")
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const selectedConv = conversations.find((c) => c.id === selectedConversation)
  const unreadCount = conversations.filter((c) => c.unread).length

  const handleProposalSubmit = (requirement: Requirement) => {
    // Placeholder for handleProposalSubmit logic
    console.log("Proposal submitted for requirement:", requirement.id)
    setShowProposalForm(false)
    setSelectedRequirement(null)
  }

  const handleMarkNotificationAsRead = async(notificationId: string,redirectionUrl:string) => {
    try{
        const res=await fetch(`/api/notifications/${notificationId}`,{
          method:"PUT",
          headers:{
            "Content-Type":"application/json"
          }
        })
        console.log("response of the mark as read::",res)
        if(res.ok){
            setDynamicNotifications((prev)=>prev.filter((eachItem)=>eachItem._id!==notificationId))
        }
     }catch(error){
       console.log("Failed to update the status of the notification::",error)
     }
    router.push(redirectionUrl)
  }

  const handleDismissNotification = (notificationId: string) => {
    // Placeholder for handleDismissNotification logic
  }

  const handleSaveProfile = (updatedProvider: Provider) => {
    setProvider(updatedProvider)
  }

  const handleRespondToReview = (review: Review) => {
    setSelectedReview(review)
    setShowRespondToReview(true)
  }

  // ADDED HANDLER FOR VIEWING REQUIREMENT DETAILS
  const handleViewRequirementDetails = (requirementId: string) => {
    const requirement = mockRequirements.find((r) => r.id === requirementId)
    if (requirement) {
      setSelectedRequirement(requirement)
      // For now, just show the proposal form - later we can add a details modal
      setShowProposalForm(true)
    }
  }

 

  useEffect(() => {
    if (!loading && (!user || user.role !== "agency")) {
      router.push("/login")
    }
    if(user && user.role === "agency"){
       loadData()
    }
  }, [user, loading, router])

  
  if (loading || resLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!user || user.role !== "agency") {
    return null
  }

  const stats = {
    totalProposals: 15,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: 12,
    averageRating: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0,
  }

  const analyticsData = {
    profileViews: 1247,
    profileViewsChange: 12,
    clicksToWebsite: 342,
    clicksChange: 8,
    impressions: 5680,
    impressionsChange: 15,
    projectInvitations: 23,
    invitationsChange: 5,
    proposalSubmissions: 15,
    proposalResponses: 8,
    conversionRate: 53,
    leadsGenerated: 34,
    leadsChange: 18,
    leadToClientRate: 23.5,
    premiumImpact: 45,
  }

  const searchQueries = [
    { keyword: "Web Development", count: 234, trend: "up" },
    { keyword: "E-commerce Solutions", count: 189, trend: "up" },
    { keyword: "Mobile App Development", count: 156, trend: "stable" },
    { keyword: "UI/UX Design", count: 142, trend: "up" },
    { keyword: "Digital Marketing", count: 98, trend: "down" },
  ]

  const marketInsights = {
    topIndustries: [
      { name: "E-commerce", percentage: 35, projects: 12 },
      { name: "SaaS", percentage: 28, projects: 9 },
      { name: "Healthcare", percentage: 18, projects: 6 },
      { name: "Finance", percentage: 12, projects: 4 },
      { name: "Education", percentage: 7, projects: 3 },
    ],
    topGeographies: [
      { location: "United States", percentage: 45, projects: 15 },
      { location: "United Kingdom", percentage: 22, projects: 7 },
      { location: "Canada", percentage: 15, projects: 5 },
      { location: "Australia", percentage: 10, projects: 3 },
      { location: "Germany", percentage: 8, projects: 4 },
    ],
  }

  const monthlyReport = {
    profileImpressions: 5680,
    profileViews: 1247,
    categoryRanking: {
      current: 12,
      previous: 18,
      category: "Web Development",
    },
    leadsGenerated: {
      inquiries: 34,
      proposals: 15,
      total: 49,
    },
    conversionFunnel: {
      views: 1247,
      contacts: 89,
      proposals: 15,
      won: 5,
    },
    reviewsAdded: 3,
    ratingsDistribution: {
      5: 12,
      4: 5,
      3: 2,
      2: 0,
      1: 0,
    },
  }

  // Added state for project tab navigation
  // const [projectTab, setProjectTab] = useState<"active" | "completed" | "invitations">("active")

  if (showProposalForm && selectedRequirement) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <SubmitProposalForm
          requirement={selectedRequirement}
          onSubmit={handleProposalSubmit}
          onCancel={() => {
            setShowProposalForm(false)
            setSelectedRequirement(null)
          }}
        />
      </div>
    )
  }

  return (
    <div>
      

      <div className="min-h-screen">
        <div className="min-h-screen">
          <div className="p-8">

            <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                  <p className="text-muted-foreground">Quick stats and recent activity</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Visibility Metrics */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Visibility & Engagement</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{dynamicStats.profileViews}</div>
                            <p className="text-xs text-green-600">+{dynamicStats.profileViewsPercentage}% this month</p>
                          </CardContent>
                        </Card>

                        {/* <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{analyticsData.impressions}</div>
                            <p className="text-xs text-green-600">+{analyticsData.impressionsChange}% this month</p>
                          </CardContent>
                        </Card> */}

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Website Clicks</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{dynamicStats.websiteClicks}</div>
                            <p className="text-xs text-green-600">+{dynamicStats.websiteClicksPercentage}% this month</p>
                          </CardContent>
                        </Card>
{/* 
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Invitations</CardTitle>
                            <UserPlus className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{analyticsData.projectInvitations}</div>
                            <p className="text-xs text-green-600">+{analyticsData.invitationsChange} this month</p>
                          </CardContent>
                        </Card> */}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Proposals</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{dynamicStats.proposals}</div>
                            <p className="text-xs text-muted-foreground">{dynamicStats.proposalResponses} responses</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{dynamicStats.conversionPercentage}%</div>
                            <p className="text-xs text-muted-foreground">Proposal to project</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Leads</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{dynamicStats.leads}</div>
                            <p className="text-xs text-green-600">+{analyticsData.leadsChange}% this month</p>
                          </CardContent>
                        </Card>

                        {/* <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Client Rate</CardTitle>
                            <Award className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{analyticsData.leadToClientRate}%</div>
                            <p className="text-xs text-muted-foreground">Lead to client</p>
                          </CardContent>
                        </Card> */}
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Active Projects</CardTitle>
                        <CardDescription>Your current ongoing projects</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {projects.length === 0 ? (
                          <p className="text-muted-foreground text-center py-4">No active projects</p>
                        ) : (
                          <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {projects.map((project) => (
                              <div key={project.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-medium">Project #{project.id}</h4>
                                  <Badge variant="outline">{project.status}</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />${project.budget.toLocaleString()}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Started {project.startDate.toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <div className="text-xs text-muted-foreground mb-1">
                                    Progress: {project.milestones.filter((m) => m.completed).length}/
                                    {project.milestones.length} milestones
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full"
                                      style={{
                                        width: `${(project.milestones.filter((m) => m.completed).length / project.milestones.length) * 100}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <NotificationsWidget
                      notifications={dynamicNotifications}
                      onMarkAsRead={handleMarkNotificationAsRead}
                      onDismiss={handleDismissNotification}
                    />
                  </div>
                </div>
              </div>

            {activeSection === "performance-analytics" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
                  <p className="text-muted-foreground">Detailed insights into your agency's performance</p>
                </div>

                {/* Search Queries */}
                <Card>
                  <CardHeader>
                    <CardTitle>Search Queries & Discovery</CardTitle>
                    <CardDescription>Keywords and categories where clients are finding you</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {searchQueries.map((query, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                            <div>
                              <p className="font-medium">{query.keyword}</p>
                              <p className="text-sm text-muted-foreground">{query.count} searches</p>
                            </div>
                          </div>
                          <Badge
                            variant={
                              query.trend === "up" ? "default" : query.trend === "down" ? "destructive" : "secondary"
                            }
                          >
                            {query.trend === "up" ? "↑" : query.trend === "down" ? "↓" : "→"} {query.trend}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Proposal Conversion Funnel */}
                <Card>
                  <CardHeader>
                    <CardTitle>Proposal Conversion Funnel</CardTitle>
                    <CardDescription>Track your proposal journey from submission to project win</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium">Submissions</div>
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-8 relative">
                            <div
                              className="bg-blue-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                              style={{ width: "100%" }}
                            >
                              {analyticsData.proposalSubmissions} proposals
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium">Responses</div>
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-8 relative">
                            <div
                              className="bg-teal-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                              style={{
                                width: `${(analyticsData.proposalResponses / analyticsData.proposalSubmissions) * 100}%`,
                              }}
                            >
                              {analyticsData.proposalResponses} responses
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium">Won Projects</div>
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-8 relative">
                            <div
                              className="bg-green-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                              style={{ width: `${(stats.activeProjects / analyticsData.proposalSubmissions) * 100}%` }}
                            >
                              {stats.activeProjects} projects
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Premium Plan Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Premium Plan Performance</CardTitle>
                    <CardDescription>Impact of your premium visibility package</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-3xl font-bold text-green-600">+{analyticsData.premiumImpact}%</div>
                        <p className="text-sm text-muted-foreground mt-2">Visibility Increase</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-3xl font-bold text-blue-600">2.3x</div>
                        <p className="text-sm text-muted-foreground mt-2">More Profile Views</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-3xl font-bold text-purple-600">1.8x</div>
                        <p className="text-sm text-muted-foreground mt-2">Higher Conversion</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "audience-insights" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Market Insights</h1>
                  <p className="text-muted-foreground">Industries and geographies where you're most competitive</p>
                </div>

                {/* Top Industries */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Industries</CardTitle>
                    <CardDescription>Industries where you're winning the most projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketInsights.topIndustries.map((industry, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{industry.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {industry.projects} projects • {industry.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${industry.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Geographies */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Geographies</CardTitle>
                    <CardDescription>Locations where your services are in highest demand</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {marketInsights.topGeographies.map((geo, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{geo.location}</span>
                            <span className="text-sm text-muted-foreground">
                              {geo.projects} projects • {geo.percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${geo.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Competitive Positioning */}
                <Card>
                  <CardHeader>
                    <CardTitle>Competitive Positioning</CardTitle>
                    <CardDescription>Your strengths in different market segments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Strongest Segments</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            E-commerce Development
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            SaaS Solutions
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            Mobile App Design
                          </li>
                        </ul>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Growth Opportunities</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            Healthcare Tech
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            Financial Services
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            Education Platforms
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "competitor-comparison" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Monthly Performance Report</h1>
                  <p className="text-muted-foreground">Comprehensive overview of your agency's monthly performance</p>
                </div>

                {/* Profile Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Profile Impressions</div>
                        <div className="text-3xl font-bold">{monthlyReport.profileImpressions}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Profile Views</div>
                        <div className="text-3xl font-bold">{monthlyReport.profileViews}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">View Rate</div>
                        <div className="text-3xl font-bold">
                          {((monthlyReport.profileViews / monthlyReport.profileImpressions) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Ranking */}
                <Card>
                  <CardHeader>
                    <CardTitle>Category Ranking Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{monthlyReport.categoryRanking.category}</p>
                        <p className="text-2xl font-bold">Rank #{monthlyReport.categoryRanking.current}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="default" className="bg-green-500">
                          ↑ {monthlyReport.categoryRanking.previous - monthlyReport.categoryRanking.current} positions
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Previous: #{monthlyReport.categoryRanking.previous}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Leads Generated */}
                <Card>
                  <CardHeader>
                    <CardTitle>Leads Generated</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-3xl font-bold">{monthlyReport.leadsGenerated.inquiries}</div>
                        <p className="text-sm text-muted-foreground mt-2">Inquiries</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-3xl font-bold">{monthlyReport.leadsGenerated.proposals}</div>
                        <p className="text-sm text-muted-foreground mt-2">Proposals</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-3xl font-bold text-primary">{monthlyReport.leadsGenerated.total}</div>
                        <p className="text-sm text-muted-foreground mt-2">Total Leads</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Conversion Funnel */}
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                    <CardDescription>View → Contact → Proposal → Won</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium">Views</div>
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-8">
                            <div
                              className="bg-blue-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                              style={{ width: "100%" }}
                            >
                              {monthlyReport.conversionFunnel.views}
                            </div>
                          </div>
                        </div>
                        <div className="w-16 text-sm text-muted-foreground">100%</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium">Contacts</div>
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-8">
                            <div
                              className="bg-teal-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                              style={{
                                width: `${
                                  (monthlyReport.conversionFunnel.contacts / monthlyReport.conversionFunnel.views) * 100
                                }%`,
                              }}
                            >
                              {monthlyReport.conversionFunnel.contacts}
                            </div>
                          </div>
                        </div>
                        <div className="w-16 text-sm text-muted-foreground">
                          {(
                            (monthlyReport.conversionFunnel.contacts / monthlyReport.conversionFunnel.views) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium">Proposals</div>
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-8">
                            <div
                              className="bg-purple-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                              style={{
                                width: `${
                                  (monthlyReport.conversionFunnel.proposals / monthlyReport.conversionFunnel.views) *
                                  100
                                }%`,
                              }}
                            >
                              {monthlyReport.conversionFunnel.proposals}
                            </div>
                          </div>
                        </div>
                        <div className="w-16 text-sm text-muted-foreground">
                          {(
                            (monthlyReport.conversionFunnel.proposals / monthlyReport.conversionFunnel.views) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium">Won</div>
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-8">
                            <div
                              className="bg-green-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                              style={{
                                width: `${
                                  (monthlyReport.conversionFunnel.won / monthlyReport.conversionFunnel.views) * 100
                                }%`,
                              }}
                            >
                              {monthlyReport.conversionFunnel.won}
                            </div>
                          </div>
                        </div>
                        <div className="w-16 text-sm text-muted-foreground">
                          {((monthlyReport.conversionFunnel.won / monthlyReport.conversionFunnel.views) * 100).toFixed(
                            1,
                          )}
                          %
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews & Ratings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews Added & Ratings Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-center p-6 border rounded-lg">
                          <div className="text-4xl font-bold text-primary">{monthlyReport.reviewsAdded}</div>
                          <p className="text-sm text-muted-foreground mt-2">New Reviews This Month</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Ratings Distribution</h4>
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-3">
                              <div className="flex items-center gap-1 w-16">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{rating}</span>
                              </div>
                              <div className="flex-1">
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div
                                    className="bg-yellow-400 h-2 rounded-full"
                                    style={{
                                      width: `${
                                        (monthlyReport.ratingsDistribution[
                                          rating as keyof typeof monthlyReport.ratingsDistribution
                                        ] /
                                          Object.values(monthlyReport.ratingsDistribution).reduce((a, b) => a + b, 0)) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </div>
                              </div>
                              <span className="text-sm text-muted-foreground w-8">
                                {
                                  monthlyReport.ratingsDistribution[
                                    rating as keyof typeof monthlyReport.ratingsDistribution
                                  ]
                                }
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "company-details" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Company Details</h1>
                  <p className="text-muted-foreground">Manage your company information</p>
                </div>
                <CompanyProfileEditor provider={provider} onSave={handleSaveProfile} />
              </div>
            )}

            {activeSection === "services" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Services</h1>
                  <p className="text-muted-foreground">Manage your service offerings</p>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Service management coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "team" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Team</h1>
                  <p className="text-muted-foreground">Manage your team members</p>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Team management coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "contact-info" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Contact Information</h1>
                  <p className="text-muted-foreground">Manage your contact details</p>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Contact management coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "certifications" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Certifications</h1>
                  <p className="text-muted-foreground">Manage your certifications and credentials</p>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Certification management coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "edit-profile" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
                  <p className="text-muted-foreground">Manage your company information and profile details</p>
                </div>
                <CompanyProfileEditor provider={provider} onSave={handleSaveProfile} />
              </div>
            )}

            {activeSection === "portfolio" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
                  <p className="text-muted-foreground">Showcase your work and achievements</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Overview & Details */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Overview Section */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Company Overview</h3>
                          <Button variant="outline" size="sm" onClick={() => setShowEditProfile(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        </div>
                        <p className="text-sm leading-relaxed">
                          We design and run high-performing paid social and search campaigns, create thumb-stopping
                          creative, and optimize landing experiences to scale predictable revenue for DTC and SaaS
                          brands.
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                          <div>
                            <span className="font-medium">Employees:</span> 10–49
                          </div>
                          <div>
                            <span className="font-medium">Founded:</span> 2016
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Service Lines */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Service Lines</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Social Media Marketing</span>
                                <span className="text-sm text-muted-foreground">45%</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Email Marketing</span>
                                <span className="text-sm text-muted-foreground">15%</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Advertising</span>
                                <span className="text-sm text-muted-foreground">10%</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Digital Strategy</span>
                                <span className="text-sm text-muted-foreground">10%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pricing Snapshot */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Pricing Snapshot</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Min. project size</div>
                            <div className="text-xl font-bold">${(provider?.minimumBudget || 0).toLocaleString()}+</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Avg. hourly rate</div>
                            <div className="text-xl font-bold">
                              ${provider?.hourlyRate?.min || 0}–${provider?.hourlyRate?.max || 0} / hr
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Rating for cost</div>
                            <div className="text-xl font-bold">4.8 / 5</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - Focus Areas & Details */}
                  <div className="space-y-6">
                    {/* Focus Areas */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Focus Areas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm leading-relaxed">
                          We primarily work with DTC ecommerce brands and high-growth SaaS looking for
                          performance-driven creative and full-funnel acquisition.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Industries */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Industries</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">E-commerce, Consumer Goods, SaaS, Fintech</div>
                      </CardContent>
                    </Card>

                    {/* Clients */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Clients</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">Cheribundi, PEZ, Alexander, Scarce, Liquid Rubber</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="w-full">
                  <Card>
                    <CardContent className="p-8">
                      <div className="space-y-6">
                        {/* Portfolio & Awards Header */}
                        <div className="flex justify-between items-center">
                          <div>
                            <h2 className="text-2xl font-bold">Portfolio & Awards</h2>
                            <p className="text-muted-foreground">
                              Selected case studies with visuals and measurable outcomes.
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Show:</span>
                            <select className="border border-border rounded-md px-3 py-1 text-sm bg-background">
                              <option>All</option>
                              <option>Social Media</option>
                              <option>Creative</option>
                              <option>User Acquisition</option>
                              <option>Ecommerce</option>
                              <option>Paid Ads</option>
                            </select>
                          </div>
                        </div>

                        {/* Case Studies Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Cheribundi Case Study */}
                          <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-red-700">Cheribundi • Visual Collage</div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">Driving top line revenue for Cheribundi</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                Paid social creative + funnel testing that delivered a significant revenue lift during
                                campaign windows.
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  Social Media
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">+30% Revenue</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* PEZ Case Study */}
                          <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-orange-700">PEZ • Brand Content</div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">Content Creation for PEZ</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                Playful, platform-native content designed for reach and shareability.
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                                  Creative
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">High Reach</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Alexander Case Study */}
                          <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-purple-700">Alexander • UA Creative</div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">App install growth for Alexander</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                Creative-led user acquisition with CPI reductions and scalable channels.
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                  User Acquisition
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">3x lower CPI</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Kjaer Weis Case Study */}
                          <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-700">Kjaer Weis • DTC</div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">Growing e-commerce for Kjaer Weis</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                Conversion optimisation, landing pages & creative to support premium DTC growth.
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  Ecommerce
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">+12% Conv.</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Scarce Case Study */}
                          <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-indigo-700">Scarce • Product Launch</div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">Ecommerce campaigns for Scarce</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                End-to-end acquisition + creative testing to identify scaleable audiences.
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  Paid Ads
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">Strong ROAS</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Liquid Rubber Case Study */}
                          <Card className="overflow-hidden">
                            <div className="h-32 bg-gradient-to-br from-gray-100 to-slate-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-700">Liquid Rubber • US Growth</div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-bold mb-2">Ecommerce Growth for Liquid Rubber (US)</h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                Landing pages, paid channels, and lifecycle to scale US revenue.
                              </p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  Ecommerce
                                </Badge>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-green-600">+22% Repeat</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="w-full">
                  <Card>
                    <CardContent className="p-8">
                      <h2 className="text-2xl font-bold mb-6 text-center">What Clients Are Saying</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          {
                            name: "Sarah Johnson",
                            company: "TechStart Inc.",
                            rating: 5,
                            comment:
                              "Exceptional work on our e-commerce platform. The team delivered beyond our expectations with great attention to detail and timely communication.",
                          },
                          {
                            name: "Michael Chen",
                            company: "Digital Solutions",
                            rating: 5,
                            comment:
                              "Professional, reliable, and innovative. They transformed our outdated website into a modern, user-friendly platform that increased our conversions by 40%.",
                          },
                          {
                            name: "Emily Rodriguez",
                            company: "Creative Agency",
                            rating: 5,
                            comment:
                              "Outstanding design and development skills. The project was completed on time and within budget. Highly recommend for any web development needs.",
                          },
                        ].map((testimonial, index) => (
                          <div key={index} className="bg-muted/50 p-6 rounded-lg">
                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <p className="text-sm mb-4 italic">"{testimonial.comment}"</p>
                            <div>
                              <p className="font-medium text-sm">{testimonial.name}</p>
                              <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeSection === "reviews" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Client Reviews</h1>
                  <p className="text-muted-foreground">View and respond to client feedback</p>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No reviews yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {reviews.map((review) => (
                          <Card key={review.id}>
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium">{review.rating}/5</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {review.createdAt.toLocaleDateString()}
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                                <div>Quality: {review.qualityRating}/5</div>
                                <div>Cost: {review.costRating}/5</div>
                                <div>Timeliness: {review.timelinessRating}/5</div>
                              </div>

                              <p className="text-sm mb-3">{review.comment}</p>

                              {review.providerResponse ? (
                                <div className="bg-muted p-3 rounded-md">
                                  <p className="text-sm font-medium mb-1">Your Response:</p>
                                  <p className="text-sm">{review.providerResponse}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Responded on {review.responseDate?.toLocaleDateString()}
                                  </p>
                                </div>
                              ) : (
                                <Button variant="outline" size="sm" onClick={() => handleRespondToReview(review)}>
                                  Respond to Review
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "project-inquiries" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Project Inquiries</h1>
                  <p className="text-muted-foreground">Browse and respond to client requirements</p>
                </div>
                {/* REMOVED SubscriptionGate */}
                <BrowseRequirements
                  requirements={mockRequirements}
                  subscriptionTier={provider.subscriptionTier}
                  onViewDetails={handleViewRequirementDetails}
                  onSubmitProposal={handleProposalSubmit}
                />
              </div>
            )}

            {activeSection === "messages" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Messages</h1>
                  <p className="text-muted-foreground">Manage your conversations and project inquiries</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Conversations List */}
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Conversations</span>
                          <Badge variant="secondary">{unreadCount}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="space-y-0">
                          {conversations.map((conversation) => (
                            <div
                              key={conversation.id}
                              onClick={() => handleConversationSelect(conversation.id)}
                              className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                                selectedConversation === conversation.id ? "bg-muted/50" : ""
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={`w-10 h-10 ${conversation.color} rounded-full flex items-center justify-center text-white font-semibold`}
                                >
                                  {conversation.initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className={`text-sm ${conversation.unread ? "font-semibold" : "font-medium"}`}>
                                      {conversation.name}
                                    </p>
                                    <span className="text-xs text-muted-foreground">{conversation.time}</span>
                                  </div>
                                  <p
                                    className={`text-sm text-muted-foreground truncate ${conversation.unread ? "font-medium" : ""}`}
                                  >
                                    {conversation.message}
                                  </p>
                                  <div className="flex items-center mt-1 space-x-2">
                                    <Badge variant="outline" className="text-xs">
                                      {conversation.project}
                                    </Badge>
                                    {conversation.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Message Thread */}
                  <div className="lg:col-span-2">
                    {selectedConv ? (
                      <Card className="h-[600px] flex flex-col">
                        <CardHeader className="border-b">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 ${selectedConv.color} rounded-full flex items-center justify-center text-white font-semibold`}
                            >
                              {selectedConv.initials}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{selectedConv.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{selectedConv.project} Project</p>
                            </div>
                            <div className="ml-auto flex items-center space-x-2">
                              <Badge variant="outline">Active</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // TODO: Implement phone call functionality
                                  console.log("Initiating phone call...")
                                }}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // TODO: Implement video call functionality
                                  console.log("Initiating video call...")
                                }}
                              >
                                <Video className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="flex-1 p-4 overflow-y-auto">
                          <div className="space-y-4">
                            {selectedConv.messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex items-start space-x-3 ${
                                  message.sender === "agency" ? "justify-end" : ""
                                }`}
                              >
                                {message.sender === "client" && (
                                  <div
                                    className={`w-8 h-8 ${selectedConv.color} rounded-full flex items-center justify-center text-white text-sm font-semibold`}
                                  >
                                    {message.avatar}
                                  </div>
                                )}
                                <div className={`flex-1 ${message.sender === "agency" ? "flex justify-end" : ""}`}>
                                  <div
                                    className={`p-3 rounded-lg max-w-md ${
                                      message.sender === "agency" ? "bg-primary text-primary-foreground" : "bg-muted"
                                    }`}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                                </div>
                                {message.sender === "agency" && (
                                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                    {message.avatar}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>

                        {/* Message Input */}
                        <div className="border-t p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // TODO: Implement file attachment
                                console.log("Opening file picker...")
                              }}
                            >
                              <Paperclip className="h-4 w-4" />
                            </Button>
                            <Input
                              placeholder="Type your message..."
                              className="flex-1"
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={handleKeyPress}
                            />
                            <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ) : (
                      <Card className="h-[600px] flex items-center justify-center">
                        <div className="text-center">
                          <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-muted-foreground">Select a conversation to start messaging</p>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Proposals Section */}
            {activeSection === "proposals" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">My Proposals</h1>
                  <p className="text-muted-foreground">Track all proposals you've submitted to clients</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Stats Cards */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">15</div>
                      <p className="text-xs text-muted-foreground">+2 from last week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Client Responses</CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">11</div>
                      <p className="text-xs text-muted-foreground">73% response rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">9</div>
                      <p className="text-xs text-muted-foreground">60% conversion rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">5</div>
                      <p className="text-xs text-muted-foreground">33% acceptance rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$127K</div>
                      <p className="text-xs text-muted-foreground">Proposed project value</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Proposal to Conversation Funnel</CardTitle>
                    <CardDescription>Track how your proposals convert into client conversations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Proposals Submitted</span>
                          <span className="text-muted-foreground">15 (100%)</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: "100%" }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Client Viewed</span>
                          <span className="text-muted-foreground">13 (87%)</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: "87%" }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Client Responded</span>
                          <span className="text-muted-foreground">11 (73%)</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: "73%" }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Active Conversations</span>
                          <span className="text-muted-foreground">9 (60%)</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-violet-500" style={{ width: "60%" }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Shortlisted</span>
                          <span className="text-muted-foreground">7 (47%)</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-pink-500" style={{ width: "47%" }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">Accepted</span>
                          <span className="text-muted-foreground">5 (33%)</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "33%" }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Proposals List */}
                <Card>
                  <CardHeader>
                    <CardTitle>All Proposals</CardTitle>
                    <CardDescription>View and manage your submitted proposals</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        id: "1",
                        projectTitle: "E-commerce Website Development",
                        clientName: "Sarah Johnson",
                        clientCompany: "Fashion Forward LLC",
                        proposedAmount: 8500,
                        timeline: "10 weeks",
                        status: "pending",
                        submittedDate: "2024-01-16",
                        category: "Web Development",
                        hasResponse: false,
                        hasConversation: false,
                        viewedByClient: true,
                      },
                      {
                        id: "2",
                        projectTitle: "Mobile App UI/UX Design",
                        clientName: "Mike Chen",
                        clientCompany: "FitLife Technologies",
                        proposedAmount: 3500,
                        timeline: "5 weeks",
                        status: "shortlisted",
                        submittedDate: "2024-01-12",
                        category: "Design",
                        hasResponse: true,
                        hasConversation: true,
                        viewedByClient: true,
                        responseDate: "2024-01-14",
                        lastMessage: "Your proposal looks great! Can we schedule a call?",
                      },
                      {
                        id: "3",
                        projectTitle: "Digital Marketing Campaign",
                        clientName: "Jennifer Davis",
                        clientCompany: "CloudSync Solutions",
                        proposedAmount: 2500,
                        timeline: "8 weeks",
                        status: "accepted",
                        submittedDate: "2024-01-08",
                        category: "Marketing",
                        hasResponse: true,
                        hasConversation: true,
                        viewedByClient: true,
                        responseDate: "2024-01-10",
                        lastMessage: "We'd like to move forward with your proposal!",
                      },
                      {
                        id: "4",
                        projectTitle: "Cloud Infrastructure Migration",
                        clientName: "Robert Kim",
                        clientCompany: "TechCorp Industries",
                        proposedAmount: 28000,
                        timeline: "16 weeks",
                        status: "rejected",
                        submittedDate: "2024-01-05",
                        category: "IT Services",
                        hasResponse: true,
                        hasConversation: false,
                        viewedByClient: true,
                        responseDate: "2024-01-09",
                        lastMessage: "Thank you for your proposal. We've decided to go with another vendor.",
                      },
                      {
                        id: "5",
                        projectTitle: "Brand Identity & Logo Design",
                        clientName: "Amanda Rodriguez",
                        clientCompany: "PayFlow Startup",
                        proposedAmount: 4200,
                        timeline: "6 weeks",
                        status: "pending",
                        submittedDate: "2024-01-20",
                        category: "Design",
                        hasResponse: true,
                        hasConversation: true,
                        viewedByClient: true,
                        responseDate: "2024-01-22",
                        lastMessage: "Interested in discussing your approach further.",
                      },
                    ].map((proposal) => (
                      <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{proposal.projectTitle}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {proposal.clientName} • {proposal.clientCompany}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />${proposal.proposedAmount.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {proposal.timeline}
                                </div>
                                <div>Submitted {new Date(proposal.submittedDate).toLocaleDateString()}</div>
                              </div>

                              <div className="flex items-center gap-3 text-sm">
                                {proposal.viewedByClient && (
                                  <div className="flex items-center gap-1 text-blue-600">
                                    <Eye className="h-4 w-4" />
                                    <span>Viewed by client</span>
                                  </div>
                                )}
                                {proposal.hasResponse && (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>Client responded</span>
                                  </div>
                                )}
                                {proposal.hasConversation && (
                                  <div className="flex items-center gap-1 text-purple-600">
                                    <Users className="h-4 w-4" />
                                    <span>Active conversation</span>
                                  </div>
                                )}
                              </div>

                              {proposal.hasResponse && proposal.lastMessage && (
                                <div className="mt-3 p-3 bg-muted rounded-lg">
                                  <p className="text-xs text-muted-foreground mb-1">
                                    Last message ({new Date(proposal.responseDate!).toLocaleDateString()}):
                                  </p>
                                  <p className="text-sm">{proposal.lastMessage}</p>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
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
                                {proposal.status === "shortlisted" ? "Shortlisted" : proposal.status}
                              </Badge>
                              <Badge variant="outline">{proposal.category}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {proposal.hasConversation && (
                              <Button variant="default" size="sm">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                View Conversation
                              </Button>
                            )}
                            {proposal.status === "pending" && !proposal.hasResponse && (
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Proposal
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Projects Section */}
            {activeSection === "projects" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">My Projects</h1>
                  <p className="text-muted-foreground">Manage your active projects and direct invitations</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={projectTab === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setProjectTab("active")}
                  >
                    Active Projects (3)
                  </Button>
                  <Button
                    variant={projectTab === "completed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setProjectTab("completed")}
                  >
                    Completed Projects (12)
                  </Button>
                  <Button
                    variant={projectTab === "invitations" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setProjectTab("invitations")}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Project Invitations (8)
                  </Button>
                </div>

                {projectTab === "invitations" && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Direct Project Invitations
                          </h3>
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            You have received 8 direct invitations from clients who are interested in working with your
                            agency. Review the project details and respond to invitations that match your expertise.
                          </p>
                        </div>
                      </div>
                    </div>

                    {[
                      {
                        id: "inv-1",
                        title: "Enterprise CRM System Development",
                        client: "Robert Martinez",
                        company: "TechCorp Industries",
                        budget: { min: 50000, max: 75000 },
                        invitedDate: "2024-02-10",
                        deadline: "2024-02-20",
                        category: "Web Development",
                        description:
                          "We're looking for an experienced agency to develop a custom CRM system with advanced analytics and reporting capabilities.",
                        requirements: ["React/Node.js", "Database Design", "API Integration", "Cloud Deployment"],
                        reason: "Your portfolio in enterprise solutions and 4.9 rating impressed us",
                        status: "pending",
                      },
                      {
                        id: "inv-2",
                        title: "Brand Identity & Marketing Campaign",
                        client: "Lisa Anderson",
                        company: "GreenLeaf Organics",
                        budget: { min: 15000, max: 20000 },
                        invitedDate: "2024-02-12",
                        deadline: "2024-02-22",
                        category: "Marketing",
                        description:
                          "Complete brand refresh including logo design, brand guidelines, and a 3-month digital marketing campaign.",
                        requirements: [
                          "Brand Strategy",
                          "Graphic Design",
                          "Social Media Marketing",
                          "Content Creation",
                        ],
                        reason: "Your work with sustainable brands aligns perfectly with our values",
                        status: "pending",
                      },
                      {
                        id: "inv-3",
                        title: "Mobile Banking App UI/UX Redesign",
                        client: "David Kim",
                        company: "FinanceFirst Bank",
                        budget: { min: 30000, max: 40000 },
                        invitedDate: "2024-02-13",
                        deadline: "2024-02-25",
                        category: "Design",
                        description:
                          "Redesign our mobile banking app to improve user experience and modernize the interface.",
                        requirements: ["Mobile UI/UX", "User Research", "Prototyping", "Accessibility"],
                        reason: "Your fintech design expertise and user-centered approach",
                        status: "pending",
                      },
                      {
                        id: "inv-4",
                        title: "E-Learning Platform Development",
                        client: "Amanda White",
                        company: "EduTech Solutions",
                        budget: { min: 45000, max: 60000 },
                        invitedDate: "2024-02-14",
                        deadline: "2024-02-28",
                        category: "Web Development",
                        description:
                          "Build a comprehensive e-learning platform with video streaming, assessments, and progress tracking.",
                        requirements: [
                          "Full-Stack Development",
                          "Video Integration",
                          "Payment Gateway",
                          "LMS Features",
                        ],
                        reason: "Your experience with educational platforms",
                        status: "pending",
                      },
                      {
                        id: "inv-5",
                        title: "AI-Powered Analytics Dashboard",
                        client: "James Wilson",
                        company: "DataInsights Pro",
                        budget: { min: 35000, max: 50000 },
                        invitedDate: "2024-02-15",
                        deadline: "2024-03-01",
                        category: "Web Development",
                        description:
                          "Develop an AI-powered analytics dashboard with real-time data visualization and predictive insights.",
                        requirements: ["React/Python", "Data Visualization", "AI/ML Integration", "Real-time Updates"],
                        reason: "Your AI integration projects showcase advanced capabilities",
                        status: "pending",
                      },
                      {
                        id: "inv-6",
                        title: "Restaurant Chain Website & Ordering System",
                        client: "Maria Garcia",
                        company: "Bella Italia Restaurants",
                        budget: { min: 25000, max: 35000 },
                        invitedDate: "2024-02-16",
                        deadline: "2024-03-05",
                        category: "Web Development",
                        description:
                          "Multi-location restaurant website with online ordering, reservations, and loyalty program.",
                        requirements: [
                          "E-commerce",
                          "Multi-location Support",
                          "Payment Integration",
                          "Mobile Responsive",
                        ],
                        reason: "Your restaurant industry portfolio",
                        status: "pending",
                      },
                      {
                        id: "inv-7",
                        title: "Healthcare Patient Portal",
                        client: "Dr. Thomas Brown",
                        company: "HealthCare Plus Clinic",
                        budget: { min: 40000, max: 55000 },
                        invitedDate: "2024-02-17",
                        deadline: "2024-03-10",
                        category: "Web Development",
                        description:
                          "HIPAA-compliant patient portal with appointment scheduling, medical records, and telemedicine features.",
                        requirements: ["HIPAA Compliance", "Security", "Video Integration", "EHR Integration"],
                        reason: "Your healthcare compliance expertise",
                        status: "pending",
                      },
                      {
                        id: "inv-8",
                        title: "Real Estate Marketplace Platform",
                        client: "Jennifer Lee",
                        company: "PropertyHub Realty",
                        budget: { min: 55000, max: 70000 },
                        invitedDate: "2024-02-18",
                        deadline: "2024-03-15",
                        category: "Web Development",
                        description:
                          "Comprehensive real estate marketplace with property listings, virtual tours, and agent management.",
                        requirements: [
                          "Full-Stack Development",
                          "Map Integration",
                          "Search & Filters",
                          "CRM Integration",
                        ],
                        reason: "Your marketplace development experience",
                        status: "pending",
                      },
                    ].map((invitation) => (
                      <Card
                        key={invitation.id}
                        className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                >
                                  <Mail className="h-3 w-3 mr-1" />
                                  Direct Invitation
                                </Badge>
                                <Badge variant="outline">{invitation.category}</Badge>
                              </div>
                              <h3 className="font-semibold text-lg mb-1">{invitation.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {invitation.client} • {invitation.company}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />${invitation.budget.min.toLocaleString()} - $
                                  {invitation.budget.max.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Respond by {new Date(invitation.deadline).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  Invited {new Date(invitation.invitedDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Project Description</h4>
                              <p className="text-sm text-muted-foreground">{invitation.description}</p>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {invitation.requirements.map((req, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {req}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <Star className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div>
                                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                                    Why you were invited
                                  </h4>
                                  <p className="text-sm text-blue-700 dark:text-blue-300">{invitation.reason}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Submit Proposal
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Full Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <X className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Active Projects */}
                {projectTab === "active" && (
                  <div className="space-y-4">
                    {/* Active Projects List */}
                    {[
                      {
                        id: "1",
                        title: "E-commerce Website Development",
                        client: "Sarah Johnson",
                        company: "Fashion Forward LLC",
                        budget: 8500,
                        startDate: "2024-01-15",
                        deadline: "2024-03-25",
                        progress: 65,
                        status: "active",
                        milestones: [
                          { name: "Requirements Analysis", completed: true },
                          { name: "UI/UX Design", completed: true },
                          { name: "Frontend Development", completed: false },
                          { name: "Backend Integration", completed: false },
                          { name: "Testing & Launch", completed: false },
                        ],
                      },
                      {
                        id: "2",
                        title: "Digital Marketing Campaign",
                        client: "Jennifer Davis",
                        company: "CloudSync Solutions",
                        budget: 2500,
                        startDate: "2024-01-20",
                        deadline: "2024-03-15",
                        progress: 40,
                        status: "active",
                        milestones: [
                          { name: "Strategy Development", completed: true },
                          { name: "Content Creation", completed: false },
                          { name: "Campaign Launch", completed: false },
                          { name: "Performance Analysis", completed: false },
                        ],
                      },
                      {
                        id: "3",
                        title: "Mobile App UI/UX Design",
                        client: "Mike Chen",
                        company: "FitLife Technologies",
                        budget: 3500,
                        startDate: "2024-01-25",
                        deadline: "2024-03-01",
                        progress: 80,
                        status: "active",
                        milestones: [
                          { name: "User Research", completed: true },
                          { name: "Wireframes", completed: true },
                          { name: "UI Design", completed: true },
                          { name: "Prototyping", completed: false },
                          { name: "Final Delivery", completed: false },
                        ],
                      },
                    ].map((project) => (
                      <Card key={project.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {project.client} • {project.company}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />${project.budget.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Due {new Date(project.deadline).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="default">Active</Badge>
                              <div className="text-sm font-medium">{project.progress}% Complete</div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Milestones */}
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Milestones</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                              {project.milestones.map((milestone, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <div
                                    className={`w-3 h-3 rounded-full ${
                                      milestone.completed ? "bg-green-500" : "bg-gray-300"
                                    }`}
                                  />
                                  <span className={milestone.completed ? "line-through text-muted-foreground" : ""}>
                                    {milestone.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message Client
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Update Progress
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {projectTab === "completed" && (
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground py-8">
                      You have 12 completed projects. View your project history and client feedback.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Lead Management Section */}
            {activeSection === "lead-generation" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Lead Management</h1>
                  <p className="text-muted-foreground">Track and manage qualified leads attributed to Spark platform</p>
                </div>

                {/* Lead Generation Stats */}
                <div className="grid gap-4 md:grid-cols-5">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">247</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">+18%</span> from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Qualified Leads</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">189</div>
                      <p className="text-xs text-muted-foreground">76.5% qualification rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Contacted</CardTitle>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">142</div>
                      <p className="text-xs text-muted-foreground">75.1% contact rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Paying Clients</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">67</div>
                      <p className="text-xs text-muted-foreground">From qualified leads</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Lead-to-Client Rate</CardTitle>
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">35.4%</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-600">+5.2%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Lead-to-Client Conversion Funnel */}
                <Card>
                  <CardHeader>
                    <CardTitle>Lead-to-Client Conversion Funnel</CardTitle>
                    <CardDescription>Complete journey from lead generation to paying client</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Funnel Visualization */}
                      <div className="space-y-3">
                        {[
                          {
                            stage: "Total Leads Generated",
                            count: 247,
                            percentage: 100,
                            color: "bg-blue-500",
                            icon: Users,
                          },
                          {
                            stage: "Qualified Leads",
                            count: 189,
                            percentage: 76.5,
                            color: "bg-indigo-500",
                            icon: Target,
                            dropoff: 58,
                          },
                          {
                            stage: "Contacted",
                            count: 142,
                            percentage: 75.1,
                            color: "bg-purple-500",
                            icon: MessageSquare,
                            dropoff: 47,
                          },
                          {
                            stage: "Proposals Sent",
                            count: 98,
                            percentage: 69.0,
                            color: "bg-violet-500",
                            icon: FileText,
                            dropoff: 44,
                          },
                          {
                            stage: "In Negotiation",
                            count: 82,
                            percentage: 83.7,
                            color: "bg-fuchsia-500",
                            icon: Handshake,
                            dropoff: 16,
                          },
                          {
                            stage: "Paying Clients",
                            count: 67,
                            percentage: 81.7,
                            color: "bg-green-500",
                            icon: CheckCircle,
                            dropoff: 15,
                          },
                        ].map((stage, index) => {
                          const Icon = stage.icon
                          return (
                            <div key={stage.stage}>
                              <div className="flex items-center gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`h-8 w-8 rounded-lg ${stage.color} flex items-center justify-center`}
                                      >
                                        <Icon className="h-4 w-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">{stage.stage}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {stage.count} leads
                                          {stage.dropoff && (
                                            <span className="text-red-500 ml-1">(-{stage.dropoff}%)</span>
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                    <div
                                      className={`h-full ${stage.color} transition-all duration-500`}
                                      style={{ width: `${stage.percentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                              {index < 5 && (
                                <div className="flex items-center justify-center py-1">
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Overall Conversion Metrics */}
                      <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Overall Lead-to-Client Rate</p>
                          <p className="text-3xl font-bold text-primary">35.4%</p>
                          <p className="text-xs text-muted-foreground mt-1">67 clients from 189 qualified leads</p>
                        </div>
                        <div className="text-center p-4 bg-green-500/5 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Average Deal Value</p>
                          <p className="text-3xl font-bold text-green-600">$78,500</p>
                          <p className="text-xs text-muted-foreground mt-1">Per converted client</p>
                        </div>
                        <div className="text-center p-4 bg-blue-500/5 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Total Revenue from Leads</p>
                          <p className="text-3xl font-bold text-blue-600">$5.26M</p>
                          <p className="text-xs text-muted-foreground mt-1">From 67 paying clients</p>
                        </div>
                      </div>

                      {/* Conversion Insights */}
                      <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            Top Performing Lead Sources
                          </h4>
                          <div className="space-y-2">
                            {[
                              { source: "Direct Invitations", rate: "52.3%", clients: 24 },
                              { source: "Profile Views", rate: "38.2%", clients: 34 },
                              { source: "Search Results", rate: "29.8%", clients: 20 },
                            ].map((item) => (
                              <div
                                key={item.source}
                                className="flex items-center justify-between p-2 bg-accent/50 rounded"
                              >
                                <span className="text-sm">{item.source}</span>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-green-600">{item.rate}</p>
                                  <p className="text-xs text-muted-foreground">{item.clients} clients</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            Average Time to Conversion
                          </h4>
                          <div className="space-y-2">
                            {[
                              { stage: "Lead to Contact", time: "2.3 days" },
                              { stage: "Contact to Proposal", time: "4.7 days" },
                              { stage: "Proposal to Client", time: "12.5 days" },
                            ].map((item) => (
                              <div
                                key={item.stage}
                                className="flex items-center justify-between p-2 bg-accent/50 rounded"
                              >
                                <span className="text-sm">{item.stage}</span>
                                <span className="text-sm font-semibold text-blue-600">{item.time}</span>
                              </div>
                            ))}
                            <div className="flex items-center justify-between p-2 bg-primary/10 rounded border border-primary/20">
                              <span className="text-sm font-semibold">Total Cycle Time</span>
                              <span className="text-sm font-bold text-primary">19.5 days</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Removed Promotions & Ads Section */}

            {/* Removed Content Hub Section */}

            {activeSection === "billing-subscription" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
                  <p className="text-muted-foreground">Manage your subscription and billing details</p>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Billing and subscription management coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Notifications</h1>
                  <p className="text-muted-foreground">Configure your notification settings</p>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Notification settings coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Removed Team Members Section */}

            {/* Removed Account Settings Section */}
          </div>
        </div>
      </div>
    </div>
  )
}
