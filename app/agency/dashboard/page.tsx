"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { PiUsersThreeLight } from "react-icons/pi";
import { RiMessage2Line } from "react-icons/ri";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyProfileEditor } from "@/components/provider/company-profile-editor";
import { BrowseRequirements } from "@/components/provider/browse-requirements";
import { SubmitProposalForm } from "@/components/provider/submit-proposal-form";
import { NotificationsWidget } from "@/components/provider/notifications-widget";
import { Input } from "@/components/ui/input";
import { authFetch } from "@/lib/auth-fetch";
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
  CircleDollarSign,
  Heart,
} from "lucide-react";
import { FaFileAlt } from "react-icons/fa";

import {
  mockNotifications,
  mockProviderProjects,
  mockProviderReviews,
  mockRequirements,
} from "@/lib/mock-data";
import {
  type Provider,
  type Requirement,
  type Notification,
  type Project,
  type Review,
  Proposal,
} from "@/lib/types";
import { Hand } from "lucide-react";
import StatCard from "@/components/provider/dashboardCardAgency";
import { Folder } from "lucide-react"
import ProjectCard from "@/components/provider/activeProjectCard";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}



// REMOVED LOCAL REQUIREMENTS ARRAY

export default function AgencyDashboard() {
  console.log("[v0] Agency dashboard rendering");
  const { user, loading } = useAuth();
  const router = useRouter();
  

  const [selectedRequirement, setSelectedRequirement] =
    useState<Requirement | null>(null);
  const [showProposalForm, setShowProposalForm] = useState(false);

 

  const [selectedConversation, setSelectedConversation] =
    useState<string>("john-doe");
  const [newMessage, setNewMessage] = useState("");
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
  ]);

  
  const [dynamicStats, setDynamicStats] = useState({
    activeProjects: 0,
    projectsInThisMonth: 0,
    proposals: 0,
    proposalResponses: 0,
    leadsCount:0,
    leadsInThisMonth:0
  });
  const [activeProjects, setActiveProjects] = useState<Requirement[]>([]);
  
  const [resLoading, setResLoading] = useState(false);

  const getProjectsInThisMonth = (proposals: any[]) => {
  const now = new Date()

  return proposals.filter((proposal) => {
    if (!proposal.acceptedAt) return false

    const acceptedDate = new Date(proposal.acceptedAt)

    return (
      acceptedDate.getMonth() === now.getMonth() &&
      acceptedDate.getFullYear() === now.getFullYear()
    )
  }).length
}
const getLeadsInThisMonth = (leads: any[]) => {
  const now = new Date()

  return leads.filter((lead) => {
    if (!lead.createdAt) return false

    const createdDate = new Date(lead.createdAt)

    return (
      createdDate.getMonth() === now.getMonth() &&
      createdDate.getFullYear() === now.getFullYear()
    )
  }).length
}
  const loadData = async () => {
    setResLoading(true);
    try {
      const [providerDetailRes, proposalRes, requirementRes,leadsRes] =
        await Promise.all([
          authFetch(`/api/providers/${user?.id}`, {}),
          authFetch("/api/proposals", {}),
          authFetch("/api/requirements", {}),
          authFetch("/api/leads",{})
          
        ]);
      if (
        providerDetailRes.ok &&
        proposalRes.ok &&
        requirementRes.ok &&
        leadsRes.ok
      ) {
        const [
          providerDetailsData,
          proposalData,
          requirementData,
          leadsData,
          
        ] = await Promise.all([
          providerDetailRes.json(),
          proposalRes.json(),
          requirementRes.json(),
          leadsRes.json()
        
        ]);
        console.log("Provider Details Data::::", providerDetailsData);
        console.log("Proposals Data:::", proposalData);
        console.log("Requirements Data::::", requirementData);
        
        
        let responsesCount = proposalData.proposals.filter(
          (eachItem) => eachItem.status != "pending",
        ).length;
        const projectsInThisMonth = getProjectsInThisMonth(
          proposalData.proposals || []
        )
        const leadsInThisMonth = getLeadsInThisMonth(leadsData.data || [])

        setDynamicStats({
        activeProjects: proposalData.proposals.filter((item)=>item.status==="accepted").length,
        projectsInThisMonth: projectsInThisMonth,
        proposals: proposalData.proposals.length,
        proposalResponses: responsesCount,
        leadsCount:(leadsData.data || []).length,
        leadsInThisMonth:leadsInThisMonth
      })

       

        

        let currentActiveProjects = proposalData.proposals.filter(
          (eachItem: any) => eachItem.status === "accepted",
        );
        console.log("current active projects::::", currentActiveProjects);

        setActiveProjects(
          [...currentActiveProjects]
            .sort(
              (a, b) =>
                new Date(b.acceptedAt).getTime() -
                new Date(a.acceptedAt).getTime()
            )
            .slice(0, 2)
        )
        
        
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log("Failed to fetch the data:::");
    } finally {
      setResLoading(false);
    }
  };

 


 
 

  const handleProposalSubmit = (requirement: Requirement) => {
    // Placeholder for handleProposalSubmit logic
    console.log("Proposal submitted for requirement:", requirement.id);
    setShowProposalForm(false);
    setSelectedRequirement(null);
  };

  

  

  

  
  useEffect(() => {
    if (!loading && (!user || user.role !== "agency")) {
      router.push("/login");
    }
    if (user && user.role === "agency") {
      loadData();
    }
  }, [user, loading, router]);

  if (loading || resLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "agency") {
    return null;
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
            setShowProposalForm(false);
            setSelectedRequirement(null);
          }}
        />
      </div>
    );
  }
  
  console.log("Dynamic Top Cards Stats are the::::",dynamicStats)

  const formatDateToShort=(dateString: string): string=> {
  const date = new Date(dateString)

  if (isNaN(date.getTime())) return ""

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}
const getCompletionPercentage = (
  items: { title: string; description: string; completed: boolean }[]
): number => {
  if (!items.length) return 0

  const completedCount = items.filter(item => item.completed).length

  return Math.round((completedCount / items.length) * 100)
}

  return (
    <div>
      <div className="space-y-3 ">
        <div className="border-b border-[#E5E7EB] pb-4">
          <h1 className="text-2xl font-semibold text-[#111827] flex items-center gap-2">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-base text-[#6B7280] mt-1">
            Dashboard Overview
          </p>
        </div>

        <div>
          <div className="space-y-3">
            
            {/* STATS CARDS */}
            <div className="w-full">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {/* PROJECTS CARD */}
                <div className="relative bg-[#F4F2FF] rounded-xl p-5 border-t-4 border-[#7C6EF6] shadow-sm flex flex-col justify-between min-h-[130px]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#E6E1FF] p-3 rounded-lg">
                        <Folder className="text-[#7C6EF6]" size={20} />
                      </div>
                      <div>
                        <h3 className="text-gray-700 font-medium text-sm">
                          Projects
                        </h3>
                        <p className="text-xs text-green-600 mt-1">
                          {dynamicStats.projectsInThisMonth > 0
                            ? `+${dynamicStats.projectsInThisMonth}`
                            : "0"}{" "}
                          new this month
                        </p>
                      </div>
                    </div>

                    <span className="text-xl font-semibold text-gray-800">
                      {dynamicStats.activeProjects}
                    </span>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button className="bg-[#7C6EF6] hover:bg-[#6A5BE8] cursor-pointer rounded-[10px] text-white text-sm px-4 py-2 transition" 
                    onClick={()=>router.push("/agency/dashboard/projects")}>
                      View Projects →
                    </button>
                  </div>
                </div>

                {/* PROPOSALS CARD */}
                <div className="relative bg-[#FFF7E9] rounded-xl p-5 border-t-4 border-[#F5B546] shadow-sm flex flex-col justify-between min-h-[130px]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#FFEFD0] p-3 rounded-lg">
                        <FileText className="text-[#F5B546]" size={20} />
                      </div>
                      <div>
                        <h3 className="text-gray-700 font-medium text-sm">
                          Proposals
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {dynamicStats.proposalResponses} responses
                        </p>
                      </div>
                    </div>

                    <span className="text-xl font-semibold text-gray-800">
                      {dynamicStats.proposals}
                    </span>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button className="bg-[#F5B546] hover:bg-[#E4A538] text-white text-sm px-4 py-2 rounded-[10px] cursor-pointer transition"
                    onClick={()=>router.push("/agency/dashboard/proposals")}>
                      Manage →
                    </button>
                  </div>
                </div>

                {/* LEADS CARD */}
                <div className="relative bg-[#EEF9F2] rounded-xl p-5 border-t-4 border-[#58B787] shadow-sm flex flex-col justify-between min-h-[130px]">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#DDF3E7] p-3 rounded-lg">
                        <Target className="text-[#58B787]" size={20} />
                      </div>
                      <div>
                        <h3 className="text-gray-700 font-medium text-sm">
                          Leads
                        </h3>
                        <p className="text-xs text-green-600 mt-1">
                          {dynamicStats.leadsCount > 0
                            ? `+${dynamicStats.leadsCount}`
                            : ""}{" "}
                          new in this month
                        </p>
                      </div>
                    </div>

                    <span className="text-xl font-semibold text-gray-800">
                      {dynamicStats.leadsCount}
                    </span>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button className="bg-[#58B787] hover:bg-[#49A876] rounded-[10px] cursor-pointer text-white text-sm px-4 py-2 transition">
                      View Leads →
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* ACTIVE PROJECTS */}
            <Card className="rounded-lg bg-white py-2 pl-0">
              <CardContent className="px-3 py-0">
                <h1 className="text-[#000] text-lg font-semibold">
                  Your Active Projects
                </h1>

                {activeProjects.length !== 0 ? (
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    {activeProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        data={{
                          id: project.id,
                          title: project.requirement.title,
                          amount: project.proposedBudget,
                          duration: project.proposedTimeline,
                          category: project.requirement.category,
                          date: project?.acceptedAt
                            ? formatDateToShort(project.acceptedAt)
                            : "N/A",
                          progress: getCompletionPercentage(project.milestones),
                        }}
                        borderColor="#7C6EF6"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center mt-4">
                    <p className="text-gray-500 text-xl">
                      No active projects
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}
