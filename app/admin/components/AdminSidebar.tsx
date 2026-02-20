"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { adminMenu } from "../sidebar-config";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Settings, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}


export function AdminSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const current = pathname.split("/")[2];
  const [open, setOpen] = useState<string[]>(["dashboard"]);

  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    // router.replace("/login");
  };

  const toggleSection = (label: string) => {
    setOpen(prev =>
      prev.includes(label)
        ? prev.filter(v => v !== label)
        : [...prev, label]
    );
  };

  return (
<>
    {!collapsed && (
  <div
    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
    onClick={onToggle}
  />
)}
    <aside
  className={`
    fixed top-0 left-0 h-full z-50
    bg-sidebarMain text-white border-r
    flex flex-col justify-between
    transition-all duration-300

    ${collapsed ? "w-20" : "w-64"}

    /* Desktop always visible */
    lg:translate-x-0

    /* Mobile & Tablet Drawer Behavior */
    ${collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"}
  `}
>
  
  
      {/* HEADER (CLICK TO TOGGLE) */}
      <div className="w-full flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button
          onClick={onToggle}
          className="w-full p-2 pt-2.5 border-b flex justify-items-start"
        >
          {!collapsed && (
            <div>
              <h2 className="text-md font-extrabold">Super Admin Dashboard</h2>
              <p className="text-sm text-white/70">Welcome back</p>
            </div>
          )}
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>

        {/* MENU */}
        <div className="p-3 space-y-4 overflow-y-auto">
          {adminMenu.map(section => (
            <div key={section.label}>
              <button
                onClick={() => toggleSection(section.label)}
                className="w-full flex items-center gap-3 hover:text-orangeButton"
              >
                <section.icon className="w-5 h-5" />
                {!collapsed && (
                  <span className="text-sm font-medium">
                    {section.label}
                  </span>
                )}
              </button>

              {open.includes(section.label) && (
                <div className={` mt-2 space-y-1 ${collapsed ? "ml-0" : "ml-8"}`}>
                  {section.children?.map(item => {
                    const active = current === item.id;
                    return (
                      <Link
                        key={item.id}
                        href={`/admin/${item.id}`}
                        className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm
                          ${active
                            ? "text-orangeButton"
                            : "hover:text-orangeButton"
                          }`}
                      >
                        <item.icon className="w-4 h-4" />
                        
                      {!collapsed && <span>{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      {/* <div className="w-auto items-center pl-1 mb-3 justify-center"> */}
        {/* System Settings */}
        {/* <Button className="bg-blueButton text-white flex-1 flex gap-0 rounded-2xl justify-start">
          <Settings className="w-4 h-4" />
          {!collapsed && "System Settings"}
        </Button> */}

        {/* Logout */}
        {/* <Button
          variant="outline"
          className="flex-1 flex gap-2 justify-between
           text-white bg-orange-600
            hover:bg-orange-600 hover:text-white 
            rounded-2xl border-none active:bg-orange-500
            active:text-white
          "
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Logout"}
        </Button> */}

        {/* FOOTER */}
<div className="w-full p-2 flex justify-center items-center py-4 -mb-3">
  <Button
    variant="outline"
    className={`
      flex items-center justify-center gap-2
      px-5 py-2.5
      w-full
      text-white bg-orange-600
      hover:bg-orange-600 hover:text-white
      rounded-full border-none
      active:bg-orange-500
    `}
    onClick={handleLogout}
  >
    <LogOut className="w-4 h-4" />
    {!collapsed && (
      <span className="text-sm font-medium">Logout</span>
    )}
  </Button>
</div>
      {/* </div> */}
    </aside>
    </>
  );
}
