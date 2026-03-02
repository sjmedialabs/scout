import {
  Home, Users, Shield, BarChart3, FileText, Database,
  MessageSquare, Building2, Activity, UserCheck, AlertTriangle,
  CreditCard, DollarSign, TrendingUp, Eye, Bell, Settings,
  Globe
} from "lucide-react";

export const adminMenu = [

  // ===== OVERVIEW =====
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "reports", label: "Reports", icon: FileText },

  // ===== USER MANAGEMENT =====
  { id: "users", label: "All Users", icon: Users },
  // { id: "role-management", label: "Role Management", icon: Shield },
  { id: "user-verification", label: "User Verification", icon: UserCheck },
  // { id: "user-activity", label: "User Activity", icon: Activity },

  // ===== SUBSCRIPTIONS =====
  { id: "subscribers", label: "Subscribers Management", icon: Users },
  { id: "subscription-plans", label: "Subscription Plans", icon: CreditCard },
  // { id: "billing", label: "Billing & Invoices", icon: FileText },
  // { id: "payment-methods", label: "Payment Methods", icon: DollarSign },

  // ===== REVENUE & ANALYTICS =====
  { id: "revenue-dashboard", label: "Revenue Dashboard", icon: DollarSign },
  { id: "financial-reports", label: "Financial Reports", icon: BarChart3 },
  // { id: "growth-metrics", label: "Growth Metrics", icon: TrendingUp },
  // { id: "performance-insights", label: "Performance Insights", icon: Eye },

  // ===== CONTENT & MODERATION =====
  { id: "moderation", label: "Content Moderation", icon: AlertTriangle },
  { id: "reported-content", label: "Reported Content", icon: FileText },
  { id: "content-policies", label: "Content Policies", icon: Shield },
  // { id: "automated-filters", label: "Automated Filters", icon: Database },
  { id: "contentMang", label: "Web Content Management", icon: Database },

  // ===== PLATFORM =====
  // { id: "settings", label: "Platform Settings", icon: Settings },
  { id: "categories", label: "Category Management", icon: Building2 },
  // { id: "notifications", label: "System Notifications", icon: Bell },
  { id: "careers", label: "Careers", icon: Shield },

  // ===== COMMUNICATION =====
  // { id: "announcements", label: "Announcements", icon: Bell },
  // { id: "support-tickets", label: "Support Tickets", icon: MessageSquare },
  // { id: "email-campaigns", label: "Email Campaigns", icon: FileText },

];
