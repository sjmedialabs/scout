"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CircleUserRound, LogOut, Menu, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "../times-ago"
import { authFetch } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context"
import { Button } from "../ui/button";

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

export default function ClientHeader({ user, onMenuClick }: Props) {
   const { logout } = useAuth()
    const router=useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const[profileDropdownOpen,setProfileDropdownOpen]=useState(false);
 const notificationRef = useRef<HTMLDivElement>(null);
const profileRef = useRef<HTMLDivElement>(null);
  const[seekerData,setSeekerData]=useState<any>(null);

  console.log("User details in header:::", user);

  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    

    try {
      const res = await authFetch(`/api/notifications`);
      const seekerRes=await authFetch(`/api/seeker/${user.id}`)
      
      if(!seekerRes.ok || !res.ok){
        throw new Error("Failed to fetch notifications or seeker data");
      }
      const seekerData=await seekerRes.json();
      const data = await res.json();
      setSeekerData(seekerData.data);

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
      notificationRef.current &&
      !notificationRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }

    if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node)
    ) {
      setProfileDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
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
          setDropdownOpen(false)
        }
      } catch (error) {
        console.log("Failed to update the status of the notification::", error);
      }
      if (filteredNotification) {
        router.push(filteredNotification?.linkUrl);
      }
    };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = async () => {
    await logout()
    router.replace("/login")
  }


  return (
    <header className="flex items-center justify-between min-h-[56px] sm:min-h-[60px] py-2 px-3 sm:px-4 md:px-5 lg:px-6 border-b border-border bg-[#fff]">
      
      {/* Left: hamburger (mobile) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden flex items-center justify-center min-h-[48px] min-w-[48px] -ml-2 rounded-lg touch-manipulation"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* <h1 className="text-lg font-semibold">
          Client Dashboard
        </h1> */}
      </div>

      {/* Right: Post requirement, Notifications, Profile */}
      <div className="flex flex-row gap-1 sm:gap-2 items-center">
        <div className="hidden lg:block">
          <Button
            size="sm"
            className="rounded-2xl text-xs bg-[#2C34A1] text-white border-none hover:bg-[#232a85] min-h-[48px] px-4 touch-manipulation"
            onClick={() => router.push("/client/dashboard/post-requirement")}
          >
            <span className="ml-2">Post Requirement</span>
          </Button>
        </div>
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative flex items-center justify-center min-h-[48px] min-w-[48px] rounded-lg touch-manipulation"
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
          >
            <Bell className="h-6 w-6 text-gray-700" />

          {/* 🔹 Unread Count Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {/* 🔹 Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg border z-50 max-h-96 overflow-y-auto [scrollbar-width:none] 
          [-ms-overflow-style:none]        
          [&::-webkit-scrollbar]:hidden">
            
            {/* 🔹 Header with View All */}
            <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
              <span className="text-sm font-semibold text-gray-700">
                Notifications
              </span>

              <button
                onClick={() => {
                  setDropdownOpen(false)
                  router.push("/client/dashboard/notifications")
                }}
                className="btn-blackButton w-[60px] "
              >
                View All
              </button>
            </div>

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
                  onClick={()=>handleMarkNotificationAsRead(notification._id)}
                >
                  <div className="text-md text-gray-600 font-semibold">{notification.title}</div>
                  <p className="text-xs text-[#656565]  mt-1">{notification.message}</p>
                  <div className="text-xs text-gray-400 mt-1">
                    {timeAgo(notification.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center justify-center min-h-[48px] min-w-[48px] rounded-full bg-gray-200 hover:bg-gray-300 touch-manipulation"
            aria-label="Profile menu"
          >
            {/* seekerData?.image ? <img src={seekerData.image} alt="" className="h-8 w-8 rounded-full object-cover" /> : */}
            <User className="h-5 w-5 text-gray-700" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg border z-50">
              <button
                type="button"
                className="flex flex-row items-center min-h-[48px] w-full px-4 text-sm border-b hover:bg-gray-50 cursor-pointer text-left touch-manipulation"
                onClick={() => { router.push("/client/dashboard/profile"); setProfileDropdownOpen(false); }}
              >
                <CircleUserRound className="h-5 w-5 shrink-0" />
                <span className="ml-2">Profile</span>
              </button>
              {/* <div className="p-3 text-sm border-b hover:bg-gray-50 cursor-pointer">
                Settings
              </div> */}
              <button
                type="button"
                className="flex flex-row items-center min-h-[48px] w-full px-4 text-sm border-b hover:bg-gray-50 cursor-pointer text-left touch-manipulation"
                onClick={() => { handleLogout(); setProfileDropdownOpen(false); }}
              >
                <LogOut className="h-5 w-5 shrink-0" color="#FF0000" />
                <span className="ml-2 text-[#FF0000]">Logout</span>
              </button>

              <button
                type="button"
                className="flex flex-row items-center min-h-[48px] w-full px-4 text-sm hover:bg-gray-50 cursor-pointer text-left lg:hidden touch-manipulation"
                onClick={() => { router.push("/client/dashboard/post-requirement"); setProfileDropdownOpen(false); }}
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span className="ml-2">Post Requirement</span>
              </button>
            </div>
          )}
        </div>

        

      </div>
    </header>
  );
}
