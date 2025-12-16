"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Send } from "lucide-react";

export default function NotificationsPage() {
  const [message, setMessage] = useState("");

  const sendNotification = () => {
    if (!message.trim()) return;
    alert("System notification sent: " + message);
    setMessage("");
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">System Notifications</h1>
      <p className="text-gray-500">Send system-wide alerts to all users.</p>

      <div className="bg-white p-6 rounded-2xl border shadow space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-600" /> Create Notification
        </h2>

        <textarea
          className="w-full border rounded-xl p-4"
          rows={4}
          placeholder="Type your notification message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <Button className="flex items-center gap-2" onClick={sendNotification}>
          <Send className="w-4 h-4" /> Send Notification
        </Button>
      </div>
    </div>
  );
}
