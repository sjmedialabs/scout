"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts"
import { Download, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import clsx from "clsx"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/* ---------------- Tabs ---------------- */
const TABS = ["Overview", "Revenue", "Users", "Services"] as const
type Tab = (typeof TABS)[number]

/* ---------------- Data ---------------- */
const revenueData = [
  { month: "Jan", revenue: 50000 },
  { month: "Feb", revenue: 65000 },
  { month: "Mar", revenue: 30000 },
  { month: "Apr", revenue: 55000 },
  { month: "May", revenue: 62000 },
  { month: "Jun", revenue: 48000 },
  { month: "Jul", revenue: 35000 },
  { month: "Aug", revenue: 52000 },
  { month: "Sep", revenue: 68000 },
  { month: "Oct", revenue: 72000 },
  { month: "Nov", revenue: 65000 },
  { month: "Dec", revenue: 82000 },
]
const revenueTrendData = [
  { month: "Jan", revenue: 52000 },
  { month: "Feb", revenue: 68000 },
  { month: "Mar", revenue: 30000 },
  { month: "Apr", revenue: 56000 },
  { month: "May", revenue: 64000 },
  { month: "Jun", revenue: 58000 },
  { month: "Jul", revenue: 46000 },
  { month: "Aug", revenue: 62000 },
  { month: "Sep", revenue: 71000 },
  { month: "Oct", revenue: 74000 },
  { month: "Nov", revenue: 70000 },
  { month: "Dec", revenue: 82000 },
]

const userGrowthData = [
  { month: "Jan", users: 2000 },
  { month: "Feb", users: 2600 },
  { month: "Mar", users: 1000 },
  { month: "Apr", users: 1700 },
  { month: "May", users: 2100 },
  { month: "Jun", users: 1800 },
  { month: "Jul", users: 1200 },
  { month: "Aug", users: 2000 },
  { month: "Sep", users: 2600 },
  { month: "Oct", users: 2800 },
  { month: "Nov", users: 2500 },
  { month: "Dec", users: 3400 },
]
function UsersKPIs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard title="Total Users" value="15,234" subtitle="+1200 this month" />
      <KPICard title="User Retention Rate" value="87.3%" subtitle="+2% last month" />
      <KPICard title="New User Signups" value="1,456" subtitle="+150 this month" />
      <KPICard title="Active Sessions" value="3,421" subtitle="Currently Active" />
    </div>
  )
}
function RevenueKPIs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Revenue"
        value="$45,231.89"
        subtitle="+20.1% from last month"
      />
      <KPICard
        title="Active Users"
        value="234"
        subtitle="+12.5% from last month"
      />
      <KPICard
        title="Services Completed"
        value="03"
        subtitle="+9.3% from last month"
      />
      <KPICard
        title="Avg. Response Time"
        value="$23,700"
        subtitle="-15.8% improvement"
      />
    </div>
  )
}

function KPICard({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs text-green-500 mt-1">{subtitle}</p>
    </div>
  )
}
function RevenueTrendChart() {
  return (
    <ChartContainer
      className="h-72 w-full"
      config={{ revenue: { label: "Revenue" } }}
    >
      <BarChart data={revenueTrendData}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="-13.56%" stopColor="#FD749B" />
            <stop offset="158.3%" stopColor="#281AC8" />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="month"
          axisLine
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
        />

        <YAxis
          axisLine
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
        />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey="revenue"
          fill="url(#revenueGradient)"
          radius={[8, 8, 0, 0]}
          barSize={8}
        />
      </BarChart>
    </ChartContainer>
  )
}

function RevenueSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        title="Monthly Recurring Revenue"
        value="$15,600"
        subtitle="From 423 active subscriptions"
        icon="/images/admin-monthlyRevenue.png"
      />
      <SummaryCard
        title="Average Revenue Per User"
        value="$69"
        subtitle="Per paying user"
        icon="/images/admin-user.png"
      />
      <SummaryCard
        title="Platform Growth"
        value="+12.5%"
        subtitle="Month over month growth"
        icon="/images/admin-monthlyRevenue.png"
      />
    </div>
  )
}
function SummaryCard({
  title,
  value,
  subtitle,
  icon
}: {
  title: string
  value: string
  subtitle: string
  icon: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex flex-row justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="rounded-full bg-[#EEF7FE] p-2"><img src={icon} alt="" className="h-4" /></div>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs text-orange-500 mt-1">{subtitle}</p>
    </div>
  )
}
const servicesKpis = {
  totalServices: 1234,
  completionRate: "97.6%",
  avgRating: "4.8 / 5.0",
}

