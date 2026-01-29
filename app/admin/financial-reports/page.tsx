"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
} from "lucide-react";

/* --------------------------------------------------
   LOCAL MOCK DATA (UI ONLY — backend-ready)
-------------------------------------------------- */

const mockMRRTable = [
  { month: "Jan", mrr: 45000, arr: 540000, churn: 3.2, ltv: 8500 },
  { month: "Feb", mrr: 52000, arr: 624000, churn: 2.8, ltv: 9200 },
  { month: "Mar", mrr: 68000, arr: 816000, churn: 1.75, ltv: 10100 },
  { month: "Apr", mrr: 82000, arr: 984000, churn: 1.9, ltv: 11200 },
  { month: "May", mrr: 95000, arr: 1140000, churn: 2.4, ltv: 12400 },
];

const mockSummary = {
  totalRevenue: 1140000,
  totalExpenses: 420000,
  netProfit: 720000,
};

const mockQuarterly = [
  {
    quarter: "Q1 2024",
    revenue: 180000,
    expenses: 92000,
    net: 88000,
  },
  {
    quarter: "Q2 2024",
    revenue: 270000,
    expenses: 135000,
    net: 135000,
  },
];

const mockYearly = [
  {
    year: "2023",
    revenue: 920000,
    expenses: 510000,
    profit: 410000,
  },
  {
    year: "2024",
    revenue: 1140000,
    expenses: 420000,
    profit: 720000,
  },
];

export default function FinancialReportsPage() {
  const [summary] = useState(mockSummary);
  const [quarters] = useState(mockQuarterly);
  const [yearly] = useState(mockYearly);

  /*
  --------------------------------------------------
  OPTIONAL: Load financial data from backend API
  --------------------------------------------------
  useEffect(() => {
    async function loadFinancial() {
      const res = await authFetch("/api/admin/financial-reports");
      const data = await res.json();
      setSummary(data.summary);
      setQuarters(data.quarters);
      setYearly(data.yearly);
    }
    loadFinancial();
  }, []);
  */

  const downloadReport = (type: string) => {
    console.log("Downloading:", type);
    // future: window.open(`/api/admin/financial-reports/download?type=${type}`)
  };



return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
          Revenue & Analytics
        </h1>
        <p className="text-gray-500 max-w-xl">
          Track revenue metrics, customer analytics, and market insights for your
          B2B sharing platform
        </p>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-orangeButton my-custom-class">
          Monthly Recurring Revenue (MRR)
        </h2>

        <Button className="bg-black text-white rounded-full px-4 py-2 text-sm flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Reports
        </Button>
      </div>

      {/* MRR Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {["Month", "MRR", "ARR", "Churn", "LTV"].map((h) => (
                  <th
                    key={h}
                    className="text-left font-semibold text-black py-4 px-6"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {mockMRRTable.map((row) => (
                <tr key={row.month} className="border-t">
                  <td className="py-5 px-6 font-medium text-black">
                    {row.month}
                  </td>
                  <td className="py-5 px-6 font-medium text-black">
                    ${row.mrr.toLocaleString()}
                  </td>
                  <td className="py-5 px-6 font-medium text-black">
                    ${row.arr.toLocaleString()}
                  </td>
                  <td className="py-5 px-6">
                    <Badge className="bg-green-50 text-green-600 border border-green-200 rounded-full px-3 py-1 text-xs">
                      {row.churn}%
                    </Badge>
                  </td>
                  <td className="py-5 px-6 font-medium text-black">
                    ${row.ltv.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

