"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "../times-ago"
import { authFetch } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";

interface Notification {
  _id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Props {
  user: any;
  onMenuClick?: () => void;
}

export default function AgencyHeader({ user, onMenuClick }: Props) {

    const router=useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    

    try {
      const res = await authFetch(`/api/notifications`);
      const data = await res.json();

      setNotifications((data.data || []).filter((eachItem)=>!eachItem.isRead));
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  },[]);

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

   const handleMarkNotificationAsRead = async (notificationId: string) => {
      console.log("notification Id recievd:::", notificationId);
      const filteredNotification = notifications.find(
        (item) => item._id === notificationId,
      );
      try {
        
  
      const res=  await authFetch(
          `/api/notifications/${notificationId}`,
          { method: "PUT" },
        );
        console.log("response of the mark as read::", res);
        if (res.ok) {
          setNotifications((prev) =>
            prev.filter((eachItem) => eachItem._id !== notificationId),
          );
        }
      } catch (error) {
        console.log("Failed to update the status of the notification::", error);
      }
      if (filteredNotification) {
        router.push(filteredNotification?.linkUrl);
      }
    };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
  <header className="flex items-center justify-end p-3 border-b border-border bg-white">
    
    {/* Notification Section */}
    <div className="relative mr-2 lg:mr-10" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative cursor-pointer"
      >
        <Bell className="h-6 w-6 text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
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
                  !notification.isRead && "bg-gray-100"
                )}
                onClick={() =>
                  handleMarkNotificationAsRead(notification._id)
                }
              >
                <div className="text-md text-gray-600 font-semibold">
                  {notification.title}
                </div>
                <p className="text-xs text-[#656565] mt-1">
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
