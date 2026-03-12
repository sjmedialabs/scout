"use client";

import { Button } from "@/components/ui/button";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaArrowLeftShort } from "react-icons/fa6";
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
import { BsArrowLeft } from "react-icons/bs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import  { ArrowLeft, File, MoveLeft,ChevronLeft,ChevronRight, MessageSquare } from "lucide-react";

import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);
const ProjectDetailPage = () => {
  const [projectDetails, setProjectDetails] = useState();
  const [filterStatus, setFilterStatus] = useState("");
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const[acceptedProposal,setAcceptedProposal]=useState({});
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const params = useParams();
  const id = params.id as string;
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

  // Tracking page: tab (Overview | Deliverables); milestone status comes from API (approvalStatus, completed)
  const [trackingTab, setTrackingTab] = useState<"overview" | "deliverables">("overview")
  const [milestoneConfirm, setMilestoneConfirm] = useState<{
    open: boolean
    index: number
    action: "accept" | "revision" | null
  }>({ open: false, index: -1, action: null })
  const [milestoneActionLoading, setMilestoneActionLoading] = useState(false)

   /* ---------------- PAGINATION ---------------- */
          const ITEMS_PER_PAGE = 10;
          const [page, setPage] = useState(1);
  
          const totalPages = Math.ceil(
            filteredProposals.length / ITEMS_PER_PAGE
          );
  
          const paginatedProposals = filteredProposals.slice(
            (page - 1) * ITEMS_PER_PAGE,
            page * ITEMS_PER_PAGE
          );

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await authFetch(`/api/proposals/${id}`, {
        credentials: "include",
      });
      const project = await authFetch(`/api/requirements/${id}`, {
        credentials: "include",
      });
      if (response.status === 404) {
        // No proposals case
        setProposals([]);
        setFilteredProposals([]);
        return;
      }
      if (!response.ok) {
        throw new Error("Failed to fetch proposals");
      }
      const data = await response.json();
      const projectData=await project.json()
      console.log("ProjectData are is:::::",projectData)
      setProjectDetails(projectData.requirements[0]);
      setProposals(data.proposals);
      setFilteredProposals(data.proposals);
      if(projectData.requirements[0].status==="Allocated" ||projectData.requirements[0].status==="Closed" ){
        const AcceptedProposal=(data.proposals || []).find((eachItem)=>eachItem.status==="accepted" || eachItem.status==="completed")
        console.log("Accepted Proposal is:::::::",AcceptedProposal)
        setAcceptedProposal(AcceptedProposal);
      }
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
    console.log("Recieved Proposal Id for the Shortlist:::",proposalId)
    setProposals((prev) =>
      prev.map((p) =>
        p.id === proposalId ? { ...p, status: "shortlisted" as const } : p,
      ),
    );
    console.log("recievd id::::", proposalId);
    try {
      const response = await authFetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        body: JSON.stringify({ status: "shortlisted" }),
        credentials: "include",
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
       const response = await authFetch(`/api/proposals/${proposalId}`, {
         method: "PUT",
         body: JSON.stringify({ status: "accepted" }),
         credentials: "include" 
       });
       console.log(
         "Shortlist action response::::",
         await response.json,
         proposalId,
       );
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
 
       setProposals((prev) =>
         prev.map((p) =>
           p.id === proposalId ? { ...p, status: "accepted" as const } : p,
         ),
       );
      window.location.reload();
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
        credentials: "include",
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

  const handleViewPortfolio=(proposalId:string)=>{
    window.open(`/provider/${proposalId}`, "_blank");
  }
  const handleMessageAgency = async (proposal: any) => {
    try {
      const res = await authFetch(`/api/chat/conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ proposalId: proposal.id }),
      });

      const data = await res.json();

      router.push(
        `/client/dashboard/chat?conversationId=${data.conversationId}&agencyId=${proposal?.agency?.userId}`
      );
    } catch (error) {
      console.log("Failed to start conversation", error);
    }
  };

  const handleOpenChat = async () => {
    const proposal = acceptedProposal as any;
    if (!proposal?.id) return;
    await handleMessageAgency(proposal);
  };

  const handleMilestoneConfirm = async () => {
    if (milestoneConfirm.index < 0 || !milestoneConfirm.action) {
      setMilestoneConfirm({ open: false, index: -1, action: null });
      return;
    }
    const proposalId = (acceptedProposal as any)?.id;
    if (!proposalId) {
      setMilestoneConfirm({ open: false, index: -1, action: null });
      return;
    }
    setMilestoneActionLoading(true);
    try {
      const action = milestoneConfirm.action === "accept" ? "approve" : "request_revision";
      const res = await authFetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          milestoneApproval: { milestoneIndex: milestoneConfirm.index, action },
        }),
      });
      if (!res.ok) throw new Error("Failed to update milestone");
      await loadData();
      setMilestoneConfirm({ open: false, index: -1, action: null });
    } catch (e) {
      console.error(e);
      alert("Failed to update milestone. Please try again.");
    } finally {
      setMilestoneActionLoading(false);
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
    } else if(filterStatus && filterStatus!=="all") {
      setFilteredProposals(
        proposals.filter(
          (req) => req.status.toLowerCase() === filterStatus.toLowerCase(),
        ),
      );
    }else{
      setFilteredProposals(proposals)
    }
  }, [proposals, filterStatus]);
  console.log("Project Details is ::::::::::",projectDetails);
  console.log("Proposals for this project:::::::::",proposals);
  const fieldClass =
  "h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[16px] text-gray-900 flex items-center"

const textareaClass =
  "rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-[16px] text-gray-900 leading-[1.6] whitespace-pre-wrap"

  const getCountryIso = (countryName?: string) => {
    if (!countryName) return "";
    return countries.getAlpha2Code(countryName, "en")?.toLowerCase() || "";
  };

  return (
    <div className="">
      
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
      {
       ( (projectDetails || {}).status!=="Allocated" && (projectDetails || {}).status !== "Closed") &&(
          <div>
            {/*header */}
              <div className="flex flex-wrap flex-row justify-between items-center">
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-[#F4561C] ">
                    Proposals
                    {proposals.length > 0 && (
                      <span className="text-sm lg:text-xl font-normal text-[#656565]">
                        {" "}
                        for {proposals[0].requirement.title}
                      </span>
                    )}
                  </h1>
                  <p className="text-sm lg:text-sm font-normal text-[#656565] ">
                    Review and manage proposals received for this project
                  </p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <div>
                    <Button
                    variant="outline"
                    size={"xs"}
                    className="BackButton"
                    onClick={() => router.push("/client/dashboard/projects")}
                  >
                    {/* <MoveLeft className="h-4 w-4 " /> */}
                    Back to Projects
                  </Button>
                  </div>
                   <div>
                        <Select
                      onValueChange={(value) => setFilterStatus(value)}
                      value={filterStatus}
                    >
                      <SelectTrigger
                       className={`
                        border-2
                        border-[#b2b2b2]
                        cursor-pointer
                        rounded-full
                        shadow-none
                        focus:ring-0
                      
                        
                        max-w-[160px]
                        max-h-[25px]
                        
                       
                        text-xs
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
                        <SelectItem value="rejected">Rejected</SelectItem>
                        
                      </SelectContent>
                    </Select>
                    </div>
                </div>
              </div>
            {(proposals || []).length > 0 && (
                <div>
                  <div className="px-0 mt-3" >
                   
                    {filteredProposals.length > 0 ? (
                     <>
                     { (paginatedProposals || []).map((proposal) => (
                       <Card
                      key={proposal.id}
                      className="py-0 px-0 rounded-[22px] mb-3"
                    >
                      <CardContent className="px-0 lg:px-2 py-0 lg:py-2">
                        <div className="flex flex-col lg:flex-row items-stretch gap-1">
                          
                          {/* Left Image */}
        
                           <div className="h-auto w-full lg:w-[170px] rounded-t-[18px] lg:rounded-[18px] overflow-hidden sm:shrink-0">
                            <img
                              src={proposal?.agency?.coverImage || "/proposal.jpg"}
                              alt={proposal.agency?.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          {/* Right Side Content */}
                          <div className="flex-1 px-3 py-2 lg:py-0 lg:pr-5">

                            {/* Top Section (Title + Cost) */}
                            <div className="flex justify-between flex-wrap items-start mb-2 w-full">
                              
                              {/* LEFT CONTENT */}
                              <div className="flex-1 pr-6">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-[#DEDEDE] bg-[#EDEDED] rounded-full h-[25px] px-3"
                                  >
                                    {proposal?.requirement?.title || "Unknown Project"}
                                  </Badge>
                                </div>
 
                                <h3
                                  className="text-xl font-bold text-[#000] mb-0 cursor-pointer"
                                  // onClick={() =>
                                  //   handleViewProfile(proposal.providerId)
                                  // }
                                >
                                  {proposal.agency?.name}
                                </h3>
                                 <p className="text-[#939191] font-normal text-xs line-clamp-2">
                                {proposal.proposalDescription}
                              </p>

                                {/* <p className="text-sm ml-1 -mt-1 text-[#939191] font-normal">
                                  {proposal.agency?.name}
                                </p> */}

                                {/* Rating */}
                                {/* <div className="flex items-center mt-0 gap-1 text-sm font-medium">
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
                                </div> */}
                              </div>

                              {/* RIGHT COST SECTION */}
                              <div className=" shrink-0">
                                <div className="text-md font-bold text-[#39A935]">
                                  <span className="text-[#000]">Proposed Budget:</span> <span className="text-md"> ${proposal.proposedBudget.toLocaleString()}</span> 
                                </div>
                                <div className="text-xs  font-bold text-[#A0A0A0] mt-1">
                                 <span className="text-[#000]">Proposed Timeline:</span> <span className="text-md">{proposal.proposedTimeline}</span>
                                </div>
                              </div>

                            </div>

                            {/* Description Section */}
                            <div className="space-y-0">

                              {proposal?.coverLetter && (
                                <div>
                                  <h4 className="font-bold text-sm text-black mb-0">
                                    Cover Letter
                                  </h4>
                                  <p className="text-[#939191] font-normal line-clamp-1 text-xs">
                                    {proposal?.coverLetter}
                                  </p>
                                </div>
                              )}

                              <div>
                              <h4 className="font-bold text-sm text-black mb-0">
                                Proposal Description
                              </h4>
                              <p className="text-[#939191] font-normal text-xs line-clamp-1">
                                {proposal.proposalDescription}
                              </p>
                            </div>


                              {/* Status Section */}
                              <div className="flex items-center mt-2 mb-3 gap-2">
                                {/* <span className="text-sm text-[#000000] font-noormal">
                                  Submitted on :{" "}
                                  {new Date(
                                    proposal.updatedAt
                                  ).toLocaleDateString()}
                                </span> */}

                                 <span className="text-[#000] text-sm font-semibold"> Submitted on :</span> <span className="text-xs text-gray-500"> {new Date(
                                    proposal.createdAt
                                  ).toLocaleDateString()}</span> 
           
                                 <Badge
                                  className={`rounded-full text-xs font-semibold px-3 py-0 capitalize
                                    ${
                                      proposal.status === "accepted"
                                        ? "bg-green-500 text-white"
                                        : proposal.status === "shortlisted"
                                        ? "bg-blue-500 text-white"
                                        : proposal.status === "rejected"
                                        ? "bg-red-500 text-white"
                                        : proposal.status === "negotation"
                                        ? "bg-yellow-500 text-white"
                                        : proposal.status === "completed"
                                        ? "bg-purple-500 text-white"
                                        : "bg-gray-200 text-gray-700"
                                    }
                                  `}
                                >
                                    {proposal.status.charAt(0).toUpperCase() +
                                      proposal.status.slice(1)}
                                </Badge>
                              </div>

                              {/* Buttons */}
                              <div className="flex items-center mt-auto justify-between pt-4 border-[#DDDDDD] border-t-2">
                                <div className="flex flex-wrap gap-2">

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleViewPortfolio(proposal.agency._id)
                                    }
                                    className="primary-button"
                                  >
                                    View Profile
                                  </Button>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(`/client/dashboard/proposals/${proposal.id}?from=projects`)
                                    }
                                    className="primary-button"
                                  >
                                    View Proposal Details
                                  </Button>
                                  
                                  {proposal.status !== "rejected" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMessageAgency(proposal)}
                                    className="btn-blackButton"
                                  >
                                    Chat
                                  </Button> 
                                    )}

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
                                        className="btn-blackButton"
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
                                        className="btn-blackButton"
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
                                        className="bg-[#39A935] rounded-full text-xs hover:bg-[#39A935] active:bg-[#39A935]"
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
                                        className="bg-[#FF0000] rounded-full text-xs hover:bg-[#FF0000] active:bg-[#FF0000]"
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
                     </>
                    ) : (
                      <h2 className="text-2xl text-center mt-10 font-semibold text-[#656565]">
                        No Proposals Found
                      </h2>
                    )}
                  </div>
                </div>
              )}
          </div>
        )
      }
      {
         ( (projectDetails || {}).status === "Allocated" || (projectDetails || {}).status === "Closed") && (
            <div className="space-y-4">

        {/* ===================== TRACKING PAGE HEADER ===================== */}
          <div className="flex flex-row flex-wrap justify-between items-start gap-4">
            <div>
              <h1 className="text-[22px] font-semibold text-[#101828]">
                {(acceptedProposal as any)?.requirement?.title}
              </h1>
              <p className="text-sm text-[#667085] mt-0.5">
                Agency: {(acceptedProposal as any)?.agency?.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-[#101828] text-white px-3 py-1 text-xs font-medium">
                Active
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-1.5"
                onClick={() => router.push("/client/dashboard/projects")}
              >
                <MoveLeft className="h-4 w-4" />
                Back to Projects
              </Button>
              <Button
                variant="default"
                size="sm"
                className="rounded-full gap-1.5 bg-[#2C34A1] hover:bg-[#2C34A1]"
                onClick={handleOpenChat}
              >
                <MessageSquare className="h-4 w-4" />
                Chat
              </Button>
            </div>
          </div>

          {/* Project Progress bar */}
          {(() => {
            const milestones = (acceptedProposal as any)?.milestones || [];
            const done = milestones.filter(
              (m: any) => m?.completed || m?.approvalStatus === "approved"
            ).length;
            const total = milestones.length;
            const progress = total ? Math.round((done / total) * 100) : 0;
            return (
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#344054]">Project Progress</p>
                <div className="h-2 w-full rounded-full bg-[#E4E7EC] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#101828] transition-all"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <p className="text-xs text-[#667085]">{progress}% complete</p>
              </div>
            );
          })()}

          {/* Tabs: Overview | Deliverables */}
          <div className="flex gap-1 border-b border-[#E4E7EC]">
            <button
              type="button"
              onClick={() => setTrackingTab("overview")}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition ${
                trackingTab === "overview"
                  ? "bg-[#101828] text-white"
                  : "bg-[#F9FAFB] text-[#667085] hover:bg-[#E4E7EC]"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setTrackingTab("deliverables")}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition ${
                trackingTab === "deliverables"
                  ? "bg-[#101828] text-white"
                  : "bg-[#F9FAFB] text-[#667085] hover:bg-[#E4E7EC]"
              }`}
            >
              Deliverables
            </button>
          </div>

      {/* ===================== OVERVIEW TAB ===================== */}
      {trackingTab === "overview" && (
      <Card className="rounded-[14px] border border-[#E4E7EC] bg-white shadow-sm">
        <CardContent className="px-6 md:px-4">
          <h2 className="text-lg font-semibold text-[#101828] mb-4">Milestones</h2>
          <p className="text-sm text-[#667085] mb-4">
            Milestones appear when the agency creates them and submits for your approval. You can approve or request a revision.
          </p>
          <div className="space-y-4">
            {((acceptedProposal as any)?.milestones || []).map((milestone: any, index: number) => {
              const apiStatus = milestone?.approvalStatus || (milestone?.completed ? "approved" : "pending");
              const status =
                milestone?.completed || apiStatus === "approved"
                  ? "Approved"
                  : apiStatus === "revision_requested"
                    ? "Revision Requested"
                    : apiStatus === "waiting_approval"
                      ? "Waiting Approval" 
                      : "Pending";
              const isActionable =
                !milestone?.completed &&
                apiStatus !== "approved" &&
                apiStatus !== "revision_requested" &&
                (apiStatus === "waiting_approval" || apiStatus === "pending");
              return (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-[#344054]">
                        {milestone?.title}
                      </p>
                      <Badge variant="secondary" className="rounded-full text-xs font-medium text-[#667085] bg-[#E4E7EC]">
                        {status}
                      </Badge>
                    </div>
                    {milestone?.description && (
                      <p className="text-xs text-[#667085] mt-1">{milestone.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#667085]">
                      {milestone?.amount != null && (
                        <span>Amount: ${milestone.amount}</span>
                      )}
                      {milestone?.duration && (
                        <span>Due: {milestone.duration}</span>
                      )}
                    </div>
                    {/* Milestone-level deliverables */}
                    {(milestone?.deliverableUrl || (milestone?.deliverableDocuments?.length > 0)) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {milestone.deliverableUrl && (
                          <a
                            href={milestone.deliverableUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#1570EF] hover:underline flex items-center gap-1"
                          >
                            <File className="h-3.5 w-3" />
                            Deliverable link
                          </a>
                        )}
                        {milestone.deliverableDocuments?.map((url: string, i: number) => (
                          <a
                            key={i}
                            href={url}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#1570EF] hover:underline flex items-center gap-1"
                          >
                            <File className="h-3.5 w-3" />
                            Document {i + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  {(milestone.approvalStatus=== "waiting_approval" || milestone.approvalStatus==="revision_requested") && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        className="rounded-full bg-[#39A935] hover:bg-[#39A935] text-xs"
                        onClick={() => setMilestoneConfirm({ open: true, index, action: "accept" })}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full text-xs border-[#E4E7EC]"
                        onClick={() => setMilestoneConfirm({ open: true, index, action: "revision" })}
                      >
                        Request Revision
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      )}

      {/* ===================== DELIVERABLES TAB ===================== */}
      {trackingTab === "deliverables" && (
      <Card className="rounded-[14px] border border-[#E4E7EC] bg-white shadow-sm">
        <CardContent className="px-6 md:px-4">
          <h2 className="text-lg font-semibold text-[#101828] mb-4">Deliverables</h2>
          <p className="text-sm text-[#667085] mb-4">
            Files and assets submitted by the agency for your reference (read-only). Includes proposal-level and milestone-level documents.
          </p>
          <div className="space-y-3">
            {(acceptedProposal as any)?.documentUrl && (
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB]">
                <div className="flex items-center gap-2 min-w-0">
                  <File className="h-5 w-5 text-[#667085] shrink-0" />
                  <span className="text-sm font-medium text-[#344054] truncate">
                    Document
                  </span>
                  <span className="text-xs text-[#667085]">Link</span>
                </div>
                <a
                  href={(acceptedProposal as any).documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#1570EF] hover:underline shrink-0"
                >
                  Download
                </a>
              </div>
            )}
            {(acceptedProposal as any)?.attachments?.map((url: string, i: number) => (
              <div
                key={`att-${i}`}
                className="flex items-center justify-between p-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <File className="h-5 w-5 text-[#667085] shrink-0" />
                  <span className="text-sm font-medium text-[#344054] truncate">
                    Attachment {i + 1}
                  </span>
                </div>
                <a
                  href={url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#1570EF] hover:underline shrink-0"
                >
                  Download
                </a>
              </div>
            ))}
            {((acceptedProposal as any)?.milestones || []).map((milestone: any, mi: number) => (
              <div key={`m-${mi}`}>
                {milestone?.deliverableUrl && (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB]">
                    <div className="flex items-center gap-2 min-w-0">
                      <File className="h-5 w-5 text-[#667085] shrink-0" />
                      <span className="text-sm font-medium text-[#344054] truncate">
                        {milestone.title || `Milestone ${mi + 1}`} – link
                      </span>
                    </div>
                    <a
                      href={milestone.deliverableUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#1570EF] hover:underline shrink-0"
                    >
                      Download
                    </a>
                  </div>
                )}
                {milestone?.deliverableDocuments?.map((url: string, di: number) => (
                  <div
                    key={`m-${mi}-d-${di}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <File className="h-5 w-5 text-[#667085] shrink-0" />
                      <span className="text-sm font-medium text-[#344054] truncate">
                        {milestone.title || `Milestone ${mi + 1}`} – document {di + 1}
                      </span>
                    </div>
                    <a
                      href={url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#1570EF] hover:underline shrink-0"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ))}
            {!((acceptedProposal as any)?.documentUrl) &&
              !((acceptedProposal as any)?.attachments?.length) &&
              !((acceptedProposal as any)?.milestones?.some((m: any) => m?.deliverableUrl || (m?.deliverableDocuments?.length > 0))) && (
              <p className="text-sm text-[#667085]">No deliverables uploaded yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
      )}

          {/* Milestone action confirmation dialog */}
          <Dialog
            open={milestoneConfirm.open}
            onOpenChange={(open) =>
              !milestoneActionLoading && setMilestoneConfirm((p) => ({ ...p, open }))
            }
          >
            <DialogContent className="rounded-2xl max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {milestoneConfirm.action === "accept"
                    ? "Are you sure you want to approve this milestone?"
                    : "Are you sure you want to request revision for this milestone?"}
                </DialogTitle>
                <DialogDescription>
                  {milestoneConfirm.action === "accept"
                    ? "The milestone will be marked as approved."
                    : "The agency will be notified to provide a revision."}
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setMilestoneConfirm({ open: false, index: -1, action: null })}
                  disabled={milestoneActionLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleMilestoneConfirm}
                  disabled={milestoneActionLoading}
                >
                  {milestoneActionLoading ? "Please wait..." : "Yes, Continue"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

            </div>
          )
      }

      
      {(proposals || []).length === 0 && !failed && !loading && (
        <Card className="mt-6 p-3  bg-[#fff] py-5 rounded-[22px]">
          <CardContent className="p-10 text-center">
            <h2 className="text-2xl font-semibold text-[#656565]">
              No Proposals Received Yet
            </h2>
          </CardContent>
        </Card>
      )}

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
                  className="border-1 border-gray-500 p-3 w-100 rounded-md"
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
export default ProjectDetailPage;
