"use client";

import { useEffect, useState } from "react";
import { UserManagement } from "@/components/admin/user-management";
import { AdminUser } from "@/lib/types";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await authFetch("/api/users?limit=100&page=1");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUserStatus = (
    userId: string,
    status: AdminUser["status"],
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u)),
    );
    console.log(`Updated user ${userId} status to ${status}`);
  };
  const handleSendMessage = (userId: string, message: string) => {
    console.log(`Sending message to user ${userId}:`, message);
    // In real app, this would send the message
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <UserManagement
      users={users}
      onUpdateUserStatus={handleUpdateUserStatus}
      onSendMessage={handleSendMessage}
    />
  );
}
