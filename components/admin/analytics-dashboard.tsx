"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, FileText, MessageSquare, DollarSign, TrendingUp, Star, Building2, CreditCard } from "lucide-react"
import type { AdminStats, SubscriptionStats, Provider } from "@/lib/types"

interface AnalyticsDashboardProps {
  stats: AdminStats
  subscriptionStats: SubscriptionStats
  topProviders: Provider[]
}

export function AnalyticsDashboard({ stats, subscriptionStats, topProviders }: AnalyticsDashboardProps) {
  const subscriptionTotal = subscriptionStats.basic + subscriptionStats.standard + subscriptionStats.premium

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{stats.monthlyGrowth}%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ${subscriptionStats.monthlyRecurring.toLocaleString()}/month recurring
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">{stats.totalProposals} total proposals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requirements</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRequirements}</div>
            <p className="text-xs text-muted-foreground">Active project requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of user types on the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clients</span>
                <span>
                  {stats.totalSeekers} ({Math.round((stats.totalSeekers / stats.totalUsers) * 100)}%)
                </span>
              </div>
              <Progress value={(stats.totalSeekers / stats.totalUsers) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Agencies</span>
                <span>
                  {stats.totalProviders} ({Math.round((stats.totalProviders / stats.totalUsers) * 100)}%)
                </span>
              </div>
              <Progress value={(stats.totalProviders / stats.totalUsers) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Subscription Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Revenue breakdown by subscription tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Basic Plan</span>
                <span>
                  {subscriptionStats.basic} ({Math.round((subscriptionStats.basic / subscriptionTotal) * 100)}%)
                </span>
              </div>
              <Progress value={(subscriptionStats.basic / subscriptionTotal) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Standard Plan</span>
                <span>
                  {subscriptionStats.standard} ({Math.round((subscriptionStats.standard / subscriptionTotal) * 100)}%)
                </span>
              </div>
              <Progress value={(subscriptionStats.standard / subscriptionTotal) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Premium Plan</span>
                <span>
                  {subscriptionStats.premium} ({Math.round((subscriptionStats.premium / subscriptionTotal) * 100)}%)
                </span>
              </div>
              <Progress value={(subscriptionStats.premium / subscriptionTotal) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Agencies</CardTitle>
          <CardDescription>Highest rated and most active agencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProviders.map((provider, index) => (
              <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{provider.companyName}</div>
                    <div className="text-sm text-muted-foreground">{provider.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-sm text-muted-foreground">({provider.reviewCount})</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{provider.services.length} services</div>
                  </div>

                  <div className="flex gap-2">
                    {provider.verified && <Badge variant="secondary">Verified</Badge>}
                    {provider.featured && <Badge>Featured</Badge>}
                    <Badge variant="outline">{provider.subscriptionTier}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${subscriptionStats.monthlyRecurring.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From {subscriptionTotal} active subscriptions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Revenue Per User</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(subscriptionStats.totalRevenue / subscriptionTotal)}</div>
            <p className="text-xs text-muted-foreground">Per paying user</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">Month over month growth</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
