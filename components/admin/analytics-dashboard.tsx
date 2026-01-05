"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { AdminStats, SubscriptionStats, Provider } from "@/lib/types"
import { Star } from "lucide-react"

interface AnalyticsDashboardProps {
  stats: AdminStats
  subscriptionStats: SubscriptionStats
  topProviders: Provider[]
}

export function AnalyticsDashboard({ stats, subscriptionStats, topProviders }: AnalyticsDashboardProps) {
  const subscriptionTotal = subscriptionStats.basic + subscriptionStats.standard + subscriptionStats.premium

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold text-orangeButton">User Distribution</CardTitle>
            <CardDescription className="text-gray-500 text-base">Breakdown of user types on the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clients</span>
                <span>
                  {stats.totalSeekers} ({Math.round((stats.totalSeekers / stats.totalUsers) * 100)}%)
                </span>
              </div>
              <Progress value={(stats.totalSeekers / stats.totalUsers) * 100} className="h-2 bg-blueBackground" />
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
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-extrabold text-orangeButton">Subscription Distribution</CardTitle>
            <CardDescription className="text-gray-500 text-base">Revenue breakdown by subscription tier</CardDescription>
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
          <CardTitle className="text-2xl font-extrabold text-orangeButton">Top Performing Agencies</CardTitle>
          <CardDescription className="text-gray-500 text-base">Highest rated and most active agencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {topProviders.map((provider, index) => (
              <div key={provider.id} className="flex items-center justify-between p-4 border rounded-2xl shadow-md">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 text-xs bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-orangeButton">{provider.companyName}</div>
                    <div className="text-sm text-gray-500">{provider.location}</div>
                  </div>
                </div>
                                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(provider.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                            }`}
                        />
                      ))}

                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({provider.reviewCount})
                      </span>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {provider.services.length} services
                    </div>
                  </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {provider.verified && <Badge className="rounded-lg bg-[#1C96F4]">Verified</Badge>}
                    {provider.featured && <Badge className="bg-[#39A935] rounded-lg">Featured</Badge>}
                    <Badge className="bg-[#EA7E1F] rounded-lg">{provider.subscriptionTier}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
