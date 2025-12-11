"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockAdminUsers } from "@/lib/mock-data";
import { UserCheck, FileText, AlertCircle, XCircle } from "lucide-react";

export default function UserVerificationPage() {
  const [users, setUsers] = useState(
    mockAdminUsers.filter((u) => u.status === "pending")
  );
  const [loading, setLoading] = useState(false);

  /*
  ------------------------------------------------------
  OPTIONAL: Fetch verification users from backend API
  ------------------------------------------------------
  useEffect(() => {
    async function fetchPendingVerifications() {
      const res = await fetch("/api/admin/user-verification");
      const data = await res.json();
      setUsers(data);
    }
    fetchPendingVerifications();
  }, []);
  */

  const updateUserStatus = async (userId: string, status: any) => {
    setLoading(true);

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );

    console.log(`User ${userId} verification updated: ${status}`);

    // Future API:
    // await fetch(`/api/admin/user-verification/update`, { method: "POST", body: JSON.stringify({ userId, status }) })

    setLoading(false);
  };

  const requestMoreInfo = (userId: string) => {
    console.log("Requesting more information from:", userId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">User Verification</h1>
        <p className="text-gray-500">
          Review documents and verify provider/business profiles.
        </p>
      </div>

      {/* Pending Verifications */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold">Pending Requests</h2>

        {users.length === 0 && (
          <p className="text-gray-500">No pending verification requests.</p>
        )}

        {users.map((user) => (
          <div
            key={user.id}
            className="p-5 border-b last:border-0 flex flex-col md:flex-row justify-between"
          >
            {/* User info */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-yellow-600" />
              </div>

              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <Badge className="mt-2 bg-yellow-100 text-yellow-700">
                  Awaiting Verification
                </Badge>

                {/* Optional documents */}
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-2 text-blue-600 cursor-pointer hover:underline">
                    <FileText className="w-4 h-4" />
                    View Documents
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-4 md:mt-0">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                onClick={() => updateUserStatus(user.id, "active")}
                disabled={loading}
              >
                <UserCheck className="w-4 h-4" />
                Approve
              </Button>

              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => requestMoreInfo(user.id)}
                disabled={loading}
              >
                <AlertCircle className="w-4 h-4" />
                Request More Info
              </Button>

              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={() => updateUserStatus(user.id, "rejected")}
                disabled={loading}
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Note Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Verification Process</h3>
        <p className="text-gray-500">
          Admins must carefully review documents and ensure provider information
          matches legal business records. Approved users gain provider
          privileges.
        </p>
      </div>
    </div>
  );
}
