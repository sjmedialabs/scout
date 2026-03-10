"use  client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RatingStars from "@/components/rating-star";
import { authFetch } from "@/lib/auth-fetch";
import { useState } from "react";
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

export default function ProposalCard({proposal}){
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
    return(
        <>
         <Card
                      key={proposal.id}
                      className="py-0 px-0 rounded-[22px] mb-3"
                    >
                      <CardContent className="px-0 lg:px-5 py-0 lg:py-6">
                        <div className="flex flex-col lg:flex-row items-stretch gap-4">
                          
                          {/* Left Image */}
        
                          <div className="
                              relative 
                              max-h-[200px] lg:max-h-none
                              w-full lg:w-[300px] 
                              flex-shrink-0 
                              rounded-t-[18px] lg:rounded-[18px]
                              overflow-hidden 
                              bg-gray-200

                              aspect-[4/3]          
                              lg:aspect-auto      
                            ">
                              <img
                                src={proposal?.agency?.coverImage || "/proposal.jpg"}
                                alt={proposal.agency?.name}
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
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
                            <div className="space-y-2">

                              {/* {proposal?.coverLetter && (
                                <div>
                                  <h4 className="font-bold text-xl text-[#616161] mb-0">
                                    Cover Letter
                                  </h4>
                                  <p className="text-[#939191] font-normal line-clamp-2 text-sm">
                                    {proposal?.coverLetter}
                                  </p>
                                </div>
                              )} */}

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
                                    className="bg-[#E6E8EC] rounded-full text-xs font-bold hover:bg-[#E6E8EC] hover:text-[#000] active:bg-[#E6E8EC] active:text-[#000]"
                                  >
                                    View Profile
                                  </Button>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(`/client/dashboard/proposals/${proposal.id}?from=projects`)
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
        </>
    )
}