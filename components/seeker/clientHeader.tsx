"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, CircleUserRound, LogOut, Menu, Plus, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "../times-ago"
import { authFetch } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";
import { error } from "console";
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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="flex items-center justify-between p-2 px-[40px] mb-0 border-b border-border bg-white ">
      
      {/* 🔹 Left Section */}
      <div className="flex items-center gap-3">
        
        {/* Mobile Sidebar Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* <h1 className="text-lg font-semibold">
          Client Dashboard
        </h1> */}
      </div>

      {/* 🔹 Right Section - Notifications */}
      <div className="flex flex-row gap-5 items-center">
        {/*post requirement button */}
        <div className="hidden lg:block">
          <Button
            size="sm"
            className={cn(
              "rounded-2xl text-xs bg-[#2C34A1] text-white border-none hover:bg-[#232a85] flex items-center justify-center",
             
            )}
            onClick={()=>router.push("/client/dashboard/post-requirement")}
            
          >
            {/* <Plus className="h-4 w-4" /> */}
              <span className="ml-2">Post Requirement</span>
          </Button>

        </div>
        {/* Notification symbol */}
        <div className="relative mt-3  mr-0  " ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="relative cursor-pointer"
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
                  <p className="text-xs text-[#656565] my-custom-class mt-1">{notification.message}</p>
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
        <div className="relative  mr-0 " ref={dropdownRef}>
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
              <div className="flex flex-row p-4 text-sm border-b hover:bg-gray-50 cursor-pointer" onClick={()=>router.push("/client/dashboard/profile")}>
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
