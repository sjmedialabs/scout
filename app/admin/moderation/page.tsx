"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReportDetailsModal from "@/components/admin/ReportDetailsModal";

import { Textarea } from "@/components/ui/textarea";

import { AlertTriangle, Search, Check, X, Eye, Calendar, } from "lucide-react";

import { mockReportedContent } from "@/lib/mock-data";

// Report type interface
interface ReportItem {
  id: string;
  type: string;
  reason: string;
  status: "all" | "pending" | "resolved" | "dismissed";
  createdAt: string;
  reporter: string;
  itemId: string;
}

export default function ModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>(mockReportedContent);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("All");

  // Get unique types from the reports data
  const uniqueTypes = Array.from(new Set(reports.map(report => report.type)));

  const [openModal, setOpenModal] = useState(false);
const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);


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

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.reason.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()) ||
      r.reporter?.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "All types" || r.type === typeFilter.toLowerCase();

    const matchesStatus = statusFilter === "All" ? true :
                         statusFilter === "Pending" ? r.status === "pending" :
                         statusFilter === "Resolved" ? r.status === "resolved" :
                         statusFilter === "Dismissed" ? r.status === "dismissed" : true;

    return matchesSearch && matchesType && matchesStatus;
  });

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All types");
    setStatusFilter("All");
  };

 
  return (
  <div className="space-y-6">
    {/* Header */}
    <div>
      <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
        Content Moderation
      </h1>
      <p className="text-gray-500 my-custom-class">
        Review and moderate reported content
      </p>
    </div>

    {/* Filters */}
    <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col lg:flex-row gap-4 items-center">
      {/* Search */}
      <div className="relative w-full lg:w-1/3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 border-gray-200 rounded-lg h-8"
        />
      </div>

      {/* Type Filter */}
      <select
        className="w-full lg:w-1/5 border rounded-lg px-3 py-2 text-sm pr-2"
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
      >
        <option>All types</option>
        {uniqueTypes.map((type) => (
          <option key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        className="w-full lg:w-1/5 border rounded-lg px-3 py-2 text-sm"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option>All</option>
        <option>Pending</option>
        <option>Resolved</option>
        <option>Dismissed</option>
      </select>

      <Button
        className="lg:ml-auto bg-black text-white rounded-full px-6"
        onClick={clearFilters}
      >
        Clear filter
      </Button>
    </div>

    {/* Table */}
    <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
      <table className="w-full min-w-[900px] text-sm">
        <thead className="border-b bg-gray-50">
          <tr className="text-left text-gray-600">
            <th className="px-6 py-4 font-bold my-custom-class text-black">Type</th>
            <th className="px-6 py-4 font-bold my-custom-class text-black">Reason</th>
            <th className="px-6 py-4 font-bold my-custom-class text-black">Status</th>
            <th className="px-6 py-4 font-bold my-custom-class text-black">Reported Date</th>
            <th className="px-6 py-4 text-center font-bold my-custom-class text-black">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredReports.map((report) => (
            <tr
              key={report.id}
              className="border-b last:border-none hover:bg-gray-50 transition"
            >
              {/* Type */}
              <td className="px-6 py-4">
                <Badge
                  className={
                    report.type === "review"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }
                >
                  {report.type}
                </Badge>
              </td>

              {/* Reason */}
              <td className="px-6 py-4">
                <p className="font-bold my-custom-class text-black">
                  {report.reason}
                </p>
                <p className="text-xs text-gray-500 mt-1 my-custom-class">
                  Reported by {report.reporter}
                </p>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
                    report.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : report.status === "resolved"
                      ? "bg-green-100 text-green-700"
                      : report.status === "dismissed"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
              </td>

              {/* Date */}
              {/* <td className="px-6 py-4 text-gray-600">
                {new Date(report.createdAt).toLocaleDateString("en-IN")}
              </td> */}
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar className="w-4 h-4 text-gray-900" />
                  <span>
                    {new Date(report.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-center gap-4 text-gray-600">
                  {/* View */}
                  <button
                    className="hover:text-black"
                    onClick={() => {
                      setSelectedReport(report);
                      setOpenModal(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Approve */}
                  <button
                    className="hover:text-green-600"
                    onClick={() => resolveReport(report.id, "approve")}
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  {/* Reject */}
                  <button
                    className="hover:text-red-600"
                    onClick={() => resolveReport(report.id, "reject")}
                  >
                    <X className="w-4 h-4" />
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

    {selectedReport && (
      <ReportDetailsModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        report={{
          id: selectedReport.id,
          type: selectedReport.type,
          status: selectedReport.status,
          createdAt: selectedReport.createdAt,
          reason: selectedReport.reason,
          description:
            "This review contains offensive language and false accusations.",
        }}
      />
    )}
  </div>
);

}
