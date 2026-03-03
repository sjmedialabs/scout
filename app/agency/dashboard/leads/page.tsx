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
import { toast } from "@/lib/toast"


import { useState,useEffect,useMemo,useRef } from "react"
import { Lead,Requirement } from "@/lib/types"
import { authFetch } from "@/lib/auth-fetch"
import { BrowseRequirements } from "@/components/provider/browse-requirements";

const LeadGenerationPage = () => {
  const [leadTab, setLeadTab] = useState<
      "opted"  | "direct"
    >("opted");
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdown(null)
    }
  }

  document.addEventListener("mousedown", handleClickOutside)

  return () => {
    document.removeEventListener("mousedown", handleClickOutside)
  }
}, [])
  

  const leadsPerPage = 5

  // 🔹 Fetch
  const loadData = async () => {
    setLoading(true)
    try {
      const res = await authFetch("/api/leads")
      const data = await res.json()
      const requirementRes = await authFetch("/api/requirements");
      const requirementData=await requirementRes.json();
      if (!res.ok || !requirementRes) throw new Error(data.message)
      setLeads(data.data)
       setRequirements(
          requirementData.requirements.filter(
            (eachItem) => eachItem.status.toLowerCase() === "open",
          ),
        );
    } catch (err: any) {
      console.log(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useEffect(() => {
  const closeDropdown = () => {
    setOpenDropdown(null)
  }

  window.addEventListener("click", closeDropdown)

  return () => {
    window.removeEventListener("click", closeDropdown)
  }
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

  //  Update Status
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await authFetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)


      setLeads((prev) =>
        prev.map((lead) =>
          lead._id === id ? { ...lead, status: newStatus } : lead
        )
      )
      toast.success("Successfully updated the status of the lead")
    } catch (err: any) {
      console.log(err.message)
      toast.error("Failed to jupdated the status of lead")
    }
  }
  const getStatusStyles = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700"
    case "contacted":
      return "bg-blue-100 text-blue-700"
    case "won":
      return "bg-green-100 text-green-700"
    case "dropped":
      return "bg-red-100 text-red-700"
    default:
      return "bg-gray-100 text-gray-700"
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
      {/* TABS */}
      <div className="inline-flex bg-[#e6edf5] rounded-full p-1 gap-1">
        {["opted", "direct"].map((tab) => (
          <button
            key={tab}
            onClick={() => setLeadTab(tab as any)}
            className={`px-4 py-2 cursor-pointer text-sm rounded-full transition ${
              leadTab === tab
                ? "bg-orangeButton text-white my-custom-class"
                : "text-gray-700 my-custom-class"
            }`}
          >
            {tab === "opted"
              ? "Opted Leads"
              :"Direct Leads"}
          </button>
        ))}
      </div>

     {
      leadTab==="opted" &&(
        <div className="p-2 lg:p-6 bg-[#F9FAFB] min-h-screen">

            {/* 🔹 Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 max-w-[95vw] overflow-x-auto">
                  <div className="flex items-center gap-3 ">

                      {/* Search */}
                      <Input
                      placeholder="Search name or email..."
                      className="h-9 min-w-[150px] max-w-[220px] border border-gray-400 rounded-[8px] placeholder:text-gray-400"
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
                      <SelectTrigger className="h-9 min-w-[150px] max-w-[220px] data-[placeholder]:text-gray-400 border border-gray-400 rounded-[8px]  text-[#000]">
                          <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="won">Won</SelectItem>
                          <SelectItem value="dropped">Dropped</SelectItem>
                      </SelectContent>
                      </Select>

                      {/* Start Date */}
                      <Input
                      type={startDate ? "date" : "text"}
                      placeholder="Filter by Start Date"
                      className="h-9 min-w-[150px] max-w-[220px] border border-gray-400 rounded-[8px] placeholder:text-gray-400"
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
                      className="h-9 min-w-[150px] max-w-[220px] border border-gray-400 rounded-[8px] placeholder:text-gray-400"
                      value={endDate}
                      onFocus={(e) => (e.target.type = "date")}
                      onBlur={(e) => {
                          if (!endDate) e.target.type = "text"
                      }}
                      onChange={(e) => setEndDate(e.target.value)}
                      />

                      {/* Clear Button */}
                      <Button
                      className="h-[40px]  border border-gray-400 rounded-[8px]"
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
            <div className="bg-white rounded-lg min-h-screen shadow-sm max-w-[95vw] overflow-x-auto">
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
                        {lead.countryCode} {lead.contactNumber}
                        </td>
                        <td className="px-4 py-3">{lead.country}</td>
                        <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs capitalize ${getStatusStyles(
                            lead.status
                          )}`}
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
                            className="text-blue-600 cursor-pointer hover:text-blue-800"
                          >
                            <Eye size={18} />
                          </button>

                          {(lead.status === "pending" || lead.status === "contacted") && (
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenDropdown(openDropdown === lead._id ? null : lead._id)
                                }}
                                className="text-gray-600 cursor-pointer hover:text-black"
                              >
                                <ChevronDown size={18} />
                              </button>

                              {openDropdown === lead._id && (
                                <div
                                  className="absolute right-0 top-6 w-32 bg-white border rounded-md shadow-md z-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {lead.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => updateStatus(lead._id, "contacted")}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                      >
                                        Contacted
                                      </button>
                                      <button
                                        onClick={() => updateStatus(lead._id, "won")}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                      >
                                        Won                                      </button>
                                      <button
                                        onClick={() => updateStatus(lead._id, "dropped")}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                      >
                                        Dropped
                                      </button>
                                    </>
                                  )}

                                  {lead.status === "contacted" && (
                                    <>
                                      <button
                                        onClick={() => updateStatus(lead._id, "closed")}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                      >
                                        Closed
                                      </button>
                                      <button
                                        onClick={() => updateStatus(lead._id, "lost")}
                                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                      >
                                        Lost
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
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
                <DialogContent className="min-w-2xl max-w-7xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      Lead Details
                    </DialogTitle>
                  </DialogHeader>

                {selectedLead && (
                    <div className="space-y-10 text-sm w-full">

                      {/* ================= CONTACT INFORMATION ================= */}
                      <div className="space-y-6">
                      <div className="flex flex-row justify-between border-b pb-2 items-center">
                        <h3 className="text-lg font-semibold ">
                          Contact Information
                        </h3>
                        <div>
                          <span
                              className={`px-3 py-1 rounded-full text-xs capitalize ${getStatusStyles(
                                selectedLead.status
                              )}`}
                            >
                              {selectedLead.status}
                            </span>
                        </div>
                      </div>

                        <div className="grid grid-cols-2 gap-6">

                          {/* Full Name */}
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Full Name
                            </label>
                            <div className="bg-gray-100 border rounded-md px-3 py-2">
                              {selectedLead.name}
                            </div>
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Email
                            </label>
                            <div className="bg-gray-100 border rounded-md px-3 py-2">
                              {selectedLead.email}
                            </div>
                          </div>

                          {/* Mobile */}
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Mobile
                            </label>
                            <div className="bg-gray-100 border rounded-md px-3 py-2">
                              {selectedLead.countryCode}
                            </div>
                          </div>

                          {/* Country */}
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Country
                            </label>
                            <div className="bg-gray-100 border rounded-md px-3 py-2">
                              {selectedLead.country}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ================= PROJECT INFORMATION ================= */}
                      {(selectedLead.projectTitle ||
                        selectedLead.category ||
                        selectedLead.description ||
                        selectedLead.minbudget ||
                        selectedLead.timeline) && (
                        <div className="space-y-6">
                          <h3 className="text-lg font-semibold border-b pb-2">
                            Project Information
                          </h3>

                          <div className="grid grid-cols-2 gap-6">

                            {selectedLead.projectTitle && (
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Project Title
                                </label>
                                <div className="bg-gray-100 border rounded-md px-3 py-2">
                                  {selectedLead.projectTitle}
                                </div>
                              </div>
                            )}

                            {selectedLead.category && (
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Category
                                </label>
                                <div className="bg-gray-100 border rounded-md px-3 py-2">
                                  {selectedLead.category}
                                </div>
                              </div>
                            )}

                            {(selectedLead.minbudget || selectedLead.maxbudget) && (
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Budget Range
                                </label>
                                <div className="bg-gray-100 border rounded-md px-3 py-2">
                                  ₹{selectedLead.minbudget} - ₹{selectedLead.maxbudget}
                                </div>
                              </div>
                            )}

                            {selectedLead.timeline && (
                              <div>
                                <label className="block text-sm font-medium mb-1">
                                  Timeline
                                </label>
                                <div className="bg-gray-100 border rounded-md px-3 py-2">
                                  {selectedLead.timeline}
                                </div>
                              </div>
                            )}

                            {selectedLead.description && (
                              <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                  Project Description
                                </label>
                                <div className="bg-gray-100 border rounded-md px-3 py-3 leading-relaxed">
                                  {selectedLead.description}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ================= CLIENT MESSAGE ================= */}
                      {selectedLead.message && (
                        <div className="space-y-3">
                          <h3 className="text-lg font-semibold border-b pb-2">
                            Client Message
                          </h3>
                          <div className="bg-gray-100 border rounded-md px-3 py-3 leading-relaxed">
                            {selectedLead.message}
                          </div>
                        </div>
                      )}

                      {/* ================= ATTACHMENTS ================= */}
                      {selectedLead.attachmentUrls &&
                        selectedLead.attachmentUrls.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold border-b pb-2">
                              Attachments
                            </h3>

                            <div className="space-y-3">
                              {selectedLead.attachmentUrls.map(
                                (url: string, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-100 border rounded-md px-4 py-3"
                                  >
                                    <div className="flex items-center gap-3">
                                      <FileText className="w-5 h-5 text-gray-500" />
                                      <p className="text-sm font-medium truncate max-w-[300px]">
                                        Attachments {index+1}
                                      </p>
                                    </div>

                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => window.open(url, "_blank")}
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      Download
                                    </Button>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      {/* ================= STATUS ================= */}
                      {/* <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b pb-2">
                          Lead Status
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Current Status
                            </label>
                            <div className="bg-gray-100 border rounded-md px-3 py-2 capitalize">
                              {selectedLead.status}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">
                              Created At
                            </label>
                            <div className="bg-gray-100 border rounded-md px-3 py-2">
                              {new Date(selectedLead.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div> */}

                    </div>
                  )}
                </DialogContent>
              </Dialog>
     </div>
      )
     }
     {
      leadTab==="direct" &&(
        <div>
          <BrowseRequirements
                    requirements={requirements}
                   
                  />

        </div>
      )
     }
    </div>
  )
}

export default LeadGenerationPage
