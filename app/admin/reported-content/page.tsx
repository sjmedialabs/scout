"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AlertTriangle, Search, Check, X } from "lucide-react";

import { mockReportedContent } from "@/lib/mock-data";

// Report type interface
interface ReportItem {
  id: string;
  type: string;
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  createdAt: string;
  reporter: string;
  itemId: string;
}

export default function ModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>(mockReportedContent);
  const [search, setSearch] = useState("");

  /*
  -------------------------------------------------------------
  OPTIONAL: Load moderation data from backend
  -------------------------------------------------------------
  useEffect(() => {
    async function loadReports() {
      const res = await fetch("/api/admin/moderation");
      const data = await res.json();
      setReports(data);
    }
    loadReports();
  }, []);
  */

  const resolveReport = (id: string, action: "approve" | "reject") => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: action === "approve" ? "resolved" : "dismissed",
            }
          : r
      )
    );

    console.log(`Report ${id} ${action === "approve" ? "approved" : "rejected"}`);
  };

  const filteredReports = reports.filter(
    (r) =>
      r.reason.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Content Moderation</h1>
        <p className="text-gray-500">Review and take action on reported content.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow border flex gap-3 items-center">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          placeholder="Search reports by type, reason, reporter..."
          className="w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Reports List */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
        <h2 className="text-xl font-semibold flex gap-2 items-center">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          Reported Items
        </h2>

        {filteredReports.length === 0 && (
          <p className="text-center py-6 text-gray-500">No reports found.</p>
        )}

        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="p-5 border rounded-xl hover:shadow transition bg-white flex flex-col md:flex-row justify-between"
          >
            {/* Left Section */}
            <div>
              <div className="flex items-center gap-4">
                <Badge
                  className={
                    report.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : report.status === "resolved"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {report.status.toUpperCase()}
                </Badge>
              </div>

              <p className="text-gray-700 mt-3">
                <span className="font-semibold">Type:</span> {report.type}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Reason:</span> {report.reason}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Reporter:</span> {report.reporter}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                Reported on{" "}
                {new Date(report.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>

            {/* Right Actions */}
            <div className="flex gap-3 mt-4 md:mt-0 self-end md:self-center">
              {report.status === "pending" ? (
                <>
                  <Button
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    onClick={() => resolveReport(report.id, "approve")}
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </Button>

                  <Button
                    variant="destructive"
                    className="flex items-center gap-2"
                    onClick={() => resolveReport(report.id, "reject")}
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </Button>
                </>
              ) : (
                <Button variant="outline" disabled>
                  Action Completed
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
