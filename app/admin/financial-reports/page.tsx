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

import {
  mockFinancialSummary,
  mockQuarterlyFinancials,
  mockYearlyComparison,
} from "@/lib/mock-data";

export default function FinancialReportsPage() {
  const [summary, setSummary] = useState(mockFinancialSummary);
  const [quarters, setQuarters] = useState(mockQuarterlyFinancials);
  const [yearly, setYearly] = useState(mockYearlyComparison);

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
    <div className="space-y-10">
      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <p className="text-gray-500">
          View platform revenue, expenses, and long-term financial performance.
        </p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Revenue (This Year)"
          value={`$${summary.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-7 h-7 text-green-600" />}
          gradient="from-green-100 to-green-200"
        />

        <SummaryCard
          title="Total Expenses"
          value={`$${summary.totalExpenses.toLocaleString()}`}
          icon={<TrendingDown className="w-7 h-7 text-red-600" />}
          gradient="from-red-100 to-red-200"
        />

        <SummaryCard
          title="Net Profit"
          value={`$${summary.netProfit.toLocaleString()}`}
          icon={<TrendingUp className="w-7 h-7 text-blue-600" />}
          gradient="from-blue-100 to-blue-200"
        />
      </div>

      {/* Quarterly Performance */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">
          Quarterly Financial Performance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quarters.map((q) => (
            <div
              key={q.quarter}
              className="p-5 border rounded-xl hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{q.quarter}</h3>
                <Badge
                  className={
                    q.revenue >= q.expenses
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {q.revenue >= q.expenses ? "Profit" : "Loss"}
                </Badge>
              </div>

              <p className="text-gray-700 mt-2">
                <span className="font-medium">Revenue:</span> $
                {q.revenue.toLocaleString()}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Expenses:</span> $
                {q.expenses.toLocaleString()}
              </p>
              <p className="text-gray-900 font-semibold mt-2">
                Net: ${q.net.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Yearly Comparison */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Yearly Comparison</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {yearly.map((y) => (
            <div
              key={y.year}
              className="p-5 border rounded-xl hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold mb-2">{y.year}</h3>

              <p className="text-gray-700">
                <span className="font-medium">Revenue:</span> $
                {y.revenue.toLocaleString()}
              </p>

              <p className="text-gray-700">
                <span className="font-medium">Expenses:</span> $
                {y.expenses.toLocaleString()}
              </p>

              <p
                className={`font-semibold mt-2 ${
                  y.profit >= 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                Net Profit: ${y.profit.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Download Reports */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h3 className="text-lg font-semibold">Export Full Financial Reports</h3>
        <p className="text-gray-600">
          Download detailed financial documents for auditing & compliance.
        </p>

        <div className="flex gap-3 flex-wrap">
          <Button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => downloadReport("pdf")}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => downloadReport("csv")}
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SUMMARY CARD COMPONENT
--------------------------------------------------------- */
function SummaryCard({ title, value, icon, gradient }: any) {
  return (
    <div className="group bg-white rounded-2xl p-6 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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
