"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Calendar,
  MessageSquare,
  Eye,
  Edit,
  X,
  Tag,
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import PdfUpload from "@/components/pdfUpload";
import  { ArrowLeft, File, MoveLeft,ChevronLeft,ChevronRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/lib/toast";
import { authFetch } from "@/lib/auth-fetch";

const ProjectsPage = () => {
  const [projectTab, setProjectTab] = useState<
    "active" | "completed" | "invitations"
  >("active");

  const [dynamicActiveProjects, setDynamicActiveProjects] = useState<any[]>([]);
  const [dynamicCompletedProjects, setDynamicCompletedProjects] = useState<
    any[]
  >([]);
  const { user, loading } = useAuth();
  const router = useRouter();

  const [resLoading, setResLoading] = useState<boolean>(false);
  const [failed, setFailed] = useState<boolean>(false);

  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [milestonesDraft, setMilestonesDraft] = useState<any[]>([]);
  const [newMilestone, setNewMilestone] = useState({
        title: "",
        description: "",
        deliverableDocuments: [],
      });
  const [updating, setUpdating] = useState(false);

  const ITEMS_PER_PAGE = 4;

const [activePage, setActivePage] = useState(1);
const [completedPage, setCompletedPage] = useState(1);

// Active Pagination
const totalActivePages = Math.ceil(
  dynamicActiveProjects.length / ITEMS_PER_PAGE
);

const paginatedActiveProjects = dynamicActiveProjects.slice(
  (activePage - 1) * ITEMS_PER_PAGE,
  activePage * ITEMS_PER_PAGE
);

// Completed Pagination
const totalCompletedPages = Math.ceil(
  dynamicCompletedProjects.length / ITEMS_PER_PAGE
);

const paginatedCompletedProjects = dynamicCompletedProjects.slice(
  (completedPage - 1) * ITEMS_PER_PAGE,
  completedPage * ITEMS_PER_PAGE
);

  const updateProgress = async () => {
    if (!selectedProject) return;

    try {
      setUpdating(true);

      console.log("----milestonesDraft---", milestonesDraft);

      const completedPercentage = calculateProgress(milestonesDraft || []);
      // Build payload dynamically
      const payload: any = {
        milestones: milestonesDraft,
      };

      // Only send status if project is 100% completed
      if (completedPercentage === 100) {
        payload.status = "completed";
      }

      console.log("----completedPercentage---", completedPercentage);

      const res = await authFetch(`/api/proposals/${selectedProject.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update progress");

      await loadData(); // refresh projects
      setIsProgressModalOpen(false);
      setSelectedProject(null);
      if (completedPercentage === 100) {
        toast.success("Project Completed successfully!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const calculateProgress = (milestones = []) => {
    if (!milestones.length) return 0;

    const completedCount = milestones.filter(
      (milestone) => milestone.completed === true,
    ).length;

    return Math.round((completedCount / milestones.length) * 100);
  };

  const loadData = async () => {
    // Fetch data or perform any necessary actions on component mount
    setResLoading(true);
    setFailed(false);
    try {
      const response = await authFetch("/api/proposals");
      if (!response.ok) {
        setFailed(true);
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      const filteredProjects = data.proposals.filter(
        (req: any) => req.status.toLowerCase() === "accepted",
      );
      console.log("Filtered Projects:", filteredProjects);

      setDynamicActiveProjects(filteredProjects);

      const filyteredCompletedProjects = data.proposals.filter(
        (req: any) => req.status.toLowerCase() === "completed",
      );

      setDynamicCompletedProjects(filyteredCompletedProjects);

      console.log("Filtered Completed Projects:", filyteredCompletedProjects);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setResLoading(false);
    }
  };
  useEffect(() => {
    if (!loading && (!user || user.role !== "agency")) {
      router.push("/login");
    }
    if (user && user.role === "agency") {
      loadData();
    }
  }, [user, loading, router]);


  const handleMessageClient=(recievedProject)=>{
    router.push(`/agency/dashboard/messages?clientId=${recievedProject?.clientId}&agencyId=${recievedProject?.agencyId}`)
  }
 const handleAddMilestone = () => {
  if (!newMilestone.title.trim()) {
    alert("Milestone title is required");
    return;
  }

  const milestone = {
    id: crypto.randomUUID(),   // add unique id
    title: newMilestone.title,
    description: newMilestone.description,
    completed: false,
    approvalStatus: "",
    deliverableDocuments: [...newMilestone.deliverableDocuments],
    isNew: true,
  };

  setMilestonesDraft((prev) => [...prev, milestone]);

  setNewMilestone({
    title: "",
    description: "",
    deliverableDocuments: [],
  });
};

const addMilestoneToProject = async () => {
  if (!selectedProject) return;

  if (!newMilestone.title.trim() || !newMilestone.description.trim()) {
    toast.error("Milestone title and description is required");
    return;
  }

  try {
    setUpdating(true);

    const updatedMilestones = [
      ...milestonesDraft,
      {
        title: newMilestone.title,
        description: newMilestone.description,
        deliverableDocuments: newMilestone.deliverableDocuments,
        completed: false,
        approvalStatus: "pending",
      },
    ];

    const payload = {
      milestones: updatedMilestones,
    };

    const res = await authFetch(`/api/proposals/${selectedProject.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to add milestone");

    toast.success("Milestone added successfully");

    setMilestonesDraft(updatedMilestones);

    setNewMilestone({
      title: "",
      description: "",
      deliverableDocuments: [],
    });

    setIsAddMilestoneOpen(false);

    await loadData();
  } catch (err) {
    console.error(err);
  } finally {
    setUpdating(false);
  }
};
  

  if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  console.log("Loaded Milesstone Draft is::::",milestonesDraft)

  return (
    <div className="space-y-3">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold text-orangeButton h-6 my-custom-class">
          My Projects
        </h1>
        <p className="text-gray-500 text-md my-custom-class">
          Manage your active projects and direct invitations
        </p>
      </div>

      {/* TABS */}
      <div className="inline-flex bg-[#e6edf5] rounded-full p-1 gap-1">
        {["active", "completed"].map((tab) => (
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
        <div>
          {dynamicActiveProjects.length !== 0 ? (
            <div>
                <div className="space-y-5 grid grid-cols-1 gap-4">
                    {paginatedActiveProjects.map((project) => (
                      <Card
                        key={project.id}
                        className="rounded-2xl h-[100%] p-1 shadow-sm transition hover:shadow-md bg-white"
                      >
                        <CardContent className="p-3">

                          {/* Top Section */}
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              {/* <div className="h-8 w-8 rounded-full bg-[#F54A0C] flex items-center justify-center text-white font-semibold text-md">
                                {project.requirement.title.charAt(0)}
                              </div> */}

                              <div>
                                <h3 className="font-semibold text-gray-800 text-base">
                                  {project.requirement.title}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {project.client.name} • {project.client.companyName}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                                project.status === "accepted"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-yellow-100 text-yellow-600"
                              }`}
                            >
                              {project.status === "accepted" ? "Active" : "Pending"}
                            </span>
                          </div>

                          {/* Divider */}
                          <div className="border-t border-gray-200 my-3" />

                          {/* Details Section */}
                          <div className="grid grid-cols-1 text-sm text-gray-600">
                            {/* Left Column */}
                            <div className="flex flex-row justify-between flex-wrap gap-2 items-center">

                              {/* Budget */}
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-[#F54A0C]">
                                  <DollarSign size={14} className="text-white" />
                                </div>
                                <span>
                                  ${project.proposedBudget.toLocaleString()}
                                </span>
                              </div>

                              {/* Timeline */}
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-[#F54A0C]">
                                  <Calendar size={14} className="text-white" />
                                </div>
                                <span>{project.proposedTimeline}</span>
                              </div>
                        

                            {/* Right Column */}
                        

                              {/* Milestones Count */}
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-[#F54A0C]">
                                  <Tag size={14} className="text-white" />
                                </div>
                                <span>{project.milestones.length} Milestones</span>
                              </div>

                              {/* Status Text */}
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-[#F54A0C]">
                                  <Clock size={14} className="text-white" />
                                </div>
                                <span className="capitalize">{project.status}</span>
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 my-3" />

                          {/* Progress */}
                          <div>
                            <div className="flex justify-end text-xs text-gray-500 mb-1">
                              <span>
                                {calculateProgress(project.milestones) || 0}% Complete
                              </span>
                            </div>

                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#6366F1] transition-all duration-500 rounded-full"
                                style={{
                                  width: `${calculateProgress(project.milestones) || 0}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Milestones Pills */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {project.milestones.map((m, i) => (
                              <span
                                key={i}
                                className={`px-4 py-1 rounded-full text-xs border ${
                                  m?.completed
                                    ? "bg-gray-100 text-gray-400"
                                    : "bg-white text-gray-900"
                                }`}
                              >
                                {m.title}
                              </span>
                            ))}
                          </div>

                          {/* Buttons */}
                          <div className="mt-4 flex flex-wrap gap-3">
                            <Button
                              className="btn-blackButton h-[30px]"
                              onClick={() => handleMessageClient(project)}
                            >
                              <MessageSquare className="h-3 w-3" />
                              Message Client
                            </Button>

                            <Button
                              variant="outline"
                              className="h-[30px] primary-button"
                              onClick={() =>
                                router.push(`/agency/dashboard/proposals/${project.id}`)
                              }
                            >
                              <Eye size={16} />
                              View Details
                            </Button>

                            <Button
                              variant="outline"
                              className="btn-blackButton h-[30px]"
                              onClick={() => {
                                setSelectedProject(project)
                                setMilestonesDraft(
                                  project.milestones.map((m: any) => ({
                                    title: m.title,
                                    description: m.description,
                                    amount: m.amount,
                                    duration: m.duration,
                                    completed: m.completed ?? false,
                                    approvalStatus: m.approvalStatus || "pending",
                                    deliverableUrl: m.deliverableUrl,
                                    deliverableDocuments: m.deliverableDocuments || [],
                                    id:m._id
                                  })),
                                )
                                setIsProgressModalOpen(true)
                              }}
                            >
                              <Edit className="h-3 w-3 " />
                              Update Progress
                            </Button>

                            <Button
                              variant="outline"
                              className="rounded-full h-[30px] w-[130px] text-xs bg-gray-200"
                              onClick={() => {
                                setSelectedProject(project);
                                setIsAddMilestoneOpen(true);
                              }}
                            >
                              + Add Milestone
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                 {isProgressModalOpen && selectedProject && (
                  <Dialog open={isProgressModalOpen} onOpenChange={setIsProgressModalOpen}>
                    <DialogContent className="sm:max-w-lg max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>Update Project Progress</DialogTitle>
                      </DialogHeader>

                      {/* Milestones */}
                      <div className="space-y-3 max-h-[300px] overflow-y-auto">
                        {milestonesDraft.map((m,index) => (
                          <div
                            key={m.id}
                            className="flex flex-col gap-2 border rounded-xl p-3"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-sm flex-1 ${
                                  m.completed ? "line-through text-gray-400" : ""
                                }`}
                              >
                                {m.title}
                              </span>

                              {!m.completed && m.approvalStatus !== "approved" && (
                                <div className="flex flex-col">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="rounded-full text-xs h-7"
                                    onClick={() => {
                                      setMilestonesDraft((prev) =>
                                        prev.map((milestone) =>
                                          milestone.id === m.id
                                            ? { ...milestone, approvalStatus: "waiting_approval" }
                                            : milestone
                                        )
                                      );
                                    }}
                                  >
                                    {m.approvalStatus === "waiting_approval"
                                      ? "Waiting approval"
                                      : "Seek approval"}
                                  </Button>

                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="rounded-full text-xs h-[25px] hover:bg-transparent hover:text-red-500 mt-2 border-red-400 text-red-500"
                                    onClick={() => {
                                      setMilestonesDraft((prev) =>
                                        prev.filter((milestone) => milestone.id !== m.id)
                                      );
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              )}
                            </div>

                            {(m.approvalStatus === "waiting_approval" ||
                              m.approvalStatus === "revision_requested") && (
                              <span className="text-xs text-[#667085]">
                                {m.approvalStatus === "revision_requested"
                                  ? "Client requested revision"
                                  : "Sent for client approval"}
                              </span>
                            )}

                            {!m.completed && (
                              <div className="ml-0 flex flex-col gap-1">
                                {m.deliverableDocuments.length > 0 && (
                                  <div className="flex flex-row items-center flex-wrap gap-2">
                                    {m.deliverableDocuments.map((url: string, i: number) => (
                                      <div
                                        key={i}
                                        className="flex items-center gap-2 bg-[#2F80ED] text-white text-xs px-3 py-1 rounded-md"
                                      >
                                        <a
                                          href={url}
                                          download
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1 max-w-[100px]"
                                        >
                                          <File className="h-3.5 w-3 text-white shrink-0" />

                                          <span className="truncate mt-0.5 text-xs">
                                            {url}
                                          </span>
                                        </a>

                                        <button
                                          type="button"
                                          className="ml-1 text-white cursor-pointer hover:text-gray-200"
                                          onClick={() => {
                                            setMilestonesDraft((prev) =>
                                              prev.map((milestone) =>
                                                milestone.id === m.id
                                                  ? {
                                                      ...milestone,
                                                      deliverableDocuments:
                                                        milestone.deliverableDocuments.filter(
                                                          (_: string, docIndex: number) =>
                                                            docIndex !== i
                                                        ),
                                                    }
                                                  : milestone
                                              )
                                            );
                                          }}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <label className="text-xs text-[#667085]">
                                  Deliverable Files (optional)
                                </label>

                                {/* Find this section inside milestonesDraft.map((m, index) => ... ) */}
                                <PdfUpload
                                // 1. Change key to use the index to ensure uniqueness during the render loop
                                key={`milestone-upload-${index}`} 
                                uploadId={`file-input-${m.id}`}
                                maxSizeMB={10}
                                placeholderText="Upload Deliverable Files"
                                onUploadSuccess={(url) => {
                                  // Log here to see which ID is being targeted at the MOMENT of success
                                  console.log("Updating milestone ID:", m.id, "with URL:", url);
                                  setMilestonesDraft((prev) =>
                                    prev.map((milestone, i) =>
                                      // 2. Use index (i) comparison instead of id (m.id)
                                      i === index
                                        ? {
                                            ...milestone,
                                            deliverableDocuments: [
                                              ...milestone.deliverableDocuments,
                                              url,
                                            ],
                                          }
                                        : milestone
                                    )
                                  );
                                }}
                                />
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Add New Milestone */}
                        {/* <div className="border rounded-xl p-3 mt-3 flex flex-col gap-2">
                          <span className="text-sm font-medium">Add New Milestone</span>

                          <input
                            type="text"
                            placeholder="Milestone Title"
                            maxLength={50}
                            value={newMilestone.title}
                            onChange={(e) =>
                              setNewMilestone({ ...newMilestone, title: e.target.value })
                            }
                            className="rounded-lg border border-[#E4E7EC] px-2 py-1.5 text-sm"
                          />

                          <div className="flex flex-col">
                            <textarea
                              placeholder="Milestone Description"
                              maxLength={50}
                              value={newMilestone.description}
                              onChange={(e) =>
                                setNewMilestone({
                                  ...newMilestone,
                                  description: e.target.value,
                                })
                              }
                              className="rounded-lg border border-[#E4E7EC] px-2 py-1.5 text-sm resize-none"
                            />

                            <span className="text-[11px] text-right text-gray-400 mt-1 ml-1">
                              {newMilestone.description.length}/50
                            </span>
                          </div>

                          {newMilestone.deliverableDocuments.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {newMilestone.deliverableDocuments.map((url, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 bg-[#2F80ED] text-white text-xs px-3 py-1 rounded-md"
                                >
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate max-w-[100px]"
                                  >
                                    {url}
                                  </a>

                                  <button
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={() => {
                                      const updated =
                                        newMilestone.deliverableDocuments.filter(
                                          (_, index) => index !== i
                                        );

                                      setNewMilestone({
                                        ...newMilestone,
                                        deliverableDocuments: updated,
                                      });
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <PdfUpload
                            key="new-milestone-upload"
                            maxSizeMB={10}
                            placeholderText="Upload Deliverable Files"
                            onUploadSuccess={(url) => {
                              setNewMilestone((prev) => ({
                                ...prev,
                                deliverableDocuments: [...prev.deliverableDocuments, url],
                              }));
                            }}
                          />

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="w-fit mt-1 rounded-full text-xs h-7"
                            onClick={handleAddMilestone}
                          >
                            Add Milestone
                          </Button>
                        </div> */}
                      </div>

                      <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setIsProgressModalOpen(false)}>
                          Cancel
                        </Button>

                        <Button
                          className="bg-[#2C34A1]"
                          disabled={updating}
                          onClick={updateProgress}
                        >
                          {updating ? "Updating..." : "Update Progress"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {
                  isAddMilestoneOpen && selectedProject &&(
                  <Dialog open={isAddMilestoneOpen} onOpenChange={setIsAddMilestoneOpen}>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Add New Milestone</DialogTitle>
                      </DialogHeader>

                      <div className="flex flex-col gap-3">

                        {/* Title */}
                        <input
                          type="text"
                          placeholder="Milestone Title"
                          value={newMilestone.title}
                          onChange={(e) =>
                            setNewMilestone({
                              ...newMilestone,
                              title: e.target.value,
                            })
                          }
                          className="rounded-lg border border-[#E4E7EC] px-3 py-2 text-sm"
                        />

                        {/* Description */}
                        <div className="flex flex-col">
                          <textarea
                            placeholder="Milestone Description"
                            maxLength={50}
                            value={newMilestone.description}
                            onChange={(e) =>
                              setNewMilestone({
                                ...newMilestone,
                                description: e.target.value,
                              })
                            }
                            className="rounded-lg border border-[#E4E7EC] px-3 py-2 text-sm resize-none"
                          />

                          <span className="text-[11px] text-right text-gray-400 mt-1 ml-1">
                            {newMilestone.description.length}/50
                          </span>
                        </div>

                        {/* Uploaded Docs */}
                        {newMilestone.deliverableDocuments.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {newMilestone.deliverableDocuments.map((url, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 bg-[#2F80ED] text-white text-xs px-3 py-1 rounded-md"
                              >
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="truncate max-w-[120px]"
                                >
                                  {url}
                                </a>

                                <button
                                  onClick={() =>
                                    setNewMilestone({
                                      ...newMilestoneData,
                                      deliverableDocuments:
                                        newMilestoneData.deliverableDocuments.filter(
                                          (_, index) => index !== i
                                        ),
                                    })
                                  }
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Upload */}
                        {/* <PdfUpload
                          maxSizeMB={10}
                          placeholderText="Upload Deliverable Files"
                          onUploadSuccess={(url) => {
                            setNewMilestone((prev) => ({
                              ...prev,
                              deliverableDocuments: [
                                ...prev.deliverableDocuments,
                                url,
                              ],
                            }));
                          }}
                        /> */}
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsAddMilestoneOpen(false)}
                          className="h-[30px] text-xs"
                        >
                          Cancel
                        </Button>

                        <Button
                          className="bg-[#2C34A1] h-[30px] text-xs"
                          onClick={addMilestoneToProject}
                          disabled={updating}
                          
                        >
                          {updating ? "Updating..." : "Add Milestone"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  )
                }
                </div>
                {/*pagination */}
              {totalActivePages > 1 && (
                <div className="sticky bottom-0 left-0 right-0 -mx-8 bg-white border-gray-500 py-2 mt-1 z-10 flex justify-center gap-2 border-t">
                  <button
                    disabled={activePage === 1}
                    onClick={() => setActivePage((p) => p - 1)}
                    className="px-3 py-1 rounded-md border text-sm disabled:opacity-40"
                  >
                    Prev
                  </button>

                  {[...Array(totalActivePages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePage(i + 1)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        activePage === i + 1
                          ? "bg-orangeButton text-white"
                          : "border"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={activePage === totalActivePages}
                    onClick={() => setActivePage((p) => p + 1)}
                    className="px-3 py-1 rounded-md border text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-gray-500 text-center text-[30px] my-15">
                No Active Projects
              </p>
            </div>
          )}{" "}
        </div>
      )}

      {/* ================= COMPLETED PROJECTS ================= */}
      {projectTab === "completed" && (
        <div>
          {dynamicCompletedProjects.length !== 0 ? (
            <div>
              <div className="space-y-5 grid grid-cols-1 gap-3">
                {paginatedCompletedProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="rounded-2xl h-[100%] p-3 shadow-sm transition hover:shadow-md bg-white"
                  >
                    <CardContent className="p-3">

                      {/* Top Section */}
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {/* <div className="h-8 w-8 rounded-full bg-[#F54A0C] flex items-center justify-center text-white font-semibold text-md">
                            {project.requirement.title.charAt(0)}
                          </div> */}

                          <div>
                            <h3 className="font-semibold text-gray-800 text-base">
                              {project.requirement.title}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {project.client.name} • {project.client.companyName}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                            
                              "bg-green-100 text-green-600"
                              
                          }`}
                        >
                        Completed
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 my-3" />

                      {/* Details Section */}
                      <div className="grid grid-cols-2 text-sm text-gray-600">
                        {/* Left Column */}
                        <div className="space-y-4 pr-4 border-r border-gray-200">

                          {/* Budget */}
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-[#F54A0C]">
                              <DollarSign size={14} className="text-white" />
                            </div>
                            <span>
                              ${project.proposedBudget.toLocaleString()}
                            </span>
                          </div>

                          {/* Timeline */}
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-[#F54A0C]">
                              <Calendar size={14} className="text-white" />
                            </div>
                            <span>{project.proposedTimeline}</span>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4 pl-4">

                          {/* Milestones Count */}
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-[#F54A0C]">
                              <Tag size={14} className="text-white" />
                            </div>
                            <span>{project.milestones.length} Milestones</span>
                          </div>

                          {/* Status Text */}
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-[#F54A0C]">
                              <Clock size={14} className="text-white" />
                            </div>
                            <span className="capitalize">{project.status}</span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 my-3" />

                      {/* Progress */}
                      <div>
                        <div className="flex justify-end text-xs text-gray-500 mb-1">
                          <span>
                            {calculateProgress(project.milestones) || 0}% Complete
                          </span>
                        </div>

                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#6366F1] transition-all duration-500 rounded-full"
                            style={{
                              width: `${calculateProgress(project.milestones) || 0}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Milestones Pills */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.milestones.map((m, i) => (
                          <span
                            key={i}
                            className={`px-4 py-1 rounded-full text-xs border ${
                              m?.completed
                                ? "bg-gray-100 text-gray-400"
                                : "bg-white text-gray-900"
                            }`}
                          >
                            {m.title}
                          </span>
                        ))}
                      </div>

                      {/* Buttons */}
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button
                          className="rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white h-[30px] w-[130px] text-xs"
                          onClick={() => handleMessageClient(project)}
                        >
                          <MessageSquare className="h-3 w-3" />
                          Message Client
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-full h-[30px] w-[120px] text-xs"
                          onClick={() =>
                            router.push(`/agency/dashboard/proposals/${project.id}`)
                          }
                        >
                          <Eye size={16} />
                          View Details
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-full h-[30px] w-[130px] text-xs"
                          onClick={() => {
                            setSelectedProject(project)
                            setMilestonesDraft(
                              project.milestones.map((m: any) => ({
                                ...m,
                                completed: m.completed ?? false,
                              })),
                            )
                            setIsProgressModalOpen(true)
                          }}
                        >
                          <Edit className="h-3 w-3 " />
                          Update Progress
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/*pagination */}
              {totalCompletedPages > 1 && (
                <div className="sticky bottom-0 left-0 right-0 -mx-8 bg-white border-gray-500 py-1 mt-2 z-10 flex justify-center gap-2 border-t">
                  <button
                    disabled={completedPage === 1}
                    onClick={() => setCompletedPage((p) => p - 1)}
                    className="px-3 py-1 rounded-md border text-sm disabled:opacity-40"
                  >
                    Prev
                  </button>

                  {[...Array(totalCompletedPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCompletedPage(i + 1)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        completedPage === i + 1
                          ? "bg-orangeButton text-white"
                          : "border"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={completedPage === totalCompletedPages}
                    onClick={() => setCompletedPage((p) => p + 1)}
                    className="px-3 py-1 rounded-md border text-sm disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
              </div>
          ) : (
            <div>
              <p className="text-gray-500 text-center text-[30px] my-15">
                {" "}
                No Completed Projects{" "}
              </p>
            </div>
          )}
        </div>
      )}

      
      
    </div>
  );
};

export default ProjectsPage;
