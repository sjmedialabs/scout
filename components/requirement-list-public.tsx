"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MessageSquare, Calendar, DollarSign } from "lucide-react"
import type { Requirement } from "@/lib/types"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { HiCurrencyDollar } from "react-icons/hi2"
import { GoClockFill } from "react-icons/go";
import { FiTag } from "react-icons/fi";
import { CiCalendar } from "react-icons/ci";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaTag } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { BsCalendarCheckFill } from "react-icons/bs";
import { useRouter } from "next/navigation";


interface RequirementListProps {
  requirements: Requirement[]
  onViewProposals: (requirementId: string) => void
  onViewDetails: (requirementId: string) => void
}

export function RequirementList({ requirements, onViewProposals, onViewDetails }: RequirementListProps) {
//   const getStatusColor = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "notapproved":
//         return "bg-red-500 text-[#fff]"
//       case "underreview":
//         return "bg-blue-500 teext-[#fff]"
//       case "open":
//         return "bg-[#CFEED2] text-[#39761E]"
//       case "shortlisted":
//         return "bg-[#D2E4FF] text-[#1E82C1]"
//       case "allocated":
//         return "bg-[#D2E4FF] text-[#1E82C1]"
//       case "negotiation":
//         return "bg-[#FCF6E3] text-[#AF905D]"
//       case "closed":
//         return "bg-gray-100 text-gray-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

  const formatBudget = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  }
  const router = useRouter();

//   const handleSubmitProposal = async (requirementId: string) => {
//   try {
//     const res = await fetch("/api/auth/me"); 
//     const data = await res.json();

//     const user = data?.user;

//     if (!user) {
//       alert("Please login as an agency to submit proposal.");
//       return;
//     }

//     if (user.role !== "agency") {
//       alert("Only agencies can submit proposals.");
//       return;
//     }

  
//     onViewProposals(requirementId);

//   } catch (err) {
//     console.log(err);
//     alert("Something went wrong");
//   }
// };

  return (
    <div className="space-y-4"> 
      {requirements.map((requirement) => (
        <Card key={requirement._id} className="hover:shadow-md transition-shadow bg-[#EFF7FA] rounded-[16px] px-0">
          <CardHeader className="px-0 -mt-1">
            <div className="flex justify-between items-start  px-0">
              <div className="flex-1 px-6">
                <CardTitle className="text-base text-[#2C34A1] font-bold">{requirement.title}</CardTitle>
              </div>
              {/* <div className="px-6">
                <Badge className={getStatusColor(requirement.status)}>
                {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
              </Badge>
              </div> */}
            </div>
             <CardDescription className="-mt-1 text-sm px-6 text-[#898383] font-normal border-[#CECECE] pb-[15px]">{requirement.description}</CardDescription>
            
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 -mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
               <HiCurrencyDollar color="#F54A0C" className="h-6 w-6"/>
                <span className="text-[14px] font-bold text-[#000]">{formatBudget(requirement.budgetMin, requirement.budgetMax)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <GoClockFill color="#F54A0C" className="h-6 w-6"/>
                <span className="text-[14px] font-bold text-[#000]">{requirement.timeline}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <FaTag className="h-6 w-6" color="#F54A0C"/>
                <span className="text-[14px] font-normal text-[#000]">{requirement.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <BsCalendarCheckFill    className="h-6 w-6" color="#F54A0C"/>
                <span className="text-[14px] font-normal text-[#000]">Posted:{requirement.createdAt ? new Date(requirement.createdAt).toLocaleDateString() : "Today"}</span>
              </div>
            </div>

            <div className="flex flex-col -mt-3 sm:flex-row gap-2">
              {/* <Button variant="outline" size="sm" onClick={() => onViewDetails(requirement._id)} className="bg-[#2C34A1] max-w-[180px] rounded-full text-[#fff] text-[14px] hover:bg-[#2C34A1] h-[40px]">
               
                View Details
                 <FaArrowRightLong className="h-3 w-3" color="#fff"/>
              </Button> */}
              {
                (requirement.status!=="UnderReview" && requirement.status!=="NotApproved") && (
                  <Button variant="outline" 
                  size="sm" 
                  onClick={() =>
                    router.push(
                    (`/login?to=submit-proposal&id=${requirement._id}`)
                    )
                    } 
                  className="bg-[#000000] max-w-[180px] rounded-full text-[#fff] text-[14px] hover:bg-[#000000] h-[40px]">
                
                Submit Proposal
                <FaArrowRightLong className="h-3 w-3" color="#fff"/>
              </Button>
                )
              }
              
            </div>
             {
              (requirement.status==="NotApproved") && (
                <p className="teext-md text-red-500">{requirement?.notApprovedMsg}</p>
              )
              }
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
