"use client";

import type React from "react";

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
import { PostRequirementForm } from "@/components/seeker/post-requirement-form";
import { RequirementList } from "@/components/seeker/requirement-list";
import { ProposalList } from "@/components/seeker/proposal-list";
import { RequirementDetailsModal } from "@/components/seeker/requirement-details-modal";
import { NegotiationChat } from "@/components/negotiation-chat";
import { FiltersPanel } from "@/components/filters-panel";
import { ProviderProfileModal } from "@/components/provider-profile-modal";
import { ProjectSubmissionForm } from "@/components/project-submission-form";
import { ReviewSubmissionForm } from "@/components/review-submission-form";
import { ProviderComparison } from "@/components/provider-comparison";
import { NotificationsWidget } from "@/components/seeker/notifications-widget";
import {
  Plus,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Eye,
  Home,
  User,
  Briefcase,
  BarChart3,
  Settings,
  CreditCard,
  Bell,
  Shield,
  GitCompare,
  ChevronDown,
  ChevronRight,
  Edit,
  Save,
  X,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  MoreHorizontal,
  Trash2,
  DollarSign,
  Target,
  Heart,
  SeparatorVertical as Separator,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RatingStars from "@/components/rating-star";
import { Linden_Hill } from "next/font/google";
import { useSearchParams } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProjectProposal {
  id: string;
  projectId: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  proposalAmount: number;
  timeline: string;
  description: string;
  submittedAt: string;
  status: "pending" | "shortlisted" | "accepted" | "rejected";
  coverLetter: string;
}



const ProposalPage = () => {
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();
  const requirementId = searchParams.get("requirementId");

  useEffect(() => {
    setSelectedRequirement(requirementId);
  }, [requirementId]);

  const [selectedRequirementProposals, setSelectedRequirementProposals] =
    useState<Proposal[]>();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard"); // Set initial state to "dashboard" so content shows by default

  const [proposals, setProposals] = useState<Proposal[]>();
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(
    null,
  );
  const [responseLoading, setResponseLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  
   const [filterStatus, setFilterStatus] = useState<string>("");
   const[projectTitles,setProjectTitles]=useState([]);
   const[projectFilter,setProjectFilter]=useState<string>("");
   const[filteredProposals,setFilteredProposals]=useState<Proposal[]>([]);

   /* ---------------- PAGINATION ---------------- */
        const ITEMS_PER_PAGE = 2;
        const [page, setPage] = useState(1);

        const totalPages = Math.ceil(
          filteredProposals.length / ITEMS_PER_PAGE
        );

        const paginatedProposals = filteredProposals.slice(
          (page - 1) * ITEMS_PER_PAGE,
          page * ITEMS_PER_PAGE
        );

  // negotation modal and message
    const[showNegotationModal,setShowNegotationModal]=useState(false);
    const[negotationMessage,setNegotationMessage]=useState("");
    const[sending,setSending]=useState(false);
    const[conversationId,setConversationId]=useState("");
    const[selectedProposalId,setSelectedProposalId]=useState('')
    const[errorMsg,setErrorMsg]=useState({
      status:"success",
      msg:""
    })

  const LoadData = async (userId: string) => {
    setResponseLoading(true);
    setFailed(false);

    try {
      const response = await authFetch(`/api/proposals`, {credentials: "include" });
      const data = await response.json();

      const reqRes=await authFetch(`/api/requirements/${userId}`, {credentials: "include" });
      const reqData=await reqRes.json();

      console.log("Fetched Proposals:::", data);

      const filteredProposals = data.proposals.filter((p: any) => {
        const id =
          p.requirement?._id || // populated
          p.requirement?.id || // populated
          p.requirementId; // not populated

        console.log("Comparing:", id?.toString(), requirementId);

        let tempTitles=["All"];
        (reqData.requirements || []).map((eachItem)=>tempTitles.push(eachItem.title))
        setProjectTitles(tempTitles)

        return id?.toString() === requirementId;
      });

      setProposals(data.proposals);
      setFilteredProposals(data.proposals)
      setSelectedRequirementProposals(filteredProposals);
      setFailed(false);
    } catch (error) {
      console.log("Failed to fetch the proposals", error);
      setFailed(true);
    } finally {
      setResponseLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login");
    }
    if (!loading && user) {
      LoadData(user.id);
    }
  }, [user, loading, router]);

  const handleShortlist = async (proposalId: string) => {
    console.log("Recived Id for the proposal shortlist::::",proposalId)
    // setProposals((prev) =>
    //   prev.map((p) =>
    //     p.id === proposalId ? { ...p, status: "shortlisted" as const } : p,
    //   ),
    // );
    // console.log("recievd id::::", proposalId);
    try {
      const response = await authFetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "shortlisted" }),
        credentials: "include" 
      });
      if(response.ok){
        await LoadData();
      }
      // console.log(
      //   "Shortlist action response::::",
      //   await response.json,
      //   proposalId,
      // );
    } catch (error) {
      console.log("failed to update the  status", error);
      alert("Staus failed to shortlist the proposal");
    }
  };

  const handleAccept = async (proposalId: string) => {
    console.log("Entered to accept fun:::", proposalId);
    try {
      const response = await authFetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "accepted" }),
        credentials: "include" 
      });
      // console.log(
      //   "Shortlist action response::::",
      //   await response.json,
      //   proposalId,
      // );
      if(!response.ok) throw new Error()
      
      //create a conversation between the agency and client and send the message
       //chat concersation start api
            const conRes=await authFetch(`/api/chat/conversation`,{
              method:"POST",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify({proposalId})
  
            })
            const convData=await conRes.json();

            const negotatiteProposal=(proposals || []).find((eachItem:any)=>eachItem.id===proposalId)
            
            const messRes=await authFetch(`/api/chat/message`,{
              method:"POST",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify({
                conversationId:convData.conversationId,
                senderType:"SEEKER",
                receiverId:negotatiteProposal?.agency?.userId,
                content:`Congratulations your proposal is accepted for the ${negotatiteProposal?.requirement.title} and project is allocated to you please stay in touch`,
                messageType:"TEXT"

              })})

      // setProposals((prev) =>
      //   prev.map((p) =>
      //     p.id === proposalId ? { ...p, status: "accepted" as const } : p,
      //   ),
      // );
      await LoadData();
    } catch (error) {
      console.log("failed to update the  status", error);
      alert("Staus failed to shortlist the proposal");
    }
  };

  const handleReject = async (proposalId: string) => {
    try {
      const response = await authFetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "rejected" }),
        credentials: "include" 
      });
      // console.log(
      //   "Shortlist action response::::",
      //   await response.json,
      //   proposalId,
      // );
      // setProposals((prev) =>
      //   prev.map((p) =>
      //     p.id === proposalId ? { ...p, status: "rejected" as const } : p,
      //   ),
      // );
      await LoadData()
    } catch (error) {
      console.log("failed to update the  status", error);
      alert("Staus failed to shortlist the proposal");
    }
  };

  const handleRequestRevision = (proposalId: string, feedback: string) => {
    console.log(
      "Revision requested for proposal:",
      proposalId,
      "Feedback:",
      feedback,
    );
    // In real app, this would send the revision request to the provider
  };

  console.log("Project titles are :::::",projectTitles)
  const getProposalsForRequirement = (requirementId: string) => {
    return proposals.filter((p) => p.requirementId === requirementId);
  };

  const handleProjectProposalAction = (
    proposalId: string,
    action: "shortlist" | "accept" | "reject",
  ) => {
    // setProjectProposals((prev) =>
    //   prev.map((proposal) =>
    //     proposal.id === proposalId
    //       ? { ...proposal, status: action === "shortlist" ? "shortlisted" : action }
    //       : proposal,
    //   ),
    // )
  };

  const handleViewPortfolio = (providerId: string) => {
    
    window.open(`/provider/${providerId}`, "_blank");
  };

  const handleViewProfile = (providerId: string) => {
    setSelectedCompanyId(providerId);
    setViewingProfile(true);
    setViewingPortfolio(false);
    setActiveSection("company-profile");
  };
  const handlNegotation=async(proposalId:string)=>{
         console.log("Entered to accept fun:::",proposalId)
        // const negotatiteProposal=proposals.find((eachItem:any)=>eachItem.id===proposalId)
         try{
           const  response=await authFetch(`/api/proposals/${proposalId}`,{
            method:"PUT",
            body:JSON.stringify({status:"negotation"})})

            console.log("negotation action response::::",await response.json,proposalId)
            setProposals((prev) => prev.map((p) => (p.id === proposalId ? { ...p, status: "negotation" as const } : p)))
            //chat concersation start api
            const conRes=await authFetch(`/api/chat/conversation`,{
              method:"POST",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify({proposalId})
   
            })
            const convData=await conRes.json();
            setConversationId(convData.conversationId)
            
            setSelectedProposalId(proposalId)
            setShowNegotationModal(true)
            
            console.log("Conversation Started")
        }catch(error){
          console.log("failed to update the  status",error)
          alert("Staus failed to shortlist the proposal")
        }
      }
  const handleSendMessage=async()=>{
    if(!negotationMessage.trim()) {
      setErrorMsg({
        status:"failed",
      msg:"Required"          
    })
    }
      setSending(true);
      const negotatiteProposal=proposals.find((eachItem:any)=>eachItem.id===selectedProposalId)
      try{
          //send message to the agency in the chat
        const messRes=await authFetch(`/api/chat/message`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            conversationId:conversationId,
            senderType:"SEEKER",
            receiverId:negotatiteProposal?.agency?.userId,
            content:negotationMessage,
            messageType:"TEXT"

          })

        })
        if(messRes.ok){
          setNegotationMessage("");
          setShowNegotationModal(false);
          await LoadData();

        }
      }catch(error){
          console.log("Failed to send the message")
          setErrorMsg({
          status:"failed",
          msg:"Failed to send the message"
          })
      }finally{
        setSending(false)
      }
  }

  //filters 
 useEffect(() => {
  if (!proposals) return

  let tempFiltered = [...proposals]

  // STATUS FILTER
  if (filterStatus && filterStatus.toLowerCase() !== "all") {
    tempFiltered = tempFiltered.filter(
      (item) =>
        item?.status?.toLowerCase() === filterStatus.toLowerCase()
    )
  }

  // PROJECT FILTER
  if (projectFilter && projectFilter.toLowerCase() !== "all") {
    tempFiltered = tempFiltered.filter(
      (item) =>
        item?.requirement?.title
          ?.toLowerCase()
          ?.trim() === projectFilter.toLowerCase().trim()
    )
  }

  setFilteredProposals(tempFiltered)
  setPage(1);
}, [filterStatus, projectFilter,proposals])
    
