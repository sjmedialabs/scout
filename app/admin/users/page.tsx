"use client";

import { UserManagement } from "@/components/admin/user-management";
import { mockAdminUsers } from "@/lib/mock-data";

export default function Page() {
  return <UserManagement users={mockAdminUsers} />;
}
