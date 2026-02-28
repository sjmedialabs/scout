"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Target,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  FileText,
  Handshake,
  ChevronDown,
  Clock,
  Check,
  Eye
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
import {  Download } from "lucide-react"


import { useState,useEffect,useMemo } from "react"
import { Lead } from "@/lib/types"
import { authFetch } from "@/lib/auth-fetch"

const LeadGenerationPage = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const leadsPerPage = 5

  // 🔹 Fetch
  const loadData = async () => {
    setLoading(true)
    try {
      const res = await authFetch("/api/leads")
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setLeads(data.data)
    } catch (err: any) {
      console.log(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 🔹 Filtering
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = statusFilter
        ? lead.status === statusFilter
        : true

      const leadDate = new Date(lead.createdAt)

      const matchesStart = startDate
        ? leadDate >= new Date(startDate)
        : true

      const matchesEnd = endDate
        ? leadDate <= new Date(endDate)
        : true

      return matchesSearch && matchesStatus && matchesStart && matchesEnd
    })
  }, [leads, search, statusFilter, startDate, endDate])

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage)

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * leadsPerPage,
    currentPage * leadsPerPage
  )

  // 🔹 Update Status
  const updateStatus = async (id: string) => {
    try {
      const res = await authFetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cleared" }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === id ? { ...lead, status: "cleared" } : lead
        )
      )
    } catch (err: any) {
      console.log(err.message)
    }
  }

  if(loading){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-orangeButton my-custom-class h-6 mb-1">
          Lead Management
        </h1>
        <p className="text-gray-500 text-sm">
          Track and manage qualified leads attributed to Spark platform
        </p>
      </div>

     <div className="p-6 bg-[#F9FAFB] min-h-screen">

      {/* 🔹 Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 max-w-[95vw] overflow-x-auto">
            <div className="flex items-center gap-3 ">

                {/* Search */}
                <Input
                placeholder="Search name or email..."
                className="h-10 w-[220px] border border-gray-400 rounded-[8px] placeholder:text-gray-400"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                }}
                />

                {/* Status Filter */}
                <Select
                value={statusFilter}
                onValueChange={(value) => {
                    setStatusFilter(value === "all" ? "" : value)
                    setCurrentPage(1)
                }}
                >
                <SelectTrigger className="h-10 w-[200px] data-[placeholder]:text-gray-400 border border-gray-400 rounded-[8px] text-gray-400">
                    <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cleared">Cleared</SelectItem>
                </SelectContent>
                </Select>

                {/* Start Date */}
                <Input
                type={startDate ? "date" : "text"}
                placeholder="Filter by Start Date"
                className="h-10 w-[200px] border border-gray-400 rounded-[8px] placeholder:text-gray-400"
                value={startDate}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                    if (!startDate) e.target.type = "text"
                }}
                onChange={(e) => setStartDate(e.target.value)}
                />

                {/* End Date */}
                <Input
                type={endDate ? "date" : "text"}
                placeholder="Filter by End Date"
                className="h-10 w-[200px] border border-gray-400 rounded-[8px] placeholder:text-gray-400"
                value={endDate}
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                    if (!endDate) e.target.type = "text"
                }}
                onChange={(e) => setEndDate(e.target.value)}
                />

                {/* Clear Button */}
                <Button
                className="h-10 border border-gray-400 rounded-[8px]"
                onClick={() => {
                    setSearch("")
                    setStatusFilter("")
                    setStartDate("")
                    setEndDate("")
                }}
                >
                Clear
                </Button>

            </div>
        </div>

      {/* 🔹 Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left px-4 py-3">Created</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Mobile</th>
              <th className="text-left px-4 py-3">Country</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-center px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">
                  No Leads Found
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => (
                <tr key={lead._id} className="border-t">
                  <td className="px-4 py-3">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3">
                   {lead.countryCode}
                  </td>
                  <td className="px-4 py-3">{lead.country}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        lead.status === "cleared"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center flex justify-center gap-3">

                    {/* View */}
                    <button
                      onClick={() => {
                        setSelectedLead(lead)
                        setIsOpen(true)
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </button>

                    {/* Update */}
                    {lead.status === "pending" && (
                      <button
                        onClick={() => updateStatus(lead._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Check size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* 🔹 View Modal */}
     <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold">
        Lead Details
      </DialogTitle>
    </DialogHeader>

    {selectedLead && (
      <div className="space-y-8 text-sm">

        {/* ================= CONTACT INFORMATION ================= */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold border-b pb-2">
            Contact Information
          </h3>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium text-gray-900">
                {selectedLead.name}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-900">
                {selectedLead.email}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Mobile</p>
              <p className="font-medium text-gray-900">
                {selectedLead.countryCode} {selectedLead.contactNumber}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Country</p>
              <p className="font-medium text-gray-900">
                {selectedLead.country}
              </p>
            </div>
          </div>
        </div>

        {/* ================= PROJECT INFORMATION ================= */}
        {(selectedLead.projectTitle ||
          selectedLead.category ||
          selectedLead.description ||
          selectedLead.minbudget ||
          selectedLead.timeline) && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold border-b pb-2">
              Project Information
            </h3>

            <div className="grid grid-cols-2 gap-6">

              {selectedLead.projectTitle && (
                <div>
                  <p className="text-gray-500">Project Title</p>
                  <p className="font-medium text-gray-900">
                    {selectedLead.projectTitle}
                  </p>
                </div>
              )}

              {selectedLead.category && (
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">
                    {selectedLead.category}
                  </p>
                </div>
              )}

              {(selectedLead.minbudget ||
                selectedLead.maxbudget) && (
                <div>
                  <p className="text-gray-500">Budget Range</p>
                  <p className="font-medium text-gray-900">
                    ₹{selectedLead.minbudget} - ₹
                    {selectedLead.maxbudget}
                  </p>
                </div>
              )}

              {selectedLead.timeline && (
                <div>
                  <p className="text-gray-500">Timeline</p>
                  <p className="font-medium text-gray-900">
                    {selectedLead.timeline}
                  </p>
                </div>
              )}

              {selectedLead.description && (
                <div className="col-span-2">
                  <p className="text-gray-500">Project Description</p>
                  <p className="font-medium bg-gray-50 p-4 rounded-lg leading-relaxed">
                    {selectedLead.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= MESSAGE ================= */}
        {selectedLead.message && (
          <div className="space-y-2">
            <h3 className="text-base font-semibold border-b pb-2">
              Client Message
            </h3>
            <p className="font-medium bg-gray-50 p-4 rounded-lg leading-relaxed">
              {selectedLead.message}
            </p>
          </div>
        )}

        {/* ================= ATTACHMENTS ================= */}
        {selectedLead.attachmentUrls &&
          selectedLead.attachmentUrls.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">
                Attachments
              </h3>

              <div className="space-y-3">
                {selectedLead.attachmentUrls.map(
                  (url: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <p className="text-sm font-medium truncate max-w-[300px]">
                          {url.split("/").pop()}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(url, "_blank")}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        {/* ================= META INFORMATION ================= */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold border-b pb-2">
            Lead Status
          </h3>

          <div className="flex items-center justify-between">
            <Badge
              variant={
                selectedLead.status === "cleared"
                  ? "default"
                  : "secondary"
              }
              className="capitalize px-3 py-1"
            >
              {selectedLead.status}
            </Badge>

            <p className="text-gray-500 text-xs">
              Created At:{" "}
              {new Date(
                selectedLead.createdAt
              ).toLocaleString()}
            </p>
          </div>
        </div>

      </div>
    )}
  </DialogContent>
</Dialog>
    </div>
    </div>
  )
}

export default LeadGenerationPage
