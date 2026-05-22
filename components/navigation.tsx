
"use client";

import type React from "react";
import { authFetch } from "@/lib/auth-fetch";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdMoreHoriz } from "react-icons/md";
import { FaBars } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  User,
  LogOut,
  Settings,
  Menu,
  Search,
  Bookmark,
  MessageSquare,
  SearchIcon,
  ChevronRight,
} from "lucide-react";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CircleUserIcon } from "lucide-react";
import { CircleUserRound } from "lucide-react";
import { set } from "mongoose";

export function Navigation() {
  const { user, logout } = useAuth();

  const [selectedOverflowCategory, setSelectedOverflowCategory] =
    useState<any | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pathname = usePathname();
  const router = useRouter();

  const [isSticky, setIsSticky] = useState(false);

  const isAgencyDashboard =
    pathname?.startsWith("/agency/dashboard");

  const [serviceCategories, setServiceCategories] = useState<any[]>([]);

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [mobileOpenMenu, setMobileOpenMenu] =
    useState<string | null>(null);

  const [cms, setCMS] = useState<any>(null);

  // =========================
  // FIXED HOVER SYSTEM
  // =========================

  const timeoutRef = useRef<any>(null);
  const enterTimeoutRef = useRef<any>(null);

  const handleEnter = (menuId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }

    if (openMenu === menuId) return;

    enterTimeoutRef.current = setTimeout(() => {
      setOpenMenu(menuId);
    }, 40);
  };

  const handleLeave = () => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 180);
  };

  const isActive = (slug: string) => {
    return (
      pathname === `/services/${slug}` ||
      pathname?.startsWith(`/services/${slug}/`)
    );
  };

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      console.time("fetchCategories");

      try {
        const res = await fetch("/api/service-categories", {
          credentials: "include",
        });

        const cmsRes = await fetch("/api/cms");
        const cmsData = await cmsRes.json();

        console.log("CMS Data in Navigation:", cmsData);

        setCMS(cmsData.data);

        if (!res.ok) return;

        const data = await res.json();

        if (isMounted) {
          setServiceCategories(data.data || []);
        }
      } catch (err) {
        console.warn("Service categories unavailable");
      }
    };

    fetchCategories();

    console.timeEnd("fetchCategories");

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!user) return "/";

    switch (user.role) {
      case "client":
        return "/client/dashboard";

      case "agency":
        return "/agency/dashboard";

      case "admin":
        return "/admin/dashboard";

      default:
        return "/";
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(
        `/services?q=${encodeURIComponent(
          searchQuery.trim()
        )}&type=providers`
      );

      setSearchQuery("");
    }
  };

  const handleBookmark = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    router.push("/bookmarks");
  };

  const handleMessages = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (user.role === "agency") {
      router.push("/agency/dashboard?section=messages");
    } else if (user.role === "client") {
      router.push("/client/dashboard?section=messages");
    } else {
      router.push("/messages");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  useEffect(() => {
    if (openMenu !== "more") {
      setSelectedOverflowCategory(null);
    }
  }, [openMenu]);

  useEffect(() => {
    setOpenMenu(null);
  }, [pathname]);

  const mainCategories = serviceCategories.filter(
    (c) => c.isMainCategory
  );

  const visibleCategories = mainCategories.slice(0, 4);

  const overflowCategories = mainCategories.slice(4);

  return (
    <div className="bg-background">
      <nav
        className={`border-b border-border bg-white transition-all duration-300
        ${isSticky
            ? "fixed top-0 left-0 right-0 z-50 shadow-md"
            : "relative"
          }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 py-2 sm:px-6 xl:px-0 ${isAgencyDashboard ? "ml-80" : ""
            }`}
        >
          <div className="flex justify-between items-center h-14 gap-4">

            <div className="flex justify-between items-center h-8 xl:mr-30 lg:mr-1">
              <div>
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                >
                  <img
                    src={
                      cms?.contact?.headerLogo ||
                      "/scoutHeaderLogo.png"
                    }
                    alt=""
                    className="h-14"
                  />
                </Link>
              </div>
            </div>

            {/* DESKTOP NAV */}
            <div
              className={`hidden flex-1 min-w-0 lg:flex items-center
                gap-2
                lg:gap-3 xl:gap-4 2xl:gap-6
                transition-all duration-300`}
            >
              {/* MAIN CATEGORIES */}
              {visibleCategories.map((category) => (
                <div
                  key={category.slug}
                  className="flex items-center h-full relative"
                >
                  <DropdownMenu
                    modal={false}
                    open={openMenu === category.slug}
                  >
                    <div
                      onPointerEnter={() =>
                        handleEnter(category.slug)
                      }
                      onPointerLeave={handleLeave}
                    >
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`relative pb-4 mt-4 text-[14px] font-medium cursor-pointer transition whitespace-nowrap focus:outline-none focus-visible:ring-0 ${openMenu === category.slug
                            ? "text-[#F4561C] after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-[#F4561C]"
                            : "text-gray-500 hover:text-slate-900 "
                            }`}
                        >
                          {category.title}
                        </button>
                      </DropdownMenuTrigger>

                      {category.children?.length > 0 && (
                        <DropdownMenuContent
                          forceMount
                          onOpenAutoFocus={(e) =>
                            e.preventDefault()
                          }
                          sideOffset={4}
                          align="start"
                          className="w-[90vw] mt-2 mx-20 max-h-[80vh] overflow-y-scroll p-6 ml-20 rounded-2xl"
                        >
                          <div className="grid grid-cols-5 gap-6">
                            {category.children.map(
                              (parent: any) => (
                                <div key={parent.title}>
                                  <p className="font-semibold text-sm mb-2 text-slate-900">
                                    {parent.title}
                                  </p>

                                  <ul className="space-y-1">
                                    {parent.items?.map(
                                      (child: any) => (
                                        <li key={child.slug}>
                                          <Link
                                            href={`/services?subcategory=${child._id}`}
                                            className="text-sm text-gray-500 hover:text-slate-900"
                                          >
                                            {child.title}
                                          </Link>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )
                            )}
                          </div>
                        </DropdownMenuContent>
                      )}
                    </div>
                  </DropdownMenu>
                </div>
              ))}

              {/* MORE DROPDOWN */}
              {overflowCategories.length > 0 && (
                <>
                  <div className="relative">
                    <DropdownMenu
                      modal={false}
                      open={openMenu === "more"}
                    >
                      <div
                        onPointerEnter={() =>
                          handleEnter("more")
                        }
                        onPointerLeave={handleLeave}
                      >
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1 text-[14px] font-medium text-gray-500 hover:text-slate-900 cursor-pointer focus:outline-none focus-visible:ring-0"
                          >
                            More
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          forceMount
                          onOpenAutoFocus={(e) =>
                            e.preventDefault()
                          }
                          sideOffset={4}
                          align="center"
                          className="w-[800px]  mt-5 p-0 overflow-hidden rounded-2xl shadow-2xl border-none"
                        >
                          <div className="flex h-[450px]">
                            {/* Sidebar Categories */}
                            <div className="w-[240px] bg-slate-50 p-4 border-r overflow-y-auto">
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                                More Categories
                              </p>

                              <div className="space-y-1">
                                {overflowCategories.map(
                                  (category) => (
                                    <button
                                      key={category.slug}
                                      className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-between group ${selectedOverflowCategory?.slug ===
                                        category.slug
                                        ? "bg-white text-[#F4561C] shadow-sm cursor-pointer"
                                        : "text-slate-600 hover:bg-white  hover:text-[#F4561C]"
                                        }`}
                                      onPointerEnter={() => {
                                        if (
                                          selectedOverflowCategory?.slug !==
                                          category.slug
                                        ) {
                                          setSelectedOverflowCategory(
                                            category
                                          );
                                        }
                                      }}
                                    >
                                      {category.title}

                                      <ChevronRight
                                        size={14}
                                        className={`transition-transform duration-200 ${selectedOverflowCategory?.slug ===
                                          category.slug
                                          ? "translate-x-1"
                                          : "opacity-0 group-hover:opacity-100"
                                          }`}
                                      />
                                    </button>
                                  )
                                )}
                              </div>
                            </div>

                            {/* CONTENT */}
                            <div className="flex-1 bg-white p-8 overflow-y-auto">
                              {selectedOverflowCategory ? (
                                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                                  <div className="flex items-center justify-between mb-6 border-b pb-4">
                                    <div>
                                      <h3 className="text-xl font-bold text-slate-900">
                                        {
                                          selectedOverflowCategory.title
                                        }
                                      </h3>

                                      <p className="text-sm text-slate-500 mt-1">
                                        Explore all{" "}
                                        {
                                          selectedOverflowCategory.title
                                        }{" "}
                                        services
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                    {selectedOverflowCategory.children?.map(
                                      (sub: any) => (
                                        <div
                                          key={sub.title}
                                          className="space-y-3"
                                        >
                                          <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                                            {sub.title}
                                          </h4>

                                          <ul className="space-y-2">
                                            {sub.items?.map(
                                              (
                                                child: any
                                              ) => (
                                                <li
                                                  key={
                                                    child.slug
                                                  }
                                                >
                                                  <Link
                                                    href={`/services?subcategory=${child._id}`}
                                                    className="text-[14px] text-slate-600 hover:text-[#F4561C] transition-colors flex items-center group"
                                                    onClick={() =>
                                                      setOpenMenu(
                                                        null
                                                      )
                                                    }
                                                  >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200 mr-2 group-hover:bg-[#F4561C] transition-colors" />

                                                    {
                                                      child.title
                                                    }
                                                  </Link>
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                  <Search
                                    size={48}
                                    strokeWidth={1}
                                    className="mb-4 opacity-20"
                                  />

                                  <p className="text-sm">
                                    Hover over a category
                                    to see services
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </DropdownMenuContent>
                      </div>
                    </DropdownMenu>
                  </div>

                  <Link
                    href="/pricing"
                    className="text-black  hover:text-slate-900 text-sm font-medium"
                  >
                    Pricing
                  </Link>

                  <Link
                    href="/blogs"
                    className="text-black font-medium hover:text-slate-900 text-sm"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                  >
                    Blogs
                  </Link>
                </>
              )}
            </div>

            {/* RIGHT BUTTONS */}
            <div className="hidden lg:flex flex-row gap-2">
              <Button
                className="primary-button h-[32px]"
                asChild
              >
                <Link
                  className="!text-sm"
                  href={
                    user
                      ? "/client/dashboard?section=projects"
                      : "/register"
                  }
                >
                  Post Requirement
                </Link>
              </Button>

              <Button
                className="primary-button h-[32px] !text-sm"
                onClick={() => router.push("/browse")}
              >
                Find Projects
              </Button>

              <div
                className="relative cursor-pointer focus:outline-none focus-visible:ring-0"
                onMouseEnter={() =>
                  handleEnter("login")
                }
                onMouseLeave={handleLeave}
              >
                <CircleUserRound
                  className="h-6 w-6 mt-1"
                  color="#e0332c"
                />

                {openMenu === "login" && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                    <button
                      onClick={() =>
                        router.push(
                          "/login?role=client"
                        )
                      }
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      Login as Client
                    </button>

                    <button
                      onClick={() =>
                        router.push(
                          "/login?role=agency"
                        )
                      }
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      Login as Agency
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* MOBILE */}
            <div className="flex flex-row gap-2 lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-transparent hover:text-slate-900 active:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                onClick={() =>
                  setMobileMenuOpen(!mobileMenuOpen)
                }
              >
                <Menu size={40} className="text-slate-900" />
              </Button>

              <div className="relative cursor-pointer">
                <div
                  onClick={() =>
                    setOpenMenu(
                      openMenu === "login"
                        ? null
                        : "login"
                    )
                  }
                >
                  <CircleUserRound
                    className="h-6 w-6 mt-1"
                    color="#f54607"
                  />
                </div>

                {openMenu === "login" && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        router.push(
                          "/login?role=client"
                        );

                        setOpenMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Login as Client
                    </button>

                    <button
                      onClick={() => {
                        router.push(
                          "/login?role=agency"
                        );

                        setOpenMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Login as Agency
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg max-h-[60vh] overflow-y-auto flex flex-col px-4 py-4 z-50">
            {mainCategories.map((category) => (
              <div key={category.slug} className="py-3 border-b border-gray-100">
                <button
                  onClick={() => setMobileOpenMenu(mobileOpenMenu === category.slug ? null : category.slug)}
                  className="flex justify-between items-center w-full text-left font-medium text-slate-800 focus:outline-none"
                >
                  {category.title}
                  <ChevronRight
                    size={16}
                    className={`transition-transform duration-200 ${
                      mobileOpenMenu === category.slug ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {mobileOpenMenu === category.slug && category.children?.length > 0 && (
                  <div className="mt-3 pl-4 space-y-4 border-l-2 border-slate-100  max-h-[30vh] overflow-y-auto">
                    {category.children.map((parent: any) => (
                      <div key={parent.title} className="space-y-2">
                        <p className="text-sm font-semibold text-slate-900">{parent.title}</p>
                        <ul className="space-y-2">
                          {parent.items?.map((child: any) => (
                            <li key={child.slug}>
                              <Link
                                href={`/services?subcategory=${child._id}`}
                                className="text-sm text-slate-500 hover:text-[#F4561C] block"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {child.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="py-3 border-b border-gray-100 flex flex-col gap-3">
              <Link
                href="/pricing"
                className="font-medium text-[#000] hover:text-[#F4561C] "
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/blogs"
                className="font-medium text-[#000] hover:text-[#F4561C]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blogs
              </Link>
            </div>

            <div className="flex flex-row gap-3 pt-4">
              <Button className="primary-button w-auto" asChild>
                <Link
                  href={user ? "/client/dashboard?section=projects" : "/register"}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Post Requirement
                </Link>
              </Button>
              <Button
                className="primary-button w-auto"
                onClick={() => {
                  router.push("/browse");
                  setMobileMenuOpen(false);
                }}
              >
                Find Projects
              </Button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}