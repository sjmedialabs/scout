"use client"

import { useState } from "react"
import { ReviewDisplay } from "@/components/reviews/review-display"
import { ReviewSummary } from "@/components/reviews/review-summary"
import { RespondToReviewModal } from "@/components/provider/respond-to-review-modal"
import { mockProviderReviews } from "@/lib/mock-data"
import { toast } from "@/hooks/use-toast"
import type { Review } from "@/lib/types"

export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleRespondClick = (review: Review) => {
    console.log("[v0] handleRespondClick called with review:", review.id)
    console.log("[v0] Current modal state - isOpen:", isModalOpen, "selectedReview:", selectedReview?.id)
    setSelectedReview(review)
    setIsModalOpen(true)
    console.log("[v0] Modal state updated - should be open now")
  }

  const handleCloseModal = () => {
    console.log("[v0] Closing respond modal")
    setIsModalOpen(false)
    setSelectedReview(null)
  }

  const handleSubmitResponse = (reviewId: string, response: string) => {
    console.log(`[v0] Response submitted for review ${reviewId}:`, response)
    toast({
      title: "Response Submitted",
      description: "Your response to the review has been submitted successfully.",
    })
   
  }

  return (
    <div className="bg-background">
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Reviews & Ratings</h1>
            <p className="text-muted-foreground">See what clients are saying about our service providers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <ReviewSummary reviews={mockProviderReviews} />
            </div>
            <div className="md:col-span-2">
              <ReviewDisplay reviews={mockProviderReviews} showProviderResponse onRespondClick={handleRespondClick} />
            </div>
          </div>
        </div>
      </div>

      <RespondToReviewModal
        review={selectedReview}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitResponse}
      />
    </div>
  )
}
