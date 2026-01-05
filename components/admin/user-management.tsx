"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function UserManagement({ users }: any) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      <div className="space-y-4">
        {users.map((user: any) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border"
          >
            {/* USER INFO */}
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              {user.company && (
                <p className="text-xs text-gray-400">{user.company}</p>
              )}
            </div>

            {/* ROLE */}
            <Badge className="capitalize">{user.role}</Badge>

            {/* ACTIVE STATUS */}
            <Badge variant={user.isActive ? "default" : "secondary"}>
              {user.isActive ? "Active" : "Inactive"}
            </Badge>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">
              {!user.isActive ? (
                <Button
                  size="sm"
                  onClick={() => console.log("Activate user", user.id)}
                >
                  Activate
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => console.log("Deactivate user", user.id)}
                >
                  Deactivate
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
