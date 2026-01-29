"use client";

import { useState, useEffect } from "react";
import { IoMdTrendingUp } from "react-icons/io";
import { RiExchangeDollarFill } from "react-icons/ri";
import { FaArrowUpLong } from "react-icons/fa6";
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
  PieChart as RePieChart,
  Pie,
  Legend,
  Cell,
} from "recharts";
import { DollarSign, TrendingUp, PieChart, Filter } from "lucide-react";

// -------------------------------------------------
// MOCK DATA (Replace with API later)
// -------------------------------------------------
const mockRevenueByPlan = [
  { plan: "Starter", enterprise: 83.54, revenue: 69.58 },
  { plan: "Professional", enterprise: 65.33, revenue: 78.82 },
  { plan: "Enterprise", enterprise: 74.15, revenue: 70.32 },
];

const pieData = [
  { name: "Subscription Revenue", value: 151.48, color: "#8b7cfb" },
  { name: "Usage-Based Fees", value: 65.55, color: "#ff9c8a" },
  { name: "Premium Features", value: 162.51, color: "#3ec1d3" },
  { name: "Integration Fees", value: 64.31, color: "#ffb84d" },
];

const mrrTrend = [
  { month: "Jan", value: 190, scatter: 70 },
  { month: "Feb", value: 120, scatter: 65 },
  { month: "Mar", value: 195, scatter: 85 },
  { month: "Apr", value: 130, scatter: 90 },
  { month: "May", value: 165, scatter: 60 },
  { month: "Jun", value: 110, scatter: 55 },
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
    <div className="space-y-4">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
            Revenue & Analytics
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Track revenue metrics, customer analytics, and market insights for
            your B2B sharing platform
          </p>
        </div>

        <button className="flex items-center cursor-pointer gap-2 bg-black text-white px-5 py-2 rounded-full text-sm">
          <Filter className="w-4 h-4" />
          Filter by Date
        </button>
      </div>

      {/* ---------------- KPI CARDS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 my-custom-class gap-6">
        <KpiCard 
          title="Current MRR"
          value="$18,000"
          note="↑ 15% from last month"
          noteColor="text-green-600"
          icon={< RiExchangeDollarFill className="text-orangeButton bg-[#eef7fe]" />}
        />

        <KpiCard
          title="Annual Revenue"
          value="$216,000"
          note="↑ 18% growth YoY"
          noteColor="text-green-600"
          icon={<IoMdTrendingUp className="text-orangeButton" />}
        />

        <KpiCard
          title="Attrition rate"
          value="$4,200"
          note="Improved from 1.8%"
          noteColor="text-gray-600"
          icon={<FaArrowUpLong className="text-green-600" />}
        />
      </div>

      {/* ---------------- MRR TREND ---------------- */}
      
      <div className="bg-white rounded-2xl p-6 shadow-md border">
  <h3 className="text-xl font-semibold text-orangeButton mb-6">
    MRR Growth Trend
  </h3>

  <div className="h-[340px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={mrrTrend}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        {/* Grid */}
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />

        {/* Axes */}
        <XAxis
          dataKey="month"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip />

        {/* Gradient */}
        <defs>
          <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        {/* Main Area Line */}
        <Area
          type="monotone"
          dataKey="value"
          stroke="#38bdf8"
          strokeWidth={2}
          fill="url(#mrrGradient)"
          dot={{
            r: 4,
            stroke: "#38bdf8",
            strokeWidth: 2,
            fill: "#ffffff",
          }}
          activeDot={{ r: 5 }}
        />

        {/* Scatter-style dots (purple) */}
        <Area
          type="monotone"
          dataKey="scatter"
          stroke="transparent"
          fill="transparent"
          dot={{
            r: 4,
            stroke: "#8b7cfb",
            strokeWidth: 2,
            fill: "#ffffff",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>


      {/* ---------------- BOTTOM GRAPHS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Plan */}
        <div className="bg-white rounded-2xl p-6 border shadow-md">
          <h3 className="text-xl font-semibold my-custom-class text-orangeButton mb-2">
            Revenue by plan
          </h3>

          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={mockRevenueByPlan}
              barGap={6}
              margin={{ top:0, right: 20, left: 0, bottom: 10 }}
            >
              {/* Grid */}
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />

              {/* X Axis */}
              <XAxis
                dataKey="plan"
                tick={{ fill: "#6b7280", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />

              {/* Y Axis */}
              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              {/* Legend */}
              <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="square"
                  iconSize={10}
                  formatter={(value) => (
                    <span style={{ color: "#000000", fontSize: "12px" }}>
                      {value}
                    </span>
                  )}
                />

              {/* Enterprise Revenue */}
              <Bar
                dataKey="enterprise"
                name="Enterprise Revenue"
                fill="#ffb3a7"
                radius={[6, 6, 0, 0]}
                label={{ position: "top", fill: "#374151", fontSize: 12 }}
              />

              {/* Revenue */}
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="#63d2e6"
                radius={[6, 6, 0, 0]}
                label={{ position: "top", fill: "#374151", fontSize: 12 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>


        {/* Revenue Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-md border">
          <h3 className="text-xl font-semibold my-custom-class text-orangeButton mb-6">
            Revenue by distribution
          </h3>

          <div className=" md:flex-row items-center gap-10">
            {/* PIE CHART */}
            <div className="w-full md:w-[420px] h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    stroke="none"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#ffffff"
                        >
                          <tspan x={x} dy="-4" fontSize="10">
                            {name}
                          </tspan>
                          <tspan x={x} dy="18" fontSize="14" fontWeight="600">
                            {value}
                          </tspan>
                        </text>
                      );
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
            </div>

            {/* LEGEND */}
            <div className="gap-2 min-w-10 grid grid-cols-2">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 text-[10px] text-gray-700 leading-sung"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------------- KPI CARD ---------------- */
function KpiCard({ title, value, note, noteColor, icon }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md flex justify-between items-start">
      <div>
        <p className="text-black text-sm font-bold">{title}</p>
        <p className="text-3xl font-bold mt-3">{value}</p>
        <p className={`text-xs mt-1 ${noteColor}`}>{note}</p>
      </div>

      <div className="w-8 h-8 rounded-full bg-[#eef7fe] flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}


