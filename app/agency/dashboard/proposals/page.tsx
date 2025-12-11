"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import type { Provider, Requirement, Notification, Project, Review } from "@/lib/types"
import { useState } from "react"

const ProposalsPage=()=>{
    return(
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
    )
}
export default ProposalsPage;