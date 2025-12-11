"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Building2,
  FileText,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  MessageSquare,
  Award,
  Edit,
  Settings,
  BarChart3,
  Users,
  Megaphone,
  CreditCard,
  Bell,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Home,
  User,
  Briefcase,
  MessageCircle,
  FileSearch,
  Eye,
  GitCompare,
  Download,
  Phone,
  Video,
  Paperclip,
  Send,
  Mail,
  Clock,
  CheckCircle,
  X,
  Target,
  Handshake,
} from "lucide-react"
import { mockNotifications, mockProviderProjects, mockProviderReviews, mockRequirements } from "@/lib/mock-data"
import type { Provider, Requirement, Notification, Project, Review } from "@/lib/types"
import { useState } from "react"
import { BrowseRequirements } from "@/components/provider/browse-requirements"

const ProjectInquiriesPage=()=>{
    const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null)
      const [showProposalForm, setShowProposalForm] = useState(false)
      const [provider, setProvider] = useState<Provider>({
          id: "1",
          name: "Jane Smith",
          email: "jane@sparkdev.com",
          subscriptionTier: "standard", // Changed from "basic" to "standard"
          isVerified: true,
          isFeatured: true,
          profileCompletion: 85,
          totalProjects: 47,
          activeProjects: 8,
          completedProjects: 39,
          totalEarnings: 125000,
          monthlyEarnings: 12500,
          rating: 4.9,
          responseTime: "2 hours",
          successRate: 98,
          minimumBudget: 500,
          hourlyRate: { min: 25, max: 150 },
        })
    const handleViewRequirementDetails = (requirementId: string) => {
        const requirement = mockRequirements.find((r) => r.id === requirementId)
        if (requirement) {
          setSelectedRequirement(requirement)
          // For now, just show the proposal form - later we can add a details modal
          setShowProposalForm(true)
        }
      }
      const handleProposalSubmit = (requirement: Requirement) => {
          // Placeholder for handleProposalSubmit logic
          console.log("Proposal submitted for requirement:", requirement.id)
          setShowProposalForm(false)
          setSelectedRequirement(null)
        }
    return(
      <div className="space-y-6">
            <div>
            <h1 className="text-3xl font-bold mb-2">Project Inquiries</h1>
            <p className="text-muted-foreground">Browse and respond to client requirements</p>
            </div>
            {/* REMOVED SubscriptionGate */}
            <BrowseRequirements
            requirements={mockRequirements}
            subscriptionTier={provider.subscriptionTier}
            onViewDetails={handleViewRequirementDetails}
            onSubmitProposal={handleProposalSubmit}
            />
        </div>
    )
}
export default ProjectInquiriesPage;