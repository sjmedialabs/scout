"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IndianRupee } from "lucide-react"
import type { Requirement } from "@/lib/types"
import { GoClockFill } from "react-icons/go";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaTag } from "react-icons/fa6";
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

  const [expandedRequirements, setExpandedRequirements] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedRequirements((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const formatBudget = (min: number, max: number) => {
    if (min === undefined || max === undefined) return ""
    return `${min.toLocaleString("en-IN")} - ${max.toLocaleString("en-IN")}`
  }
  const router = useRouter();

  console.log("Recieved required  requirements:::::", requirements)

  return (
    <div className="space-y-4">
      {requirements.map((requirement) => (
        <Card key={requirement._id} className="hover:shadow-md transition-shadow p-6 bg-[#EFF7FA] rounded-[20px] border border-[#E2E8F0]/30 flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg text-[#2C34A1] font-bold tracking-tight">
                {requirement.title}
              </h3>
              <span className="bg-[#FF5500] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wider uppercase">
                {requirement.status ? requirement.status.toUpperCase() : "OPEN"}
              </span>
            </div>
            <div className="text-[11px] text-[#898383] font-normal tracking-wider uppercase mb-1">
              POSTED BY <span className="text-[#2C34A1] font-bold normal-case ml-1">{requirement.client?.companyName || "Tiles Export Co."}</span>
            </div>
            <p className={`text-[13px] text-[#686868] font-normal leading-relaxed mt-1 ${expandedRequirements[requirement._id] ? "" : "line-clamp-2"}`}>
              {requirement.description}
            </p>
            {requirement.description.length > 140 && (
              <button
                onClick={() => toggleExpand(requirement._id)}
                className="text-xs cursor-pointer text-[#2C34A1] font-bold hover:underline  focus:outline-none self-start"
              >
                {expandedRequirements[requirement._id] ? "Read Less" : "Read More"}
              </button>
            )}
          </div>

          {/* Grid of Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-0">
            {/* Budget */}
            <div className="flex items-center gap-3">
              <IndianRupee className="h-5 w-5 shrink-0" color="#F54A0C" />
              <div className="flex flex-col">
                <span className="text-[9px] text-[#898383] font-bold tracking-wider uppercase">BUDGET</span>
                <span className="text-[13px] font-bold text-[#000]">₹{formatBudget(requirement.budgetMin, requirement.budgetMax)}</span>
              </div>
            </div>
            {/* Timeline */}
            <div className="flex items-center gap-3">
              <GoClockFill color="#F54A0C" className="h-5 w-5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[9px] text-[#898383] font-bold tracking-wider uppercase">TIMELINE</span>
                <span className="text-[13px] font-bold text-[#000]">{requirement.timeline}</span>
              </div>
            </div>
            {/* Category */}
            <div className="flex items-center gap-3">
              <FaTag className="h-5 w-5 shrink-0" color="#F54A0C" />
              <div className="flex flex-col">
                <span className="text-[9px] text-[#898383] font-bold tracking-wider uppercase">CATEGORY</span>
                <span className="text-[13px] font-bold text-[#000]">{requirement.category}</span>
              </div>
            </div>
            {/* Posted */}
            <div className="flex items-center gap-3">
              <BsCalendarCheckFill className="h-5 w-5 shrink-0" color="#F54A0C" />
              <div className="flex flex-col">
                <span className="text-[9px] text-[#898383] font-bold tracking-wider uppercase">POSTED</span>
                <span className="text-[13px] font-bold text-[#000]">
                  {requirement.createdAt ? new Date(requirement.createdAt).toLocaleDateString() : "Today"}
                </span>
              </div>
            </div>
          </div>

          {/* Dotted/Dashed Divider */}
          <div className="border-t border-dashed border-[#CECECE]" />

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-[#898383] font-normal text-center sm:text-left">
              Ready to Win This Project? Submit Your Proposal Today.
            </p>
            {
              (requirement.status !== "UnderReview" && requirement.status !== "NotApproved") && (
                <Button
                  onClick={() =>
                    router.push(
                      (`/login?to=submit-proposal&id=${requirement._id}`)
                    )
                  }
                  className="bg-[#2C34A1] hover:bg-[#2C34A1] text-white rounded-full font-bold px-6 py-2 h-[35px] text-[13px] transition-colors flex items-center gap-2 border-none shrink-0"
                >
                  Submit Proposal
                  <FaArrowRightLong className="h-3.5 w-3.5" color="#fff" />
                </Button>
              )
            }
          </div>
          {
            (requirement.status === "NotApproved") && (
              <p className="text-md text-red-500 mt-1">{requirement?.notApprovedMsg}</p>
            )
          }
        </Card>
      ))}
    </div>
  )
}
