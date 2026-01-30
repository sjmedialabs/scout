"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AlertTriangle, Search, Check, X,Calendar, Eye} from "lucide-react";

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
      const res = await authFetch("/api/admin/moderation");
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
          : r,
      ),
    );

    console.log(
      `Report ${id} ${action === "approve" ? "approved" : "rejected"}`,
    );
  };

  const filteredReports = reports.filter(
    (r) =>
      r.reason.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
          Reported Content
        </h1>
        <p className="text-gray-500 my-custom-class">
          Platform management and oversight
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow border flex gap-3 items-center">
        <Search className="w-4 h-4 ml-2 text-gray-500 absolute" />
        <Input
          placeholder="Search reports by type, reason, reporter..."
          className="w-full pl-8 placeholder:pl-2 placeholder:text-500 border shadow relative placeholder:text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border shadow-lg overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-red-100">
            <tr className="text-left">
              <th className="px-6 py-4 font-semibold text-black my-custom-class">Type</th>
              <th className="px-6 py-4 font-semibold text-black my-custom-class">Reason</th>
              <th className="px-6 py-4 font-semibold text-black my-custom-class">Status</th>
              <th className="px-6 py-4 font-semibold text-black my-custom-class">
                Reported Date
              </th>
              <th className="px-6 py-4 font-semibold text-black text-center my-custom-class">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.map((report) => (
              <tr
                key={report.id}
                className="border-b border-red-100 hover:bg-gray-50 transition"
              >
                {/* Type */}
                <td className="px-6 py-4">
                  <Badge className="bg-[#dbd9f0] text-[#4a37d6] my-custom-class rounded-md px-3 py-1">
                    {report.type}
                  </Badge>
                </td>

                {/* Reason */}
                <td className="px-6 py-4">
                  <p className="font-semibold text-black my-custom-class">
                    {report.reason}
                  </p>
                  <p className="text-sm text-gray-500 my-custom-class">
                    Reported by {report.reporter}
                  </p>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className="inline-flex px-4 py-1 my-custom-class text-sm font-medium bg-yellow-200 text-yellow-800 rounded-sm">
                    Pending
                  </span>
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-black my-custom-class flex gap-2 items-center">
                  <Calendar className="w-4 h-4 text-gray-900" />
                  <span>
                  {new Date(report.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-6 text-black">
                    <button>
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        resolveReport(report.id, "approve")
                      }
                      className="hover:text-green-600"
                    >
                      <Check className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() =>
                        resolveReport(report.id, "reject")
                      }
                      className="hover:text-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredReports.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No reports found.
          </p>
        )}
      </div>
    </div>
  );
}