const agencyPerformanceData = [
  { agency: "Conceptual Canvas", value: 8000 },
  { agency: "Innovate Intuition", value: 15000 },
  { agency: "IdeaFlux Agency", value: 12000 },
  { agency: "ThinkTank Thrive", value: 15000 },
  { agency: "BlueSky Brandworks", value: 18000 },
]

const topServices = [
  {
    id: 1,
    name: "Website sketching",
    category: "Design",
    orders: 150,
    revenue: "$12,875",
    rating: 4.8,
  },
  {
    id: 2,
    name: "UX/UI design (frontend)",
    category: "Design",
    orders: 22,
    revenue: "$15,879",
    rating: 4.3,
  },
  {
    id: 3,
    name: "Website development",
    category: "Development",
    orders: 78,
    revenue: "$11,589",
    rating: 4.8,
  },
  {
    id: 4,
    name: "eCommerce solutions",
    category: "Development",
    orders: 548,
    revenue: "$31,789",
    rating: 4.0,
  },
  {
    id: 5,
    name: "Website copywriting",
    category: "Content",
    orders: 751,
    revenue: "$9,789",
    rating: 3.9,
  },
  {
    id: 6,
    name: "Website copywriting",
    category: "Content",
    orders: 751,
    revenue: "$9,789",
    rating: 3.9,
  },
]
function ServicesKPIs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KpiCard
        title="Total Services"
        value="1,234"
        subtitle="Across all categories"
      />
      <KpiCard
        title="Completion Rate"
        value="97.6%"
        subtitle="+21% last month"
        positive
      />
      <KpiCard
        title="Avg Rating"
        value="4.8 / 5.0"
        subtitle="From 9875 users"
      />
    </div>
  )
}

function KpiCard({
  title,
  value,
  subtitle,
  positive,
}: {
  title: string
  value: string
  subtitle: string
  positive?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p
        className={`text-xs mt-1 ${positive ? "text-green-500" : "text-gray-400"
          }`}
      >
        {subtitle}
      </p>
    </div>
  )
}
function AgencyPerformanceChart() {
  return (
    <ChartContainer
      className="h-64"
      config={{ value: { label: "Performance" } }}
    >
      <BarChart data={agencyPerformanceData}>
        <defs>
          <linearGradient id="serviceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="-13.56%" stopColor="#FD749B" />
            <stop offset="158.3%" stopColor="#281AC8" />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="agency"
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey="value"
          fill="url(#serviceGradient)"
          radius={[8, 8, 0, 0]}
          barSize={8}
        />
      </BarChart>
    </ChartContainer>
  )
}

