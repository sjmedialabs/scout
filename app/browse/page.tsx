"use client"

import { Search } from "lucide-react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"

import { ProposalsHeader } from "@/components/requirements/ProposalsHeader"
import { ProposalCard } from "@/components/requirements/ProposalCard"

const bannerData={
    title:"Service Providers",
    description:"Find verified professionals for your next project",
    backgroundImageUrl:"/serviceProviderBanner.jpg"
  }

export default function BrowsePage() {
  const proposals = [
    {
      id: "1",
      category: "Website design",
      title: "E-commerce Website Design and development",
      description:
        "Looking for a modern e-commerce platform with payment integration, inventory management, and responsive design. Must support multiple payment gateways and have admin dashboard.",
      budget: "$5,000 - $10,000",
      timeline: "3 months",
      proposalsCount: 12,
      postedAgo: "2 days ago",
    },
    {
      id: "2",
      category: "Web application",
      title: "Web application Development",
      description:
        "Need a scalable web application with secure authentication, role-based access, and modern UI. Experience with React and backend APIs required.",
      budget: "$3,000 - $8,000",
      timeline: "2 months",
      proposalsCount: 8,
      postedAgo: "4 days ago",
    },
    {
      id: "3",
      category: "Design",
      title: "Brochure Design & Packaging design",
      description:
        "Creative brochure and packaging design needed for a retail brand. Deliverables include print-ready files and design guidelines.",
      budget: "$1,500 - $3,000",
      timeline: "1 month",
      proposalsCount: 5,
      postedAgo: "1 day ago",
    },
  ]

  return (
    <div className="bg-background">

      {/*  HERO SECTION  */}
      <section
  className="relative w-full overflow-hidden"
  style={{
    backgroundImage: `url(${bannerData.backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <div className="absolute inset-0 bg-white/35" />

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16 sm:py-20">
    
    {/* TITLE */}
    <div className="text-center mb-10">
      <h1 className="text-[26px] sm:text-[32px] md:text-[40px] font-bold text-[#F54A0C]">
        Browse Requirements
      </h1>
      <p className="mt-[-10] text-sm sm:text-base text-[#9b9b9b] leading-tight">
        Discover opportunities from businesses looking for your services
      </p>
    </div>

    {/* FILTER BAR */}
    <div className="flex justify-center">
      <div
        className="w-full max-w-5xl bg-white rounded-[28px]
                   shadow-[0_20px_40px_rgba(0,0,0,0.08)]
                   px-6 py-5 border"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_auto] gap-6 items-center">

          {/* Search */}
          <div className="flex items-center gap-2 border-b border-[#dcdcdc] pb-2">
            
            <Input
              placeholder="Search Requirement"
              className="border-0 p-0 h-auto text-[15px] placeholder:text-[#9b9b9b]
                         focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Category */}
          <Select>
            <SelectTrigger
            className="
                border-0 border-b border-[#dcdcdc] rounded-none px-0 pb-2
                text-[15px] font-normal
                focus-visible:ring-0 focus-visible:ring-offset-0

                [&_span]:text-[#9b9b9b]
                [&_span]:text-[15px]
                [&_span]:font-normal
            "
            >
            <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web">Web Development</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>

          {/* Budget */}
          <Select>
            <SelectTrigger
            className="
                border-0 border-b border-[#dcdcdc] rounded-none px-0 pb-2
                text-[15px] font-normal
                focus-visible:ring-0 focus-visible:ring-offset-0

                [&_span]:text-[#9b9b9b]
                [&_span]:text-[15px]
                [&_span]:font-normal
            "
            >
            <SelectValue placeholder="Budget Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1k">Under $1k</SelectItem>
              <SelectItem value="5k">$1k – $5k</SelectItem>
              <SelectItem value="10k">$5k – $10k</SelectItem>
            </SelectContent>
          </Select>

          {/* APPLY FILTER */}
          <Button
            className="h-10 px-6 rounded-full bg-[#F54A0C] hover:bg-[#d93f0b]
                       text-white text-[14px] font-medium whitespace-nowrap"
          >
            <Filter className="h-4 w-4" />
            Apply Filter
          </Button>

        </div>
      </div>
    </div>
  </div>
</section>

      <div className="px-4 py-10">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <ProposalsHeader
            onSortChange={(value) => console.log("Sort:", value)}
          />

          {/* Cards */}
          <div className="space-y-8">
            {proposals.map((item) => (
              <ProposalCard
                key={item.id}
                category={item.category}
                title={item.title}
                description={item.description}
                budget={item.budget}
                timeline={item.timeline}
                proposalsCount={item.proposalsCount}
                postedAgo={item.postedAgo}
                onView={() => console.log("View", item.id)}
                onSubmit={() => console.log("Submit", item.id)}
              />
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}