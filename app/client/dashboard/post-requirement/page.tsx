"use client";
import {
  mockRequirements,
  mockProposals,
  mockProviders,
} from "@/lib/mock-data";
import type {
  Requirement,
  Proposal,
  Provider,
  Notification,
} from "@/lib/types";
import { PostRequirementForm } from "@/components/seeker/post-requirement-form";
import VerificationModal from "@/components/VerificationModal";
import { authFetch } from "@/lib/auth-fetch"
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/lib/toast";
import { error } from "console";

const PostRequirementPage = () => {
  const { user } = useAuth();
  const [showPostForm, setShowPostForm] = useState(false);
  const [requirements, setRequirements] =
    useState<Requirement[]>(mockRequirements);
  const [sending, setSending] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [pendingRequirement, setPendingRequirement] = useState<any>(null);

  const handlePostRequirement = async (newRequirement: any) => {
    // Optimistic check: if user is already in dashboard and we know they aren't verified
    // we can show the modal even before the API call if we want, 
    // but let's rely on the API to be sure about the "first project" logic.

    setSending(true);
    try {
      console.log("Recieved Requirememt to the backend:::", newRequirement);
      // Prepare payload for API
      const payload = {
        title: newRequirement.title,
        image: newRequirement.image,
        category: newRequirement.category,
        budgetMin: newRequirement.budgetMin,
        budgetMax: newRequirement.budgetMax,
        timeline: newRequirement.timeline,
        description: newRequirement.description,
        attachmentUrls: newRequirement.attachmentUrls,
      };

      // API CALL
      const res = await authFetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Requirement created on main parent:", data);

      if (!res.ok) {
        if (data.code === "VERIFICATION_REQUIRED") {
          setPendingRequirement(newRequirement);
          setIsVerificationModalOpen(true);
          toast.error("Verification Required", data.error);
          return;
        }
        toast.error(data.error || "Failed to post the requirement");
        return;
      }

      toast.success("Requirement Posted successfully");
    } catch (error) {
      console.error("Error posting requirement:", error);
      toast.error("Failed to post the requirement");
    } finally {
      setSending(false);
    }
  };

  const handleVerificationComplete = () => {
    if (pendingRequirement) {
      handlePostRequirement(pendingRequirement);
      setPendingRequirement(null);
    }
  };

  return (
    <div className="bg-transparent">
      <div className="container max-w-7xl py-8 px-4">
        <PostRequirementForm
          onSubmit={handlePostRequirement}
          sendingStatus={sending}
        />
      </div>

      {user && (
        <VerificationModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          userId={user.id}
          onVerified={handleVerificationComplete}
          initialEmail={user.email}
          initialPhone={user.phone}
          isEmailVerifiedInDashboard={true}
          isMobileNumberVerified={user.isMobileNumberVerified}
          message="Email and mobile verification is mandatory for your first project post."
        />
      )}
    </div>
  );
};
export default PostRequirementPage;
