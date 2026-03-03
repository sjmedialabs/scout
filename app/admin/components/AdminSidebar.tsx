"use client";

import Link from "next/link";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { adminMenu } from "../sidebar-config";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapseToggle: () => void;
  onMobileToggle: () => void;
}

export function AdminSidebar({
  collapsed,
  mobileOpen,
  onCollapseToggle,
  onMobileToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const current = pathname.split("/")[2];

  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // ✅ Auto reset collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // below lg
        if (collapsed) {
          onCollapseToggle(); // reset to expanded
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [collapsed, onCollapseToggle]);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

     <aside
  className={`
    fixed top-0 left-0 h-full z-50
    bg-[#e0dbfa] text-[#000] border-r
    flex flex-col
    transition-all duration-300

    ${collapsed ? "w-20" : "w-64"}

    lg:translate-x-0
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
>
  {/* HEADER (Fixed) */}
  <div className="p-2 py-4.5 border-b flex justify-between items-center shrink-0">
    {!collapsed && (
      <h2 className="text-md font-extrabold text-[#000]">
        Super Admin Dashboard
      </h2>
    )}

    {/* Desktop Chevron */}
    <div className="hidden lg:block">
      <button onClick={onCollapseToggle}>
        {collapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </div>

    {/* Mobile Close */}
    <div className="lg:hidden">
      <button onClick={onMobileToggle}>
        <X className="w-5 h-5" />
      </button>
    </div>
  </div>

  {/* NAVIGATION (Only This Scrolls) */}
  <div
    className="
      flex-1 overflow-y-auto p-3 space-y-2
      [scrollbar-width:none]
      [-ms-overflow-style:none]
      [&::-webkit-scrollbar]:hidden
    "
  >
    <nav>
      {adminMenu.map((item) => {
        const isActive = current === item.id;

        return (
          <Link
            key={item.id}
            href={`/admin/${item.id}`}
            onClick={() => {
              if (window.innerWidth < 1024) {
                onMobileToggle();
              }
            }}
            className={`
              flex items-center gap-3 px-3 py-2 text-sm
              ${
                isActive
                  ? "bg-[#ebe6f8] border border-[#e4dff6] text-[#000] rounded-[8px]"
                  : "text-[#000] hover:bg-[#ebe6f8] rounded-[8px]"
              }
            `}
          >
            <item.icon className="w-4 h-4" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  </div>

  {/* FOOTER (Fixed) */}
  <div className="p-4 border-t border-[#e4dff6] shrink-0">
    <Button
      variant="outline"
      className="
        flex items-center justify-center gap-2
        px-5 py-2.5 w-full
        text-white bg-orange-600
        hover:bg-orange-600 hover:text-white
        rounded-full border-none
        active:bg-orange-500
      "
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4" />
      {!collapsed && (
        <span className="text-sm font-medium">Logout</span>
      )}
    </Button>
  </div>
</aside>
    </>
  );
}