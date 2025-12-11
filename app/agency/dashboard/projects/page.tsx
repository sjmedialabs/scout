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

const ProjectsPage=()=>{
    const [projectTab, setProjectTab] = useState<"active" | "completed" | "invitations">("active");
    return(
     <div className="space-y-6">
        <div>
        <h1 className="text-3xl font-bold mb-2">My Projects</h1>
        <p className="text-muted-foreground">Manage your active projects and direct invitations</p>
        </div>

        <div className="flex gap-2">
        <Button
            variant={projectTab === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setProjectTab("active")}
        >
            Active Projects (3)
        </Button>
        <Button
            variant={projectTab === "completed" ? "default" : "outline"}
            size="sm"
            onClick={() => setProjectTab("completed")}
        >
            Completed Projects (12)
        </Button>
        <Button
            variant={projectTab === "invitations" ? "default" : "outline"}
            size="sm"
            onClick={() => setProjectTab("invitations")}
        >
            <Mail className="h-4 w-4 mr-2" />
            Project Invitations (8)
        </Button>
        </div>

        {projectTab === "invitations" && (
        <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Direct Project Invitations
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                    You have received 8 direct invitations from clients who are interested in working with your
                    agency. Review the project details and respond to invitations that match your expertise.
                </p>
                </div>
            </div>
            </div>

            {[
            {
                id: "inv-1",
                title: "Enterprise CRM System Development",
                client: "Robert Martinez",
                company: "TechCorp Industries",
                budget: { min: 50000, max: 75000 },
                invitedDate: "2024-02-10",
                deadline: "2024-02-20",
                category: "Web Development",
                description:
                "We're looking for an experienced agency to develop a custom CRM system with advanced analytics and reporting capabilities.",
                requirements: ["React/Node.js", "Database Design", "API Integration", "Cloud Deployment"],
                reason: "Your portfolio in enterprise solutions and 4.9 rating impressed us",
                status: "pending",
            },
            {
                id: "inv-2",
                title: "Brand Identity & Marketing Campaign",
                client: "Lisa Anderson",
                company: "GreenLeaf Organics",
                budget: { min: 15000, max: 20000 },
                invitedDate: "2024-02-12",
                deadline: "2024-02-22",
                category: "Marketing",
                description:
                "Complete brand refresh including logo design, brand guidelines, and a 3-month digital marketing campaign.",
                requirements: [
                "Brand Strategy",
                "Graphic Design",
                "Social Media Marketing",
                "Content Creation",
                ],
                reason: "Your work with sustainable brands aligns perfectly with our values",
                status: "pending",
            },
            {
                id: "inv-3",
                title: "Mobile Banking App UI/UX Redesign",
                client: "David Kim",
                company: "FinanceFirst Bank",
                budget: { min: 30000, max: 40000 },
                invitedDate: "2024-02-13",
                deadline: "2024-02-25",
                category: "Design",
                description:
                "Redesign our mobile banking app to improve user experience and modernize the interface.",
                requirements: ["Mobile UI/UX", "User Research", "Prototyping", "Accessibility"],
                reason: "Your fintech design expertise and user-centered approach",
                status: "pending",
            },
            {
                id: "inv-4",
                title: "E-Learning Platform Development",
                client: "Amanda White",
                company: "EduTech Solutions",
                budget: { min: 45000, max: 60000 },
                invitedDate: "2024-02-14",
                deadline: "2024-02-28",
                category: "Web Development",
                description:
                "Build a comprehensive e-learning platform with video streaming, assessments, and progress tracking.",
                requirements: [
                "Full-Stack Development",
                "Video Integration",
                "Payment Gateway",
                "LMS Features",
                ],
                reason: "Your experience with educational platforms",
                status: "pending",
            },
            {
                id: "inv-5",
                title: "AI-Powered Analytics Dashboard",
                client: "James Wilson",
                company: "DataInsights Pro",
                budget: { min: 35000, max: 50000 },
                invitedDate: "2024-02-15",
                deadline: "2024-03-01",
                category: "Web Development",
                description:
                "Develop an AI-powered analytics dashboard with real-time data visualization and predictive insights.",
                requirements: ["React/Python", "Data Visualization", "AI/ML Integration", "Real-time Updates"],
                reason: "Your AI integration projects showcase advanced capabilities",
                status: "pending",
            },
            {
                id: "inv-6",
                title: "Restaurant Chain Website & Ordering System",
                client: "Maria Garcia",
                company: "Bella Italia Restaurants",
                budget: { min: 25000, max: 35000 },
                invitedDate: "2024-02-16",
                deadline: "2024-03-05",
                category: "Web Development",
                description:
                "Multi-location restaurant website with online ordering, reservations, and loyalty program.",
                requirements: [
                "E-commerce",
                "Multi-location Support",
                "Payment Integration",
                "Mobile Responsive",
                ],
                reason: "Your restaurant industry portfolio",
                status: "pending",
            },
            {
                id: "inv-7",
                title: "Healthcare Patient Portal",
                client: "Dr. Thomas Brown",
                company: "HealthCare Plus Clinic",
                budget: { min: 40000, max: 55000 },
                invitedDate: "2024-02-17",
                deadline: "2024-03-10",
                category: "Web Development",
                description:
                "HIPAA-compliant patient portal with appointment scheduling, medical records, and telemedicine features.",
                requirements: ["HIPAA Compliance", "Security", "Video Integration", "EHR Integration"],
                reason: "Your healthcare compliance expertise",
                status: "pending",
            },
            {
                id: "inv-8",
                title: "Real Estate Marketplace Platform",
                client: "Jennifer Lee",
                company: "PropertyHub Realty",
                budget: { min: 55000, max: 70000 },
                invitedDate: "2024-02-18",
                deadline: "2024-03-15",
                category: "Web Development",
                description:
                "Comprehensive real estate marketplace with property listings, virtual tours, and agent management.",
                requirements: [
                "Full-Stack Development",
                "Map Integration",
                "Search & Filters",
                "CRM Integration",
                ],
                reason: "Your marketplace development experience",
                status: "pending",
            },
            ].map((invitation) => (
            <Card
                key={invitation.id}
                className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500"
            >
                <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        >
                        <Mail className="h-3 w-3 mr-1" />
                        Direct Invitation
                        </Badge>
                        <Badge variant="outline">{invitation.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{invitation.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                        {invitation.client} • {invitation.company}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />${invitation.budget.min.toLocaleString()} - $
                        {invitation.budget.max.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Respond by {new Date(invitation.deadline).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Invited {new Date(invitation.invitedDate).toLocaleDateString()}
                        </div>
                    </div>
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div>
                    <h4 className="text-sm font-medium mb-1">Project Description</h4>
                    <p className="text-sm text-muted-foreground">{invitation.description}</p>
                    </div>

                    <div>
                    <h4 className="text-sm font-medium mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {invitation.requirements.map((req, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                            {req}
                        </Badge>
                        ))}
                    </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                        <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                            Why you were invited
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">{invitation.reason}</p>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Proposal
                    </Button>
                    <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Details
                    </Button>
                    <Button variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Decline
                    </Button>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
        )}

        {/* Active Projects */}
        {projectTab === "active" && (
        <div className="space-y-4">
            {/* Active Projects List */}
            {[
            {
                id: "1",
                title: "E-commerce Website Development",
                client: "Sarah Johnson",
                company: "Fashion Forward LLC",
                budget: 8500,
                startDate: "2024-01-15",
                deadline: "2024-03-25",
                progress: 65,
                status: "active",
                milestones: [
                { name: "Requirements Analysis", completed: true },
                { name: "UI/UX Design", completed: true },
                { name: "Frontend Development", completed: false },
                { name: "Backend Integration", completed: false },
                { name: "Testing & Launch", completed: false },
                ],
            },
            {
                id: "2",
                title: "Digital Marketing Campaign",
                client: "Jennifer Davis",
                company: "CloudSync Solutions",
                budget: 2500,
                startDate: "2024-01-20",
                deadline: "2024-03-15",
                progress: 40,
                status: "active",
                milestones: [
                { name: "Strategy Development", completed: true },
                { name: "Content Creation", completed: false },
                { name: "Campaign Launch", completed: false },
                { name: "Performance Analysis", completed: false },
                ],
            },
            {
                id: "3",
                title: "Mobile App UI/UX Design",
                client: "Mike Chen",
                company: "FitLife Technologies",
                budget: 3500,
                startDate: "2024-01-25",
                deadline: "2024-03-01",
                progress: 80,
                status: "active",
                milestones: [
                { name: "User Research", completed: true },
                { name: "Wireframes", completed: true },
                { name: "UI Design", completed: true },
                { name: "Prototyping", completed: false },
                { name: "Final Delivery", completed: false },
                ],
            },
            ].map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                        {project.client} • {project.company}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />${project.budget.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due {new Date(project.deadline).toLocaleDateString()}
                        </div>
                    </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                    <Badge variant="default">Active</Badge>
                    <div className="text-sm font-medium">{project.progress}% Complete</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="w-full bg-muted rounded-full h-2">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                    />
                    </div>
                </div>

                {/* Milestones */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Milestones</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {project.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                            className={`w-3 h-3 rounded-full ${
                            milestone.completed ? "bg-green-500" : "bg-gray-300"
                            }`}
                        />
                        <span className={milestone.completed ? "line-through text-muted-foreground" : ""}>
                            {milestone.name}
                        </span>
                        </div>
                    ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Client
                    </Button>
                    <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                    </Button>
                    <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Update Progress
                    </Button>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
        )}

        {projectTab === "completed" && (
        <div className="space-y-4">
            <p className="text-center text-muted-foreground py-8">
            You have 12 completed projects. View your project history and client feedback.
            </p>
        </div>
        )}
    </div>
    )
}
export default ProjectsPage;