"use client";

import EditSubscriberModal from "@/components/EditSubscriberModal";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Pencil, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Plus,
} from "lucide-react";

/* ---------------- TYPES ---------------- */

type Subscriber = {
  company: string;
  email: string;
  plan: "Enterprise" | "Pro" | "Basic";
  status: "Active" | "Inactive" | "Suspended";
  users: number;
  revenue: number;
  joined: string;
};

/* ---------------- FALLBACK DATA ---------------- */

const fallbackSubscribers: Subscriber[] = [
  {
    company: "Tech Corp",
    email: "seeker@example.com",
    plan: "Enterprise",
    status: "Active",
    users: 45,
    revenue: 5000,
    joined: "2024-01-15",
  },
  {
    company: "Tech Corp",
    email: "seeker@example.com",
    plan: "Pro",
    status: "Active",
    users: 12,
    revenue: 1500,
    joined: "2024-02-20",
  },
  {
    company: "Tech Corp",
    email: "seeker@example.com",
    plan: "Basic",
    status: "Active",
    users: 5,
    revenue: 500,
    joined: "2024-03-10",
  },
  {
    company: "Tech Corp",
    email: "seeker@example.com",
    plan: "Enterprise",
    status: "Inactive",
    users: 18,
    revenue: 0,
    joined: "2023-11-05",
  },
  {
    company: "Tech Corp",
    email: "seeker@example.com",
    plan: "Pro",
    status: "Suspended",
    users: 120,
    revenue: 2000,
    joined: "2023-09-12",
  },
];

export default function AllSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(fallbackSubscribers);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

 
//   useEffect(() => {
//     async function loadSubscribers() {
//       try {
//         const res = await fetch("/api/admin/subscribers");
//         if (!res.ok) throw new Error();
//         const data = await res.json();
//         setSubscribers(data);
//       } catch {
      
//       }
//     }
//     loadSubscribers();
//   }, []);

  const filtered = subscribers.filter((s) => {
    const matchesSearch =
      s.company.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "all" || s.status.toLowerCase() === status;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 space-y-4">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold my-custom-class text-orangeButton">
            Subscribers
          </h1>
          <p className="text-gray-500 my-custom-class text-xl">
            Manage and monitor your customer subscriptions
          </p>
        </div>
        
        <Link href="/admin/subscribers/all-subscribers/add">
        <Button className="bg-black text-white rounded-3xl my-custom-class flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Subscriber
        </Button>
        </Link>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row  gap-4">
        <div className="border rounded-xl w-100">
        <Input
          placeholder="Search Subscribers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:max-w-sm my-custom-class placeholder:text-gray-500"
        />
        </div>
        <div className="rounded-xl border">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="md:w-48 my-custom-class">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="my-custom-class">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-md">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="text-left text-sm font-semibold border-b">
              <th className="p-4 my-custom-class">Company</th>
              <th className="p-4 my-custom-class">Plan</th>
              <th className="p-4 my-custom-class">Status</th>
              <th className="p-4 my-custom-class">Users</th>
              <th className="p-4 my-custom-class">Monthly Revenue</th>
              <th className="p-4 my-custom-class">Join Date</th>
              <th className="p-4 my-custom-class">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((sub, i) => (
              <tr
                key={i}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <div className="font-bold text-sm h-4 my-custom-class">{sub.company}</div>
                  <div className="text-sm text-gray-500">{sub.email}</div>
                </td>

                <td className="p-4">
                  <Badge
                    className={
                      sub.plan === "Enterprise"
                        ? "bg-blue-100 text-blue-600 rounded-2xl"
                        : sub.plan === "Pro"
                        ? "bg-pink-100 text-pink-600 rounded-2xl"
                        : "bg-gray-100 text-gray-600 rounded-2xl"
                    }
                  >
                    {sub.plan}
                  </Badge>
                </td>

                <td className="p-4">
                  <Badge
                    className={
                      sub.status === "Active"
                        ? "bg-green-100 text-green-600 rounded-2xl"
                        : sub.status === "Inactive"
                        ? "bg-gray-200 text-gray-600 rounded-2xl"
                        : "bg-red-200 text-red-600 rounded-2xl"
                    }
                  >
                    {sub.status}
                  </Badge>
                </td>

                <td className="p-4 text-gray-500 text-sm">{sub.users.toString().padStart(2, "0")}</td>

                <td className="p-4 text-sm">${sub.revenue.toLocaleString()}</td>

                <td className="p-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {sub.joined}
                </td>

                <td className="p-4">
                <div className="flex items-center gap-3">
                    <EditSubscriberModal subscriber={sub} />
                    <UserX className="h-4 w-4 cursor-pointer text-gray-700 hover:text-black" 
                    />
                </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
