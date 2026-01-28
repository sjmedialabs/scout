"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authFetch } from "@/lib/auth-fetch";
import {
  Building2,
  FileText,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  MessageSquare,
  Award,
  Edit,
  Settings,
  BarChart3,
  Users,
  Megaphone,
  CreditCard,
  Bell,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Home,
  User,
  Briefcase,
  MessageCircle,
  FileSearch,
  Eye,
  GitCompare,
  Download,
  Phone,
  Video,
  Paperclip,
  Send,
  Mail,
  Clock,
  CheckCircle,
  X,
  Target,
  Handshake,
} from "lucide-react";
import {
  mockNotifications,
  mockProviderProjects,
  mockProviderReviews,
  mockRequirements,
} from "@/lib/mock-data";
import type {
  Provider,
  Requirement,
  Notification,
  Project,
  Review,
} from "@/lib/types";
import { useEffect, useState } from "react";
import { BrowseRequirements } from "@/components/provider/browse-requirements";

const ProjectInquiriesPage = () => {
  const [selectedRequirement, setSelectedRequirement] =
    useState<Requirement | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await fetch("/api/requirements");
      if (res.ok) {
        const data = await res.json();

        setRequirements(
          data.requirements.filter(
            (eachItem) => eachItem.status.toLowerCase() === "open",
          ),
        );
        setFailed(false);
      }
    } catch (error) {
      console.log("Failed to fetch the data:::", error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  const [showProposalForm, setShowProposalForm] = useState(false);
  const [provider, setProvider] = useState<Provider>({
    id: "1",
    name: "Jane Smith",
    email: "jane@sparkdev.com",
    subscriptionTier: "standard", // Changed from "basic" to "standard"
    isVerified: true,
    isFeatured: true,
    profileCompletion: 85,
    totalProjects: 47,
    activeProjects: 8,
    completedProjects: 39,
    totalEarnings: 125000,
    monthlyEarnings: 12500,
    rating: 4.9,
    responseTime: "2 hours",
    successRate: 98,
    minimumBudget: 500,
    hourlyRate: { min: 25, max: 150 },
  });
  const handleViewRequirementDetails = (requirementId: string) => {
    const requirement = mockRequirements.find((r) => r.id === requirementId);
    if (requirement) {
      setSelectedRequirement(requirement);
      // For now, just show the proposal form - later we can add a details modal
      setShowProposalForm(true);
    }
  };
  const handleProposalSubmit = (requirement: Requirement) => {
    // Placeholder for handleProposalSubmit logic
    console.log("Proposal submitted for requirement:", requirement.id);
    setShowProposalForm(false);
    setSelectedRequirement(null);
  };
  console.log("Fetched Requirements::::", requirements);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-orangeButton">
          Project Inquiries
        </h1>
        <p className="text-sm text-gray-500 mt-0">
          Browse and respond to client requirements
        </p>
      </div>
      {/* REMOVED SubscriptionGate */}

      {!loading && !failed && requirements.length !== 0 && (
        <BrowseRequirements
          requirements={requirements}
          subscriptionTier={provider.subscriptionTier}
          onViewDetails={handleViewRequirementDetails}
          onSubmitProposal={handleProposalSubmit}
        />
      )}
      {!loading && !failed && requirements.length === 0 && (
        <p className="text-center mt-5 text-2xl">No Requirements yet</p>
      )}
    </div>
  );
};
export default ProjectInquiriesPage;
