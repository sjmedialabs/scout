// import { Button } from "@/components/ui/button"
// import { Pencil } from "lucide-react"
// import { FaRegEdit } from "react-icons/fa";
// import Link from "next/link"

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

export default function CompanyOverviewCard({ provider }: CompanyOverviewCardProps) {

  return (
    <div className="rounded-2xl border shadow-md border-orange-100 bg-white overflow-hidden">
      
      {/* Top section */}
      <div className="px-5 pt-3">
          <h2 className="text-[16px] font-semibold text-orangeButton">
            {provider.companyOverview || "Company Overview"}
          </h2>

      
      </div>

          
        <div className="px-6 pb-3">
          <p className="text-[11px]  text-gray-600">
            {provider.description ||
            "No company description provided yet."}
          </p>
        </div>
    

      {/* Divider */}
      <div className="h-px w-full bg-gray-200" />

      {/* Bottom meta section */}
      <div className="p-6 pt-3  pb-3 flex flex-wrap flex-row gap-3 sm:gap-5">
        <div className="text-[11px] font-semibold text-gray-900">
          Employees:{" "} 
          <span className="font-normal text-gray-600 text-[11px]">
            {provider.teamSize || "—"}
          </span>
        </div>
        <div className="text-[11px] font-semibold text-gray-900">
          Founded:{" "}
          <span className="font-normal text-gray-600 text-[11px]">
            {provider.foundedYear || "—"}
          </span>
        </div>
          <div className="text-[11px] font-semibold text-gray-900">
          Project Completed:{" "}
          <span className="font-normal text-gray-600 text-[11px]">
            {provider.projectsCompleted || "—"}
          </span>
        </div>
          <div className="text-[11px] font-semibold text-gray-900">
          Min Project Size:{" "}
          <span className="font-normal text-gray-600 text-[11px]">
            {provider.minProjectSize || "—"}$
          </span>
        </div>
          <div className="text-[11px] font-semibold text-gray-900">
          Hourly Rate:{" "}
          <span className="font-normal text-gray-600 text-[11px]">
            {provider.hourlyRate || "—"}$/hr
          </span>
        </div>
      </div>
    </div>
  )
}
