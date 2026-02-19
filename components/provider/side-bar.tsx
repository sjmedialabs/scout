"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  ChevronDown,
  ChevronRight,
  Settings,
  X, // ✅ Added
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: MenuItem[];
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

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const toggleSection = (id: string) => {
    setExpandedSection((prev) => (prev === id ? null : id));
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.path) {
      router.push(item.path);
      setIsMobileOpen(false);
    }
  };

  /* Auto expand correct parent based on pathname */
  useEffect(() => {
    if (!pathname) return;

    menuItems.forEach((section) => {
      if (section.children) {
        const isActiveChild = section.children.some(
          (child) =>
            child.path &&
            (pathname === child.path ||
              pathname.startsWith(child.path))
        );

        if (isActiveChild) {
          setExpandedSection(section.id);
        }
      }
    });
  }, [pathname, menuItems]);

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
          fixed inset-y-0 left-0 z-40 bg-[#3C3A3E] text-[#FFFFFF] border-r border-border 
          flex flex-col transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isCollapsed ? "lg:w-20" : "lg:w-80"}
          w-40
        `}
      >
        {/* HEADER */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Agency Dashboard
              </h2>
              <p className="text-sm text-[#8B8585] mt-0.5">
                Welcome back, {user?.name || "User"}
              </p>
            </div>
          )}

          {/* ✅ Mobile Close OR Desktop Collapse */}
          {isMobileOpen ? (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-accent lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-accent hidden lg:block"
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
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] 
          [-ms-overflow-style:none]        
          [&::-webkit-scrollbar]:hidden px-3 py-4">
          <nav className="space-y-1.5">
            {menuItems.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between 
                  px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer text-[#fff]"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="h-4 w-4 shrink-0" />
                    {!isCollapsed && section.label}
                  </div>

                  {section.children && !isCollapsed && (
                    expandedSection === section.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )
                  )}
                </button>

                {section.children &&
                  expandedSection === section.id && (
                    <div
                      className={`mt-1 space-y-1 ${
                        isCollapsed ? "ml-4" : "ml-7"
                      }`}
                    >
                      {section.children.map((item) => {
                        const isActive =
                          item.path && pathname === item.path;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleMenuClick(item)}
                            className={`
                              w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg
                              transition-colors cursor-pointer
                              ${
                                isActive
                                  ? "text-[#F54A0C] font-medium"
                                  : "text-[#fff]"
                              }
                            `}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!isCollapsed && item.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
              </div>
            ))}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-border">
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
              className="justify-start bg-[#2C34A1] text-[#fff] hover:bg-[#2C34A1] rounded-full"
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
