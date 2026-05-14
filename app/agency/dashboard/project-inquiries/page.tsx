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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  AlertTriangle,
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
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
const ProjectInquiriesPage = () => {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [selectedRequirement, setSelectedRequirement] =
    useState<Requirement | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [resLoading, setResLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const [userProfileData, setUserProfileData] = useState<any>(null);
  const [freeTrialConfigData, setFreeTrialConfigData] = useState<any>(null);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"upgrade" | "buy">("upgrade");

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    setResLoading(true);
    setFailed(false);
    try {
      const res = await authFetch("/api/requirements/agency");
      const UserRes = await authFetch(`/api/users/${user?.id}`)
      const freeTrailRes = await authFetch("/api/free-trail-config")

      if (UserRes.ok) {
        const userData = await UserRes.json();
        setUserProfileData(userData);
      }
      if (freeTrailRes.ok) {
        const freeTrailData = await freeTrailRes.json();
        setFreeTrialConfigData(freeTrailData);
      }
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched updated Requriments::::::", data.requirements)

        setRequirements(
          data.requirements.filter(
            (eachItem: any) => eachItem.status.toLowerCase() === "open",
          ),
        );
        setFailed(false);
      }
    } catch (error) {
      console.log("Failed to fetch the data:::", error);
      setFailed(true);
    } finally {
      setResLoading(false);
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
    const reqId = (requirement as any)._id || requirement.id;
    const targetUrl = `/agency/dashboard/project-inquiries/${reqId}`;

    if (!userProfileData) {
      router.push(targetUrl);
      return;
    }

    const { user: u, subscription: sub } = userProfileData;
    const isFreeUser = sub?.type === "trial" || !u?.subscriptionPlanId;

    let isBlocked = false;
    let msg = "";
    let type: "upgrade" | "buy" = "upgrade";

    if (isFreeUser) {
      const proposalLimit = sub?.proposalsPerMonth || freeTrialConfigData?.proposalLimit || 0;
      if ((u?.proposalCount || 0) >= proposalLimit) {
        isBlocked = true;
        type = "buy";
        msg = "To send a proposal, your free trial limit has been reached. Need to buy the subscription to continue.";
      }
    } else {
      const isExpired = sub?.status === "expired" || (u?.subscriptionEndDate && new Date(u.subscriptionEndDate) < new Date());
      const isMonthlyLimitReached = (u?.monthlyProposalCount || 0) >= (u?.monthlyProposalLimit || 0);

      if (isExpired) {
        isBlocked = true;
        type = "upgrade";
        msg = "To send a proposal, your subscription plan has expired. Kindly Upgrade or renew the plan.";
      } else if (isMonthlyLimitReached) {
        isBlocked = true;
        type = "upgrade";
        msg = "To send a proposal, your limit has reached for the month, Kindly do it next month or Upgrade the plan.";
      }
    }

    if (isBlocked) {
      setModalType(type);
      setModalMessage(msg);
      setIsModalOpen(true);
    } else {
      router.push(targetUrl);
    }
  };

  console.log("Fetched Requirements::::", requirements);
  if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-orangeButton">
          Find Projects
        </h1>
        <p className="text-md text-gray-500 mt-0">
          Browse and respond to client projects
        </p>
      </div>

      {!resLoading && !failed && requirements.length !== 0 && (
        <BrowseRequirements
          requirements={requirements}
          subscriptionTier={provider.subscriptionTier}
          onViewDetails={handleViewRequirementDetails}
          onSubmitProposal={handleProposalSubmit}
        />
      )}
      {!resLoading && !failed && requirements.length === 0 && (
        <p className="text-center mt-5 text-2xl">No Requirements yet</p>
      )}

      {/* PROPOSAL LIMIT / EXPIRED MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none bg-white rounded-[32px] shadow-2xl">
          {/* Header styled with brand color #2C34A1 */}
          <div style={{ backgroundColor: "#2C34A1" }} className="p-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold">Proposal Limit Reached</DialogTitle>
            </div>
            <DialogDescription className="text-blue-100 text-base">
              Subscription Status Alert
            </DialogDescription>
          </div>

          <div className="p-8 space-y-6">
            <p className="text-gray-700 text-base leading-relaxed font-medium">
              {modalMessage}
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                style={{ backgroundColor: "#F54A0C" }}
                className="w-full h-12 rounded-xl font-bold text-white hover:opacity-90"
                onClick={() => {
                  setIsModalOpen(false);
                  router.push("/agency/dashboard/account/subscriptions");
                }}
              >
                {modalType === "buy" ? "Need to buy the subscription" : "Upgrade the plan"}
              </Button>

              <Button
                variant="ghost"
                className="w-full text-gray-500 bg-gray-100 h-12 rounded-xl"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default ProjectInquiriesPage;
