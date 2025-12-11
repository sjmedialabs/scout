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

const CompetitorComparisonPage=()=>{
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
    return(
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
    )
}
export default CompetitorComparisonPage;