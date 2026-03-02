"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/components/times-ago";
import { authFetch } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";

interface Notification {
  _id: string;
  title: string;
  message: string; 
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

interface Props {
  onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: Props) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔹 Fetch Admin Notifications
  // const fetchNotifications = async () => {
  //   try {
  //     const res = await authFetch(`/api/admin/notifications`);
  //     const data = await res.json();

  //     setNotifications((data.data || []).filter((n: Notification) => !n.isRead));
  //   } catch (error) {
  //     console.error("Failed to fetch admin notifications", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  // 🔹 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const selected = notifications.find((n) => n._id === id);

    try {
      const res = await authFetch(`/api/admin/notifications/${id}`, {
        method: "PUT",
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.filter((item) => item._id !== id)
        );
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    }

    if (selected?.linkUrl) {
      router.push(selected.linkUrl);
    }
  };

  const unreadCount = notifications.length;

  return (
    <header className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-40">
      
      {/* 🔹 Left Section */}
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        {/* <h1 className="text-lg font-semibold text-gray-800">
          Admin Dashboard
        </h1> */}
      </div>

      {/* 🔹 Right Section */}
      <div className="relative mr-2" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="relative"
        >
          <Bell className="h-6 w-6 text-gray-700" />

          {/* {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )} */}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg border z-50 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={cn(
                    "p-3 text-sm border-b hover:bg-gray-50 cursor-pointer",
                    "bg-gray-100"
                  )}
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  <div className="font-semibold text-gray-700">
                    {notification.title}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <div className="text-xs text-gray-400 mt-1">
                    {timeAgo(notification.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
}