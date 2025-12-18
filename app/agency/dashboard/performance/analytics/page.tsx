"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { mockNotifications, mockProviderProjects, mockProviderReviews, mockRequirements } from "@/lib/mock-data"
import type { Provider, Requirement, Notification, Project, Review } from "@/lib/types"
import { useState } from "react"

const AnalyticsPage=()=>{
    const [projects] = useState<Project[]>(mockProviderProjects)
    const [reviews, setReviews] = useState<Review[]>(mockProviderReviews)
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
    const stats = {
    totalProposals: 15,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: 12,
    averageRating: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0,
  }
  
  const searchQueries = [
    { keyword: "Web Development", count: 234, trend: "up" },
    { keyword: "E-commerce Solutions", count: 189, trend: "up" },
    { keyword: "Mobile App Development", count: 156, trend: "stable" },
    { keyword: "UI/UX Design", count: 142, trend: "up" },
    { keyword: "Digital Marketing", count: 98, trend: "down" },
  ]
    return(
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
    )
}
export default AnalyticsPage;