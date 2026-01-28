"use client";

import { Button } from "@/components/ui/button";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { Content } from "next/font/google";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import RatingStars from "@/components/rating-star";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Requirement,
  Proposal,
  Provider,
  Notification,
} from "@/lib/types";
import { authFetch } from "@/lib/auth-fetch";
const ProjectDetailPage = () => {
  const [projectDetails, setProjectDetails] = useState();
  const [filterStatus, setFilterStatus] = useState("all");
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const params = useParams();
  const id = params.id as string;
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/proposals/${id}`);
      const project = await fetch(`/api/requirements/${id}`);
      console.log("Project detail response::::", await project.json());
      if (response.status === 404) {
        // ✅ No proposals case
        setProposals([]);
        setFilteredProposals([]);
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch proposals");
      }
      const data = await response.json();
      setProjectDetails(data.proposals[0].requirement);
      setProposals(data.proposals);
      setFilteredProposals(data.proposals);
      setFailed(false);
    } catch (error) {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  const getBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-[#39A935] text-[#fff]";
      case "shortlisted":
        return "bg-[#1C96F4] text-[#fff]";
      case "negotiation":
        return "bg-[#FCF6E3] text-[#AF905D]";
      case "rejected":
        return "bg-[#FF0000] text-[#fff]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleShortlist = async (proposalId: string) => {
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: "shortlisted" as const } : p,
      ),
    );
    console.log("recievd id::::", proposalId);
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "shortlisted" }),
      });
      console.log(
        "Shortlist action response::::",
        await response.json,
        proposalId,
      );
    } catch (error) {
      console.log("failed to update the  status", error);
      alert("Staus failed to shortlist the proposal");
    }
  };
  const handleAccept = async (proposalId: string) => {
    console.log("Entered to accept fun:::", proposalId);
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "accepted" }),
      });
      console.log(
        "Shortlist action response::::",
        await response.json,
        proposalId,
      );
      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId ? { ...p, status: "accepted" as const } : p,
        ),
      );
    } catch (error) {
      console.log("failed to update the  status", error);
      alert("Staus failed to shortlist the proposal");
    }
  };
  const handleReject = async (proposalId: string) => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "rejected" }),
      });
      console.log(
        "Shortlist action response::::",
        await response.json,
        proposalId,
      );
      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId ? { ...p, status: "rejected" as const } : p,
        ),
      );
    } catch (error) {
      console.log("failed to update the  status", error);
      alert("Staus failed to shortlist the proposal");
    }
  };

  // if (loading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //       </div>
  //     )
  //   }
  // if(failed){
  //         return(
  //         <div className="flex flex-col justify-center items-center text-center min-h-100">
  //             <h1 className="text-center font-semibold">Failed  to Retrive the data</h1>
  //             <Button onClick={loadData} className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]">Reload</Button>
  //         </div>
  //         )
  // }
  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredProposals(proposals);
    } else {
      setFilteredProposals(
        proposals.filter(
          (req) => req.status.toLowerCase() === filterStatus.toLowerCase(),
        ),
      );
    }
  }, [proposals, filterStatus]);

  return (
    <div className="space-6 p-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#F4561C] my-custom-class">
            Project Details
            {proposals.length > 0 && (
              <span className="text-[24px] font-normal text-[#656565]">
                {" "}
                for {proposals[0].requirement.title}
              </span>
            )}
          </h1>
          <p className="text-lg font-normal text-[#656565] my-custom-class ">
            Review and manage proposals received for this project
          </p>
        </div>
        <div>
          <Button
            className="bg-[#000] rounded-full"
            onClick={() => router.push("/client/dashboard/projects")}
          >
            <FaArrowLeftLong className="h-4 w-4" color="#fff" /> Back to
            Projects
          </Button>
        </div>
      </div>
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {failed && (
        <div className="flex flex-col justify-center items-center text-center min-h-100">
          <h1 className="text-center font-semibold">
            Failed to Retrive the data
          </h1>
          <Button
            onClick={loadData}
            className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]"
          >
            Reload
          </Button>
        </div>
      )}
      {(proposals || []).length > 0 && (
        <Card className="mt-6 p-3  bg-[#fff] py-5 rounded-[22px]">
          <CardContent>
            <Select
              onValueChange={(value) => setFilterStatus(value)}
              value={filterStatus}
            >
              <SelectTrigger
                className="
                                mt-1
                                border-0
                                border-2
                                border-[#b2b2b2]
                                mb-4
                                
                                rounded-full

                                shadow-none
                                focus:outline-none focus:ring-0 focus:ring-offset-0
                                focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0
                                focus:border-[#b2b2b2]
                                placeholder:text-[#b2b2b2]
                                px-6
                                w-[150px]
                                h-12
                                text-sm
                                md:text-base
                              "
              >
                <SelectValue placeholder="Rating" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="negotation">Negotiation</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
            {filteredProposals.length > 0 ? (
              (filteredProposals || []).map((proposal) => (
                <Card
                  key={proposal.id}
                  className="py-0 px-0 rounded-[22px] mb-3"
                >
                  <CardContent className="px-5 py-6">
                    <div className="flex flex-col lg:flex-row lg:justify-start gap-4">
                      {/* Left Image */}
                      <div className="max-h-[300px] max-w-100 lg:max-h-[100%] lg:max-w-[300px] rounded-[18px] overflow-hidden shrink-0">
                        <img
                          src={proposal.agency.coverImage || "/proposal.jpg"}
                          alt={proposal.agency.name}
                          className="h-full w-full"
                        />
                      </div>

                      {/* Right Content */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className="text-xs border-[#DEDEDE] bg-[#EDEDED] rounded-full h-[30px] px-3"
                              >
                                {proposal?.requirement?.title ||
                                  "Unknown Project"}
                              </Badge>
                            </div>

                            <h3 className="text-2xl font-bold text-[#000] mb-0">
                              {proposal.agency.name}
                            </h3>

                            <p className="text-sm ml-1 -mt-1 text-[#939191] font-normal">
                              {proposal.agency.name}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center mt-0 gap-1 text-sm font-medium">
                              <RatingStars
                                rating={proposal.agency.rating}
                                reviews={proposal.agency.reviewCount}
                              />
                              <span className="text-sm font-bold text-[#000] mt-1">
                                {`${proposal.agency.rating || 0} (${proposal.agency.reviewCount || 0})`}
                              </span>
                            </div>
                          </div>

                          <div className="text-right mb-0">
                            <div className="text-2xl font-bold text-[#39A935]">
                              ${proposal.proposedBudget.toLocaleString()}
                            </div>
                            <div className="text-sm text-[#A0A0A0] -mt-1">
                              {proposal.proposedTimeline}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <h4 className="font-bold text-xl text-[#616161] mb-0">
                              Cover Letter
                            </h4>
                            <p className="text-[#939191] font-normal text-sm">
                              {proposal.coverLetter}
                            </p>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-bold text-xl text-[#616161] mb-0">
                              Proposal Description
                            </h4>
                            <p className="text-[#939191] font-normal text-sm">
                              {proposal.proposalDescription}
                            </p>
                          </div>

                          <div className="flex flex-col md:flex-row items-center justify-between pt-4 border-[#DDDDDD] border-t-2">
                            <div className="flex items-center mt-2 mb-3 gap-2">
                              <span className="text-sm text-[#000000] font-noormal">
                                Submitted on :{" "}
                                {new Date(
                                  proposal.updatedAt,
                                ).toLocaleDateString()}
                              </span>

                              <Badge
                                className={`border-[#DEDEDE] bg-[#EDEDED] rounded-full text-xs text-[#000] ${getBgColor(
                                  proposal.status,
                                )}`}
                              >
                                {proposal.status.charAt(0).toUpperCase() +
                                  proposal.status.slice(1)}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {/* Shortlist */}
                              {proposal.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleShortlist(proposal.id)}
                                  className="bg-[#E6E8EC] rounded-full text-xs font-bold hover:bg-[#E6E8EC] hover:text-[#000] active:bg-[#E6E8EC] active:text-[#000]"
                                >
                                  Shortlist
                                </Button>
                              )}

                              {/* Accept */}
                              {proposal.status !== "accepted" &&
                                proposal.status !== "rejected" && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleAccept(proposal.id)}
                                    className="bg-[#39A935] rounded-full text-xs font-bold hover:bg-[#39A935] active:bg-[#39A935]"
                                  >
                                    Accept
                                  </Button>
                                )}

                              {/* Reject */}
                              {proposal.status !== "accepted" &&
                                proposal.status !== "rejected" && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleReject(proposal.id)}
                                    className="bg-[#FF0000] rounded-full text-xs font-bold hover:bg-[#FF0000] active:bg-[#FF0000]"
                                  >
                                    Reject
                                  </Button>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <h2 className="text-2xl text-center mt-10 font-semibold text-[#656565]">
                No Proposals Found
              </h2>
            )}
          </CardContent>
        </Card>
      )}
      {(proposals || []).length === 0 && !failed && !loading && (
        <Card className="mt-6 p-3  bg-[#fff] py-5 rounded-[22px]">
          <CardContent className="p-10 text-center">
            <h2 className="text-2xl font-semibold text-[#656565]">
              No Proposals Received Yet
            </h2>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
export default ProjectDetailPage;