function TopServicesTable() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-orange-500">
        Top Services
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Most popular services on the platform
      </p>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500 text-xs">
              <th className="text-left py-2">#</th>
              <th className="text-left">Service Name</th>
              <th>Category</th>
              <th>Orders</th>
              <th>Revenue</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {topServices.slice(0, 6).map((service) => (
              <tr
                key={service.id}
                className="border-b last:border-none text-xs"
              >
                <td className="py-3">{service.id}</td>
                <td>{service.name}</td>
                <td className="text-center">{service.category}</td>
                <td className="text-center">{service.orders}</td>
                <td className="text-center">{service.revenue}</td>
                <td className="text-center flex justify-center py-3 items-center gap-1">
                  {service.rating}
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows.length) return

  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => `"${row[h]}"`).join(",")
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview")
  const handleExport = () => {
    switch (activeTab) {
      case "Revenue":
        exportToCSV("revenue-report.csv", revenueTrendData)
        break

      case "Users":
        exportToCSV("users-report.csv", userGrowthData)
        break

      case "Services":
        exportToCSV(
          "services-report.csv",
          topServices.map((s) => ({
            Service: s.name,
            Category: s.category,
            Orders: s.orders,
            Revenue: s.revenue,
            Rating: s.rating,
          }))
        )
        break

      case "Overview":
      default:
        exportToCSV("overview-report.csv", [
          {
            Metric: "Total Revenue",
            Value: "$45,231.89",
          },
          {
            Metric: "Active Users",
            Value: "234",
          },
          {
            Metric: "Services Completed",
            Value: "03",
          },
          {
            Metric: "Avg Response Time",
            Value: "$23,700",
          },
        ])
        break
    }
  }

  return (
    <div className="space-y-8">
      {/* ---------- Header ---------- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500">
            Comprehensive insights into platform performance
          </p>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleExport}
                className="bg-[#FF0000] hover:bg-red-600 rounded-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </TooltipTrigger>

            <TooltipContent side="bottom">
              <p>Export tab based data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </div>
      {/* Top KPIs */}
      <RevenueKPIs />
      {/* ---------- Tabs ---------- */}
      <div className="bg-gray-100 rounded-full p-1 flex w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-6 py-2 rounded-full text-sm font-medium transition",
              activeTab === tab
                ? "bg-orange-500 text-white shadow"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---------- Tab Content ---------- */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Overview */}
          <ChartCard
            title="Revenue Overview"
            subtitle="Monthly revenue trends for the last 6 months"
          >
            <RevenueChart />
          </ChartCard>

          {/* User Growth */}
          <ChartCard
            title="User Growth"
            subtitle="Active users growth over time"
          >
            <UserGrowthChart />
          </ChartCard>
        </div>
      )}

      {activeTab === "Revenue" && (
        <div className="space-y-8">
          {/* Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-orange-500">
              Revenue Trends
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Detailed revenue analysis over the past 12 months
            </p>
            <RevenueTrendChart />
          </div>
        </div>
      )}

      {activeTab === "Users" && (
        <div className="space-y-8">
          {/* Top KPIs */}
          <UsersKPIs />

          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-orange-500">
              User Growth Analytics
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Track user acquisition and trends report
            </p>
            <UserGrowthChart2 />
          </div>
        </div>
      )}


      {activeTab === "Services" && (
        <div className="space-y-8">
          {/* Top KPIs */}
          <ServicesKPIs />

          {/* Main Content */}
          <div className="flex flex-row gap-6">
            {/* Chart */}
            <div className=" bg-white rounded-2xl p-6 shadow-sm w-full">
              <h3 className="text-lg font-semibold text-orange-500">
                Agency Performance
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Track service usage and performance
              </p>
              <AgencyPerformanceChart />
            </div>
            <div className="w-full">
              {/* Table */}
              <TopServicesTable /></div>
          </div>
        </div>
      )}


      {/* Bottom Metrics */}
      <RevenueSummaryCards />
    </div>
  )
}

/* ---------------- Chart Cards ---------------- */
function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-orange-500">
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
      )}
      {children}
    </div>
  )
}

/* ---------------- Revenue Chart ---------------- */
function RevenueChart() {
  return (
    <ChartContainer
      config={{
        revenue: {
          label: "Revenue",
        },
      }}
      className="h-64"
    >
      <BarChart data={revenueData} barCategoryGap={20}>
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="-13.56%" stopColor="#FD749B" />
            <stop offset="158.3%" stopColor="#281AC8" />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#858585", fontSize: 10, className: "text-gray-300" }}
          axisLine={true}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: "#858585", fontSize: 10, className: "text-gray-300" }}
          axisLine={true}
          tickLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey="revenue"
          fill="url(#revenueGradient)"
          radius={[10, 10, 0, 0]}
          barSize={8}   // 👈 decreases bar width
        />
      </BarChart>
    </ChartContainer>
  )
}


/* ---------------- User Growth Chart ---------------- */
function UserGrowthChart() {
  return (
    <ChartContainer
      config={{
        users: {
          label: "Users",
        },
      }}
      className="h-64"
    >
      <BarChart data={userGrowthData} barCategoryGap={20}>
        <defs>
          <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="-13.56%" stopColor="#FD749B" />
            <stop offset="158.3%" stopColor="#281AC8" />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#858585", fontSize: 10, className: "text-gray-300" }}
          axisLine={true}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: "#858585", fontSize: 10, className: "text-gray-300" }}
          axisLine={true}
          tickLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey="users"
          fill="url(#userGradient)"
          radius={[10, 10, 0, 0]}
          barSize={8}   // 👈 slimmer bars
        />
      </BarChart>
    </ChartContainer>
  )
}
function UserGrowthChart2() {
  return (
    <ChartContainer
      className="h-72 w-full"
      config={{ users: { label: "Users" } }}
    >
      <LineChart data={userGrowthData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="month"
          axisLine
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
        />

        <YAxis
          axisLine
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
        />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Line
          type="monotone"
          dataKey="users"
          stroke="#F43F5E"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  )
}

