"use client"
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
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import StarRating from "@/components/ui/star-rating"

interface ProjectProposal {
  id: string
  projectId: string
  providerId: string
  providerName: string
  providerRating: number
  proposalAmount: number
  timeline: string
  description: string
  submittedAt: string
  status: "pending" | "shortlisted" | "accepted" | "rejected"
  coverLetter: string
}

const mockProjectProposals: ProjectProposal[] = [
  {
    id: "pp1",
    projectId: "proj1",
    providerId: "prov1",
    providerName: "TechSolutions Inc",
    providerRating: 4.8,
    proposalAmount: 15000,
    timeline: "8 weeks",
    description:
      "We propose to develop a comprehensive e-commerce platform using React, Node.js, and MongoDB. Our team has extensive experience in building scalable web applications with modern technologies. We'll implement advanced features like real-time inventory management, secure payment processing, and analytics dashboard.",
    submittedAt: "2024-01-15",
    status: "pending",
    coverLetter:
      "We are excited to work on your e-commerce project and deliver a high-quality solution that meets your business needs. Our portfolio includes 20+ successful e-commerce projects.",
  },
  {
    id: "pp2",
    projectId: "proj1",
    providerId: "prov2",
    providerName: "WebCraft Studios",
    providerRating: 4.6,
    proposalAmount: 12000,
    timeline: "10 weeks",
    description:
      "Our approach focuses on creating a user-friendly e-commerce platform with advanced features like real-time inventory management, payment gateway integration, and responsive design. We'll use Next.js for optimal performance and SEO.",
    submittedAt: "2024-01-16",
    status: "shortlisted",
    coverLetter:
      "With 5+ years of e-commerce development experience, we're confident in delivering exceptional results for your project. We guarantee 99.9% uptime and mobile-first design.",
  },
  {
    id: "pp3",
    projectId: "proj1",
    providerId: "prov3",
    providerName: "Digital Commerce Pro",
    providerRating: 4.7,
    proposalAmount: 18000,
    timeline: "6 weeks",
    description:
      "Premium e-commerce solution with AI-powered recommendations, advanced analytics, multi-vendor support, and integrated CRM. We'll deliver a future-ready platform that scales with your business.",
    submittedAt: "2024-01-18",
    status: "pending",
    coverLetter:
      "We specialize in enterprise-level e-commerce solutions and have helped 100+ businesses increase their online revenue by 300% on average.",
  },
  {
    id: "pp4",
    projectId: "proj2",
    providerId: "prov4",
    providerName: "MobileFirst Dev",
    providerRating: 4.9,
    proposalAmount: 8000,
    timeline: "6 weeks",
    description:
      "We specialize in React Native development and will create a cross-platform mobile app with native performance, push notifications, offline capabilities, and seamless user experience across iOS and Android.",
    submittedAt: "2024-01-17",
    status: "accepted",
    coverLetter:
      "Our team has developed 50+ mobile apps with excellent user ratings. We're excited to bring your vision to life with cutting-edge mobile technology.",
  },
  {
    id: "pp5",
    projectId: "proj2",
    providerId: "prov5",
    providerName: "AppCrafters",
    providerRating: 4.5,
    proposalAmount: 9500,
    timeline: "8 weeks",
    description:
      "Native iOS and Android development with Flutter framework. We'll create a high-performance mobile app with custom animations, biometric authentication, and cloud synchronization.",
    submittedAt: "2024-01-19",
    status: "shortlisted",
    coverLetter:
      "We're a team of certified mobile developers with expertise in Flutter, React Native, and native development. Your app will be optimized for performance and user engagement.",
  },
  {
    id: "pp6",
    projectId: "proj3",
    providerId: "prov6",
    providerName: "BrandVision Agency",
    providerRating: 4.8,
    proposalAmount: 5000,
    timeline: "4 weeks",
    description:
      "Complete brand identity package including logo design, color palette, typography, brand guidelines, business cards, letterheads, and social media templates. We'll create a memorable brand that resonates with your target audience.",
    submittedAt: "2024-01-20",
    status: "pending",
    coverLetter:
      "We've created successful brand identities for 200+ companies across various industries. Our designs are modern, timeless, and strategically crafted to drive business growth.",
  },
  {
    id: "pp7",
    projectId: "proj3",
    providerId: "prov7",
    providerName: "Creative Minds Studio",
    providerRating: 4.6,
    proposalAmount: 4500,
    timeline: "3 weeks",
    description:
      "Professional brand identity design with focus on minimalist aesthetics and strong visual impact. Includes logo variations, brand style guide, and application mockups across different mediums.",
    submittedAt: "2024-01-21",
    status: "rejected",
    coverLetter:
      "Our award-winning design team specializes in creating distinctive brand identities that stand out in competitive markets. We guarantee unlimited revisions until you're 100% satisfied.",
  },
  {
    id: "pp8",
    projectId: "proj4",
    providerId: "prov8",
    providerName: "DataFlow Solutions",
    providerRating: 4.9,
    proposalAmount: 25000,
    timeline: "12 weeks",
    description:
      "Enterprise CRM system with advanced analytics, automated workflows, customer segmentation, email marketing integration, and comprehensive reporting dashboard. Built with scalability and security in mind.",
    submittedAt: "2024-01-22",
    status: "shortlisted",
    coverLetter:
      "We're CRM specialists with 10+ years of experience building enterprise solutions for Fortune 500 companies. Our systems handle millions of customer records with 99.99% uptime.",
  },
  {
    id: "pp9",
    projectId: "proj4",
    providerId: "prov9",
    providerName: "Enterprise Tech Hub",
    providerRating: 4.7,
    proposalAmount: 22000,
    timeline: "10 weeks",
    description:
      "Custom CRM solution with AI-powered lead scoring, automated sales pipeline management, integration with popular tools (Salesforce, HubSpot), and mobile app for field sales teams.",
    submittedAt: "2024-01-23",
    status: "pending",
    coverLetter:
      "We understand the complexity of enterprise CRM requirements and have successfully delivered 30+ CRM projects. Our solution will streamline your sales process and boost productivity by 40%.",
  },
  {
    id: "pp10",
    projectId: "proj5",
    providerId: "prov10",
    providerName: "EduTech Innovators",
    providerRating: 4.8,
    proposalAmount: 18000,
    timeline: "10 weeks",
    description:
      "Comprehensive learning management system with video streaming, interactive quizzes, progress tracking, certificate generation, discussion forums, and mobile-responsive design for seamless learning experience.",
    submittedAt: "2024-01-24",
    status: "pending",
    coverLetter:
      "We specialize in educational technology and have built LMS platforms for universities and corporate training programs. Our solutions support 10,000+ concurrent users with excellent performance.",
  },
]
const ProviderComparisonPage=()=>{
    return(
            <div className="space-y-6 p-3 md:p-6">
            <div>
              <h1 className="text-3xl text-[#F4561C] my-custom-class leading-6">Provider Comparison</h1>
              <p className="text-lg text-[#656565] my-custom-class mt-0">Compare vendors side-by-side to make informed decisions</p>
            </div>

            {/* Vendor Selection */}
            <Card className="border-[1px] border-[#D1CBCB] rounded-3xl bg-[#fff] shadow-none w-auto">
              <CardHeader>
                <CardTitle className="text-[#333333] text-2xl font-bold my-custom-class leading-6">Select Vendors to Compare</CardTitle>
                <CardDescription className="text-md text-[#333333] font-normal my-custom-class">Choose up to 4 vendors to compare their ratings and proposals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockProjectProposals.slice(0, 6).map((proposal) => (
                    <Button key={proposal.id} variant="outline" size="sm" className="border-[1px] border-[#DEDEDE] rounded-full bg-[#EDEDED] text-[#000] hover:text-[#000] active:bg-[#EDEDED] hover:bg-[#EDEDED]">
                      {proposal.providerName}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Side-by-Side Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {mockProjectProposals.slice(0, 3).map((proposal) => (
                <Card key={proposal.id} className="relative px-0 py-3 border-[1px] shadow-none rounded-2xl bg-[#fff]  border-[#EBEBEB]  ">
                  <CardHeader className="px-0 py-0 mb-0">
                    <div className="flex items-start justify-start gap-2 p-4 bg-[#fff]">
                      <div className="items-center">
                        <img src="/demilogo.png" alt={proposal.providerName} className="min-h-18 min-w-18 max-h-23 max-w-23 object-contain mb-2" />
                      </div>
                      <div className="items-center mt-2">
                        <CardTitle className="text-lg font-bold text-[#000]">{proposal.providerName}</CardTitle>
                        <div className="flex items-center  mt-1">
                          <StarRating rating={proposal.providerRating}/>
                          <span className="text-sm ml-1  font-bold text-[#000]">{` (${proposal?.reviewCount || 0})`}</span>
                        </div>
                      </div>
                      {/* <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-0 mb-1 px-0 py-0">
                    {/* Proposal Details */}
                    <div className="space-y-0 bg-[#DBE8F2]  -mt-8 p-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#000] text-xl font-bold">Proposal Amount</span>
                        <span className="font-bold text-lg">${proposal.proposalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#000] text-xl font-bold">Timeline</span>
                        <span className="font-bold text-lg">{proposal.timeline}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#000] text-xl font-bold">Location</span>
                        <span className="font-bold text-lg">{proposal.providerId}</span>
                      </div>
                    </div>

                   

                    {/* Rating Breakdown */}
                    <div className="space-y-0 bg-[#E9F5FF] p-6">
                      <h4 className="text-[#F54A0C] text-xl mb-3 font-bold -ml-2">Rating Breakdown</h4>

                      {/* Quality Rating */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B6B6B] font-bold text-md my-custom-class">Quality</span>
                          <span className="font-bold text-[#6B6B6B] text-md">4.8/5.0</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-[#00C951]" style={{ width: "90%" }} />
                        </div>
                      </div>

                      {/* Schedule Rating */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B6B6B] font-bold text-md my-custom-class">Schedule</span>
                          <span className="font-bold text-[#6B6B6B] text-md">4.5/5.0</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-[#2B7FFF]" style={{ width: "90%" }} />
                        </div>
                      </div>

                      {/* Cost Rating */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B6B6B] font-bold text-md my-custom-class">Cost</span>
                          <span className="font-bold text-[#6B6B6B] text-md">4.3/5.0</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-[#F0B100]" style={{ width: "86%" }} />
                        </div>
                      </div>

                      {/* Willing to Refer */}
                      <div className="space-y-1 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#6B6B6B] font-bold text-md my-custom-class">Willing to Refer</span>
                          <span className="font-bold text-[#6B6B6B] text-md">95%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-[#34359B]" style={{ width: "95%" }} />
                        </div>
                      </div>
                    </div>

                  

                    {/* Key Strengths */}
                    <div className="space-y-2 bg-[#fffff] p-6">
                      <h4 className="text-[#F54A0C] font-bold text-lg">Key Strengths</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-[#1C96F4] rounded-full text-xs my-custom-class min-h-[40px] min-w-[100px] text-[#fff]">Fast Delivery</Badge>
                        <Badge variant="secondary" className="bg-[#1C96F4] rounded-full text-xs my-custom-class min-h-[40px] min-w-[100px] text-[#fff]">Great Communication</Badge>
                        <Badge variant="secondary" className="bg-[#1C96F4] rounded-full text-xs my-custom-class min-h-[40px] min-w-[100px] text-[#fff]">High Quality</Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 p-6 pt-0 bg-[#fff]">
                      <Button className="flex-1 bg-[#2C34A1] rounded-full min-h-[40px]" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="items-center bg-[#000000] rounded-full mt-0 min-h-[40px]">
                        <Heart className="h-8 w-8"  color="#fff"/>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison Summary */}
            <h1 className="text-xl text-[#F54A0C] font-bold mb-1 my-custom-class">Comparison Summary</h1>
            <Card className="bg-[#fff] mt-2 rounded-xl border-[1px] border-[#E6E6E6]">
              {/* ⚠️ Important: NO overflow on CardContent */}
              <CardContent className="p-0 font-bold text-black text-sm">
                
                {/* Scroll wrapper */}
                <div className="relative w-full overflow-x-auto">
                  <table className="w-full  border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-bold">Criteria</th>
                        {mockProjectProposals.slice(0, 3).map((proposal) => (
                          <th
                            key={proposal.id}
                            className="text-center p-3 font-bold text-black"
                          >
                            {proposal.providerName}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 font-bold">Overall Rating</td>
                        {mockProjectProposals.slice(0, 3).map((p) => (
                          <td key={p.id} className="text-center p-3 font-medium">
                            {p.providerRating}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-b">
                        <td className="p-3 font-bold">Proposal Amount</td>
                        {mockProjectProposals.slice(0, 3).map((p) => (
                          <td key={p.id} className="text-center p-3 font-medium">
                            ${p.proposalAmount.toLocaleString()}
                          </td>
                        ))}
                      </tr>

                      <tr className="border-b">
                        <td className="p-3 font-bold">Timeline</td>
                        {mockProjectProposals.slice(0, 3).map((p) => (
                          <td key={p.id} className="text-center p-3 font-medium">
                            {p.timeline}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>

              </CardContent>
            </Card>

          </div>
    )
}
export default ProviderComparisonPage; 