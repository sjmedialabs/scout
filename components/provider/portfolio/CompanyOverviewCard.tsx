// import { Button } from "@/components/ui/button"
// import { Pencil } from "lucide-react"
// import { FaRegEdit } from "react-icons/fa";
// import Link from "next/link"
import {
  Users,
  Calendar,
  CheckCircle,
  DollarSign,
  Clock
} from "lucide-react";

type CompanyOverviewCardProps = {
  provider: {
    companyOverview?: string
    description?: string
    teamSize?: string
    foundedYear?: string | number
    projectsCompleted?: string | number
    minProjectSize?: string | number
    hourlyRate?: string | number
  }
}

export default function CompanyOverviewCard({ provider, variant = "default" }: CompanyOverviewCardProps & { variant?: "default" | "compact" | "large" }) {

  const isCompact = variant === "compact";
const isLarge = variant === "large";

  return (
    <div className="rounded-2xl border shadow-md border-orange-100 bg-white overflow-hidden">
      
      {/* Top section */}
      <div className="px-5 pt-3">
          <h2 className={`${
            isCompact ? "text-[14px]" :
            isLarge ? "text-[18px]" :
            "text-[16px]"
          } font-semibold text-orangeButton`}>
            {provider.companyOverview || "Company Overview"}
          </h2>
      </div>

          
        <div className="px-6 pb-3">
          <p className={`${
          isCompact ? "text-[10px]" :
          isLarge ? "text-[13px] text-gray-600" :
          "text-[11px] text-gray-600"
        }`}>
            {provider.description ||
            "No company description provided yet."}
          </p>
        </div>
    

      {/* Divider */}
      <div className="h-px w-full bg-gray-200" />

      {/* Bottom meta section */}
      <div className="p-6 pt-3  pb-3 flex flex-wrap flex-row gap-3 sm:gap-5">
        <div className={`${isLarge ? "text-[10px]" : "text-[11px]"} font-semibold text-gray-900 gap-1 flex`}>
          <Users className="w-3.5 h-3.5 text-orangeButton" />
          Employees:{" "} 
          <span className={`${
        isCompact ? "text-[10px]" :
        isLarge ? "text-[10px] text-gray-500" :
        "text-[12px]"
      }`}>
            {provider.teamSize || "—"}
          </span>
        </div>
        <div className={`${isLarge ? "text-[10px]" : "text-[11px]"} font-semibold text-gray-900 gap-1 flex`}>
          <Calendar className="w-3.5 h-3.5 text-orangeButton" />
          Founded:{" "}
          <span className={`${
          isCompact ? "text-[10px]" :
          isLarge ? "text-[10px] text-gray-500" :
          "text-[12px]"
        }`}>
            {provider.foundedYear || "—"}
          </span>
        </div>
          <div className={`${isLarge ? "text-[10px]" : "text-[11px]"} font-semibold text-gray-900 gap-1 flex`}>
            <CheckCircle className="w-3.5 h-3.5 text-orangeButton" />
          Project Completed:{" "}
          <span className={`${
            isCompact ? "text-[10px]" :
            isLarge ? "text-[10px] text-gray-500" :
            "text-[12px]"
          }`}>
            {provider.projectsCompleted || "—"}
          </span>
        </div>
          <div className={`${isLarge ? "text-[10px]" : "text-[11px]"} font-semibold text-gray-900 gap-1 flex`}>
            <DollarSign className="w-3.5 h-3.5 text-orangeButton" />
          Min Project Size:{" "}
          <span className={`${
            isCompact ? "text-[10px]" :
            isLarge ? "text-[10px] text-gray-500" :
            "text-[12px]"
          }`}>
           $ {provider.minProjectSize || "—"}
          </span>
        </div>
          <div className={`${isLarge ? "text-[10px]" : "text-[11px]"} font-semibold text-gray-900 gap-1 flex`}>
            <Clock className="w-3.5 h-3.5 text-orangeButton" />
          Hourly Rate:{" "}
          <span className={`${
            isCompact ? "text-[10px]" :
            isLarge ? "text-[10px] text-gray-500" :
            "text-[12px]"
          }`}>
            ${provider.hourlyRate || "—"}/hr
          </span>
        </div>
      </div>
    </div>
  )
}
