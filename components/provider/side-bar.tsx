"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  ChevronRight,
  Settings,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
}

interface SidebarProps {
  user: any;
  menuItems: MenuItem[];
  isCollapsed: boolean;
  isMobileOpen: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  user,
  menuItems,
  isCollapsed,
  isMobileOpen,
  setIsCollapsed,
  setIsMobileOpen,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.path) {
      router.push(item.path);
      setIsMobileOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 
          bg-[#e0dbfa] text-[#000]
          border-r border-[#e4dff6]
          flex flex-col transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isCollapsed ? "lg:w-20" : "lg:w-80"}
          w-80 
        `}
      >
        {/* HEADER */}
        <div className="px-3 py-3.5 border-b border-gray-300 flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Agency Dashboard
              </h2>
              {/* <p className="text-sm text-gray-600 mt-0.5">
                Welcome back, {user?.name || "User"}
              </p> */}
            </div>
          )}

          {isMobileOpen ? (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-[#ebe6f8] lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-[#ebe6f8] hidden lg:block"
            >
              <ChevronRight
                className={`h-5 w-5 transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-3 py-4  [scrollbar-width:none] 
          [-ms-overflow-style:none]        
          [&::-webkit-scrollbar]:hidden">
          <nav className="space-y-2">
           {menuItems.map((item) => {
              const pathSegments = pathname?.split("/").filter(Boolean) || [];
              const lastSegment = pathSegments[pathSegments.length - 1];

              const isDashboard =
                item.id === "dashboard" &&
                pathname === "/agency/dashboard";

              const isActive =
                item.id === lastSegment || isDashboard;

              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 text-sm
                    transition-colors cursor-pointer
                    ${
                      isActive
                        ? "bg-[#ebe6f8] border border-[#e4dff6] text-[#000] rounded-[8px]"
                        : "text-[#000] hover:bg-[#ebe6f8] rounded-[8px]"
                    }
                  `}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-[#e4dff6]">
          <div
            className={`grid gap-2 ${
              isCollapsed
                ? "grid-cols-1 place-items-center"
                : "grid-cols-2"
            }`}
          >
            <Button
              size="sm"
              onClick={() =>
                router.push(
                  "/agency/dashboard/account/subscriptions"
                )
              }
              className="justify-start bg-[#2C34A1] text-white hover:bg-[#2C34A1] rounded-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              {!isCollapsed && "Upgrade Plan"}
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={handleLogout}
              className="justify-start rounded-full bg-[#F54A0C]"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {!isCollapsed && "Logout"}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}