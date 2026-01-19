"use client"

import { useState } from "react"
import {Card,CardContent} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  Calendar,
  MessageSquare,
  Eye,
  Edit,
} from "lucide-react"

const ProjectsPage = () => {
  const [projectTab, setProjectTab] = useState<
    "active" | "completed" | "invitations"
  >("active")


  /* =================  ACTIVE PROJECTS ================= */
  const projects = [
    {
      id: "1",
      title: "E-commerce Website Development",
      client: "Sarah Johnson",
      company: "Fashion Forward LLC",
      budget: 8500,
      dueDate: "2024-03-25",
      progress: 65,
      status: "Active",
      milestones: [
        { name: "Requirements Analysis", completed: true },
        { name: "UI/UX Design", completed: true },
        { name: "Frontend Development", completed: true },
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
      dueDate: "2024-03-15",
      progress: 40,
      status: "Active",
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
      dueDate: "2024-03-01",
      progress: 80,
      status: "Active",
      milestones: [
        { name: "User Research", completed: true },
        { name: "Wireframes", completed: true },
        { name: "UI Design", completed: true },
        { name: "Prototyping", completed: false },
        { name: "Final Delivery", completed: false },
      ],
    },
  ]

   /* ================= COMPLETED PROJECTS ================= */
  const completedProjects = [
    {
      id: "c1",
      title: "E-commerce Website Development",
      client: "Sarah Johnson",
      company: "Fashion Forward LLC",
      budget: 8500,
      completedDate: "2024-03-15",
      milestones: [
        "Requirements Analysis",
        "UI/UX Design",
        "Frontend Development",
        "Backend Integration",
        "Testing & Launch",
      ],
    },
  ]

   /* ================= PROJECT INVITATIONS ================= */
  const invitations = [
    {
      id: "i1",
      title: "Enterprise CRM System Development",
      client: "Robert Martinez",
      company: "TechCorp Industries",
      budgetMin: 50000,
      budgetMax: 75000,
      respondBy: "2024-02-20",
      invitedOn: "2024-02-10",
      category: "Web Development",
      description:
        "We're looking for an experienced agency to develop a custom CRM system with advanced analytics and reporting capabilities.",
      skills: ["React/Node.js", "Database Design", "API Integration", "Cloud Deployment"],
      reason:
        "Your portfolio in enterprise solutions and 4.9 rating impressed us",
    },
  ]

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-[26px] font-bold text-orangeButton h-8 my-custom-class">
          My Projects
        </h1>
        <p className="text-gray-500 text-[18px] my-custom-class">
          Manage your active projects and direct invitations
        </p>
      </div>

      {/* TABS */}
      <div className="inline-flex bg-[#e6edf5] rounded-full p-1 gap-1">
        {["active", "completed", "invitations"].map((tab) => (
          <button
            key={tab}
            onClick={() => setProjectTab(tab as any)}
            className={`px-4 py-2 text-sm rounded-full transition ${
              projectTab === tab
                ? "bg-orangeButton text-white my-custom-class"
                : "text-gray-700 my-custom-class"
            }`}
          >
            {tab === "active"
              ? "Active Projects"
              : tab === "completed"
              ? "Completed Projects"
              : "Project invitations"}
          </button>
        ))}
      </div>

      {/* ACTIVE PROJECTS */}
      {projectTab === "active" && (
        <div className="space-y-5">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="rounded-[28px] border border-gray-200 bg-white"
            >
              <CardContent className="p-6 space-y-4">
                {/* TOP */}
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  <div>
                    <h3 className="text-[20px] font-extrabold text-blueButton">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {project.client} • {project.company}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 mt-4">
                    {/* Budget */}
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-orangeButton flex items-center justify-center">
                        <DollarSign className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-[13px] font-semibold text-black">
                        ${project.budget.toLocaleString()}
                        </span>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-orangeButton flex items-center justify-center">
                        <Calendar className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-[13px] font-semibold text-black">
                        Due {new Date(project.dueDate).toLocaleDateString("en-GB")}
                        </span>
                    </div>
                    </div>

                  </div>

                  <Badge className="bg-green-500 text-white px-4 py-1 rounded-full h-fit">
                    {project.status}
                  </Badge>
                </div>

                {/* PROGRESS */}
                <div>
                  <div className="flex justify-between h-5 text-sm mb-1">
                    <span></span>
                    <span>{project.progress}% Complete</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* MILESTONES */}
                <div>
                  <h4 className="font-bold mb-2">Milestones</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.milestones.map((m, i) => (
                      <span
                        key={i}
                        className={`px-4 py-1 rounded-full text-sm border ${
                          m.completed
                            ? "bg-gray-100 text-gray-400"
                            : "bg-white text-gray-900"
                        }`}
                      >
                        {m.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-full bg-[#2C34A1]">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Client
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View details
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ================= COMPLETED PROJECTS ================= */}
      {projectTab === "completed" && (
        <div className="space-y-5">
          <p className="font-medium h-3 pl-6">
            You have {completedProjects.length} completed projects.
          </p>

          {completedProjects.map((project) => (
            <Card key={project.id} className="rounded-[28px] border-gray-200 bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-[20px] font-extrabold text-blueButton">
                      {project.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {project.client} • {project.company}
                    </p>

                    {/* <div className="flex gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-orangeButton" />
                        ${project.budget.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orangeButton" />
                        Completed{" "}
                        {new Date(project.completedDate).toLocaleDateString("en-GB")}
                      </div>
                    </div> */}

                    <div className="flex flex-wrap items-center gap-6 mt-4">
                    {/* Budget */}
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-orangeButton flex items-center justify-center">
                        <DollarSign className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-[13px] font-semibold text-black">
                        ${project.budget.toLocaleString()}
                        </span>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-orangeButton flex items-center justify-center">
                        <Calendar className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-[13px] font-semibold text-black">
                        Due {new Date(project.completedDate).toLocaleDateString("en-GB")}
                        </span>
                    </div>
                    </div>
                  </div>

                  <Badge className="bg-green-500 text-white px-4 py-1 rounded-full h-fit">
                    Completed
                  </Badge>
                </div>

                <div>
                  <div className="flex justify-end text-sm mb-1">
                    100% Complete
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-500 w-full rounded-full" />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Milestones</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.milestones.map((m, i) => (
                      <span
                        key={i}
                        className="px-4 py-1 rounded-full text-sm bg-gray-100 text-gray-400 border"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-full bg-[#2C34A1]">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Client
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-full"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View details
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ================= PROJECT INVITATIONS ================= */}
      {projectTab === "invitations" && (
        <div className="space-y-6">
          <div className="bg-[#eaf6ff] rounded-3xl p-5">
            <h3 className="text-[20px] font-medium text-blueButton">
              Direct Project Invitations
            </h3>
            <p className="text-blueButton text-sm">
              You have received {invitations.length} direct invitations from clients who are interested in working with your agency. Review the project details and respond to invitations that match your expertise..
            </p>
          </div>

          {invitations.map((inv) => (
            <Card key={inv.id} className="rounded-[28px] border bg-white">
              <CardContent className="p-6 pt-0 space-y-5">
                <div className="flex gap-4">
                  <Badge className="bg-[#b3deff] text-blueButton rounded-full">
                    ✉ Direct Invitation
                  </Badge>
                  <Badge 
                  className="rounded-full text-black"
                  variant="outline">{inv.category}</Badge>
                </div>

                <h3 className="text-[22px] h-2 font-extrabold text-blueButton">
                  {inv.title}
                </h3>
                <p className="text-gray-500">
                  {inv.client} • {inv.company}
                </p>

                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-orangeButton" />
                    ${inv.budgetMin.toLocaleString()} – $
                    {inv.budgetMax.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="text-orangeButton" />
                    Respond by{" "}
                    {new Date(inv.respondBy).toLocaleDateString("en-GB")}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold">Project Description</h4>
                  <p className="text-gray-600">{inv.description}</p>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {inv.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-4 py-1 rounded-full border text-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#eaf4ff] rounded-xl p-4">
                  <h4 className="font-bold text-blueButton">
                    Why you were invited
                  </h4>
                  <p className="text-blue-700">{inv.reason}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="rounded-full bg-[#2C34A1]">
                    Submit Proposal
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    View full details
                  </Button>
                  <Button className="rounded-full bg-red-500 text-white">
                    Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectsPage
