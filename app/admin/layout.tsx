"use client";

import { AdminSidebar } from "./components/AdminSidebar";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex">
        <AdminSidebar />

        <main className="ml-72 w-full p-8 min-h-screen bg-slate-50">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
