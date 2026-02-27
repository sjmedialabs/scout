"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Loader2, File } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import type { Proposal } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import RatingStars from "@/components/rating-star"
import { ChevronRight,ChevronLeft } from "lucide-react"
import { authFetch } from "@/lib/auth-fetch"
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

countries.registerLocale(en);
export default function ProposalViewDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, loading } = useAuth()

  const [resLoading, setResLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [proposal, setProposal] = useState<Proposal | null>(null)

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
  

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    const loadProposal = async () => {
      setResLoading(true)
      setFailed(false)

      try {
        const res = await fetch(`/api/proposals/${id}`)
        if (!res.ok) throw new Error("Failed")

        const data = await res.json()
        setProposal(data.proposals[0])
      } catch (err) {
        setFailed(true)
      } finally {
        setResLoading(false)
      }
    }

    loadProposal()
  }, [id, user, loading, router])

  if (resLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }
  console.log("Proposal Details:::",proposal)

  if (failed || !proposal) {
    return <div className="p-6">Proposal not found</div>
  }

  const fieldClass =
    "h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-[16px] text-gray-900 flex items-center"

  const textareaClass =
    "rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-[16px] text-gray-900 leading-[1.6] whitespace-pre-wrap"

  const statusColors: any = {
    pending: "bg-yellow-100 text-yellow-700",
    viewed: "bg-blue-100 text-blue-700",
    shortlisted: "bg-green-100 text-green-700",
    accepted: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    withdrawn: "bg-gray-200 text-gray-600",
    negotation: "bg-orange-100 text-orange-700",
    completed: "bg-purple-100 text-purple-700",
  }

  const renderActionButtons = () => {
    switch (proposal.status?.toLowerCase()) {
      case "pending":
      case "viewed":
        return (
          <>
            <Button className="bg-green-600 m-2 hover:bg-green-700 rounded-full">
              Accept
            </Button>
            <Button className="bg-orange-500 m-2 hover:bg-orange-600 rounded-full">
              Negotiate
            </Button>
            <Button className="bg-red-500 m-2 hover:bg-red-600 rounded-full">
              Reject
            </Button>
          </>
        ) 

      case "shortlisted":
        return (
          <>
            <Button className="bg-green-600 m-2 hover:bg-green-700 rounded-full">
              Accept
            </Button>
            <Button className="bg-orange-500 m-2 hover:bg-orange-600 rounded-full">
              Negotiate
            </Button>
          </>
        )

      case "accepted":
        return (
          <Button className="bg-blue-600 m-2 hover:bg-blue-700 rounded-full">
            Mark as Completed
          </Button>
        )

      case "negotation":
        return (
          <>
            <Button className="bg-green-600 m-2 hover:bg-green-700 rounded-full">
              Accept Final Offer
            </Button>
            <Button className="bg-red-500 m-2 hover:bg-red-600 rounded-full">
              Reject
            </Button>
          </>
        )

      case "completed":
        return (
          <Badge className="bg-purple-100 m-2 text-purple-700 rounded-full px-4 py-2">
            Project Completed
          </Badge>
        )

      case "rejected":
        return (
          <Badge className="bg-red-100 m-2 text-red-700 rounded-full px-4 py-2">
            Proposal Rejected
          </Badge>
        )

      case "withdrawn":
        return (
          <Badge className="bg-gray-200 m-2 text-gray-600 rounded-full px-4 py-2">
            Withdrawn by Agency
          </Badge>
        )

      default:
        return null
    }
  }
 const getCountryIso = (countryName?: string) => {
  if (!countryName) return "in";

  const code = countries.getAlpha2Code(countryName, "en");
  return code ? code.toLowerCase() : "";
};

const handleViewProfile = (providerId: string) => {
  window.open(`/provider/${providerId}`, "_blank");
};

