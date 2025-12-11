"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, CreditCard, XCircle } from "lucide-react";

// ------------------------------
// MOCK SUBSCRIBERS (Replace with API)
// ------------------------------
const mockSubscribers = [
  {
    id: "sub-001",
    name: "John Doe",
    email: "john@example.com",
    plan: "Pro Plan",
    status: "active",
    renewal: "2025-12-12",
  },
  {
    id: "sub-002",
    name: "Sarah Miller",
    email: "sarah@example.com",
    plan: "Enterprise",
    status: "active",
    renewal: "2025-12-08",
  },
  {
    id: "sub-003",
    name: "Michael Brown",
    email: "michael@example.com",
    plan: "Basic Plan",
    status: "cancelled",
    renewal: "-",
  },
  {
    id: "sub-004",
    name: "Anita Sharma",
    email: "anita@example.com",
    plan: "Pro Plan",
    status: "pending",
    renewal: "2025-12-15",
  },
];

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState(mockSubscribers);
  const [search, setSearch] = useState("");

  /*
  ------------------------------------------------------
  OPTIONAL: Fetch subscribers from backend API
  ------------------------------------------------------
  useEffect(() => {
    async function loadSubscribers() {
      const res = await fetch("/api/admin/subscribers");
      const data = await res.json();
      setSubscribers(data);
    }
    loadSubscribers();
  }, []);
  */

  const cancelSubscription = (id: string) => {
    console.log("Cancel subscription for:", id);

    setSubscribers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "cancelled" } : s
      )
    );

    // Future API:
    // await fetch("/api/admin/subscribers/cancel", { method: "POST", body: JSON.stringify({ id }) });
  };

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase()) ||
    sub.email.toLowerCase().includes(search.toLowerCase()) ||
    sub.plan.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Subscribers Management</h1>
        <p className="text-gray-500">View and manage all subscription users.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow border flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          placeholder="Search subscribers by name, email, plan..."
          className="w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Subscribers List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold">All Subscribers</h2>

        {filteredSubscribers.length === 0 && (
          <p className="text-gray-400 text-center py-8 text-lg">
            No subscribers found.
          </p>
        )}

        {filteredSubscribers.map((sub) => (
          <div
            key={sub.id}
            className="p-5 border rounded-xl flex flex-col md:flex-row justify-between hover:shadow-lg transition"
          >
            {/* Left Section */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-700" />
              </div>

              <div>
                <h3 className="font-semibold text-lg">{sub.name}</h3>
                <p className="text-gray-500 text-sm">{sub.email}</p>

                <p className="mt-2 text-gray-700 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="font-medium">{sub.plan}</span>
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Renewal Date:{" "}
                  <span className="font-medium text-gray-600">
                    {sub.renewal}
                  </span>
                </p>

                <div className="mt-2">{statusBadge(sub.status)}</div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end justify-center mt-4 md:mt-0 gap-3">
              {sub.status === "active" && (
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={() => cancelSubscription(sub.id)}
                >
                  <XCircle className="w-4 h-4" />
                  Cancel Subscription
                </Button>
              )}

              {sub.status !== "active" && (
                <Button variant="outline" disabled>
                  No Actions Available
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
