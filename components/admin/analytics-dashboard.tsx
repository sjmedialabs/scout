"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { AdminStats, SubscriptionStats, Provider } from "@/lib/types"
import { Star } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "../ui/button"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

interface AnalyticsDashboardProps {
  stats: AdminStats
  subscriptionStats: SubscriptionStats[]
  topProviders: Provider[]
  revenueData: any[]
  lifetimeRevenue: number
}
   
  export function AnalyticsDashboard({
  stats,
  subscriptionStats,
  topProviders,
  revenueData,
  lifetimeRevenue
}: AnalyticsDashboardProps) {
  console.log("Recived props subscription stats", subscriptionStats)
  // const subscriptionTotal = subscriptionStats.basic + subscriptionStats.standard + subscriptionStats.premium
  // const getSubscriptionName=(recivedId:string)=>{
  //     let name="Free Trailer"
  //     console.log("Recived id", recivedId)
  //      subscriptionStats.map((ecahItem)=>{
  //       if(ecahItem.planId===recivedId){
  //         name=ecahItem.planName
  //       }
  //      })
  //     return name;
  // }

  const getSubscriptionName = (receivedId: string) => {
  const plan = subscriptionStats.find(
    (item) => item.planId === receivedId
  );

  return plan ? plan.planName : "Free Trial";
};

  const COLORS = ["#3B82F6", "#1E40AF"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* User Distribution */}
        <Card className="rounded-2xl shadow-md pt-3 bg-white  hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-md -mb-4 font-bold ">User Distribution</CardTitle>
            {/* <CardDescription className="text-gray-500 text-sm">Breakdown of user types on the platform</CardDescription> */}
          </CardHeader>

          <CardContent className=" flex flex-col items-center justify-center">
            {stats.clientsCount === 0 && stats.agenciesCount === 0 ? (
              <div className="flex items-center justify-center h-[160px] text-gray-400 text-sm">
                No Data
              </div>
            ) : (
            <div className="w-40 h-40 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Clients", value: stats.clientsCount },
                      { name: "Agencies", value: stats.agenciesCount },
                    ]}
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={index} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            )}

            <div className="flex text-xs gap-5 ">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Clients {stats.clientsCount} ({stats.clientsCountPercentage}%)
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-900 rounded-full"></div>
                Agencies {stats.agenciesCount} ({stats.agenciesCountPercentage}%)
              </div>
            </div>
          </CardContent>
          {/* <CardContent className="space-y-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Clients</span>
                <span className="text-gray-500">
                  {stats.clientsCount} ({stats.clientsCountPercentage}%)
                </span>
              </div>
              <Progress value={stats.clientsCountPercentage} className="h-2 bg-blueBackground" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Agencies</span>
                <span className="text-gray-500">
                  {stats.agenciesCount} ({stats.agenciesCountPercentage}%)
                </span>
              </div>
              <Progress value={stats.agenciesCountPercentage} className="h-2" />
            </div>
          </CardContent> */}
        </Card>


        {/* Revenue Overview */}
        <Card className="rounded-2xl shadow-md pt-3 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
  <CardHeader>
    <CardTitle className="text-md font-bold ">
      Revenue Overview
    </CardTitle>
  </CardHeader>

  <CardContent>
    <div className="flex items-center justify-between -mt-2">
      <div className="text-2xl font-bold">
        ${lifetimeRevenue.toLocaleString()}
      </div>

      <div
        className={`text-sm font-semibold flex items-center gap-1 ${
          stats.lifetimeGrowth >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {stats.lifetimeGrowth >= 0 ? "▲" : "▼"}{" "}
        {Math.abs(stats.lifetimeGrowth)}%
      </div>
    </div>

    <div className="h-35 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={revenueData}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            padding={{ left: 10, right: 10 }}
            tick={{ fontSize: 10 }}
            interval={0}
          />

          <YAxis hide domain={["dataMin", "dataMax"]} />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#16a34a"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

        {/* Subscription Stats */}
        <Card className="rounded-2xl pt-3 shadow-md bg-white  hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-md -mb-2 font-bold ">Subscription Breakdown</CardTitle>
            {/* <CardDescription className="text-gray-500 text-sm">Revenue breakdown by subscription tier</CardDescription> */}
          </CardHeader>

          <CardContent className="space-y-4">
            {(subscriptionStats || []).map((eachItem) => (
              <div key={eachItem.planId} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{eachItem.planName}</span>
                  <span className="text-gray-500">
                    {eachItem.count} ({eachItem.percentage}%)
                  </span>
                </div>

                <Progress value={eachItem.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
          {/* <CardContent className="-space-y-4 grid grid-cols-2 gap-6">
            {
              (subscriptionStats || []).map((eachItem)=>(
                <div className="space-y-2" key={eachItem._id}>
              <div className="flex justify-between text-sm">
                <span>{eachItem.planName}</span>
                <span className="text-gray-500">
                  {eachItem.count} ({eachItem.percentage}%)
                </span>
              </div>
              <Progress value={eachItem.percentage} className="h-2" />
            </div>
              ))
            } */}

            {/* <div className="space-y-2">
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
            </div> */}
          {/* </CardContent> */}
        </Card>
      </div>


       {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4"> */}
      {/* <Card className="rounded-2xl shadow-md bg-white">
  <CardHeader>
    <CardTitle className="text-xl font-bold text-orangeButton">
      Recent Activity
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-4 text-sm">
    <div>
      <div className="font-medium">New Agency Registered</div>
      <div className="text-gray-500">Dell Software's - 2 mins ago</div>
    </div>

    <div>
      <div className="font-medium">Client Approved</div>
      <div className="text-gray-500">ABC Company - 1 hour ago</div>
    </div>

    <div>
      <div className="font-medium">New Project Posted</div>
      <div className="text-gray-500">43 requirements - 3 hours ago</div>
    </div>
  </CardContent>
</Card> */}
     
      {/* Top Providers */}
      <Card className="bg-white rounded-2xl pt-3">
        <CardHeader className="-mb-4 flex items-center justify-between">
          <CardTitle className="text-md font-bold -mb-2 ">
            Top Performing Agencies
            </CardTitle>
            
            <Link
              href="/admin/subscribers/all-subscribers"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View All
            </Link>
          {/* <CardDescription className="text-gray-500 text-sm">
            Highest rated and most active agencies
            </CardDescription> */}
        </CardHeader>
        <CardContent>

          {/* Header */}
<div className="grid grid-cols-4 text-sm font-semibold text-gray-500 border-b pb-2 mb-2">
  <div>Agency</div>
  <div className="text-center">Services</div>
  <div className="text-center">Rating</div>
  <div className="text-right">Revenue</div>
</div>

{topProviders.map((provider, index) => (
  <div
    key={provider._id || provider.id}
    className="grid grid-cols-4 items-center py-3 border-b"
  >

    {/* Agency */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
        {provider.name?.charAt(0)}
      </div>

      <div>
        <div className="font-semibold">{provider.name}</div>
        <div className="text-xs text-gray-500">{provider.location}</div>
      </div>
    </div>

    {/* Services */}
    <div className="text-center">
      {provider.services?.length || 0}
    </div>

    {/* Rating */}
    <div className="flex items-center justify-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.round(provider.rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1">{provider.rating?.toFixed(1)}</span>
    </div>

    {/* Revenue */}
    <div className="text-right font-semibold">
      ${(provider.revenue || 0).toLocaleString()}
    </div>

  </div>
))}
          {/* <div className="space-y-1">
            {topProviders.map((provider, index) => (
              <div 
              key={provider._id || provider.id} 
              className="grid grid-cols-4 items-center justify-between p-4 border rounded-2xl shadow-sm">
                <div className="flex items-center gap-4 w-50">
                  <div className="w-6 h-6 text-xs bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-orangeButton">{provider.name}</div>
                    <div className="text-sm text-gray-500">{provider.location}</div>
                  </div>
                </div>
                  <div >
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
                    <div className="text-sm font-semibold text-green-600">
                      ${provider.revenue?.toLocaleString() || 0}
                    </div>
                  </div>
                <div className="flex">
                  <div className="flex gap-2 ">
                    {provider.isVerified && <Badge className="rounded-full bg-[#1C96F4]">Verified</Badge>}
                    {/* {provider.isFeatured && <Badge className="bg-[#39A935] rounded-lg">Featured</Badge>} */}
                    {/* {provider?.subscriptionDetails.subscriptionPlanId?<Badge className="bg-[#EA7E1F] rounded-full">{getSubscriptionName(provider?.subscriptionDetails.subscriptionPlanId)}</Badge>:<Badge className="bg-[#EA7E1F] rounded-full">Free Trail</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </CardContent>
      </Card>
      </div>
    // </div>
  )
}
