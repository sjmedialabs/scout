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

const LeadGenerationPage=()=>{
    return(
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
    )
}
export default LeadGenerationPage;