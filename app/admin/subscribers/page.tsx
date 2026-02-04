"use client";

import { LabelList } from "recharts";
import { ArrowRight } from "lucide-react";
import { PiUsersThreeBold } from "react-icons/pi";
import { useEffect, useState } from "react";
import { RiExchangeDollarLine } from "react-icons/ri";
import Link from "next/link";
import { LuTrendingUpDown } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  DollarSign,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { authFetch } from "@/lib/auth-fetch";



const weeklyRevenue = [
  { day: "Mon", value: 60000 },
  { day: "Tue", value: 70000 },
  { day: "Wed", value: 30000 },
  { day: "Thu", value: 50000 },
  { day: "Fri", value: 62000 },
  { day: "Sat", value: 54000 },
  { day: "Sun", value: 38000 },
];

const subscriberGrowth = [
  { week: "Week-1", value: 40 },
  { week: "Week-2", value: 92 },
  { week: "Week-3", value: 38 },
  { week: "Week-4", value: 96 },
  { week: "Week-5", value: 22 },
];

const cancellations = [
  { month: "Jan", a: 47.25, b: 47.8, c: 62.75 },
  { month: "Feb", a: 72.75, b: 22.25, c: 38.13 },
  { month: "Mar", a: 81.28, b: 14.98, c: 63.62 },
  { month: "Apr", a: 34.78, b: 62.02, c: 50.75 },
  { month: "May", a: 97.04, b: 83.59, c: 23.29 },
  { month: "Jun", a: 62.48, b: 28.52, c: 61.74 },
  { month: "Jul", a: 37.7, b: 43.33, c: 80.37 },
  { month: "Aug", a: 10.33, b: 87.23, c: 18.2 },
  { month: "Sep", a: 71.6, b: 44.94, c: 59.67 },
  { month: "Oct", a: 84.82, b: 72.07, c: 57.05 },
  { month: "Nov", a: 69.89, b: 40.03, c: 64 },
  { month: "Dec", a: 71.89, b: 23.94, c: 48.68 },
];

