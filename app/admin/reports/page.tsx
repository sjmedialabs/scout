"use client";

import { useState, useEffect } from "react";
import { FileText, Download, BarChart2, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const [reports, setReports] = useState([
    {
      id: "rep-001",
      title: "Monthly User Growth Report",
      type: "Analytics",
      date: "2025-12-01",
      description: "Overview of user acquisition, retention, and churn metrics.",
      icon: Users,
    },
    {
      id: "rep-002",
      title: "Financial Summary Report",
      type: "Finance",
      date: "2025-12-01",
      description: "Subscription revenue, MRR, ARR, and transaction logs.",
      icon: BarChart2,
    },
    {
      id: "rep-003",
      title: "Content Moderation Summary",
      type: "Content",
      date: "2025-12-01",
      description: "Reported content analysis, actions taken, and policy violations.",
      icon: AlertTriangle,
    },
  ]);

  /*
  ----------------------------------------------------
  OPTIONAL: Fetch reports dynamically from backend API
  ----------------------------------------------------
  useEffect(() => {
    async function fetchReports() {
      const res = await fetch("/api/admin/reports");
      const data = await res.json();
      setReports(data);
    }
    fetchReports();
  }, []);
  */

  const handleDownloadPDF = (id: string) => {
    console.log("Downloading PDF for:", id);
    // Later: window.open(`/api/admin/reports/${id}/download`)
  };

  const handleDownloadCSV = (id: string) => {
    console.log("Downloading CSV for:", id);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-500">View platform analytics, summaries, and export reports</p>
      </div>

      {/* Reports List */}
      <div className="space-y-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              {/* Left Section */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow">
                  <report.icon className="w-6 h-6 text-blue-600" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{report.title}</h3>
                  <p className="text-sm text-gray-500">{report.type}</p>
                  <p className="text-gray-600 mt-2">{report.description}</p>

                  <p className="text-sm text-gray-400 mt-1">
                    Generated on: <span className="font-medium text-gray-600">{report.date}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleDownloadPDF(report.id)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4" />
                  PDF
                </Button>

                <Button
                  onClick={() => handleDownloadCSV(report.id)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Future Export Tools */}
      <div className="mt-6 p-6 bg-white border rounded-2xl shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Generate New Report</h3>
        <p className="text-gray-500 mb-4">Advanced filters and custom report types coming soon.</p>

        <Button disabled className="opacity-50 cursor-not-allowed">
          + Create Custom Report
        </Button>
      </div>
    </div>
  );
}
