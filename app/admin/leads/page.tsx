"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Mail, Phone, Trash2, CheckCircle } from "lucide-react";
import { authFetch } from "@/lib/auth-fetch";
import { ResponsiveTable } from "@/components/layout";
import { MobileFilterBar } from "@/components/layout";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";

interface ContactLead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  website?: string;
  country?: string;
  message?: string;
  status?: string;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<ContactLead | null>(null);

  async function loadLeads() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(ITEMS_PER_PAGE));
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);

      const res = await authFetch(`/api/admin/contacts?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to fetch leads");
      }
      const data = await res.json();
      setLeads(data.data || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, [page, statusFilter]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (page === 1) loadLeads();
      else setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function handleMarkContacted(lead: ContactLead) {
    setActionLoading(lead._id);
    try {
      const res = await authFetch(`/api/admin/contacts/${lead._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "contacted" }),
      });
      if (res.ok) await loadLeads();
    } finally {
      setActionLoading(null);
    }
  }

  function openDeleteConfirm(lead: ContactLead) {
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!leadToDelete) return;
    setActionLoading(leadToDelete._id);
    try {
      const res = await authFetch(`/api/admin/contacts/${leadToDelete._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteDialogOpen(false);
        setLeadToDelete(null);
        await loadLeads();
      }
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#F54A0C]">Leads</h1>
        <p className="text-gray-500 text-sm">Contact form submissions from the website</p>
      </div>

      <MobileFilterBar
        searchSlot={
          <div className="w-full flex-1">
      <Input
        placeholder="Search by name, email, phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full h-9 border border-gray-200 rounded-full placeholder:text-gray-500 text-sm"
      />
    </div>
        }
        activeFilterCount={statusFilter !== "all" ? 1 : 0}
        sheetTitle="Filter leads"
      >
        <div className="w-full md:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-9  md:min-w-[140px] border border-gray-200 rounded-full px-3 text-sm">
              <SelectValue placeholder="All" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="btn-blackButton h-[30px]" onClick={()=>{
          setSearch("");
          setStatusFilter("all")
        }}>
          Clear
        </Button>
      </MobileFilterBar>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F54A0C]" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <ResponsiveTable scrollOnMobile>
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Message</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Created</th>
                  <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.phone}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">
                        {lead.message || "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            (lead.status || "new") === "contacted"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }
                        >
                          {(lead.status || "new") === "contacted" ? "Contacted" : "New"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 hover:bg-transparent active:bg-transparent ${
                                      actionLoading === lead._id || (lead.status || "new") === "contacted"
                                        ? "cursor-not-allowed pacity-50"
                                        : "cursor-pointer"
                                    }`}
                            onClick={() => handleMarkContacted(lead)}
                            disabled={
                              actionLoading === lead._id || (lead.status || "new") === "contacted"
                            }
                            title="Mark as Contacted"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-transparent active:bg-transparent"
                            onClick={() => openDeleteConfirm(lead)}
                            disabled={actionLoading === lead._id}
                            title="Delete lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ResponsiveTable>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lead?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this contact lead. This action cannot be undone.
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
