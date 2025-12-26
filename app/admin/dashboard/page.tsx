"use client";

import { useState, useEffect } from "react";
import { mockAdminStats, mockReportedContent, mockSubscriptionStats } from "@/lib/mock-data";
import {
  Users,
  FileText,
  AlertTriangle,
  TriangleAlert,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(mockAdminStats);
  const [subscriptionStats, setSubscriptionStats] = useState(mockSubscriptionStats);
  const [users, setUsers] = useState<User[]>([]);
  const [reportedContent, setReportedContent] = useState(mockReportedContent);
  const [requirements, setRequirements] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      // To decrease server load, use a single aggregated endpoint
      // or Promise.all to fetch concurrently.
      try {
        setIsLoading(true);
        const [
          //statsRes, subRes,
           usersRes, requirementsRes,
          //  reportsRes
          ] = await Promise.all([
        //   fetch("/api/admin/stats"),
        //   fetch("/api/admin/subscriptions"),
          fetch("/api/users"),
        fetch("/api/requirements"),
        //   fetch("/api/admin/reports"),
        ]);
       const usersData = await usersRes.json();
        setUsers(usersData.users);

        const requirementsData = await requirementsRes.json();
        console.log("Fetched requirements data:", requirementsData);
        setRequirements(requirementsData.requirements);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        // setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const pendingReports = reportedContent.filter((r) => r.status === "pending").length;
  const pendingUsers = users.filter((u) => !u.isVerified).length;
  const activeRequirements = requirements.filter((r) => r.status === "Allocated").length;
  return (
    <div className="space-y-10">
      {/* Page Heading */}
      <div className="py-4 border-b border-slate-300 mb-6 flex items-center justify-between">
        <div>
        <h1 className="text-4xl font-bold text-orangeButton">Admin Dashboard</h1>
        <p className="text-gray-500 text-xl">Platform management and insights</p>
        </div>
        <div className="flex flex-row justify-center items-center gap-4">
          <Button className="bg-orangeButton rounded-full text-white mt-4 hover:bg-orange-600 flex items-center gap-2">
           <TriangleAlert className="h-4 w-4" /> Reports 
          </Button>
          <Button className="bg-[#278DEC] rounded-full text-white mt-4 hover:bg-blue-800 flex items-center gap-2">
            <Users className="h-4 w-4" /> Pending
          </Button>
        </div>
      </div>

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
          icon={<img src="/images/revenue-icon.png" className="h-4 w-4 text-orangeButton" />}
          gradient="from-purple-100 to-purple-200"
          value={`$${subscriptionStats.monthlyRecurring.toLocaleString()}`}
          helper={`+${stats.monthlyGrowth}% growth`}
        />
      </div>

      {/* Recent activity  */}
     <div className="flex flex-col lg:flex-row gap-6">
  <RecentUserActivityCard />
  <ContentReportsCard/>
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

function RecentUserActivityCard() {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-extrabold text-orangeButton">
            Recent User Activity
          </h3>
          <p className="text-sm text-gray-500">
            Latest user registrations and status changes
          </p>
        </div>

        {/* User List */}
        <div className="space-y-3">
          {/* User Item */}
          <div className="flex items-center justify-between border rounded-xl px-4 py-3">
            <div>
              <p className="font-semibold text-orangeButton">John Doe</p>
              <p className="text-sm text-gray-500">seeker@example.com</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-green-100 text-green-700">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between border rounded-xl px-4 py-3">
            <div>
              <p className="font-semibold text-orangeButton">Jane Smith</p>
              <p className="text-sm text-gray-500">provider@example.com</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-green-100 text-green-700">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between border rounded-xl px-4 py-3">
            <div>
              <p className="font-semibold text-orangeButton">Bob Wilson</p>
              <p className="text-sm text-gray-500">bob@example.com</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700">
              Pending
            </span>
          </div>

          <div className="flex items-center justify-between border rounded-xl px-4 py-3">
            <div>
              <p className="font-semibold text-orangeButton">Alice Johnson</p>
              <p className="text-sm text-gray-500">alice@example.com</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-red-100 text-red-700">
              Suspending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
function ContentReportsCard() {
  return (
    <div className="w-full">
      <div
        className="
          bg-white rounded-2xl p-6
          shadow-md hover:shadow-xl
          transition-all duration-300 ease-in-out
          hover:-translate-y-1
        "
      >
        {/* Header */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-orangeButton">
            Content Reports
          </h3>
          <p className="text-sm text-gray-500">
            Recent content moderation requests
          </p>
        </div>

        {/* Report List */}
        <div className="space-y-3">
          {/* Item */}
          <div className="flex items-center justify-between border rounded-xl px-4 py-3">
            <div>
              <p className="font-semibold text-orangeButton">
                Inappropriate content
              </p>
              <p className="text-sm text-gray-500">
                review • 20/01/2024
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-green-100 text-green-700">
              Resolved
            </span>
          </div>

          <div className="flex items-center justify-between border rounded-xl px-4 py-3">
            <div>
              <p className="font-semibold text-orangeButton">Spam</p>
              <p className="text-sm text-gray-500">
                proposal • 19/01/2024
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-green-100 text-green-700">
              Resolved
            </span>
          </div>

          <div className="flex items-center justify-between border rounded-xl px-4 py-3">
            <div>
              <p className="font-semibold text-orangeButton">
                Fraudulent activity
              </p>
              <p className="text-sm text-gray-500">
                user • 15/01/2024
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700">
              Pending
            </span>
          </div>

          <div className="flex items-center justify-between border rounded-xl px-4 py-3">
            <div>
              <p className="font-semibold text-orangeButton">
                Alice Johnson
              </p>
              <p className="text-sm text-gray-500">
                alice@example.com
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700">
              Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
