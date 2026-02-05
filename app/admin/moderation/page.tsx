"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  DollarSign,
  Clock,
  Inbox,
} from "lucide-react";

// --------------------
// TYPES
// --------------------
interface ReportItem {
  id: string;
  type: string;
  reason: string;
  status: "all" | "pending" | "resolved" | "dismissed";
  createdAt: string;
  reporter: string;
  itemId: string;
}

interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  budgetDescription: string;
  budgetMin: number;
  budgetMax: number;
  timeline: string;
  attachment?: string;
  allocatedToId?: string;
}

// --------------------
// MOCK DATA
// --------------------
const mockReportedContent: ReportItem[] = [
  {
    id: "1",
    type: "project",
    reason: "Spam content",
    status: "pending",
    createdAt: new Date().toISOString(),
    reporter: "john@example.com",
    itemId: "proj_1",
  },
];

const mockProject: Project = {
  _id: "proj_1",
  title: "Website Redesign for SaaS Platform",
  category: "Web Design",
  description:
    "Redesign the SaaS marketing website with a modern UI, improved UX, and conversion-focused layout.",
  budgetDescription: "Fixed budget based on milestones",
  budgetMin: 50000,
  budgetMax: 80000,
  timeline: "4–6 weeks",
  attachment: "project-brief.pdf",
  allocatedToId: "user_123",
};

// --------------------
// PAGE
// --------------------
export default function ModerationPage() {
  const [reports] = useState<ReportItem[]>(mockReportedContent);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("All");

  const uniqueTypes = Array.from(
    new Set(reports.map((report) => report.type)),
  );

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All types");
    setStatusFilter("All");
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
          Content Moderation
        </h1>
        <p className="text-gray-500 my-custom-class">
          Review and moderate reported content
        </p>
      </div>

      {/* FILTERS (UNCHANGED) */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-gray-200 rounded-lg h-8"
          />
        </div>

        <select
          className="w-full lg:w-1/5 border rounded-lg px-3 py-2 text-sm"
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

      
      <div className="rounded-2xl border border-[#e6e6e6] bg-white shadow-sm p-6 flex flex-col lg:flex-row gap-6">
        {/* LEFT */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge className="rounded-full bg-[#eef7fe] text-[#2c34a1]">
              {mockProject.category}
            </Badge>

            {/* {mockProject.allocatedToId && (
              <Badge className="rounded-full bg-green-100 text-green-700">
                Allocated
              </Badge>
            )} */}
          </div>

          <h3 className="text-xl font-semibold text-[#2c34a1]">
            {mockProject.title}
          </h3>

          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            {mockProject.description}
          </p>
        
        <div className="flex flex-col-3 mt-3 gap-10  w-full">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-[#ff4d00]" />
            <span className="font-semibold">
              ₹{mockProject.budgetMin.toLocaleString()} – ₹
              {mockProject.budgetMax.toLocaleString()}
            </span>
          </div>

          {/* <div className="text-xs text-gray-500">
            {mockProject.budgetDescription}
          </div> */}

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-[#ff4d00]" />
            <span className="font-semibold">{mockProject.timeline}</span>
          </div>

          {mockProject.attachment && (
            <div className="flex items-center gap-2 text-sm">
              <Inbox className="h-4 w-4 text-[#ff4d00]" />
              <span className="text-blue-600 underline cursor-pointer">
                {mockProject.attachment}
              </span>
            </div>
          )}
        </div>
        <div className="flex-col-2 mt-3  w-full">
        <Button
          className="lg:ml-auto bg-orangeButton text-white rounded-full px-6 mr-3"
          
        >
          Accept
        </Button>

        <Button
          className="lg:ml-auto bg-black text-white rounded-full px-6"
          
        >
          Reject
        </Button>
        </div>
        </div>
        
      </div>
    </div>
  );
}