const handlNegotation=async(proposalId:string)=>{
         console.log("Entered to accept fun:::",proposalId)
        // const negotatiteProposal=proposals.find((eachItem:any)=>eachItem.id===proposalId)
         try{
           const  response=await authFetch(`/api/proposals/${proposalId}`,{
            method:"PUT",
            body:JSON.stringify({status:"negotation"})})

            console.log("negotation action response::::",await response.json,proposalId)
           
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
            receiverId:proposal?.agency?.userId,
            content:negotationMessage,
            messageType:"TEXT"

          })

        })
        if(messRes.ok){
          setNegotationMessage("");
          setShowNegotationModal(false);
          setProposal((prev)=>({...prev!,status:"negotation"}))

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


   const handleShortlist = async (proposalId: string) => {
      console.log("Recived Id for the proposal shortlist::::",proposalId)
      try {
        const response = await authFetch(`/api/proposals/${proposalId}`, {
          method: "PUT",
          body: JSON.stringify({ status: "shortlisted" }),
          credentials: "include" 
        });
        if(response.ok){
          setProposal((prev) => ({
            ...prev!,
            status: "shortlisted",
          }));
        }
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

            
            
            const messRes=await authFetch(`/api/chat/message`,{
              method:"POST",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify({
                conversationId:convData.conversationId,
                senderType:"SEEKER",
                receiverId:proposal?.agency?.userId,
                content:`Congratulations your proposal is accepted for the ${proposal?.requirement.title} and project is allocated to you please stay in touch`,
                messageType:"TEXT"

              })})

      
      setProposal((prev)=>({...prev!,status:"accepted"}))
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
        setProposal((prev)=>({...prev!,status:"rejected"}))
      } catch (error) {
        console.log("failed to update the  status", error);
        alert("Staus failed to shortlist the proposal");
      }
    };

  return (
    <div className="space-y-3 -mt-3">

      {/* ===================== TOP SECTION ===================== */}
     

          {/* Requirement Title */}
          <h1 className="text-[22px] font-medium text-[#101828]">
           Project Title:<span className="text-gray-700"> {proposal.requirement?.title}</span>
          </h1>

          {/* Agency Details */}
          <div className="flex items-center justify-between flex-wrap gap-6">

            <div className="flex items-center gap-4">
              <img
                src={proposal.agency?.logo || "/placeholder-logo.png"}
                alt="agency-logo"
                className="h-16 w-16 rounded-full object-cover border"
              />

              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {proposal.agency?.name}
                </h2>

          <p className="text-sm text-gray-500 flex items-center gap-2">
  {proposal.agency?.country && (
    <img
      src={`https://flagcdn.com/24x18/${getCountryIso(
        proposal.agency?.country
      )}.png`}
      alt="flag"
      className="w-5 h-4 object-cover rounded-sm border"
    />
  )}

  <span>
    +{proposal.agency?.countryCode || "91"}{" "}
    {proposal.agency?.adminContactPhone}
  </span>
</p>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  
                   <RatingStars
                    rating={proposal.agency?.rating}
                    
                     />
                     <span className="text-sm text-[#000]">{proposal.agency?.rating}</span>

                   <span className="text-gray-400">
                    ({proposal.agency?.reviewCount || 0} reviews)
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
              className={`rounded-full text-sm px-4 py-1 font-medium ${
                statusColors[proposal.status?.toLowerCase()]
              }`}
            >
              {proposal.status}
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
                  className="flex items-start justify-between gap-4 border border-[#E4E7EC] bg-[#F9FAFB] rounded-2xl p-4 hover:shadow-sm transition"
                >
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
              ))}
            </div>
          </div>

          {/* Document */}
          {proposal.documentUrl && (
            <a
              href={proposal.documentUrl}
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
          <div className="flex flex-col border-t border-gray-400 sm:flex-row  justify-between items-center gap-4 mt-3 pt-0">
            <a className="flex flex-row items-center mt-3 cursor-pointer gap-1" href="/client/dashboard/proposals">
              <ChevronLeft  size={20} className="text-gray-400"/>
              <span className="text-xs underline text-gray-400">Back to proposals</span>
            </a>
            {/* Buttons */}
              <div className="flex items-center justify-between pt-4 ">
                <div className="flex flex-wrap gap-2">

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleViewProfile(proposal.agency._id)
                    }
                    className="bg-[#E6E8EC] rounded-full text-xs font-bold hover:bg-[#E6E8EC] hover:text-[#000] active:bg-[#E6E8EC] active:text-[#000]"
                  >
                    View Profile
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

        </CardContent>
      </Card>

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
  )
}