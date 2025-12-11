"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { mockSubscriptionStats } from "@/lib/mock-data";
import {
  BarChart,
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, TrendingUp, PieChart } from "lucide-react";

// -------------------------------------------------
// MOCK DATA (Replace with API later)
// -------------------------------------------------
const mockRevenueByPlan = [
  { plan: "Basic", revenue: 2400 },
  { plan: "Pro", revenue: 5400 },
  { plan: "Enterprise", revenue: 11200 },
];

export default function RevenueDashboardPage() {
  const [stats, setStats] = useState(mockSubscriptionStats);
  const [history, setHistory] = useState(null);
  const [planRevenue, setPlanRevenue] = useState(mockRevenueByPlan);

  /*
  -------------------------------------------------
  OPTIONAL: Fetch Real Revenue Data from Backend
  -------------------------------------------------
  useEffect(() => {
    async function loadRevenue() {
      const res = await fetch("/api/admin/revenue-dashboard");
      const data = await res.json();
      setStats(data.stats);
      setHistory(data.history);
      setPlanRevenue(data.planRevenue);
    }
    loadRevenue();
  }, []);
  */

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
        <p className="text-gray-500">Detailed insight into subscription revenue and performance.</p>
      </div>

      {/* KPI Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <KpiCard
          title="MRR (Monthly Recurring Revenue)"
          value={`$${stats.monthlyRecurring.toLocaleString()}`}
          icon={<DollarSign className="w-7 h-7 text-green-600" />}
          gradient="from-green-100 to-green-200"
        />

        <KpiCard
          title="Active Subscribers"
          value={stats.activeSubscribers}
          icon={<PieChart className="w-7 h-7 text-blue-600" />}
          gradient="from-blue-100 to-blue-200"
        />

        <KpiCard
          title="Monthly Growth"
          value={`+${stats.monthlyGrowth}%`}
          icon={<TrendingUp className="w-7 h-7 text-purple-600" />}
          gradient="from-purple-100 to-purple-200"
        />
      </div>

      {/* Revenue Over Time */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4f46e5"
              fill="url(#colorRev)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Plan-wise Revenue */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Revenue by Plan</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={planRevenue}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="plan" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Notes */}
      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <h3 className="text-lg font-semibold">Revenue Notes</h3>
        <p className="text-gray-600 mt-2">
          Revenue data includes subscription income across all plans. Metrics update every 24 hours.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   KPI Card Component
--------------------------------------------------------- */
function KpiCard({ title, value, icon, gradient }: any) {
  return (
    <div
      className="group bg-white rounded-2xl p-6 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-sm text-gray-600">{title}</h3>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>

      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}
