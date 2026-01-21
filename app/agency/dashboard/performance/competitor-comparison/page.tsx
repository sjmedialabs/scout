"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Star } from "lucide-react"

const CompetitorComparisonPage = () => {
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
      total: 55,
    },
    conversionFunnel: {
      views: 1247,
      contacts: 89,
      proposals: 25,
      won: 10,
    },
    reviewsAdded: 3,
    ratingsDistribution: {
      5: 57,
      4: 102,
      3: 86,
      2: 32,
      1: 27,
    },
  }

  const totalRatings = Object.values(
    monthlyReport.ratingsDistribution,
  ).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl h-8 font-bold text-orangeButton my-custom-class">
          Monthly Performance Report
        </h1>
        <p className="text-gray-500">
          Comprehensive overview of your agency&apos;s monthly performance
        </p>
      </div>

      {/* Profile Performance */}
      <Card className="rounded-3xl bg-white">
        <CardHeader>
          <CardTitle className="h-2">Profile Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">
                Profile Impressions
              </p>
              <p className="text-2xl font-bold">
                {monthlyReport.profileImpressions}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                Profile Views
              </p>
              <p className="text-2xl font-bold">
                {monthlyReport.profileViews}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                View Rate
              </p>
              <p className="text-2xl font-bold">
                {(
                  (monthlyReport.profileViews /
                    monthlyReport.profileImpressions) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Ranking Trend */}
      <Card className="rounded-3xl bg-white">
        <CardHeader>
          <CardTitle className="h-2">Category Ranking Trend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Web Development */}
          <div className="flex items-center py-2 justify-between p-4 border rounded-2xl">
            <div>
              <p className="text-sm font-bold">
                Web Development
              </p>
              <p className="text-2xl font-bold">
                Rank #{monthlyReport.categoryRanking.current}
              </p>
            </div>
            <div className="text-right">
              <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                ↑{" "}
                {monthlyReport.categoryRanking.previous -
                  monthlyReport.categoryRanking.current}{" "}
                positions
              </span>
              <p className="text-xs text-center text-gray-500 mt-1">
                Previous: #{monthlyReport.categoryRanking.previous}
              </p>
            </div>
          </div>

          {/* Digital Marketing (static like screenshot) */}
          <div className="flex items-center py-2 justify-between p-4 border rounded-2xl">
            <div>
              <p className="text-sm font-bold">
                Digital Marketing
              </p>
              <p className="text-2xl font-bold">Rank #10</p>
            </div>
            <div className="text-right">
              <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                ↑ 3 positions
              </span>
              <p className="text-xs text-center text-gray-500 mt-1">
                Previous: #12
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Generated */}
      <Card className="rounded-3xl bg-white">
        <CardHeader>
          <CardTitle className="h-1">Leads Generated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-2 h-16 border rounded-2xl text-center">
              <p className="text-2xl font-bold h-6">
                {monthlyReport.leadsGenerated.inquiries}
              </p>
              <p className="text-sm text-gray-500">
                Inquiries
              </p>
            </div>
            <div className="p-2 h-16 border rounded-2xl text-center">
              <p className="text-2xl font-bold h-6">
                {monthlyReport.leadsGenerated.proposals}
              </p>
              <p className="text-sm text-muted-foreground">
                Proposals
              </p>
            </div>
            <div className="p-2 h-16 border rounded-2xl text-center">
              <p className="text-2xl font-bold h-6">
                {monthlyReport.leadsGenerated.total}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Leads
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card className="rounded-3xl bg-white">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription className="text-gray-500 h-4">
            View → Contact → Proposal → Won
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
        {[
            {
            label: "Views",
            value: monthlyReport.conversionFunnel.views,
            percent: 100,
            color: "bg-green-600",
            showValue: true,
            },
            {
            label: "Contacts",
            value: monthlyReport.conversionFunnel.contacts,
            percent:
                (monthlyReport.conversionFunnel.contacts /
                monthlyReport.conversionFunnel.views) *
                100,
            color: "bg-blue-500",
            showValue: true,
            },
            {
            label: "Proposals",
            value: monthlyReport.conversionFunnel.proposals,
            percent:
                (monthlyReport.conversionFunnel.proposals /
                monthlyReport.conversionFunnel.views) *
                100,
            color: "bg-teal-400",
            showValue: true,
            },
            {
            label: "Won",
            value: monthlyReport.conversionFunnel.won,
            percent:
                (monthlyReport.conversionFunnel.won /
                monthlyReport.conversionFunnel.views) *
                100,
            color: "bg-purple-500",
            showValue: true,
            },
        ].map((item) => (
            <div
            key={item.label}
            className="flex items-center gap-6 p-4 border rounded-2xl"
            >
            {/* Label */}
            <div className="w-20 font-semibold">
                {item.label}
            </div>

            {/* Bar */}
            <div className="flex-1">
                <div className="w-full bg-muted h-4 rounded-full">
                <div
                className={`${item.color} h-4 rounded-full flex items-center justify-center 
                            text-white text-[10px] font-medium px-3 whitespace-nowrap`}
                style={{
                    width: `${item.percent}%`,
                    minWidth: "56px",
                }}
                >
                {item.value}
                </div>

                </div>
            </div>

            {/* Percentage */}
            <div className="w-16 text-right font-semibold">
                {item.percent.toFixed(1)}%
            </div>
            </div>
        ))}
        </CardContent>

      </Card>

      {/* Reviews & Ratings */}
      <Card className="rounded-3xl bg-white">
        <CardHeader>
          <CardTitle className="h-2">
            Reviews Added & Ratings Distribution
          </CardTitle>    
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 items-start">
            <div className="border rounded-2xl 
                px-6 py-4 
                max-w-xs 
                h-40
                flex flex-col items-center justify-center
                text-center">
              <p className="text-4xl font-bold mb-2">
                {monthlyReport.reviewsAdded}
              </p>
              <p className="text-sm text-gray-500 leading-tight">
                New Reviews This Month
              </p>
            </div>

            

            <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
                const value =
                monthlyReport.ratingsDistribution[
                    rating as keyof typeof monthlyReport.ratingsDistribution
                ]

                const percent = (value / totalRatings) * 100

                return (
                <div
                    key={rating}
                    className="grid grid-cols-[36px_1fr_30px] items-center gap-4"
                >
                    {/* Rating */}
                    <div className="flex items-center gap-1 text-[#f5a30c] font-medium">
                    <span>{rating}</span>
                    <Star className="h-4 w-4 fill-[#f5a30c] text-[#f5a30c]" />
                    </div>

                    {/* Bar */}
                    <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div
                        className="h-3 bg-[#f9c666] rounded-full"
                        style={{ width: `${percent}%` }}
                    />
                    </div>

                    {/* Count */}
                    <div className="text-right text-sm text-muted-foreground">
                    {value}
                    </div>
                </div>
                
                )
            })}
            </div>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CompetitorComparisonPage