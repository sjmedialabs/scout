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
      <div className="px-5 pt-4 pb-2 flex items-end justify-between flex-col sm:flex-row sm:justify-between gap-2">
          <h2 className="text-[16px] font-semibold text-orangeButton">
            {provider.companyOverview || "Company Overview"}
          </h2>

                  {/* <Link href="/provider/dashboard/profile/edit">
                  <Button
                    variant="secondary"
                    className="flex h-8 items-center gap-2 bg-[#ededed] text-gray-700 hover:bg-gray-200 sm:self-start"
                  >
                    <FaRegEdit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  </Link> */}
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
      <div className="p-6 pt-3 pl-10 pb-3 flex flex-col sm:flex-row gap-12">
        <div className="text-[11px] font-semibold text-gray-900">
          Employees:{" "} 
          <span className="font-bold">
            {provider.teamSize || "—"}
          </span>
        </div>
        <div className="text-[11px] font-semibold text-gray-900">
          Founded:{" "}
          <span className="font-bold">
            {provider.foundedYear || "—"}
          </span>
        </div>
          <div className="text-[11px] font-semibold text-gray-900">
          Project Completed:{" "}
          <span className="font-bold">
            {provider.projectsCompleted || "—"}
          </span>
        </div>
          <div className="text-[11px] font-semibold text-gray-900">
          Min Project Size:{" "}
          <span className="font-bold">
            {provider.minProjectSize || "—"}$
          </span>
        </div>
          <div className="text-[11px] font-semibold text-gray-900">
          Hourly Rate:{" "}
          <span className="font-bold">
            {provider.hourlyRate || "—"}$/hr
          </span>
        </div>
      </div>
    </div>
  )
}
