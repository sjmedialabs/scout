"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Star, Verified, DollarSign, Calendar, MessageSquare, ThumbsUp, ThumbsDown, Edit } from "lucide-react"
import type { Proposal } from "@/lib/types"

interface ProposalListProps {
  proposals: Proposal[]
  maxVisible?: number
  onShortlist: (proposalId: string) => void
  onAccept: (proposalId: string) => void
  onReject: (proposalId: string) => void
  onRequestRevision: (proposalId: string, feedback: string) => void
}

export function ProposalList({
  proposals,
  maxVisible = 10,
  onShortlist,
  onAccept,
  onReject,
  onRequestRevision,
}: ProposalListProps) {
  const [visibleProposals, setVisibleProposals] = useState(proposals.slice(0, maxVisible))
  const [rejectedCount, setRejectedCount] = useState(0)
  const [revisionDialog, setRevisionDialog] = useState<{ open: boolean; proposalId: string }>({
    open: false,
    proposalId: "",
  })
  const [revisionFeedback, setRevisionFeedback] = useState("")
  const [negotiationDialog, setNegotiationDialog] = useState<{ open: boolean; proposalId: string }>({
    open: false,
    proposalId: "",
  })

  const handleReject = (proposalId: string) => {
    onReject(proposalId)
    setRejectedCount((prev) => prev + 1)

    // Show next proposal if available
    const remainingProposals = proposals.filter((p) => !visibleProposals.find((vp) => vp.id === p.id))
    if (remainingProposals.length > 0) {
      setVisibleProposals((prev) => [...prev.filter((p) => p.id !== proposalId), remainingProposals[0]])
    } else {
      setVisibleProposals((prev) => prev.filter((p) => p.id !== proposalId))
    }
  }

  const handleAccept = (proposalId: string) => {
    onAccept(proposalId)
    setNegotiationDialog({ open: true, proposalId })
  }

  const handleRequestRevision = () => {
    onRequestRevision(revisionDialog.proposalId, revisionFeedback)
    setRevisionDialog({ open: false, proposalId: "" })
    setRevisionFeedback("")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Proposals Received</h3>
        <div className="text-sm text-muted-foreground">
          Showing {visibleProposals.length} of {proposals.length} proposals
          {rejectedCount > 0 && ` (${rejectedCount} rejected)`}
        </div>
      </div>

      {visibleProposals.map((proposal) => (
        <Card key={proposal.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {proposal.providerName}
                  {proposal.verified && <Verified className="h-4 w-4 text-blue-500" />}
                </CardTitle>
                <CardDescription>{proposal.providerCompany}</CardDescription>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{proposal.rating}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">${proposal.proposedCost.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{proposal.timeline}</span>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Work Approach</h4>
              <p className="text-sm text-muted-foreground">{proposal.workApproach}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Milestones</h4>
              <div className="flex flex-wrap gap-2">
                {proposal.milestones.map((milestone, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {milestone}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {proposal.status === "pending" && (
                <>
                  <Button size="sm" onClick={() => onShortlist(proposal.id)}>
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Shortlist
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAccept(proposal.id)}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRevisionDialog({ open: true, proposalId: proposal.id })}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Request Revision
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(proposal.id)}>
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </>
              )}
              {proposal.status === "shortlisted" && <Badge className="bg-blue-100 text-blue-800">Shortlisted</Badge>}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Revision Request Dialog */}
      <Dialog open={revisionDialog.open} onOpenChange={(open) => setRevisionDialog({ open, proposalId: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Proposal Revision</DialogTitle>
            <DialogDescription>Provide feedback to help the provider improve their proposal</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              placeholder="Please explain what changes you'd like to see in the proposal..."
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleRequestRevision}>Send Revision Request</Button>
              <Button variant="outline" onClick={() => setRevisionDialog({ open: false, proposalId: "" })}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Negotiation Chat Dialog */}
      <Dialog open={negotiationDialog.open} onOpenChange={(open) => setNegotiationDialog({ open, proposalId: "" })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Negotiation Chat</DialogTitle>
            <DialogDescription>Start negotiating project details with the provider</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-2">System Message</div>
              <p className="text-sm">
                🎉 Congratulations! You've accepted this proposal. You can now negotiate the final terms, timeline, and
                project details with the provider. Once both parties agree, the project will begin.
              </p>
            </div>
            <div className="h-64 border rounded-lg p-4 bg-background">
              <div className="text-center text-muted-foreground text-sm">
                Chat interface would be implemented here with real-time messaging
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Start Project</Button>
              <Button variant="outline" onClick={() => setNegotiationDialog({ open: false, proposalId: "" })}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
