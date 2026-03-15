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
      <div
        aria-hidden="true"
        className={`
          fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ease-out
          ${mobileOpen ? "bg-black/40 opacity-100" : "bg-transparent opacity-0 pointer-events-none"}
        `}
        onClick={onMobileToggle}
      />

      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          bg-[#3C3A3E] text-[#fff] border-r
          flex flex-col
          transform transition-[transform] duration-300 ease-out will-change-transform
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          w-[min(80vw,320px)] sm:w-64
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
  {/* HEADER (Fixed) */}
  <div className="px-3 py-2 border-b flex justify-between items-center shrink-0">
    {!collapsed && (
      // <h2 className="text-md font-extrabold text-[#000]">
      //   Super Admin Dashboard
      // </h2>
       <img src="/scoutFooterLogo.png" className="h-[45px] w-[120px]"/>
    )}

    <div className="hidden lg:flex items-center">
      <button
        type="button"
        onClick={onCollapseToggle}
        className="flex items-center justify-center min-h-[48px] min-w-[48px] rounded-lg touch-manipulation"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </div>

    <div className="lg:hidden">
      <button
        type="button"
        onClick={onMobileToggle}
        className="flex items-center justify-center min-h-[48px] min-w-[48px] rounded-lg touch-manipulation"
        aria-label="Close menu"
      >
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
              if (typeof window !== "undefined" && window.innerWidth < 1024) {
                onMobileToggle();
              }
            }}
            className={`
              flex items-center gap-3 min-h-[48px] px-3 py-2 text-sm rounded-[8px] touch-manipulation
              ${isActive ? "text-[#F54A0C]" : "text-[#fff]"}
            `}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-left">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  </div>

  {/* FOOTER (Fixed) */}
  <div className="py-2 px-6 border-t border-[#e4dff6] shrink-0">
    <Button
      variant="outline"
      className="
        flex items-center justify-center gap-2 min-h-[48px] w-full
        px-2 text-white bg-orange-600
        hover:bg-orange-600 hover:text-white
        rounded-full border-none touch-manipulation
        active:bg-orange-500
      "
      onClick={handleLogout}
    >
      <LogOut className="w-4 h-4 shrink-0" />
      {!collapsed && (
        <span className="text-xs font-medium">Logout</span>
      )}
    </Button>
  </div>
</aside>
    </>
  );
}