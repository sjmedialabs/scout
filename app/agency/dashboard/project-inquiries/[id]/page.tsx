"use client"

import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { useState } from "react"
import { mockRequirements } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SubmitProposalPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [success, setSuccess] = useState(false)


  const [isSubmitting, setIsSubmitting] = useState(false)

  const buildPayload = () => ({
  requirementId: requirement.id,
  proposedCost: Number(cost),
  estimatedTimeline: timeline,
  workApproach: approach,
  coverLetter: coverLetter,
  milestones: milestones.filter((m) => m.trim() !== ""),
})


  const handleSubmitProposal = async () => {
  if (!validateForm()) return

  setIsSubmitting(true)
  setSuccess(false)

  try {
    await new Promise((resolve) => setTimeout(resolve, 1200))

    setSuccess(true)
    setErrors({
      cost: false,
      timeline: false,
      approach: false,
      form: false,
    })

    setTimeout(() => {
      router.push("/agency/dashboard/project-inquiries")
    }, 1500)

  } catch {
    setErrors({
      cost: false,
      timeline: false,
      approach: false,
      form: true,
    })
  } finally {
    setIsSubmitting(false)
  }
}
  

  const requirement = mockRequirements.find((r) => r.id === id)

  const [errors, setErrors] = useState<{
    cost: boolean
    timeline: boolean
    approach: boolean
    form: boolean
  }>({
    cost: false,
    timeline: false,
    approach: false,
    form: false,
  })

  const validateForm = () => {
    const hasCostError = !cost.trim() || Number(cost) <= 0
    const hasTimelineError = !timeline.trim()
    const hasApproachError = !approach.trim()

    const hasError = hasCostError || hasTimelineError || hasApproachError

    setErrors({
      cost: hasCostError,
      timeline: hasTimelineError,
      approach: hasApproachError,
      form: hasError,
    })

    return !hasError
  }


  const [cost, setCost] = useState("")
  const [timeline, setTimeline] = useState("")
  const [approach, setApproach] = useState("")
  const [milestones, setMilestones] = useState([""])
  const [coverLetter, setCoverLetter] = useState("")

  if (!requirement) {
    return <div className="p-6">Project not found</div>
  }

  return (
    <div className="space-y-8">

      {/* PROJECT SUMMARY */}
      <Card className="rounded-[36px] border border-gray-300 bg-white">
        <CardContent className="px-12 py-0 space-y-6">

          {/* Heading */}
          <div className="space-y-3">
            <p className="text-[20px] font-extrabold text-black h-2">
              Submitting Proposal For
            </p>

            <h1 className="text-[28px] font-extrabold text-orange-600 h-8">
              {requirement.title}
            </h1>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center  h-3 gap-8 text-[16px]">
            {/* Category */}
            <span className="rounded-md leading-none bg-gray-100 px-3 py-1 text-[14px] font-medium text-gray-500">
              {requirement.category}
            </span>

            {/* Budget */}
            <span className="text-gray-900">
              <span className="font-semibold">Budget:</span>{" "}
              <span className="text-gray-500">
                ${requirement.budgetMin.toLocaleString()} – ${requirement.budgetMax.toLocaleString()}
              </span>
            </span>

            {/* Timeline */}
            <span className="text-gray-900">
              <span className="font-semibold">Timeline:</span>{" "}
              <span className="text-gray-500">{requirement.timeline}</span>
            </span>
          </div>

          {/* Description */}
          <p className="max-w-full text-[14px] leading-5 text-gray-500">
            {requirement.description}
          </p>

        </CardContent>
      </Card>


      {/* PROPOSAL FORM */}
      <Card className="rounded-[36px] border border-gray-300 bg-white">
        <CardContent className="px-12 py-10 space-y-10">

          {/* COST + TIMELINE */}
          <div className="grid grid-cols-1 h-18 md:grid-cols-2 gap-10">
            {/* Proposed Cost */}
            <div className="space-y-2">
              <label className="text-[14px] font-bold text-[#98A0B4]">
                Proposed cost ($)
              </label>

              <Input
                value={cost}
                onChange={(e) => {
                  const value = e.target.value
                  if (!/^\d*$/.test(value)) return
                  setCost(value)
                  if (errors.cost || errors.form) {
                    setErrors({ ...errors, cost: false, form: false })
                  }
                }}
                placeholder="Enter Proposed Cost"
                className={`h-10 rounded-xl placeholder:text-[12px] placeholder:text-[#98A0B4]
                  ${errors.cost ? "border-red-500" : "border-gray-200"}
                  `}
              />

              <p className="text-[12px] text-gray-300">
                Client budget: ${requirement.budgetMin.toLocaleString()} – ${requirement.budgetMax.toLocaleString()}
              </p>
            </div>

            {/* Estimated Timeline */}
            <div className="space-y-2">
              <label className="text-[15px] font-bold text-[#98A0B4]">
                Estimated Timeline
              </label>

              <Input
                value={timeline}
                onChange={(e) => {
                  setTimeline(e.target.value)
                  if (errors.timeline || errors.form) {
                    setErrors({ ...errors, timeline: false, form: false })
                  }
                }}

                placeholder="Enter Estimated Timeline"
                className={`
                  h-10 rounded-xl text-[16px] placeholder:text-[12px] placeholder:text-[#98A0B4]
                  ${errors.timeline ? "border-red-500" : "border-gray-200"}
                `}
              />

              <p className="text-[12px] text-gray-300">
                Client expectation: {requirement.timeline}
              </p>
            </div>
          </div>

          {/* WORK APPROACH */}
          <div className="space-y-3 h-20">
            <label className="text-[14px] font-bold text-[#98A0B4]">
              Work Approach
            </label>

            <Textarea
              value={approach}
              onChange={(e) => {
                setApproach(e.target.value)
                if (errors.approach || errors.form) {
                  setErrors({ ...errors, approach: false, form: false })
                }
              }}

              rows={6}
              placeholder="Describe your methodology, Technologies you will use, and how you will approach this project...."
              className={`rounded-xl text-[16px] leading-[1.6] placeholder:text-[12px] placeholder:text-[#98A0B4]
                  ${errors.approach ? "border-red-500" : "border-gray-200"}
              `}    
            />
          </div>

          <div className="space-y-3 h-22">
            <label className="text-[14px] font-bold text-[#98A0B4]">
              Cover Letter
            </label>

            <Textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder="Describe your methodology, Technologies you will use, and how you will approach this project...."
              className="rounded-xl border-gray-200 text-[16px] leading-[1.6] placeholder:text-[12px] placeholder:text-[#98A0B4]"
            />
          </div>

          {/* MILESTONES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-bold text-[#98A0B4]">
                Project milestones
              </label>

              <Button
                type="button"
                className="h-8 rounded-lg bg-black px-4 text-[14px] font-medium text-white flex items-center gap-2 hover:bg-black/80"
                onClick={() => setMilestones([...milestones, ""])}
              >
                + Add Milestone
              </Button>
            </div>

            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
              <Input
                value={milestone}
                onChange={(e) => {
                  const updated = [...milestones]
                  updated[index] = e.target.value
                  setMilestones(updated)
                }}
                placeholder={`Milestone -${index + 1}`}
                className="h-10 border border-gray-200 rounded-xl text-[16px] placeholder:text-[#98A0B4]"
              />

              {/* Remove button */}
              {milestones.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setMilestones(milestones.filter((_, i) => i !== index))
                  }
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    text-gray-400 hover:text-red-500
                    text-sm font-medium
                  "
                >
                  ✕
                </button>
              )}
            </div>
            ))}
          </div>

          {/* PROPOSAL TIPS */}
          <div className="space-y-3 pt-1">
            <p className="text-[14px] font-bold text-[#98A0B4]">
              Proposal Tips
            </p>

            <ul className="list-disc pl-5 space-y-2 text-[14px] leading-[1.6] text-gray-500">
              <li>Be specific about your approach and methodology</li>
              <li>Highlight relevant experience and past projects</li>
              <li>Break down your timeline into clear milestones</li>
              <li>Explain why your pricing provides good value</li>
            </ul>
          </div>

          <div>
          <Button
            className="h-12 rounded-full hover:bg-orange-400 bg-orangeButton px-8 text-white flex items-center justify-center gap-2"
            disabled={isSubmitting}
            onClick={handleSubmitProposal}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Proposal"
            )}
          </Button>

          {errors.form && (
            <p className="text-[14px] font-medium text-red-500">
              Please enter the required fields
            </p>
          )}

          {success && (
            <p className="text-green-600 font-medium">
              Proposal submitted successfully
            </p>
          )}
          </div>

        </CardContent>
      </Card>

    </div>
  )
}
