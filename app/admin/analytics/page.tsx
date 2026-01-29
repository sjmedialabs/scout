"use client";

import { useState, useEffect } from "react";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import {
  mockAdminStats,
  mockSubscriptionStats,
  mockProvider,
  mockReportedContent,
} from "@/lib/mock-data";
import { User } from "@/lib/types";
import { AlertTriangle, FileText, Users } from "lucide-react";
import {
  type Provider,
  type Requirement,
  type Notification,
  type Project,
  type Review,
  Proposal,
} from "@/lib/types";

export default function AnalyticsPage() {
  const [stats, setStats] = useState(mockAdminStats);
  const [subscriptionStats, setSubscriptionStats] = useState(
    mockSubscriptionStats,
  );
  const [topProviders, setTopProviders] = useState([mockProvider]);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [reportedContent, setReportedContent] = useState(mockReportedContent);
  const [requirements, setRequirements] = useState([]);
  const [userDistribution, setUserDistribution] = useState({
    clientsCount: 0,
    clientsCountPercentage: 0,
    agenciesCount: 0,
    agenciesCountPercentage: 0,
  });
  const [topPerformingAgencies, setTopPerformingAgencies] = useState<
    Provider[]
  >([]);

  useEffect(() => {
    async function fetchDashboardData() {
      // To decrease server load, use a single aggregated endpoint
      // or Promise.all to fetch concurrently.
      try {
        setIsLoading(true);
        const [
          //statsRes, subRes,
          usersRes,
          requirementsRes,
          providersRes,
          //  reportsRes
        ] = await Promise.all([
          //   authFetch("/api/admin/stats"),
          //   authFetch("/api/admin/subscriptions"),
          authFetch("/api/users"),
          authFetch("/api/requirements"),
          authFetch("/api/providers"),
          //   authFetch("/api/admin/reports"),
        ]);
        const usersData = await usersRes.json();
        let totalUsers = usersData.users.length;
        let clientCounts = usersData.users.filter(
          (eachItem) => eachItem.role === "client",
        ).length;
        let clientsCountPercentage =
          totalUsers > 0 ? Math.round((clientCounts / totalUsers) * 100) : 0;
        let agenciesCount = totalUsers - clientCounts;
        let agencyCountPercentage =
          totalUsers > 0 ? Math.round((agenciesCount / totalUsers) * 100) : 0;

        console.log("Total users count::::", totalUsers);
        console.log("clients counts::::", clientCounts);
        console.log("clients counts percentage::::", clientsCountPercentage);
        console.log("Agencies count:::::", agenciesCount);
        console.log("Agencies percentage:::::", agencyCountPercentage);

        setUserDistribution({
          clientsCount: clientCounts,
          clientsCountPercentage: clientsCountPercentage,
          agenciesCount: agenciesCount,
          agenciesCountPercentage: agencyCountPercentage,
        });

        setUsers(usersData.users);

        const requirementsData = await requirementsRes.json();
        console.log("Fetched requirements data:", requirementsData);

        const providersData = await providersRes.json();
        const providers = providersData.providers || [];

        const topThreePerformers = providers
          .filter((p) => typeof p.rating === "number") // optional safety
          .sort((a, b) => b.rating - a.rating) // highest rating first
          .slice(0, 3);

        console.log("top performers::::::", topThreePerformers);
        setTopPerformingAgencies(topThreePerformers);
        setRequirements(requirementsData.requirements);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        // setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const pendingReports = reportedContent.filter(
    (r) => r.status === "pending",
  ).length;
  const pendingUsers = users.filter((u) => !u.isVerified).length;
  const activeRequirements = requirements.filter(
    (r) => r.status === "Open",
  ).length;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-orangeButton">
        Analytics Overview
      </h1>
      <p className="text-gray-500 text-xl">
        Key platform insights and performance metrics
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <DashboardCard
          title="Total Users"
          icon={<Users className="h-4 w-4 text-orangeButton" />}
          gradient="from-blue-100 to-blue-200"
          value={users.length}
          helper={`${pendingUsers} pending approval`}
        />

        {/* Active Projects */}
        <DashboardCard
          title="Active Projects"
          icon={<FileText className="h-4 w-4 text-orangeButton" />}
          gradient="from-green-100 to-green-200"
          value={activeRequirements}
          helper={`${requirements.length} requirements posted`}
        />

        {/* Pending Reports */}
        <DashboardCard
          title="Pending Reports"
          icon={<AlertTriangle className="h-4 w-4 text-orangeButton" />}
          gradient="from-orange-100 to-orange-200"
          value={pendingReports}
          helper="Require moderation"
        />

        {/* Monthly Revenue */}
        <DashboardCard
          title="Monthly Revenue"
          icon={
            <img
              src="/images/revenue-icon.png"
              className="h-4 w-4 text-orangeButton"
            />
          }
          gradient="from-purple-100 to-purple-200"
          value={`$${subscriptionStats.monthlyRecurring.toLocaleString()}`}
          helper={`+${stats.monthlyGrowth}% growth`}
        />
      </div>
      <AnalyticsDashboard
        stats={userDistribution}
        subscriptionStats={subscriptionStats}
        topProviders={topPerformingAgencies}
      />
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <DashboardCard
          title="Average Revenue Per User"
          icon={<Users className="h-4 w-4 text-orangeButton" />}
          gradient="from-blue-100 to-blue-200"
          value={`${subscriptionStats.monthlyRecurring.toLocaleString()}`}
          helper={`From ${subscriptionStats.totalSubscriptions} active subscriptions`}
        />

        {/* Active Projects */}
        <DashboardCard
          title="Average Revenue Per User"
          icon={<FileText className="h-4 w-4 text-orangeButton" />}
          gradient="from-green-100 to-green-200"
          value={`${Math.round(subscriptionStats.totalRevenue / subscriptionStats.totalSubscriptions)}`}
          helper={`Per paying user`}
        />

        {/* Pending Reports */}
        <DashboardCard
          title="Platform Growth"
          icon={<AlertTriangle className="h-4 w-4 text-orangeButton" />}
          gradient="from-orange-100 to-orange-200"
          value={`+${stats.monthlyGrowth}%`}
          helper="Month over month growth"
        />
      </div>
    </div>
  );
}
/* ---------------------------------------------------------
   REUSABLE DASHBOARD CARD COMPONENT
--------------------------------------------------------- */
function DashboardCard({ title, value, icon, helper, gradient }: any) {
  return (
    <div
      className="group bg-white rounded-2xl p-6  shadow-lg
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center justify-between pb-8">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <div
          className={`p-2 rounded-full flex items-center justify-center shadow-md
          bg-[#EEF7FE] group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>

      <div className="text-2xl font-extrabold text-slate-800">{value}</div>
      <p className="text-xs text-orangeButton font-extralight mt-1">{helper}</p>
    </div>
  );
}
