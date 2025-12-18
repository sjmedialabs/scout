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
interface RequirementListProps {
  requirements: Requirement[]
  onViewProposals: (requirementId: string) => void
  onViewDetails: (requirementId: string) => void
}

export function RequirementList({ requirements, onViewProposals, onViewDetails }: RequirementListProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-[#CFEED2] text-[#39761E]"
      case "shortlisted":
        return "bg-[#D2E4FF] text-[#1E82C1]"
      case "allocated":
        return "bg-[#D2E4FF] text-[#1E82C1]"
      case "negotiation":
        return "bg-[#FCF6E3] text-[#AF905D]"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatBudget = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  }

  return (
    <div className="space-y-4"> 
      {requirements.map((requirement) => (
        <Card key={requirement.id} className="hover:shadow-md transition-shadow bg-[#EFF7FA] rounded-[16px] px-0">
          <CardHeader className="px-0">
            <div className="flex justify-between items-start  px-0">
              <div className="flex-1 px-6">
                <CardTitle className="text-base text-[#2C34A1] font-bold">{requirement.title}</CardTitle>
              </div>
              <div className="px-6">
                <Badge className={getStatusColor(requirement.status)}>
                {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
              </Badge>
              </div>
            </div>
             <CardDescription className="mt-1 text-sm px-6 text-[#898383] font-normal border-b-2 border-[#CECECE] pb-[15px]">{requirement.description}</CardDescription>
            
          </CardHeader>
          <CardContent>
            <div className="flex justify-between flex-wrap items-center mb-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
               <HiCurrencyDollar color="#F54A0C" className="h-6 w-6"/>
                <span className="text-[14px] font-bold text-[#000]">{formatBudget(requirement.budgetMin, requirement.budgetMax)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <GoClockFill color="#F54A0C" className="h-6 w-6"/>
                <span className="text-[14px] font-bold text-[#000]">{requirement.timeline}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <FiTag className="h-6 w-6" color="#F54A0C"/>
                <span className="text-[14px] font-normal text-[#000]">{requirement.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <CiCalendar  className="h-6 w-6" color="#F54A0C"/>
                <span className="text-[14px] font-normal text-[#000]">Posted:{requirement.createdAt ? new Date(requirement.createdAt).toLocaleDateString() : "Today"}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onViewDetails(requirement.id)} className="bg-[#2C34A1] rounded-full text-[#fff] text-[14px] hover:bg-[#2C34A1] h-[40px]">
               
                View Details
                 <FaArrowRightLong className="h-3 w-3" color="#fff"/>
              </Button>
              <Button variant="outline" size="sm" onClick={() => onViewProposals(requirement.id)} className="bg-[#000000] rounded-full text-[#fff] text-[14px] hover:bg-[#000000] h-[40px]">
                
                View Proposals
                <FaArrowRightLong className="h-3 w-3" color="#fff"/>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
