"use client";

import { useParams, useRouter,useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useEffect, useState } from "react";
import { Edit, Loader2, X, DollarSign, Calendar, FileText } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import type { Proposal } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { authFetch } from "@/lib/auth-fetch";
import { Button } from "@/components/ui/button";
import RatingStars from "@/components/rating-star";
import { MoveLeft,ChevronLeft,File,ChevronRight } from "lucide-react";

import ProposalHeader from "@/components/provider/proposalDetailHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import PdfUpload from "@/components/pdfUpload";
import { toast } from "@/lib/toast";

import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);


export default function ProposalViewDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const router = useRouter();
  const { user, loading } = useAuth();

  const [resLoading, setResLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isEditMilestoneOpen, setIsEditMilestoneOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const loadProposal = useCallback(async () => {
    setResLoading(true);
    setFailed(false);

    try {
      const res = await authFetch(`/api/proposals/${id}`);
      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      console.log("proposal details:::;", data);
      setProposal(data.proposals[0]);
    } catch (err) {
      setFailed(true);
    } finally {
      setResLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }
    loadProposal();
  }, [id, user, loading, router, loadProposal]);

  const handleUpdateMilestone = async () => {
    if (!proposal || !selectedMilestone) return;

    setUpdating(true);
    try {
      const updatedMilestones = proposal.milestones.map((m) =>
        m._id === selectedMilestone._id ? selectedMilestone : m,
      );

      const payload = {
        milestones: updatedMilestones,
      };

      const res = await authFetch(`/api/proposals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        toast.error("Failed to update milestone.");
        throw new Error("Failed to update milestone");
      }

      await loadProposal();

      setIsEditMilestoneOpen(false);
      setSelectedMilestone(null);
      toast.success("Milestone updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update milestone.");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeClass = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-[#F3D5B5] text-[#8A4B08]";
      case "shortlisted":
        return "bg-[#2F80ED] text-white";
      case "accepted":
        return "bg-[#27AE60] text-white";
      case "rejected":
        return "bg-[#EB5757] text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  if (resLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (failed || !proposal) {
    return <div className="p-6">Proposal not found</div>;
  }
  const fieldClass =
    "h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[16px] text-gray-900 flex items-center";

  const textareaClass =
    "rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[16px] text-gray-900 leading-[1.6] whitespace-pre-wrap";

 

  return (
    <div className="space-y-8">
      {/* HEADER */}
         <div className="mt-2">
          <ProposalHeader
            proposal={proposal}
            buttonText="Back to Proposals"
            buttonUrl="/agency/dashboard/proposals"
          />
         </div>

          {/* ===================== PROPOSAL DETAILS ===================== */}
          <Card className="rounded-[14px] border border-[#E4E7EC] bg-white shadow-sm">
            <CardContent className="px-6 space-y-6">

              {/* Status Badge */}
              <div className="flex justify-end">
                <Badge
                  className={`rounded-full text-sm px-4 py-1 font-medium capitalize ${getStatusBadgeClass(
                    proposal.status,
                  )}`}
                >
                  {proposal.status ?? "pending"}
                </Badge>
              </div>

              {/* Cost & Timeline */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="absolute right-3 top-3 rounded-full bg-orange-100 p-1.5">
                    <DollarSign className="h-4 w-4 text-orangeButton" />
                  </div>
                  <p className="text-sm font-semibold text-[#667085]">Proposed Cost ($)</p>
                  <p className="mt-1 text-2xl font-bold text-[#344054]">
                    ${proposal.proposedBudget.toLocaleString()}
                  </p>
                </div>
                <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="absolute right-3 top-3 rounded-full bg-orange-100 p-1.5">
                    <Calendar className="h-4 w-4 text-orangeButton" />
                  </div>
                  <p className="text-sm font-semibold text-[#667085]">Estimated Timeline</p>
                  <p className="mt-1 text-2xl font-bold text-[#344054]">
                    {proposal.proposedTimeline}
                  </p>
                </div>
              </div>

              <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="absolute right-3 top-3 rounded-full bg-orange-100 p-1.5">
                  <FileText className="h-4 w-4 text-orangeButton" />
                </div>
                <p className="text-sm font-semibold text-[#667085]">Work Approach</p>
                <div className="mt-2 text-sm leading-relaxed text-[#475467] md:text-base">
                  {proposal.proposalDescription}
                </div>
              </div>

              {/* Project Milestones */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-[#667085]">
                  Project Milestones
                </label>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {proposal.milestones?.map((milestone, index) => (
                    <div
                      key={milestone._id || index}
                      className="flex flex-col gap-2 border border-[#E4E7EC] bg-[#F9FAFB] rounded-2xl hover:shadow-sm transition"
                    >
                      <div className="flex flex-row justify-end mt-2 mr-3">
                        {milestone?.completed && (
                          <Badge className="bg-green-400 border-1 rounded-xl text-[10px] h-[18px]">
                            Completed
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-start justify-between px-4 py-2 gap-4">
                        {/* Left Content */}
                        <div className="flex gap-3">

                          {/* Number Circle */}
                          <div className="min-w-[28px] h-[28px] rounded-full bg-[#1570EF] text-white text-xs font-semibold flex items-center justify-center">
                            {index + 1}
                          </div>

                          {/* Title + Description */}
                          <div>
                            <p className="text-sm font-semibold text-[#344054]">
                              {milestone.title}
                            </p>
                            {milestone.description && (
                              <p className="text-xs text-[#667085] mt-1">
                                {milestone.description}
                              </p>
                            )}
                            {milestone.deliverableDocuments &&
                              milestone.deliverableDocuments.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {milestone.deliverableDocuments.map(
                                    (docUrl, docIndex) => (
                                      <a
                                        key={docIndex}
                                        href={docUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                                        title={docUrl.split("/").pop()}
                                      >
                                        <File className="w-4 h-4" />
                                      </a>
                                    ),
                                  )}
                                </div>
                              )}
                          </div>
                        </div>

                        {/* Right Arrow */}
                        {!milestone?.completed && (
                          <button
                            onClick={() => {
                              setSelectedMilestone({
                                ...milestone,
                                deliverableDocuments:
                                  milestone.deliverableDocuments || [],
                              });
                              setIsEditMilestoneOpen(true);
                            }}
                          >
                            <Edit className="text-[#98A2B3] w-4 h-4 mt-1 cursor-pointer" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cover Letter */}
              {proposal.coverLetter && (
                <div className="relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="absolute right-3 top-3 rounded-full bg-orange-100 p-1.5">
                    <FileText className="h-4 w-4 text-orangeButton" />
                  </div>
                  <p className="text-sm font-semibold text-[#667085]">Cover Letter</p>
                  <div className="mt-2 text-sm leading-relaxed text-[#475467] md:text-base">
                    {proposal.coverLetter}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {proposal.attachments &&
                proposal.attachments.length > 0 && (
                <div className="space-y-2 mt-3">
                  <label className="text-sm font-semibold mb-1 text-[#667085]">
                    Attachments
                  </label>

                  <div className="flex flex-row items-center flex-wrap gap-2">
                    {proposal.attachments.map((url: string, index: number) => (
                    <div>
                      <a
                        key={index}
                        href={url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#475467] hover:text-[#1570EF] transition text-sm"
                      >
                        <File size={18} />
                        <span className="underline">Attachement {index + 1}</span>
                      </a>
                    </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col border-t border-gray-400 sm:flex-row justify-between items-center gap-4 mt-3 pt-0">
                <a
                    className="flex flex-row items-center mt-3 cursor-pointer gap-1"
                    onClick={() =>
                      from
                        ? router.back()
                        : router.push("/agency/dashboard/proposals")
                    }
                  >
                    <ChevronLeft size={20} className="text-gray-400" />
                    <span className="text-xs underline text-gray-400">
                      {from ? "Back to Projects" : "Back to Proposals"}
                    </span>
                  </a>
               
                
              </div>

            </CardContent>
          </Card>

      {isEditMilestoneOpen && selectedMilestone && (
        <Dialog open={isEditMilestoneOpen} onOpenChange={setIsEditMilestoneOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Milestone: {selectedMilestone.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Deliverable Files
                </label>
                {selectedMilestone.deliverableDocuments?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedMilestone.deliverableDocuments.map(
                      (url: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-md"
                        >
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate max-w-[200px]"
                          >
                            {url.split("/").pop()}
                          </a>
                          <button
                            type="button"
                            className="ml-1 text-blue-800 cursor-pointer hover:text-blue-900"
                            onClick={() => {
                              const updatedDocs =
                                selectedMilestone.deliverableDocuments.filter(
                                  (_: string, index: number) => index !== i,
                                );
                              setSelectedMilestone((prev: any) => ({
                                ...prev,
                                deliverableDocuments: updatedDocs,
                              }));
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              <PdfUpload
                maxSizeMB={10}
                placeholderText="Upload Deliverable Files"
                onUploadSuccess={(url) => {
                  setSelectedMilestone((prev: any) => ({
                    ...prev,
                    deliverableDocuments: [
                      ...(prev?.deliverableDocuments || []),
                      url,
                    ],
                  }));
                }}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditMilestoneOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateMilestone} disabled={updating}>
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update Milestone"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
