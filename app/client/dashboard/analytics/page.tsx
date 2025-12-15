


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PostRequirementForm } from "@/components/seeker/post-requirement-form"
import { RequirementList } from "@/components/seeker/requirement-list"
import { ProposalList } from "@/components/seeker/proposal-list"
import { RequirementDetailsModal } from "@/components/seeker/requirement-details-modal"
import { NegotiationChat } from "@/components/negotiation-chat"
import { FiltersPanel } from "@/components/filters-panel"
import { ProviderProfileModal } from "@/components/provider-profile-modal"
import { ProjectSubmissionForm } from "@/components/project-submission-form"
import { ReviewSubmissionForm } from "@/components/review-submission-form"
import { ProviderComparison } from "@/components/provider-comparison"
import { NotificationsWidget } from "@/components/seeker/notifications-widget"
import {
  Plus,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Eye,
  Home,
  User,
  Briefcase,
  BarChart3,
  Settings,
  CreditCard,
  Bell,
  Shield,
  GitCompare,
  ChevronDown,
  ChevronRight,
  Edit,
  Save,
  X,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  MoreHorizontal,
  Trash2,
  DollarSign,
  Target,
  Heart,
  SeparatorVertical as Separator,
} from "lucide-react"
import { mockRequirements, mockProposals, mockProviders } from "@/lib/mock-data"
import type { Requirement, Proposal, Provider, Notification } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
const ClientAnalyticsPage=()=>{
    return(
        <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Project Analytics</h1>
                  <p className="text-muted-foreground">Insights into vendor demographics and proposal trends</p>
                </div>
    
                {/* Top Locations Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Top Vendor Locations
                    </CardTitle>
                    <CardDescription>Geographic distribution of vendors responding to your projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { location: "San Francisco, CA", count: 12, percentage: 30 },
                        { location: "New York, NY", count: 10, percentage: 25 },
                        { location: "Austin, TX", count: 8, percentage: 20 },
                        { location: "Seattle, WA", count: 6, percentage: 15 },
                        { location: "Boston, MA", count: 4, percentage: 10 },
                      ].map((item) => (
                        <div key={item.location} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.location}</span>
                            <span className="text-muted-foreground">
                              {item.count} vendors ({item.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all" style={{ width: `${item.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
    
                {/* Top Specialties Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Top Vendor Specialties
                    </CardTitle>
                    <CardDescription>Expertise areas of vendors responding to your projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { specialty: "Web Development", count: 15, percentage: 35 },
                        { specialty: "Mobile Apps", count: 12, percentage: 28 },
                        { specialty: "UI/UX Design", count: 10, percentage: 23 },
                        { specialty: "Cloud Services", count: 4, percentage: 9 },
                        { specialty: "DevOps", count: 2, percentage: 5 },
                      ].map((item) => (
                        <div key={item.specialty} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.specialty}</span>
                            <span className="text-muted-foreground">
                              {item.count} vendors ({item.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all" style={{ width: `${item.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
    
                {/* Cost Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Cost Distribution Analysis
                    </CardTitle>
                    <CardDescription>Budget ranges of proposals received vs. your stated budget</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Your Stated Budget</span>
                          <span className="text-lg font-bold text-primary">$50,000</span>
                        </div>
                      </div>
    
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm">Proposal Budget Ranges</h4>
                        {[
                          { range: "Under $30,000", count: 3, percentage: 15, color: "bg-green-500" },
                          { range: "$30,000 - $50,000", count: 8, percentage: 40, color: "bg-blue-500" },
                          { range: "$50,000 - $70,000", count: 6, percentage: 30, color: "bg-yellow-500" },
                          { range: "Over $70,000", count: 3, percentage: 15, color: "bg-red-500" },
                        ].map((item) => (
                          <div key={item.range} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{item.range}</span>
                              <span className="text-muted-foreground">
                                {item.count} proposals ({item.percentage}%)
                              </span>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.color} transition-all`}
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
    
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Average</p>
                          <p className="text-lg font-bold">$52,500</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Median</p>
                          <p className="text-lg font-bold">$48,000</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Range</p>
                          <p className="text-lg font-bold">$25K - $85K</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
    )
}
export default ClientAnalyticsPage;