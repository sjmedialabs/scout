"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Check, X,CalendarDays,
  Folder,
  Pencil,
  FileText,Eye,User } from "lucide-react";
import { authFetch } from "@/lib/auth-fetch";
import { toast } from "@/lib/toast";

interface ServiceRequest {
  _id: string;
  mainCategory: string;
  subCategory?: string;
  childCategory?: string;
  serviceName?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  userId?: {
    name?: string;
    email?: string;
  };
}

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewRequest, setViewRequest] = useState<ServiceRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await authFetch("/api/servicerequests");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRequests(data.serviceRequests || []);
    } catch (error) {
      console.error("Error loading service requests:", error);
      toast.error("Failed to load service requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let temp = [...requests];

    // Search filter (applies to service name/category or description)
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      temp = temp.filter(
        (req) =>
          (req.childCategory || req.serviceName || "").toLowerCase().includes(lowerSearch) ||
          (req.description || "").toLowerCase().includes(lowerSearch)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      temp = temp.filter(
        (req) => (req.status || "pending").toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredRequests(temp);
    setCurrentPage(1);
  }, [search, statusFilter, requests]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const openApproveModal = (id: string) => {
    setSelectedRequestId(id);
    setShowApproveModal(true);
  };

  const handleApprove = async () => {
    if (!selectedRequestId) return;
    setIsUpdating(true);
    try {
      const res = await authFetch(`/api/servicerequests/${selectedRequestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }), 
      });
      if (!res.ok) throw new Error("Failed to approve");
      toast.success("Service request approved!");
      setShowApproveModal(false);
      loadData();
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("Failed to approve service request.");
    } finally {
      setIsUpdating(false);
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedRequestId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }
    setIsUpdating(true);
    try {
      const res = await authFetch(`/api/servicerequests/${selectedRequestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", reason: rejectReason }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      toast.success("Service request rejected!");
      setShowRejectModal(false);
      loadData();
    } catch (error) {
      console.error("Reject error:", error);
      toast.error("Failed to reject service request.");
    } finally {
      setIsUpdating(false);
    }
  };

  const openViewModal = (req: ServiceRequest) => {
    setViewRequest(req);
    setShowViewModal(true);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold text-[#F54A0C]">Service Requests</h1>
        <p className="text-gray-500 text-sm">
          Manage and track custom service requests submitted by providers.
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-row justify-start items-center gap-3 overflow-x-auto max-w-[95vw] py-0">
        <div className="relative w-full max-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search service name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-[35px] border-gray-200 rounded-full placeholder:text-gray-400"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] h-[35px] rounded-full border-gray-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Button className="btn-blackButton h-[35px]" onClick={clearFilters}>
          Clear filter
        </Button>
      </div>

      {/* TABLE VIEW */}
      <div className="border rounded-xl w-full overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Service Name</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.length > 0 ? (
              paginatedRequests.map((req) => (
                <tr key={req._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-500 whitespace-nowrap">
                    {formatDate(req.createdAt)}
                  </td>
                  <td className="p-4 text-gray-500">
                    {req?.userId?.name || "--"}<br/>
                    {req?.userId?.email || "--"}
                  </td>
                  <td className="p-4 font-medium text-[#2c34a1]">
                    {req.childCategory || req.serviceName || "Unknown"}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant="secondary"
                      className={`text-xs capitalize rounded-full ${
                        ["accepted", "approved"].includes((req.status || "pending").toLowerCase())
                          ? "bg-[#d1fadf] text-[#008a2e]"
                          : (req.status || "").toLowerCase() === "rejected"
                          ? "bg-[#fee4e2] text-[#e02d3c]"
                          : "bg-[#fef0c7] text-[#dc6803]"
                      }`}
                    >
                      {req.status || "Pending"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-full border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => openViewModal(req)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" strokeWidth={2.5} />
                      </Button>
                     {
                      req.status?.toLowerCase()==="pending"&&(
                         <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 disabled:border-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => openApproveModal(req._id)}
                        disabled={isUpdating || ["accepted", "approved"].includes((req.status || "pending").toLowerCase())}
                        title="Approve Request"
                      >
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </Button>
                      )
                     }
                     {
                      req.status?.toLowerCase()==="pending" && (
                         <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0 rounded-full border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => openRejectModal(req._id)}
                        disabled={isUpdating || ["rejected"].includes((req.status || "").toLowerCase())}
                        title="Reject Request"
                      >
                        <X className="h-4 w-4" strokeWidth={3} />
                      </Button>
                      )
                     }
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No service requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 pb-4">
          <Button
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              size="sm"
              variant={currentPage === index + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* REJECT MODAL */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="md:max-w-md rounded-2xl flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle className="text-xl font-bold text-[#F4561C]">
              Reject Service Request
            </DialogTitle>
          </DialogHeader>

          <div className="px-4 py-2 space-y-4 w-full">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Reason for Rejection</label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
                className="bg-[#f2f1f6] border-[#D0D5DD] rounded-[6px] placeholder:text-[#b2b2b2]"
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t flex gap-4 shrink-0 justify-end">
            <Button
              variant="outline"
              className="btn-blackButton h-[35px]"
              onClick={() => setShowRejectModal(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              className="primary-button h-[35px]"
              onClick={handleReject}
              disabled={isUpdating}
            >
              {isUpdating ? "Rejecting..." : "Reject Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    {/* APPROVE MODAL */}
    <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
      <DialogContent className="md:max-w-md rounded-2xl flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle className="text-xl font-bold text-[#39A935]">
            Approve Service Request
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4 w-full">
          <p className="text-gray-700 text-sm">
            Are you sure you want to approve this service request?
          </p>
        </div>

        <div className="px-6 py-4 border-t flex gap-4 shrink-0 justify-end">
          <Button
            variant="outline"
            className="btn-blackButton h-[35px]"
            onClick={() => setShowApproveModal(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            className="primary-button h-[35px]"
            onClick={handleApprove}
            disabled={isUpdating}
          >
            {isUpdating ? "Approving..." : "Approve Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

      {/* VIEW DETAILS MODAL */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
  <DialogContent
    className="
      md:max-w-2xl
      rounded-3xl
      p-0
      max-h-[90vh]
      overflow-hidden
    "
  >

    {/* Header */}
    <DialogHeader
      className="
        flex flex-row items-center
        px-5 py-4
        border-b
        space-y-0
      "
    >

      <div className="flex items-center gap-2.5">

        {/* Smaller Icon */}
        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[#F4561C]">
          <FileText className="text-white h-4 w-4" />
        </div>

        <DialogTitle className="text-lg font-bold text-gray-900">
          Service Request Details
        </DialogTitle>

      </div>

      {/* ❌ Removed extra close button */}

    </DialogHeader>

    {viewRequest && (

      <div
        className="
          px-5 py-4
          space-y-4
          overflow-y-auto
          max-h-[calc(90vh-120px)]
        "
      >

        {/* USER + DATE */}
        <div className="grid grid-cols-2 gap-4">

          {/* User */}
          <div className="flex items-center gap-3">

            <div className="h-11 w-11 flex items-center justify-center rounded-lg bg-blue-100">
              <User className="h-5 w-5 text-blue-600" />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-800">
                User
              </p>

              <p className="text-sm font-semibold text-gray-700">
                {viewRequest.userId?.name || "--"}
              </p>

              <p className="text-xs text-gray-500">
                {viewRequest.userId?.email || "--"}
              </p>
            </div>

          </div>

          {/* Date */}
          <div className="flex items-center gap-3">

            <div className="h-11 w-11 flex items-center justify-center rounded-lg bg-green-100">
              <CalendarDays className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-800">
                Date Submitted
              </p>

              <p className="text-sm font-semibold text-gray-700">
                {formatDate(viewRequest.createdAt)}
              </p>
            </div>

          </div>

        </div>

        {/* CATEGORY PATH */}
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">

          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-100">
            <Folder className="h-4 w-4 text-purple-600" />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-800">
              Service Category Path
            </p>

            <p className="text-sm text-gray-600">
              {viewRequest.mainCategory}
              {viewRequest.subCategory &&
                ` / ${viewRequest.subCategory}`}
            </p>
          </div>

        </div>

        {/* SERVICE NAME */}
        <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">

          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-100">
            <Pencil className="h-4 w-4 text-orange-600" />
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-800">
              Service Name
            </p>

            <p className="text-sm text-gray-600">
              {viewRequest.childCategory ||
                viewRequest.serviceName ||
                "Unknown"}
            </p>
          </div>

        </div>

        {/* DESCRIPTION */}
        <div className="flex gap-3 p-3 border rounded-lg bg-gray-50">

          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100">
            <FileText className="h-4 w-4 text-blue-600" />
          </div>

          <div className="w-full">

            <p className="text-xs font-semibold text-gray-800 mb-1">
              Description
            </p>

            <div className="p-3 bg-[#eef1f6] rounded-lg text-sm text-gray-600 leading-relaxed">
              {viewRequest.description ||
                "No description provided."}
            </div>

          </div>

        </div>

      </div>

    )}

    {/* Footer */}
    <div className="px-5 py-3 border-t flex justify-end">

      <Button
        onClick={() => setShowViewModal(false)}
        className="
          rounded-full
          px-6
          h-[38px]
          bg-gradient-to-r
          from-blue-600
          to-blue-700
          hover:opacity-90
          text-white
          text-sm
        "
      >
        Close
      </Button>

    </div>

  </DialogContent>
</Dialog>
    </div>
  );
}
