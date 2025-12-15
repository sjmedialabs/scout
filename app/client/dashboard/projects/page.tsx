
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
const ProjectsPage=()=>{
    const { user, loading } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState([
    {
      id: "1",
      title: "E-commerce Website Development",
      description: "Modern responsive e-commerce platform with payment integration",
      budget: "$15,000 - $25,000",
      status: "In Progress",
      createdAt: "2024-01-15",
      proposalsCount: 12,
      category: "Web Development",
    },
    {
      id: "2",
      title: "Mobile App UI/UX Design",
      description: "Complete mobile app design for iOS and Android platforms",
      budget: "$8,000 - $12,000",
      status: "Planning",
      createdAt: "2024-01-20",
      proposalsCount: 8,
      category: "Design",
    },
    {
      id: "3",
      title: "Digital Marketing Campaign",
      description: "Comprehensive digital marketing strategy and execution",
      budget: "$5,000 - $10,000",
      status: "Completed",
      createdAt: "2024-01-10",
      proposalsCount: 15,
      category: "Marketing",
    },
  ])

  const [showCreateProject, setShowCreateProject] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    budget: "",
    category: "",
  })

  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login")
    }
  }, [user, loading, router])

  
    const handleCreateProject = () => {
    if (newProject.title && newProject.description && newProject.budget && newProject.category) {
      const project = {
        id: Date.now().toString(),
        ...newProject,
        status: "Planning",
        createdAt: new Date().toISOString().split("T")[0],
        proposalsCount: 0,
      }
      setProjects([...projects, project])
      setNewProject({ title: "", description: "", budget: "", category: "" })
      setShowCreateProject(false)
    }
  }

  const handleEditProject = (project: any) => {
    setEditingProject(project)
    setNewProject({
      title: project.title,
      description: project.description,
      budget: project.budget,
      category: project.category,
    })
    setShowCreateProject(true)
  }

  const handleUpdateProject = () => {
    if (editingProject && newProject.title && newProject.description && newProject.budget && newProject.category) {
      setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...newProject } : p)))
      setEditingProject(null)
      setNewProject({ title: "", description: "", budget: "", category: "" })
      setShowCreateProject(false)
    }
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
  }
    return(
       <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Projects</h1>
                <p className="text-muted-foreground">Manage your projects and track progress</p>
              </div>
              <Button onClick={() => setShowCreateProject(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>

            <div className="grid gap-6">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-muted-foreground mb-3">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Budget: {project.budget}</span>
                          <span>Category: {project.category}</span>
                          <span>Created: {project.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            project.status === "Completed"
                              ? "default"
                              : project.status === "In Progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {project.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteProject(project.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{project.proposalsCount} proposals received</span>
                      <Button variant="outline" size="sm" onClick={() => handleViewProjectProposals(project.id)}>
                        View Proposals
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {showCreateProject && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md mx-4">
                  <CardHeader>
                    <CardTitle>{editingProject ? "Edit Project" : "Create New Project"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Project Title</label>
                      <Input
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        placeholder="Enter project title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <textarea
                        className="w-full p-2 border rounded-md resize-none"
                        rows={3}
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="Describe your project"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Budget Range</label>
                      <Input
                        value={newProject.budget}
                        onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                        placeholder="e.g., $5,000 - $10,000"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={newProject.category}
                        onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      >
                        <option value="">Select category</option>
                        <option value="Web Development">Web Development</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Business Services">Business Services</option>
                      </select>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowCreateProject(false)
                        setEditingProject(null)
                        setNewProject({ title: "", description: "", budget: "", category: "" })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={editingProject ? handleUpdateProject : handleCreateProject}>
                      {editingProject ? "Update" : "Create"} Project
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
    )
}
export default ProjectsPage;