import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, CalendarDays, Inbox } from "lucide-react"

interface ProposalCardProps {
  category: string
  title: string
  description: string
  budget: string
  timeline: string
  proposalsCount: number
  postedAgo: string
  onView?: () => void
  onSubmit?: () => void
}

export function ProposalCard({
  category,
  title,
  description,
  budget,
  timeline,
  proposalsCount,
  postedAgo,
  onView,
  onSubmit,
}: ProposalCardProps) {
  return (
    <div className="rounded-[26px] border border-[#e6e6e6] bg-[#f4fbff] overflow-hidden">
      
      {/* Top */}
      <div className="p-6 flex justify-between gap-4">
        <div>
          <Badge
            variant="outline"
            className="mb-3 rounded-full px-4 py-1 font-bold text-xs bg-white"
          >
            {category}
          </Badge>

          <h3 className="text-[20px] sm:text-[22px] font-semibold text-[#2c34a1]">
            {title}
          </h3>

          <p className="mt-2 max-w-3xl text-[14px] text-[#8b8b8b] leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-[#ff4d00] whitespace-nowrap">
          <Clock className="h-4 w-4" />
          {postedAgo}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#e6e6e6]" />

      {/* Bottom */}
      <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Meta */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[#ff4d00]" />
            <span className="font-semibold">{budget}</span>
          </div>

          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#ff4d00]" />
            <span className="font-semibold">{timeline}</span>
          </div>

          <div className="flex items-center gap-2">
            <Inbox className="h-4 w-4 text-[#ff4d00]" />
            <span className="font-semibold">
              {proposalsCount} proposals received
              </span>
          </div>
        </div>
        </div>
        {/* Actions */}
        <div className="m-4 flex gap-3">
          <Button
            onClick={onView}
            className="rounded-full bg-[#2c34a1] hover:bg-[#2c34a1] px-6"
          >
            View Details →
          </Button>

          <Button
            onClick={onSubmit}
            className="rounded-full bg-black hover:bg-black px-6"
          >
            Submit Proposal
          </Button>
        </div>
      </div>
    
  )
}