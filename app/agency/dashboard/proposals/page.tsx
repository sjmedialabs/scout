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
import { type Provider, type Requirement, type Notification, type Project, type Review, Proposal } from "@/lib/types"
import { useState,useEffect } from "react"
import { AiFillWechatWork } from "react-icons/ai"
import { stat } from "fs"

const ProposalsPage=()=>{
    const[proposals,setProposals]=useState<Proposal[]>([]);
    const[loading,setLoading]=useState(false);
    const[failed,setFailed]=useState(false);
    const[stats,setStats]=useState({
        submissions:0,
        lastWeekSubmissions:0,
        clientResponse:0,
        clientResponsePercentage:0,
        accepted:0,
        acceptedPercentage:0,
        totalValue:0,
        shortlisted:0,
        shortlistedPercentage:0,
        clientViewed:0,
        clientViewedPercentage:0,

    })

    const loadData=async()=>{
        setLoading(true);
        setFailed(false);
        try{
           const res=await fetch("/api/proposals");
           if(res.ok){
              const data=await res.json();
              console.log("Fetched Proposals::::",data);
              let submissionCount = (data.proposals || []).length;

              let countClientResponse=0;
              let acceptedCount=0;
              let totalValue=0;
              let lastWeekSubmissionCount=0;
              let shortlistedCount=0;
              let clientViewedCount=0
              //  Calculate last week date range
                const now = new Date();
                const lastWeek = new Date();
                lastWeek.setDate(now.getDate() - 7);

                (data.proposals || []).forEach((eachItem) => {
                // Client response count
                if (eachItem.status?.toLowerCase() !== "pending") {
                    countClientResponse++;
                }

                // Accepted proposals
                if (eachItem.status?.toLowerCase() === "accepted") {
                    acceptedCount++;
                    totalValue += eachItem.proposedBudget || 0;
                }
               //Shortliseted proposal
                if(eachItem.status?.toLowerCase()==="shortlisted"){
                    shortlistedCount++
                }

                //viewed proposal

                if(eachItem.clientViewed){
                    clientViewedCount++;
                }

                //  Last week submissions
                const createdDate = new Date(eachItem.createdAt);
                if (createdDate >= lastWeek && createdDate <= now) {
                    lastWeekSubmissionCount++;
                }
                });

             
             const totalSubmissions = submissionCount || 0;

                const clientResponsePercentage =
                totalSubmissions > 0
                    ? Math.round((countClientResponse / totalSubmissions) * 100)
                    : 0;

                const acceptedPercentage =
                totalSubmissions > 0
                    ? Math.round((acceptedCount / totalSubmissions) * 100)
                    : 0;

                const shortlistedPercentage=totalSubmissions>0?Math.round((shortlistedCount / totalSubmissions) * 100):0;
                const clientViewedPercentage=totalSubmissions>0?Math.round((clientViewedCount / totalSubmissions) * 100):0;

             setStats({
                submissions:submissionCount,
                lastWeekSubmissions:lastWeekSubmissionCount,
                clientResponse:countClientResponse,
                clientResponsePercentage:clientResponsePercentage,
                accepted:acceptedCount,
                acceptedPercentage:acceptedPercentage,
                totalValue:totalValue,
                shortlisted:shortlistedCount,
                shortlistedPercentage:shortlistedPercentage,
                clientViewed:clientViewedCount,
                clientViewedPercentage:clientViewedPercentage,
             })
             console.log("Total submissions:", submissionCount);
            console.log("Client responses:", countClientResponse);
            console.log("Accepted count:", acceptedCount);
            console.log("Total accepted value:", totalValue);
            console.log("Last week submissions:", lastWeekSubmissionCount);
             setProposals(data.proposals)
           }

        }catch(error){
            console.log("Failed to fetch the data::",error);
            setFailed(true)
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        loadData()
    },[])

    if(loading){
        return(
             <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }
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
            <div className="text-2xl font-bold">{stats.submissions}</div>
            <p className="text-xs text-muted-foreground">+{stats.lastWeekSubmissions} from last week</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Client Responses</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{stats.clientResponse}</div>
            <p className="text-xs text-muted-foreground">{stats.clientResponsePercentage}% response rate</p>
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
            <div className="text-2xl font-bold">{stats.accepted}</div>
            <p className="text-xs text-muted-foreground">{stats.acceptedPercentage}% acceptance rate</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue>1000?`${(stats.totalValue/1000).toFixed(0)}k`:stats.totalValue}</div>
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
                <span className="text-muted-foreground">{stats.submissions}(100%)</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "100%" }} />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                <span className="font-medium">Client Viewed</span>
                <span className="text-muted-foreground">{stats.clientViewed} {`(${stats.clientViewedPercentage}%)`}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${stats.clientViewedPercentage}%` }} />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                <span className="font-medium">Client Responded</span>
                <span className="text-muted-foreground">{stats.clientResponse} {`(${stats.clientResponsePercentage}%)`}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: `${stats.clientResponsePercentage}%` }} />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                <span className="font-medium">Accepted</span>
                <span className="text-muted-foreground">{stats.accepted} {`(${stats.acceptedPercentage}%)`}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-violet-500" style={{ width: `${stats.acceptedPercentage}%` }} />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                <span className="font-medium">Shortlisted</span>
                <span className="text-muted-foreground">{stats.shortlisted} {`(${stats.shortlistedPercentage}%)`}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-pink-500" style={{ width: `${stats.shortlistedPercentage}%` }} />
                </div>
            </div>

            {/* <div className="space-y-2">
                <div className="flex justify-between text-sm">
                <span className="font-medium">Accepted</span>
                <span className="text-muted-foreground">5 (33%)</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "33%" }} />
                </div>
            </div> */}
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
            {
                (proposals.length!==0 && !loading && !failed)?
                <div>
                 {
                    (proposals || []).map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-md transition-shadow mb-4">
                <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{proposal.requirement.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                        {proposal.client.name} • {proposal.client.companyName}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />${proposal.proposedBudget.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {proposal.proposedTimeline}
                        </div>
                        <div>Submitted {new Date(proposal.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        {proposal.clientViewed && (
                        <div className="flex items-center gap-1 text-blue-600">
                            <Eye className="h-4 w-4" />
                            <span>Viewed by client</span>
                        </div>
                        )}
                        {proposal.clientResponded && (
                        <div className="flex items-center gap-1 text-green-600">
                            <MessageSquare className="h-4 w-4" />
                            <span>Client responded</span>
                        </div>
                        )}
                        {proposal.conversationStarted && (
                        <div className="flex items-center gap-1 text-purple-600">
                            <Users className="h-4 w-4" />
                            <span>Active conversation</span>
                        </div>
                        )}
                    </div>

                    {/* {proposal.hasResponse && proposal.lastMessage && (
                        <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                            Last message ({new Date(proposal.responseDate!).toLocaleDateString()}):
                        </p>
                        <p className="text-sm">{proposal.lastMessage}</p>
                        </div>
                    )} */}
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
                    <Badge variant="outline">{proposal.requirement.category}</Badge>
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
            ))
                 }
                </div>
                :
                <div>
                    <p className="text-center text-[#000] text-2xl mt-5">No Proposals yet</p>
                </div>
            }

        </CardContent>
        </Card>
    </div>
    )
}
export default ProposalsPage;