"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, MessageSquare, Calendar, DollarSign } from "lucide-react"
import type { Requirement } from "@/lib/types"

interface RequirementListProps {
  requirements: Requirement[]
  onViewProposals: (requirementId: string) => void
  onViewDetails: (requirementId: string) => void
}

export function RequirementList({ requirements, onViewProposals, onViewDetails }: RequirementListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800"
      case "shortlisted":
        return "bg-blue-100 text-blue-800"
      case "negotiation":
        return "bg-yellow-100 text-yellow-800"
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
        <Card key={requirement.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg">{requirement.title}</CardTitle>
                <CardDescription className="mt-1">{requirement.description.substring(0, 150)}...</CardDescription>
              </div>
              <Badge className={getStatusColor(requirement.status)}>
                {requirement.status.charAt(0).toUpperCase() + requirement.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{requirement.category}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                {formatBudget(requirement.budgetMin, requirement.budgetMax)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {requirement.timeline}
              </div>
              <div className="text-sm text-muted-foreground">Posted {requirement.createdAt ? new Date(requirement.createdAt).toLocaleDateString() : "Today"}</div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onViewDetails(requirement.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button variant="outline" size="sm" onClick={() => onViewProposals(requirement.id)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                View Proposals
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