export default function SubscribersManagementPage() {

  const [revenueTrend, setRevenueTrend] = 
  useState<"up" | "down" | "same">("same");


  const [stats, setStats] = useState([
  {
    title: "Total Subscribers",
    value: "0",
    sub: "Loading...",
    icon: <PiUsersThreeBold className="h-4 w-4"/>,
  },
  {
    title: "Monthly Revenue",
    value: "₹0",
    sub: "Loading...",
    icon: <RiExchangeDollarLine className="h-4 w-4"/>,
  },
  {
    title: "Cancellation Rate",
    value: "0%",
    sub: "Loading...",
    icon: <LuTrendingUpDown className="h-4 w-4"/>,
  },
  {
    title: "Pending Invoices",
    value: "0",
    sub: "Loading...",
    icon: <AlertTriangle className="h-4 w-4"/>,
  },
]);

   useEffect(() => {
  const loadStats = async () => {
    try {
      const res = await authFetch("/api/users?role=agency&limit=10000");

      const data = await res.json();
      const users = data.users ?? [];

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // ✅ ACTIVE SUBSCRIBED AGENCIES
      const activeAgencies = users.filter(
        (u: any) =>
          u.subscriptionPlanId &&
          u.subscriptionEndDate &&
          new Date(u.subscriptionEndDate) > now
      );

      const totalActiveSubscribers = activeAgencies.length;

      // ✅ NEW THIS MONTH
      const newThisMonth = activeAgencies.filter(
        (u: any) =>
          u.subscriptionStartDate &&
          new Date(u.subscriptionStartDate) >= startOfMonth
      ).length;

       /* ---------- PAYMENTS ---------- */
        const paymentRes = await authFetch("/api/payment/admin");
        const paymentData = await paymentRes.json();
        const payments = paymentData.payments ?? [];

        const startOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const endOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          0
        );

        const thisMonthRevenue = payments
          .filter(
            (p: any) =>
              p.status === "success" &&
              new Date(p.createdAt) >= startOfMonth
          )
          .reduce((sum: number, p: any) => sum + p.amount, 0);

        const lastMonthRevenue = payments
          .filter(
            (p: any) =>
              p.status === "success" &&
              new Date(p.createdAt) >= startOfLastMonth &&
              new Date(p.createdAt) <= endOfLastMonth
          )
          .reduce((sum: number, p: any) => sum + p.amount, 0);

        let percent = 0;
        let trend: "up" | "down" | "same" = "same";

        if (lastMonthRevenue > 0) {
          percent = Math.round(
            ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          );
          trend = percent > 0 ? "up" : percent < 0 ? "down" : "same";
        }

        setRevenueTrend(trend);

      setStats(prev => [
        {
          ...prev[0],
          value: totalActiveSubscribers.toString(),
          sub:
            newThisMonth > 0
              ? `↑ ${newThisMonth} new this month`
              : prev[0].sub,
        },
        {
            ...prev[1],
            value: `₹${thisMonthRevenue.toLocaleString()}`,
            sub:
              trend === "up"
                ? `↑ ${percent}% increase`
                : trend === "down"
                ? `↓ ${Math.abs(percent)}% decrease`
                : "0% change",
          },
        prev[2],
        prev[3],
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  loadStats();
}, []);





  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-2">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold my-custom-class h-8 text-orangeButton">
          Subscribers Management
        </h1>
        <p className="text-gray-500 my-custom-class">
          Welcome back to your B2B management console
        </p>
      </div>
       <Link href="/admin/subscribers/all-subscribers">
        <Button className="bg-orangeButton rounded-2xl hover:bg-orangeButton/90">
          All Subscribers 
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {stats.map((item) => (
          <Card key={item.title} className="relative bg-white rounded-3xl py-2 pb-0 shadow-lg border-none">
            <CardHeader className="flex flex-row h-2 items-start justify-between">
              <CardTitle className="text-sm font-bold my-custom-class">
                {item.title}
              </CardTitle>
              <div className="absolute right-3 top-1 p-2 rounded-full bg-[#eef7fe] text-orange-500">
                {item.icon}
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <div className="text-2xl font-bold my-custom-class">{item.value}</div>
              <p className="mt-2 my-custom-class text-xs text-green-600">
                {item.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* WEEKLY REVENUE */}
        <DashboardCard title="Weekly Revenue">
          <ResponsiveContainer width="100%" height={300}>
        <BarChart data={weeklyRevenue} barSize={14}>
          <defs>
            <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <Tooltip />

          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            fill="url(#weeklyGrad)"
          />
        </BarChart>
      </ResponsiveContainer>

        </DashboardCard>

        {/* SUBSCRIBER GROWTH */}
        <DashboardCard title="Subscriber Growth">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={subscriberGrowth}>
              <defs>
                <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c7cff" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7c7cff" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#7c7cff"
                strokeWidth={2.5}
                fill="url(#growthFill)"
                dot={{
                  r: 4,
                  fill: "#ffffff",
                  stroke: "#7c7cff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>

        </DashboardCard>
      </div>

      {/* CANCELLATIONS */}

      <DashboardCard title="Cancellations Trend (Last 12 Months)">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={cancellations} barSize={9}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <Tooltip />

            {/* BAR A */}
            <Bar dataKey="a" fill="#9f9cff" radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="a"
                position="top"
                fill="#6b7280"
                fontSize={11}
              />
            </Bar>

            {/* BAR B */}
            <Bar dataKey="b" fill="#ffb4a2" radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="b"
                position="top"
                fill="#6b7280"
                fontSize={11}
              />
            </Bar>

            {/* BAR C */}
            <Bar dataKey="c" fill="#67d1e8" radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="c"
                position="top"
                fill="#6b7280"
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </DashboardCard>

    </div>
  );
}



function DashboardCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-3xl bg-white p-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between px-10 pt-4 pb-4">
        <CardTitle className="text-[22px] font-semibold text-orangeButton my-custom-class">
          {title}
        </CardTitle>

        <Select defaultValue="weekly">
          <SelectTrigger className="h-12 w-40 rounded-xl border-gray-200 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2">
        {children}
      </CardContent>
    </Card>
  );
}

