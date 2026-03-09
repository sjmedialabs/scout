"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import type { Proposal } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { authFetch } from "@/lib/auth-fetch";
import { Button } from "@/components/ui/button";
import RatingStars from "@/components/rating-star";
import { MoveLeft,ChevronLeft,File,ChevronRight } from "lucide-react";

import ProposalHeader from "@/components/provider/proposalDetailHeader";

import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);


export default function ProposalViewDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [resLoading, setResLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const [proposal, setProposal] = useState<Proposal | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const loadProposal = async () => {
      setResLoading(true);
      setFailed(false);

      try {
        const res = await authFetch(`/api/proposals/${id}`);
        if (!res.ok) throw new Error("Failed");

        const data = await res.json();
        console.log("proposal details:::;",data);
        setProposal(data.proposals[0]);
      } catch (err) {
        setFailed(true);
      } finally {
        setResLoading(false);
      }
    };

    loadProposal();
  }, [id, user, loading, router]);

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
            <CardContent className="px-6 md:px-4 py-0 space-y-0">

              {/* Status Badge */}
              <div className="flex justify-end">
                <Badge
                  className={`rounded-full text-sm px-4 py-1 font-medium bg-green-400`}
                >
                  Accepted
                </Badge>
              </div>

              {/* Cost & Timeline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-[#667085]">
                    Proposed Cost ($)
                  </label>
                  <div className="h-[40px] rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] flex items-center px-4 text-[#344054] font-medium">
                    ${proposal.proposedBudget}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#667085]">
                    Estimated Timeline
                  </label>
                  <div className="h-[40px] rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] flex items-center px-4 text-[#344054] font-medium">
                    {proposal.proposedTimeline}
                  </div>
                </div>
              </div>

              {/* Work Approach */}
              <div className="space-y-3 mt-3">
                <label className="text-sm font-semibold text-[#667085]">
                  Work Approach
                </label>
                <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-4 text-[#475467] leading-relaxed text-sm md:text-base">
                  {proposal.proposalDescription}
                </div>
              </div>

              {/* Cover Letter */}
              {proposal.coverLetter && (
                <div className="space-y-3 mt-3">
                  <label className="text-sm font-semibold text-[#667085]">
                    Cover Letter
                  </label>
                  <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-4 text-[#475467] leading-relaxed text-sm md:text-base">
                    {proposal.coverLetter}
                  </div>
                </div>
              )}

              {/* Project Milestones */}
              <div className="space-y-4 mt-3">
                <label className="text-sm font-semibold text-[#667085]">
                  Project Milestones
                </label>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {proposal.milestones?.map((milestone, index) => (
                    <div
                      key={index}
                      className="flex flex-col justify-between border border-[#E4E7EC] bg-[#F9FAFB] rounded-2xl hover:shadow-sm transition"
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
                          </div>
                        </div>

                        {/* Right Arrow */}
                        <ChevronRight className="text-[#98A2B3] w-4 h-4 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              {proposal.attachments && proposal.attachments.length > 0 && (
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
                  href="/agency/dashboard/proposals"
                >
                  <ChevronLeft size={20} className="text-gray-400" />
                  <span className="text-xs underline text-gray-400">
                    Back to proposals
                  </span>
                </a>
               
                
              </div>

            </CardContent>
          </Card>

      
    </div>
  );
}
