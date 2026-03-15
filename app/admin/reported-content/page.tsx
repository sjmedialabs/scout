"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AlertTriangle, Search, Check, X,Calendar, Eye} from "lucide-react";

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

interface ReportItem {
  _id: string;
  reason: string;
  description?: string;
  status: string;
  createdAt: string;
  reportedBy: { name?: string; email?: string; role?: string };
  reportedTo?: { name?: string; email?: string; role?: string };
}

export default function ReportedContentPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [search, setSearch] = useState("");
  const [resLoading, setResLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<ReportItem | null>(null);

  async function loadReports() {
    setResLoading(true);
    setFailed(false);
    try {
      const res = await authFetch("/api/reported-content");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setFailed(true);
    } finally {
      setResLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

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
      const res = await authFetch(`/api/reported-content/${reportToDelete._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteDialogOpen(false);
        setReportToDelete(null);
        await loadReports();
      }
    } finally {
      setActionLoading(null);
    }
  }

  const filteredReports = reports.filter(
    (r) =>
      r.reason?.toLowerCase().includes(search.toLowerCase()) ||
      (typeof r.reportedBy === "object" && r.reportedBy?.name?.toLowerCase().includes(search.toLowerCase())),
  );

  if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-orangeButton ">
          Reported Content
        </h1>
        <p className="text-gray-500 text-md">
          Platform management and oversight
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 items-center" >
        <Search className="w-4 h-4 ml-2 text-gray-500 absolute" />
        <Input
          placeholder="Search reports by type, reason, reporter..."
          className="w-full pl-8 border-gray-400 rounded-full placeholder:pl-2 placeholder:text-500 border shadow relative placeholder:text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border shadow-lg">
        <ResponsiveTable scrollOnMobile>
          <table className="w-full min-w-[600px] text-sm">
          <thead className="border-b border-red-100">
            <tr className="text-left">
              {/* <th className="px-6 py-4 font-semibold text-black ">Type</th> */}
              <th className="px-6 py-4 font-semibold text-black ">Reason</th>
              <th className="px-6 py-4 font-semibold text-black ">Status</th>
              <th className="px-6 py-4 font-semibold text-black ">Role</th>
              <th className="px-6 py-4 font-semibold text-black ">
                Reported Date
              </th>
              <th className="px-6 py-4 font-semibold text-black text-center ">
                Actions
              </th>
            </tr>
          </thead>

          
            {
              filteredReports.length!==0
              ?
               <tbody>
                      {filteredReports.map((report) => (
                    <tr
                      key={report._id}
                      className="border-b border-red-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-black ">
                          {report.reason}
                        </p>
                        <p className="text-sm text-gray-500 ">
                          Reported by {typeof report.reportedBy === "object" ? report.reportedBy?.name : "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-4 py-1 text-sm font-medium rounded-sm ${
                          report.status === "resolved" ? "bg-green-200 text-green-800" :
                          report.status === "dismissed" ? "bg-gray-200 text-gray-700" :
                          "bg-yellow-200 text-yellow-800"
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-green-50 text-green-500 rounded-full">
                          {typeof report.reportedBy === "object" ? report.reportedBy?.role : "—"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-black flex gap-2 items-center">
                        <Calendar className="w-4 h-4 text-gray-900 shrink-0" />
                        <span>{new Date(report.createdAt).toLocaleDateString("en-IN")}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2 flex-wrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => { setOpen(true); setSelectedReport(report); }}
                            title="View Content"
                          >
                            <Eye className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:text-green-600"
                            onClick={() => handleApprove(report)}
                            disabled={actionLoading === report._id || report.status === "resolved"}
                            title="Approve"
                          >
                            <Check className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:text-amber-600"
                            onClick={() => handleIgnore(report)}
                            disabled={actionLoading === report._id || report.status === "dismissed"}
                            title="Ignore Report"
                          >
                            <X className="w-5 h-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:text-red-600"
                            onClick={() => openDeleteConfirm(report)}
                            disabled={actionLoading === report._id}
                            title="Remove / Delete"
                          >
                            <AlertTriangle className="w-5 h-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
               </tbody>
              :
              <tbody className="text-center">
                <p className="text-gray-500 text-xl">No Reports for now</p>
              </tbody>
              
            }
          
        </table>
        </ResponsiveTable>

        {/* {filteredReports.length === 0 && (
          <p className="text-center py-8 text-gray-500">
            No reports found.
          </p>
        )} */}
      </div>

      {/* View Content modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#F54A0C]">Report Content</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <>
              <div className="rounded-md border border-[#D0D5DD] px-3 py-2 text-sm bg-gray-50">
                <span className="font-medium">Reason:</span> {selectedReport.reason}
              </div>
              <div className="rounded-md border border-[#D0D5DD] px-3 py-2 text-sm bg-gray-50 whitespace-pre-wrap">
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

      {/* Delete confirmation */}
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
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
