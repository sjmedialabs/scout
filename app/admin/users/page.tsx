"use client";

import { useEffect, useState } from "react";
import { UserManagement } from "@/components/admin/user-management";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users?limit=100&page=1");
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

  if (loading) return <p className="p-6">Loading...</p>;

  return <UserManagement users={users} />;
}
