"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "../times-ago"
import { authFetch } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";
import {  CircleUserRound, LogOut,  User } from "lucide-react";
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

export default function AgencyHeader({ user, onMenuClick }: Props) {
 
  const { logout } = useAuth()
  const router=useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const[profileDropdownOpen,setProfileDropdownOpen]=useState(false);


  const[agencyData,setAgencyData]=useState<any>(null);


  // 🔹 Fetch notifications
  const fetchNotifications = async () => {
    

    try {
      const res = await authFetch(`/api/notifications`);
      const agencyRes=await authFetch(`/api/providers/${user?.id}`);

      const data = await res.json();
      const agencyData = await agencyRes.json();

      console.log("Agency Data::::", agencyData);

      setAgencyData(agencyData.provider);
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
        setProfileDropdownOpen(false);
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

  const handleLogout = async () => {
    await logout()
    router.replace("/login")
  }

  return (
  <header className="flex  items-center justify-end p-3 ml-auto border-border bg-transparent">
    
         <div className="flex flex-row gap-6">
             {/* Notification Section */}
              <div className="relative mt-2" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="relative cursor-pointer"
                >
                  <Bell className="h-6 w-6 text-gray-700" />

                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
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

              {/* Profile Dropdown */}
              <div className="relative  mr-4 lg:mr-10 " ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center">
                    {/* {seekerData?.image?<img src={seekerData.image} alt="Profile" className="h-8 w-8 rounded-full object-cover" /> : <User className="h-4 w-4 text-gray-700" />} */}
                    <User className="h-5 w-5 text-gray-700" />
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg border z-50">
                    <div className="flex flex-row p-4 text-sm border-b hover:bg-gray-50 cursor-pointer" onClick={()=>router.push("/agency/dashboard/editprofile")}>
                      <CircleUserRound className="h-5 w-5 "/>
                      <span className="ml-2">Profile</span>
                    </div>
                    {/* <div className="p-3 text-sm border-b hover:bg-gray-50 cursor-pointer">
                      Settings
                    </div> */}
                    <div className="p-4 flex flex-row text-sm border-b hover:bg-gray-50 cursor-pointer" onClick={handleLogout}>
                      <LogOut className="h-5 w-5" color="#FF0000" />
                      <span className="ml-2 text-[#FF0000]">Logout</span>
                    </div>

                    {/*Post requirement buttton in the mobile view only */}
                    <div
                      className="p-4 flex flex-row text-sm hover:bg-gray-50 cursor-pointer lg:hidden"
                      onClick={() => router.push("/client/dashboard/post-requirement")}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="ml-2">Post Requirement</span>
                    </div>
                  </div>
                )}
              </div>
          </div>
  </header>
);

}
