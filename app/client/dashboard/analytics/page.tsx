


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
import { MdLocationOn } from "react-icons/md";
const ClientAnalyticsPage=()=>{
    return(
        <div className="space-y-6 p-3 md:p-6">
                <div>
                  <h1 className="text-2xl font-bold my-custom-class leading-6 text-[#F4561C]">Project Analytics</h1>
                  <p className="text-[#656565] font-medium text-lg my-custom-class">Insights into vendor demographics and proposal trends</p>
                </div>
    
                {/* Top Locations Analytics */}
                <Card className="border-1 border-[#CFCACA] rounded-3xl px-2 md:px-8 bg-[#fff]">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-0">
                      <MdLocationOn className="h-6 w-9" color="#F54A0C" />
                      <span className="text-2xl font-bold my-custom-class text-[#F54A0C]"> Top Vendor Locations</span>
                     
                    </CardTitle>
                     <p className="text-[#656565] my-custom-class ml-3 -mt-2">Geographic distribution of vendors responding to your projects</p>
                    
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 px-2">
                      {[
                        { location: "San Francisco, CA", count: 12, percentage: 30 },
                        { location: "New York, NY", count: 10, percentage: 25 },
                        { location: "Austin, TX", count: 8, percentage: 20 },
                        { location: "Seattle, WA", count: 6, percentage: 15 },
                        { location: "Boston, MA", count: 4, percentage: 10 },
                      ].map((item) => (
                        <div key={item.location} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-xs text-[#6B6B6B] my-custom-class">{item.location}</span>
                            <span className="font-bold text-xs text-[#6B6B6B] my-custom-class">
                              {item.count} vendors ({item.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-[#DAEDF8] rounded-full overflow-hidden">
                            <div className="h-full bg-[#1C96F4] transition-all" style={{ width: `${item.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
    
                {/* Top Specialties Analytics */}
                <Card className="border-1 border-[#CFCACA] rounded-3xl bg-[#fff] px-2 md:px-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-8 w-8" color="#F54A0C"/>
                       <span className="text-2xl font-bold my-custom-class text-[#F54A0C]">Top Vendor Specialties</span>
                    </CardTitle>
                    <p className="text-[#656565] my-custom-class ml-2 -mt-2">Expertise areas of vendors responding to your projects</p>
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
                            <span className="font-bold text-xs text-[#6B6B6B] my-custom-class">{item.specialty}</span>
                            <span className="font-bold text-xs text-[#6B6B6B] my-custom-class">
                              {item.count} vendors ({item.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-[#DAEDF8] rounded-full overflow-hidden">
                            <div className="h-full bg-[#1C96F4] transition-all" style={{ width: `${item.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
    
                {/* Cost Distribution */}
                <Card className="border-1 border-[#CFCACA] rounded-3xl bg-[#fff] px-0">
                  <CardHeader className="px-8">
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-8 w-8 flex items-center justify-center border-2 border-[#F4561C]  rounded-md">
                        <DollarSign className="h-5 w-5" color="#F4561C"/>
                      </div>
                     <span className="text-2xl font-bold my-custom-class text-[#F54A0C]">Cost Distribution Analysis</span>
                    </CardTitle>
                    <p className="text-[#656565] my-custom-class  -mt-2">Budget ranges of proposals received vs. your stated budget</p>
                  </CardHeader>
                  <CardContent className="px-0">
                    <div className="space-y-6  px-0 ">
                      <div className="py-4  rounded-lg px-8">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg text-[#000] font-bold my-custom-class">Your Stated Budget</span>
                          <span className="text-lg font-bold text-[#000] my-custom-class">$50,000</span>
                        </div>
                      </div>
                      <hr className="border-[1px] border-[#E4E4E4] w-full"/>
                      <div className="space-y-4 px-8">
                        <h4 className="text-xl font-bold text-[#000] my-custom-class">Proposal Budget Ranges</h4>
                        {[
                          { range: "Under $30,000", count: 3, percentage: 15, color: "bg-green-500" },
                          { range: "$30,000 - $50,000", count: 8, percentage: 40, color: "bg-blue-500" },
                          { range: "$50,000 - $70,000", count: 6, percentage: 30, color: "bg-yellow-500" },
                          { range: "Over $70,000", count: 3, percentage: 15, color: "bg-red-500" },
                        ].map((item) => (
                          <div key={item.range} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-bold text-xs text-[#6B6B6B] my-custom-class">{item.range}</span>
                              <span className="font-bold text-xs text-[#6B6B6B] my-custom-class">
                                {item.count} proposals ({item.percentage}%)
                              </span>
                            </div>
                            <div className="h-2 bg-[#DAEDF8] rounded-full overflow-hidden">
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
                          <p className="text-sm text-[#6B6B6B] my-custom-class font-bold">Average</p>
                          <p className="text-lg text-[#000] font-bold">$52,500</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-[#6B6B6B] my-custom-class font-bold">Median</p>
                          <p className="text-lg text-[#000] font-bold">$48,000</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-[#6B6B6B] my-custom-class font-bold">Range</p>
                          <p className="text-lg font-bold text-[#000]">$25K - $85K</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
    )
}
export default ClientAnalyticsPage;