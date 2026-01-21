"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

import { mockProviderProjects, mockProviderReviews } from "@/lib/mock-data"
import type { Project, Review } from "@/lib/types"

const AnalyticsPage = () => {
  const [projects] = useState<Project[]>(mockProviderProjects)
  const [reviews] = useState<Review[]>(mockProviderReviews)

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
    averageRating:
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0,
  }

  const searchQueries = [
    { keyword: "Web Development", count: 234, trend: "up" },
    { keyword: "E-commerce Solutions", count: 189, trend: "up" },
    { keyword: "Mobile App Development", count: 156, trend: "stable" },
    { keyword: "UI/UX Design", count: 142, trend: "down" },
    { keyword: "Digital Marketing", count: 98, trend: "down" },
  ]

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="h-10">
        <h1 className="text-2xl font-bold text-orangeButton my-custom-class">
          Performance Analytics
        </h1>
        <p className="text-gray-500">
          Detailed insights into your agency&apos;s performance
        </p>
      </div>

      {/* Search Queries */}
      <Card className="rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-xl h-6">Search Queries & Discovery</CardTitle>
          <CardDescription className="text-gray-500">
            Keywords and categories where clients are finding you
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {searchQueries.map((query, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border shadow rounded-xl"
            >
              <div className="flex items-center gap-4 h-2">
                <div className="text-2xl font-bold text-muted-foreground">
                  #{index + 1}
                </div>
                <div>
                  <p className="font-bold">{query.keyword}</p>
                  <p className="text-sm text-gray-500">
                    {query.count} searches
                  </p>
                </div>
              </div>

              <Badge
                className={`
                    px-4 py-2 text-sm font-medium rounded-lg text-white
                    ${
                    query.trend === "up"
                        ? "bg-green-500"
                        : query.trend === "stable"
                        ? "bg-blue-500"
                        : "bg-orangeButton"
                    }
                `}
                >
                {query.trend === "up" && "↑ UP"}
                {query.trend === "stable" && "→ Stable"}
                {query.trend === "down" && "↓ DOWN"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Proposal Funnel */}
      <Card className="rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-xl h-6">Proposal Conversion Funnel</CardTitle>
          <CardDescription className="text-gray-500">
            Track your proposal journey from submission to project win
          </CardDescription>
        </CardHeader>

       <CardContent className="space-y-6">
        {/* Submissions */}
        <div className="flex items-center gap-6 p-4 border shadow rounded-xl">
            <div className="w-30 font-semibold text-lg">Submissions</div>
            <div className="flex-1">
            <div className="w-full bg-muted rounded-full h-10">
                <div className="h-7 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                {analyticsData.proposalSubmissions} Proposals
                </div>
            </div>
            </div>
        </div>

        {/* Responses */}
        <div className="flex items-center gap-6 p-4 shadow border rounded-xl">
            <div className="w-30 font-semibold text-lg">Responses</div>
            <div className="flex-1">
            <div className="w-full bg-muted rounded-full h-10">
                <div
                className="h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold"
                style={{
                    width: `${
                    (analyticsData.proposalResponses /
                        analyticsData.proposalSubmissions) *
                    100
                    }%`,
                }}
                >
                {analyticsData.proposalResponses} responses
                </div>
            </div>
            </div>
        </div>

        {/* Won Projects */}
        <div className="flex items-center gap-6 p-4 border shadow rounded-xl">
            <div className="w-30 font-semibold text-lg">Won Projects</div>
            <div className="flex-1">
            <div className="w-full bg-muted rounded-full h-10">
                <div
                className="h-7 rounded-full bg-teal-400 flex items-center justify-center 
                            text-white font-semibold whitespace-nowrap px-4"
                style={{
                    width: `${(stats.activeProjects / analyticsData.proposalSubmissions) * 100}%`,
                    minWidth: "140px",
                }}
                >
                {stats.activeProjects} Projects
                </div>

            </div>
            </div>
        </div>
        </CardContent>

      </Card>

      {/* Premium Plan */}
      <Card className="rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-xl h-6">Premium Plan Performance</CardTitle>
          <CardDescription className="text-gray-500">
            Impact of your premium visibility package
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border shadow rounded-2xl text-center">
              <p className="text-4xl h-6 font-bold text-green-600">
                +{analyticsData.premiumImpact}
              </p>
              <p className="text-sm font-bold mt-2">
                Visibility Increase
              </p>
            </div>

            <div className="p-6 border shadow rounded-2xl text-center">
              <p className="text-4xl h-6 font-bold text-blue-600">2.3x</p>
              <p className="text-sm font-bold mt-2">
                More Profile Views
              </p>
            </div>

            <div className="p-6 border rounded-2xl text-center">
              <p className="text-4xl h-6 font-bold text-purple-600">1.8x</p>
              <p className="text-sm font-bold mt-2">
                Higher Conversion
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsPage
