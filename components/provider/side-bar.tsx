"use client";

import React, { useState,useEffect } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import {
  Home,
  User,
  Building2,
  Briefcase,
  Users,
  MessageCircle,
  Award,
  Star,
  MessageSquare,
  FileSearch,
  FileText,
  BarChart3,
  TrendingUp,
  Eye,
  GitCompare,
  Megaphone,
  Download,
  Settings,
  CreditCard,
  Bell,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/auth-fetch";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;        // <== ADDED
  children?: MenuItem[];
}

// const menuItems: MenuItem[] = [
//   {
//     id: "overview",
//     label: "OVERVIEW",
//     icon: Home,
//     children: [
//       { id: "dashboard", label: "Dashboard", icon: Home, path: "/agency/dashboard" },

//       {id:"editprofile",label:"EditProfile",icon: Briefcase, path: "/agency/dashboard/editprofile"},

//       { id: "portfolio", label: "Portfolio", icon: Briefcase, path: "/agency/dashboard/portfolio" },
//       { id: "reviews", label: "Reviews", icon: Star, path: "/agency/dashboard/reviews" },
//       { id: "messages", label: "Messages", icon: MessageSquare, path: "/agency/dashboard/messages" },
//       { id: "project-inquiries", label: "Project Inquiries", icon: FileSearch, path: "/agency/dashboard/project-inquiries" },
//       { id: "proposals", label: "Proposals", icon: FileText, path: "/agency/dashboard/proposals" },
//       { id: "projects", label: "Projects", icon: Briefcase, path: "/agency/dashboard/projects" },
//     ],
//   },

//   {
//     id: "performance",
//     label: "PERFORMANCE",
//     icon: BarChart3,
//     children: [
//       { id: "performance-analytics", label: "Performance Analytics", icon: TrendingUp, path: "/agency/dashboard/performance/analytics" },
//       { id: "audience-insights", label: "Audience Insights", icon: Eye, path: "/agency/dashboard/performance/audience-insights" },
//       { id: "competitor-comparison", label: "Competitor Comparison", icon: GitCompare, path: "/agency/dashboard/performance/competitor-comparison" },
//     ],
//   },

//   // {
//   //   id: "marketing",
//   //   label: "MARKETING",
//   //   icon: Megaphone,
//   //   children: [
//   //     { id: "lead-generation", label: "Lead Management", icon: Download, path: "/agency/dashboard/marketing/lead-generation" },
//   //   ],
//   // },

//   {
//     id: "account-settings",
//     label: "ACCOUNT & SETTINGS",
//     icon: Settings,
//     children: [
//       { id: "billing-subscription", label: "Billing & Subscription", icon: CreditCard, path: "/agency/dashboard/account/billing" },
//       { id: "subscription", label: "Subscription", icon:Briefcase, path: "/agency/dashboard/account/subscriptions" },
//       { id: "notifications", label: "Notifications", icon: Bell, path: "/agency/dashboard/account/notifications" },
//     ],
//   },
// ];

interface SidebarProps {
  user: any;
  menuItems: any;
}

export default function Sidebar({ user, menuItems }: SidebarProps) {
  const router = useRouter();

  const { logout } = useAuth()

const handleLogout = async () => {
  await logout();
  router.replace("/login");
};


  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);
  const[userDetails,setUserDetails]=useState({});
  const[expired,setExpired]=useState(false);
  const[filteredMenuItem,setFilteredMenuItems]=useState<MenuItem[]>([])
  
    // const loadData=async()=>{
  
    //   try{
    //    const res=await authFetch(`/api/users/${user.id}`);
    //    const data=await res.json();
    //    if(!res.ok) throw new Error();

    //    if(data.user?.subscriptionStartDate){
    //     const today = new Date();
    //       const endDate = new Date(data.user?.subscriptionEndDate);

    //       setExpired(endDate < today);
    //    }else{
    //       setExpired((data.user?.proposalCount || 0)>1)
    //    }

    //    console.log("the fetched user details from the side bar is :::::",data)
    //   }catch(error){
    //        console.log("Failed to get the user details::::::",error);
    //   }
  
    // }
  
    // useEffect(()=>{
    //   loadData()
    // },[])

    // useEffect(()=>{
    //   if(expired){
    //     setFilteredMenuItems([menuItems[menuItems.length-1]])
        
    //   }else{
    //     setFilteredMenuItems([...menuItems])
    //   }
    // },[expired])

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleMenuClick = (item: MenuItem, parentId?: string) => {
    setActiveSection(item.id);
    setActiveSubSection(parentId || item.id);

    if (item.path) {
      router.push(item.path);   // <===== REDIRECT HERE
    }
  };
  console.log("Filterded menu items are :::",filteredMenuItem)

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-card border-r border-border flex flex-col z-10">
      
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-bold">Agency Dashboard</h2>
        <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>

        <div className="flex items-center gap-2 mt-3">
          {/* <Badge
            className={
              provider.subscriptionTier === "basic"
                ? "bg-gray-100 text-gray-800"
                : provider.subscriptionTier === "standard"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-purple-100 text-purple-800"
            }
          >
            {provider.subscriptionTier === "basic"
              ? "Basic"
              : provider.subscriptionTier === "standard"
                ? "Standard"
                : "Premium"}
            &nbsp;Plan
          </Badge> */}

          {user?.isVerified && <Badge variant="secondary" className="bg-red-500">Verified</Badge>}
          {user?.isActive && <Badge className="bg-green-500">Active</Badge>}
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {menuItems.map((section) => (
            <div key={section.id}>
              
              {/* Section Button */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </div>

                {section.children &&
                  (expandedSections.includes(section.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  ))}
              </button>

              {/* Section Children */}
              {section.children && expandedSections.includes(section.id) && (
                <div className="ml-4 mt-2 space-y-1">
                  {section.children.map((item) => (
                    <div key={item.id}>
                      
                      <button
                        onClick={() => handleMenuClick(item, section.id)}
                        className={`w-full flex items-center justify-between p-2 text-sm rounded-lg transition-colors ${
                          activeSection === item.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </div>

                        {item.children &&
                          (expandedSections.includes(item.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          ))}
                      </button>

                      {/* Sub Items */}
                      {item.children && expandedSections.includes(item.id) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.children.map((subItem) => (
                            <button
                              key={subItem.id}
                              onClick={() => handleMenuClick(subItem, item.id)}
                              className={`w-full flex items-center gap-3 p-2 text-sm rounded-lg transition-colors ${
                                activeSubSection === subItem.id
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
                              }`}
                            >
                              <subItem.icon className="h-4 w-4" />
                              {subItem.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Button */}
      <div className="p-4 border-border flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/agency/dashboard/account/subscriptions")}
          className="flex-1 bg-blueButton text-white flex gap-0 rounded-2xl justify-start"
        >
          <Settings className="h-4 w-4 mr-2" />
          Upgrade Plan
        </Button>

         <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex-1 flex gap-2 justify-start
           text-white bg-orange-600
            hover:bg-orange-600 hover:text-white 
            rounded-2xl border-none active:bg-orange-500
            active:text-white
          "
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