console.log("Filtered Proposals:::::::",filteredProposals)
  if (loading || responseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (failed || !proposals) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-100">
        <h1 className="text-center font-semibold">
          Failed to Retrive the data
        </h1>
        <Button
          onClick={LoadData}
          className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]"
        >
          Reload
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-3 -mt-5">
      <div>
        <h1 className="text-2xl font-bold my-custom-class text-[#F4561C]">
          Proposals <span className="text-[#656565] text-[18px]">({proposals.length})</span> 
          {selectedRequirementProposals[0]?.requirement?.title && (
            <span className="text-[#656565] font-normal text-sm">
              {` (for  ${selectedRequirementProposals[0].requirement?.title} )`}
            </span>
          )}
        </h1>
        <p className="text-[#656565] -mt-1 text-xl font-medium my-custom-class">
          {selectedRequirement
            ? "Review and manage proposals for the selected requirement"
            : "All proposals received for your projects"}
        </p>
      </div>

      {/* <div className="flex gap-4 -mt-1 h-[40px] w-fit  justify-center items-center font-bold text-sm text-[#000] bg-[#E6EDF5] rounded-full">
        <button
          className={`h-[100%] ${
            !selectedRequirement
              ? " bg-[#F54A0C] rounded-full text-[#fff] px-5"
              : " text-muted-foreground hover:text-foreground px-5"
          }`}
          onClick={() => setSelectedRequirement(null)}
        >
          Project Proposals ({proposals.length})
        </button>
        <button
          className={`h-[100%] ${
            selectedRequirement
              ? "bg-[#F54A0C] rounded-full text-[#fff] px-5"
              : "text-muted-foreground hover:text-foreground px-5"
          }`}
          onClick={() => setSelectedRequirement("req" || null)}
        >
          Requirement Proposals
        </button> 
      </div> */}

      <Card className="bg-transparent py-0 border-none shadow-none rounded-[22px]">
        <CardContent className=" px-2 sm:px-0">
          {selectedRequirement ? (
            <ProposalList
              // proposals={getProposalsForRequirement(selectedRequirement)}
              proposals={selectedRequirementProposals || []}
              onShortlist={handleShortlist}
              onAccept={handleAccept}
              onReject={handleReject}
              onRequestRevision={handleRequestRevision}
            />
          ) : (
            <div className="space-y-0">
              {/*Filterss block */}
              {
                (projectTitles.length>=1) && (
                  <div className="flex flex-row  gap-4 overflow-x-auto mx-1 lg:mx-0">
                    <div className="mb-2 md:mb-0">
                      {/* <p className="text-md text-gray-500 ml-2">Proposal Status</p> */}
                      <Select
                        onValueChange={(value) => setFilterStatus(value)}
                        value={filterStatus}
                      >
                        <SelectTrigger
                        className={`
                      border-2
                      border-[#b2b2b2]
                      cursor-pointer
                      rounded-[8px]
                      shadow-none
                      focus:ring-0
                      
                      px-3
                      h-11 
                      text-sm
                      data-[placeholder]:text-[#98A0B4]
                    `}
                        >
                          <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
              
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="negotation">Negotiation</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mb-2 md:mb-0">
                       {/* <p className="text-md text-gray-500 ml-2">Select Project</p> */}
                      <Select
                        onValueChange={(value) => setProjectFilter(value)}
                        value={projectFilter}
                      >
                        <SelectTrigger
                          className={`
                      border-2
                      border-[#b2b2b2]
                      cursor-pointer
                      rounded-[8px]
                      shadow-none
                      focus:ring-0
                      
                      px-3
                      h-11 
                      text-sm
                      data-[placeholder]:text-[#98A0B4]
                    `}
                        >
                          <SelectValue placeholder="Filter by Project" />
                        </SelectTrigger>
              
                        <SelectContent className=" mr-[40px] max-h-[300px]">
                          {
                            (projectTitles || []).map((eachItem,index)=>(<SelectItem value={eachItem} key={index}>{eachItem}</SelectItem>))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )
              }
              <div className="sm:pr-2">
                {filteredProposals.length > 0 ? (
                <div>
                  <div className="space-y-4 mb-4">
                    {/* <div className="flex justify-between items-center mt-0">
                      <h3 className="text-lg font-semibold my-custom-class tracking-tight">
                        Proposals Received
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        Showing {proposals.length} of {proposals.length}{" "}
                        proposals
                        {proposals.rejectedCount > 0 &&
                          ` (${proposals.rejectedCount} rejected)`}
                      </div>
                    </div> */}

                  </div>

                 {paginatedProposals.map((proposal) => (
                    <Card
                      key={proposal.id}
                      className="py-0 px-0 rounded-[22px] mb-3"
                    >
                      <CardContent className="px-0 lg:px-5 py-0 lg:py-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                          
                          {/* Left Image */}
                          <div className="max-h-[200px] lg:max-h-[300px] max-w-full lg:max-w-[300px] rounded-t-[18px] lg:rounded-[18px] overflow-hidden sm:shrink-0">
                            <img
                              src={proposal?.agency?.coverImage || "/proposal.jpg"}
                              alt={proposal.agency?.name}
                              className="h-auto lg:h-full w-full object-cover"
                            />
                          </div>

                          {/* Right Side Content */}
                          <div className="flex-1 px-3 py-2 lg:py-0 lg:pr-5">

                            {/* Top Section (Title + Cost) */}
                            <div className="flex justify-between flex-wrap items-start mb-2 w-full">
                              
                              {/* LEFT CONTENT */}
                              <div className="flex-1 pr-6">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-[#DEDEDE] bg-[#EDEDED] rounded-full h-[30px] px-3"
                                  >
                                    {proposal?.requirement?.title || "Unknown Project"}
                                  </Badge>
                                </div>
 
                                <h3
                                  className="text-2xl font-bold text-[#000] mb-0 cursor-pointer"
                                  onClick={() =>
                                    handleViewProfile(proposal.providerId)
                                  }
                                >
                                  {proposal.agency?.name}
                                </h3>

                                {/* <p className="text-sm ml-1 -mt-1 text-[#939191] font-normal">
                                  {proposal.agency?.name}
                                </p> */}

                                {/* Rating */}
                                <div className="flex items-center mt-0 gap-1 text-sm font-medium">
                                  <RatingStars
                                    rating={proposal.agency?.rating}
                                    reviews={proposal.agency?.reviewCount}
                                  />
                                  <span className="text-sm font-bold text-[#000] mt-1">
                                    {proposal.agency?.rating || 0} ({proposal.agency?.reviewCount || 0}{" "}
                                    <span className="text-gray-500 text-sm font-light">
                                      Reviews
                                    </span>
                                    )
                                  </span>
                                </div>
                              </div>

                              {/* RIGHT COST SECTION */}
                              <div className="md:text-right shrink-0">
                                <div className="text-md font-bold text-[#39A935]">
                                  <span className="text-[#000]">Proposed Budget:</span> <span className="text-md"> ${proposal.proposedBudget.toLocaleString()}</span> 
                                </div>
                                <div className="text-xs  font-bold text-[#A0A0A0] mt-1">
                                 <span className="text-[#000]">Proposed Timeline:</span> <span className="text-md">{proposal.proposedTimeline}</span>
                                </div>
                              </div>

                            </div>

                            {/* Description Section */}
                            <div className="space-y-2">

                              {proposal?.coverLetter && (
                                <div>
                                  <h4 className="font-bold text-xl text-[#616161] mb-0">
                                    Cover Letter
                                  </h4>
                                  <p className="text-[#939191] font-normal line-clamp-2 text-sm">
                                    {proposal?.coverLetter}
                                  </p>
                                </div>
                              )}

                              <div>
                              <h4 className="font-bold text-xl text-[#616161] mb-0">
                                Proposal Description
                              </h4>
                              <p className="text-[#939191] font-normal text-sm line-clamp-2">
                                {proposal.proposalDescription}
                              </p>
                            </div>


                              {/* Status Section */}
                              <div className="flex items-center mt-2 mb-3 gap-2">
                                <span className="text-sm text-[#000000] font-noormal">
                                  Submitted on :{" "}
                                  {new Date(
                                    proposal.updatedAt
                                  ).toLocaleDateString()}
                                </span>

                                <Badge
                                  variant={
                                    proposal.status === "accepted"
                                      ? "default"
                                      : proposal.status === "shortlisted"
                                      ? "secondary"
                                      : proposal.status === "rejected"
                                      ? "destructive"
                                      : "outline"
                                  }
                                  className="border-[#DEDEDE] bg-[#EDEDED] rounded-full text-xs text-[#000]"
                                >
                                  {proposal.status.charAt(0).toUpperCase() +
                                    proposal.status.slice(1)}
                                </Badge>
                              </div>

                              {/* Buttons */}
                              <div className="flex items-center justify-between pt-4 border-[#DDDDDD] border-t-2">
                                <div className="flex flex-wrap gap-2">

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleViewPortfolio(proposal.agency._id)
                                    }
                                    className="bg-[#E6E8EC] rounded-full text-xs font-bold hover:bg-[#E6E8EC] hover:text-[#000] active:bg-[#E6E8EC] active:text-[#000]"
                                  >
                                    View Profile
                                  </Button>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(`proposals/${proposal.id}`)
                                    }
                                    className="bg-[#E6E8EC] rounded-full text-xs font-bold hover:bg-[#E6E8EC] hover:text-[#000] active:bg-[#E6E8EC] active:text-[#000]"
                                  >
                                    View Proposal Details
                                  </Button>

                                  {/* Shortlist */}
                                  {proposal.status !== "shortlisted" &&
                                    proposal.status !== "accepted" &&
                                    proposal.status !== "rejected" &&
                                    proposal.status !== "completed" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleShortlist(proposal.id)
                                        }
                                        className="bg-[#E6E8EC] rounded-full text-xs font-bold hover:bg-[#E6E8EC] hover:text-[#000] active:bg-[#E6E8EC] active:text-[#000]"
                                      >
                                        Shortlist
                                      </Button>
                                    )}

                                  {/* Negotiation */}
                                  {proposal.status !== "accepted" &&
                                    proposal.status !== "rejected" &&
                                    proposal.status !== "shortlisted" &&
                                    proposal.status !== "negotation" &&
                                    proposal.status !== "completed" && (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() =>
                                          handlNegotation(proposal.id)
                                        }
                                        className="bg-[#F5A30C] rounded-full text-xs font-bold hover:bg-[#F5A30C] active:bg-[#F5A30C]"
                                      >
                                        Negotation
                                      </Button>
                                    )}

                                  {/* Accept */}
                                  {proposal.status !== "accepted" &&
                                    proposal.status !== "rejected" &&
                                    proposal.status !== "completed" && (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() =>
                                          handleAccept(proposal.id)
                                        }
                                        className="bg-[#39A935] rounded-full text-xs font-bold hover:bg-[#39A935] active:bg-[#39A935]"
                                      >
                                        Accept
                                      </Button>
                                    )}

                                  {/* Reject */}
                                  {proposal.status !== "rejected" &&
                                    proposal.status !== "accepted" &&
                                    proposal.status !== "completed" && (
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          handleReject(proposal.id)
                                        }
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
                  ))}

                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Proposals Yet</h3>
                  <p className="text-muted-foreground">
                    No proposals have been received for your projects yet.
                  </p>
                </div>
              )}
              </div>
              {/* ---------------- PAGINATION ---------------- */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 mb-2 flex-wrap text-sm">

                  {/* PREV */}
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className={`px-3 py-1 rounded-md ${
                      page === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-black cursor-pointer"
                    }`}
                  >
                    Prev
                  </button>

                  {/* PAGE NUMBERS */}
                  {/* PAGE NUMBERS */}
                  {(() => {
                    const visiblePages = 6; //  show 7 at a time

                    let startPage = Math.max(1, page - visiblePages + 1);
                    let endPage = startPage + visiblePages - 1;

                    if (endPage > totalPages) {
                      endPage = totalPages;
                      startPage = Math.max(1, endPage - visiblePages + 1);
                    }

                    return Array.from(
                      { length: endPage - startPage + 1 },
                      (_, i) => startPage + i
                    ).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`
                          w-8 h-8 rounded-lg cursor-pointer
                          ${
                            page === pageNumber
                              ? "bg-[#2C34A1] text-white font-semibold"
                              : "text-gray-500"
                          }
                        `}
                      >
                        {pageNumber}
                      </button>
                    ));
                  })()}
                  {/* NEXT */}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className={`px-3 py-1 rounded-md ${
                      page === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-black cursor-pointer"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
          {/*Negotaatiion Modal */}

           {showNegotationModal && (
              <Dialog open={showNegotationModal} onOpenChange={setShowNegotationModal}>
              <DialogContent className="md:max-w-xl rounded-2xl  flex flex-col p-0">

                {/* ✅ FIXED HEADER */}
                <DialogHeader className="px-6 py-4 border-b shrink-0">
                  <DialogTitle className="text-xl font-bold text-[#F4561C]">
                   Send Message to Agency
                  </DialogTitle>
                </DialogHeader>

                {/* ✅ SCROLLABLE FORM FIELDS */}
              
                 <div className="mt-3 p-4 w-full">
                  <p className="text-md text-gray-400">Message</p>
                  <textarea
                  value={negotationMessage}
                  onChange={(e)=>setNegotationMessage(e.target.value)}
                  className="border-1 border-gray-500 p-3 w-full rounded-md"
                  rows={6}
                  cols={30}
                  placeholder="Enter Your Message"
                  >

                  </textarea>
                  {
                    errorMsg.status==="failed" &&(
                      <p className="text-sm text-red-400">{errorMsg.msg}</p>

                    )
                  }
                 </div>

                {/* ✅ FIXED FOOTER */}
                <div className="px-6 py-4 border-t flex gap-5 shrink-0">
                  <Button type="submit" disabled={sending} onClick={handleSendMessage} className="bg-[#2C34A1] rounded-full">
                    {sending ? "Sending..." : "Send"}
                  </Button>
                  <DialogClose asChild>
                    <Button className="bg-[#000] rounded-full">Cancel</Button>
                  </DialogClose>
                </div>

              </DialogContent>
            </Dialog>

            )}
    </div>
  );
};
export default ProposalPage;
