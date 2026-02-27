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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import  { ArrowLeft, File, MoveLeft,ChevronLeft,ChevronRight } from "lucide-react";

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
      if(projectData.requirements[0].status==="Allocated"){
        const AcceptedProposal=(data.proposals || []).find((eachItem)=>eachItem.status==="accepted")
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
    <div className="space-6 ">
      
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
        (projectDetails || {}).status!=="Allocated" &&(
          <div>
            {/*header */}
              <div className="flex flex-wrap justify-between items-start">
              <div>
                <h1 className="text-xl lg:text-3xl font-bold text-[#F4561C] my-custom-class">
                  Project Details
                  {proposals.length > 0 && (
                    <span className="text-sm lg:text-[24px] font-normal text-[#656565]">
                      {" "}
                      for {proposals[0].requirement.title}
                    </span>
                  )}
                </h1>
                <p className="text-sm lg:text-lg font-normal text-[#656565] my-custom-class ">
                  Review and manage proposals received for this project
                </p>
              </div>
              <div>
                <Button
                  className="bg-[#000] rounded-full h-[30px] mb-3 w-[120px] text-xs lg:text-sm lg:h-[40px] lg:w-[160px]"
                  onClick={() => router.push("/client/dashboard/projects")}
                >
                  <MoveLeft className="h-4 w-4 " />Back to
                  Projects
                </Button>
              </div>
              </div>
            {(proposals || []).length > 0 && (
                <div>
                  <div className="px-2" >
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
                        mb-3 
                        max-w-[160px]
                        
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
                        <SelectItem value="rejected">Rejected</SelectItem>
                        
                      </SelectContent>
                    </Select>
                    {filteredProposals.length > 0 ? (
                     <>
                     { (paginatedProposals || []).map((proposal) => (
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
                                  // onClick={() =>
                                  //   handleViewProfile(proposal.providerId)
                                  // }
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
          (projectDetails || {}).status === "Allocated" && (
            <div className="space-y-4">

        {/* ===================== TOP SECTION ===================== */}
     

          {/* Requirement Title */}
          <div className="flex flex-row flex-wrap justify-between">

            <h1 className="text-[22px] font-medium text-[#101828]">
           Project Title:<span className="text-gray-700"> {acceptedProposal.requirement?.title}</span>
          </h1>

          <Button
              className="bg-[#000] rounded-full h-[30px] mb-3 w-[120px] text-xs lg:text-sm lg:h-[40px] lg:w-[160px]"
              onClick={() => router.push("/client/dashboard/projects")}
            >
          <MoveLeft className="h-4 w-4 " />Back to
          Projects
        </Button>

          </div>
          {/* Agency Details */}
          <div className="flex items-center -mt-4 justify-between flex-wrap gap-6">

            <div className="flex items-center gap-4">
              <img
                src={acceptedProposal.agency?.logo || "/placeholder-logo.png"}
                alt="agency-logo"
                className="h-16 w-16 rounded-full object-cover border"
              />

              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {acceptedProposal.agency?.name}
                </h2>

          <p className="text-sm text-gray-500 flex items-center gap-2">
  {acceptedProposal.agency?.country && (
    <img
      src={`https://flagcdn.com/24x18/${getCountryIso(
        acceptedProposal.agency.country
      )}.png`}
      alt="flag"
      className="w-5 h-4 object-cover rounded-sm border"
    />
  )}

  <span>
    +{acceptedProposal.agency?.countryCode}{" "}
    {acceptedProposal.agency?.adminContactPhone}
  </span>
</p>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  
                   <RatingStars
                    rating={acceptedProposal.agency?.rating}
                    
                     />
                     <span className="text-sm text-[#000]">{acceptedProposal.agency?.rating}</span>

                   <span className="text-gray-400">
                    ({acceptedProposal.agency?.reviewCount || 0} reviews)
                  </span> 
                </div>
              </div>
            </div>

            {/* <Button
              variant="outline"
              className="rounded-full"
              onClick={() => router.push("/client/dashboard/proposals")}
            >
              Back
            </Button> */}

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
                ${acceptedProposal.proposedBudget}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#667085]">
                Estimated Timeline
              </label>
              <div className="h-[40px] rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] flex items-center px-4 text-[#344054] font-medium">
                {acceptedProposal.proposedTimeline}
              </div>
            </div>
          </div>

          {/* Work Approach */}
          <div className="space-y-3 mt-3">
            <label className="text-sm font-semibold text-[#667085]">
              Work Approach
            </label>
            <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-4 text-[#475467] leading-relaxed text-sm md:text-base">
              {acceptedProposal.proposalDescription}
            </div>
          </div>

          {/* Cover Letter */}
          {acceptedProposal.coverLetter && (
            <div className="space-y-3 mt-3">
              <label className="text-sm font-semibold text-[#667085]">
                Cover Letter
              </label>
              <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] p-4 text-[#475467] leading-relaxed text-sm md:text-base">
                {acceptedProposal.coverLetter}
              </div>
            </div>
          )}

          {/* Project Milestones */}
          <div className="space-y-4 mt-3">
            <label className="text-sm font-semibold text-[#667085]">
              Project Milestones
            </label>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {acceptedProposal.milestones?.map((milestone, index) => (
                <div
                  key={index}
                  className=" flex flex-col justify-between border border-[#E4E7EC] bg-[#F9FAFB] rounded-2xl  hover:shadow-sm transition"
                >
                  <div className="flex flex-row justify-end mt-2 mr-3">
                   {
                    milestone?.completed &&(
                       <Badge className="bg-green-400 border-1 rounded-xl text-[10px] h-[18px] ">Completed</Badge>
                    )
                   }
                  </div>
                  <div className="flex  items-start justify-between px-4 py-2 gap-4">
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

          {/* Document */}
          {acceptedProposal.documentUrl && (
            <a
              href={acceptedProposal.documentUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#475467] hover:text-[#1570EF] transition text-sm"
            >
              <File size={18} />
              <span className="underline">Download Attached Document</span>
            </a>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col border-t border-gray-400 sm:flex-row  justify-between items-center gap-4 mt-3  pt-0">
            <a className="flex flex-row items-center mt-3  cursor-pointer gap-1" href="/client/dashboard/projects">
              <ChevronLeft  size={20} className="text-gray-400"/>
              <span className="text-xs underline text-gray-400">Back to projects</span>
            </a>
           
          </div>

        </CardContent>
      </Card>
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
