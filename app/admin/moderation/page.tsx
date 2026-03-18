"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Eye, Check, X, AlertTriangle } from "lucide-react";
import { authFetch } from "@/lib/auth-fetch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ResponsiveTable } from "@/components/layout";
import { MobileFilterBar } from "@/components/layout";

interface ReportItem {
  _id: string;
  reason: string;
  description?: string;
  status: string;
  createdAt: string;
  reportedBy: { name?: string; email?: string; role?: string };
  reportedTo?: { name?: string; email?: string; role?: string };
}

export default function ModerationPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [search, setSearch] = useState("");
  const [resLoading, setResLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<ReportItem | null>(null);

  async function loadReports() {
    setResLoading(true);
    try {
      const res = await authFetch("/api/reported-content");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error("Failed to fetch reported content:", error);
    } finally {
      setResLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = reports.filter(
    (r) =>
      r.reason?.toLowerCase().includes(search.toLowerCase()) ||
      (typeof r.reportedBy === "object" && r.reportedBy?.name?.toLowerCase().includes(search.toLowerCase())),
  );

  async function handleApprove(report: ReportItem) {
    setActionLoading(report._id);
    try {
      const res = await authFetch(`/api/reported-content/${report._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      if (res.ok) await loadReports();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleIgnore(report: ReportItem) {
    setActionLoading(report._id);
    try {
      const res = await authFetch(`/api/reported-content/${report._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ignore" }),
      });
      if (res.ok) await loadReports();
    } finally {
      setActionLoading(null);
    }
  }

  function openDeleteConfirm(report: ReportItem) {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!reportToDelete) return;
    setActionLoading(reportToDelete._id);
    try {
      const res = await authFetch(`/api/reported-content/${reportToDelete._id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteDialogOpen(false);
        setReportToDelete(null);
        await loadReports();
      }
    } finally {
      setActionLoading(null);
    }
  }

  if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-orangeButton">Content Moderation</h1>
        <p className="text-gray-500 text-sm md:text-base">Review and moderate reported content</p>
      </div>

      
        <div className="flex gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full h-9 border-gray-200 placeholder:text-xs rounded-full"
            />
          </div>
        
        
      
        <Button variant="outline" className="h-[35px] btn-blackButton" onClick={() => setSearch("")}>
          Clear search
        </Button>
        </div>
      

      <div className="bg-white rounded-2xl border shadow-lg max-w-[95vw] overflow-x-auto">
        <ResponsiveTable scrollOnMobile>
          <table className="w-full min-w-[600px] text-sm">
            <thead className="border-b bg-gray-50">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold text-gray-700">Reason</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 font-semibold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No reported content to moderate
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{report.reason}</p>
                      <p className="text-xs text-gray-500">
                        By {typeof report.reportedBy === "object" ? report.reportedBy?.name : "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          report.status === "resolved"
                            ? "bg-green-200 text-green-800"
                            : report.status === "dismissed"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-amber-200 text-amber-800"
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="bg-green-50 text-green-700 rounded-full text-xs">
                        {typeof report.reportedBy === "object" ? report.reportedBy?.role : "—"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1 flex-wrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            setSelectedReport(report);
                            setOpen(true);
                          }}
                          title="View Content"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:text-green-600"
                          onClick={() => handleApprove(report)}
                          disabled={actionLoading === report._id || report.status === "resolved"}
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:text-amber-600"
                          onClick={() => handleIgnore(report)}
                          disabled={actionLoading === report._id || report.status === "dismissed"}
                          title="Ignore Report"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:text-red-600"
                          onClick={() => openDeleteConfirm(report)}
                          disabled={actionLoading === report._id}
                          title="Remove / Delete"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </ResponsiveTable>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-orangeButton">Report Content</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <>
              <div className="rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50">
                <span className="font-medium">Reason:</span> {selectedReport.reason}
              </div>
              <div className="rounded-md border border-gray-200 px-3 py-2 text-sm bg-gray-50 whitespace-pre-wrap">
                <span className="font-medium">Description:</span> {selectedReport.description || "—"}
              </div>
            </>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove report?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this report. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
