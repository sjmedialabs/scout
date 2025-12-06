"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, DollarSign, Calendar, Lock, Eye } from "lucide-react"
import type { Requirement } from "@/lib/types"
import { categories } from "@/lib/mock-data"

interface BrowseRequirementsProps {
  requirements: Requirement[]
  subscriptionTier: string
  onViewDetails: (requirementId: string) => void
  onSubmitProposal: (requirementId: string) => void
}

export function BrowseRequirements({
  requirements,
  subscriptionTier,
  onViewDetails,
  onSubmitProposal,
}: BrowseRequirementsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [budgetFilter, setBudgetFilter] = useState("all")

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || req.category === categoryFilter
    const matchesBudget =
      budgetFilter === "all" ||
      (budgetFilter === "low" && req.budgetMax <= 2000) ||
      (budgetFilter === "medium" && req.budgetMax > 2000 && req.budgetMax <= 10000) ||
      (budgetFilter === "high" && req.budgetMax > 10000)

    return matchesSearch && matchesCategory && matchesBudget && req.status === "open"
  })

  const canViewFullDetails = (requirement: Requirement) => {
    if (subscriptionTier === "basic") {
      return false
    }
    return true
  }

  const formatBudget = (min: number, max: number) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Browse Requirements</CardTitle>
          <CardDescription>Find projects that match your expertise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requirements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Budget Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="low">Under $2,000</SelectItem>
                <SelectItem value="medium">$2,000 - $10,000</SelectItem>
                <SelectItem value="high">Over $10,000</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
                setBudgetFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Gate for Basic Users */}
      {subscriptionTier === "basic" && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-yellow-600" />
              <div>
                <h3 className="font-medium text-yellow-800">Upgrade to View Full Details</h3>
                <p className="text-sm text-yellow-700">
                  Upgrade to Standard or Premium plan to view full requirement details and submit proposals.
                </p>
              </div>
              <Button className="ml-auto">Upgrade Now</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requirements List */}
      <div className="space-y-4">
        {filteredRequirements.map((requirement) => (
          <Card key={requirement.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{requirement.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {canViewFullDetails(requirement)
                      ? requirement.description.substring(0, 150) + "..."
                      : "Upgrade your subscription to view full project details."}
                  </CardDescription>
                </div>
                <Badge variant="outline">{requirement.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  {canViewFullDetails(requirement)
                    ? formatBudget(requirement.budgetMin, requirement.budgetMax)
                    : "Budget hidden"}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {canViewFullDetails(requirement) ? requirement.timeline : "Timeline hidden"}
                </div>
                <div className="text-sm text-muted-foreground">Posted {requirement.createdAt.toLocaleDateString()}</div>
              </div>

              <div className="flex gap-2">
                {canViewFullDetails(requirement) ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => onViewDetails(requirement.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" onClick={() => onSubmitProposal(requirement.id)}>
                      Submit Proposal
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    <Lock className="h-4 w-4 mr-2" />
                    Upgrade to Submit Proposal
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRequirements.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No requirements found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
