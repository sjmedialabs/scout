"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostRequirementForm } from "@/components/seeker/post-requirement-form";
import { RequirementList } from "@/components/seeker/requirement-list";
import { ProposalList } from "@/components/seeker/proposal-list";
import { RequirementDetailsModal } from "@/components/seeker/requirement-details-modal";
import { NegotiationChat } from "@/components/negotiation-chat";
import { FiltersPanel } from "@/components/filters-panel";
import { ProviderProfileModal } from "@/components/provider-profile-modal";
import { ProjectSubmissionForm } from "@/components/project-submission-form";
import { ReviewSubmissionForm } from "@/components/review-submission-form";
import { ProviderComparison } from "@/components/provider-comparison";
import { NotificationsWidget } from "@/components/seeker/notifications-widget";
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
  SquarePen,
} from "lucide-react";
import {
  mockRequirements,
  mockProposals,
  mockProviders,
} from "@/lib/mock-data";
import type {
  Requirement,
  Proposal,
  Provider,
  Notification,
} from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiCurrencyDollar } from "react-icons/hi2";
import { GoTag } from "react-icons/go";
import { CiCalendar } from "react-icons/ci";
import { FaArrowRightLong } from "react-icons/fa6";
import PdfUpload from "@/components/pdfUpload";
import { categories } from "@/lib/mock-data";
import { toast } from "@/lib/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authFetch } from "@/lib/auth-fetch";
import ServiceDropdown from "@/components/select-category-filter";
const statusOptions = [
  "All",
  "UnderReview",
  "NotApproved",
  "Open",
  "Closed",
  "shortlisted",
  "negotation",
  "Allocated",
];
import { useSearchParams } from "next/navigation";

const ProjectsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams=useSearchParams();
  const status=searchParams.get("status");
  // const [projects, setProjects] = useState([
  //   {
  //     id: "1",
  //     title: "E-commerce Website Development",
  //     description: "Modern responsive e-commerce platform with payment integration",
  //     budget: "$15,000 - $25,000",
  //     status: "In Progress",
  //     createdAt: "2024-01-15",
  //     proposalsCount: 12,
  //     category: "Web Development",
  //   },
  //   {
  //     id: "2",
  //     title: "Mobile App UI/UX Design",
  //     description: "Complete mobile app design for iOS and Android platforms",
  //     budget: "$8,000 - $12,000",
  //     status: "Planning",
  //     createdAt: "2024-01-20",
  //     proposalsCount: 8,
  //     category: "Design",
  //   },
  //   {
  //     id: "3",
  //     title: "Digital Marketing Campaign",
  //     description: "Comprehensive digital marketing strategy and execution",
  //     budget: "$5,000 - $10,000",
  //     status: "Completed",
  //     createdAt: "2024-01-10",
  //     proposalsCount: 15,
  //     category: "Marketing",
  //   },
  // ])

  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [searchTerm, setSearchTerm] = useState("");
const [selectedStatus, setSelectedStatus] = useState(
  status ? status[0].toUpperCase() + status.slice(1) : ""
);
const [selectedCategory, setSelectedCategory] = useState("");
const [startDate, setStartDate] = useState("");
const [startInputType, setStartInputType] = useState<"text" | "date">("text");
const [endDate, setEndDate] = useState("");
const [endInputType, setEndInputType] = useState<"text" | "date">("text");

  const [showCreateProject, setShowCreateProject] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    documentUrl: "",
    timeline: "",
  });

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
  title: "",
  content: "",
  rating: "",
  qualityRating: "",
  costRating: "",
  scheduleRating: "",
  willingToReferRating: "",
  projectStartDate: "",
  projectEndDate: "",
});

  const [reviewSubmissionProjectId, setReviewSubmissionProjectId] = useState<
    string | null
  >(null);

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  // const [filteredRequirements, setFilteredRequirements] = useState<
  //   Requirement[]
  // >([]);
  const [responseLoading, setResponseLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  //for sending the form staus
  const [sending, setSending] = useState(false);


  

  const loadData = async (userId: string) => {
    setResponseLoading(true);
    try {
      const response = await authFetch(`/api/requirements/${userId}`, {credentials: "include" });
      const data = await response.json();
      setRequirements(data.requirements);
      // setFilteredRequirements(data.requirements);

       

      setFailed(false);
    } catch (error) {
      setFailed(true);
      console.log("Failed to fetch the  data");
    } finally {
      setResponseLoading(false);
    }
  };
  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login");
    }
    if (!loading && user) {
      loadData(user.id);
    }
  }, [user, loading, router]);

  const handleCreateProject = () => {
    if (
      newProject.title &&
      newProject.description &&
      newProject.budget &&
      newProject.category
    ) {
      const project = {
        id: Date.now().toString(),
        ...newProject,
        status: "Planning",
        createdAt: new Date().toISOString().split("T")[0],
        proposalsCount: 0,
      };
      setProjects([...projects, project]);
      setNewProject({ title: "", description: "", budget: "", category: "" });
      setShowCreateProject(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.category ||
      !formData.description.trim() ||
      !formData.budgetMin ||
      !formData.budgetMax
    ) {
      toast.error("All Fields are required except document");
      return;
    }
    if (Number(formData.budgetMin) > Number(formData.budgetMax)) {
      toast.error("Minimum budget should be greater than the Maximum budget");
      return;
    }

    //Build correct payload for API
    const payload = {
      title: formData.title.trim(),
      image: formData.image,
      category: formData.category,
      description: formData.description.trim(),
      budgetMin: Number(formData.budgetMin),
      budgetMax: Number(formData.budgetMax),
      documentUrl: formData.documentUrl,
      timeline: formData.timeline.trim(),
    };
    try {
      setSending(true);
      // API CALL
      if (editingProject) {
        if(editingProject.status==="NotApproved"){
          payload.status = "UnderReview";
        }
        const res = await authFetch(`/api/requirements/${editingProject._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include" 
        });
        const data = await res.json();
        if (!res.ok) {
          toast.error("Failed to update the project");
        }
        toast.success("Updated the project successfully");
        setEditingProject(null);
        setFormData({
          title: "",
          image: "",
          description: "",
          category: "",
          budgetMin: "",
          budgetMax: "",
          documentUrl: "",
          timeline: "",
        });
        setShowCreateProject(false);
        setRequirements((prev) => [
          ...prev.filter((item) => item._id !== data.requirement._id),
          data.requirement,
        ]);
      } else {
        const res = await authFetch("/api/requirements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include" 
        });

        const data = await res.json();
        console.log("Requirement created:::", data);
        if (!res.ok) {
          toast.error("Failed to post the requirement");
        }
        toast.success("Requirement Posted successfully");

        setRequirements((prev) => [data.requirement, ...prev]);

        setFormData({
          title: "",
          image: "",
          description: "",
          category: "",
          budgetMin: "",
          budgetMax: "",
          documentUrl: "",
          timeline: "",
        });
        setShowCreateProject(false);
      }
    } catch (error) {
      console.error("Error posting requirement:", error);
      toast.error("Failed to post the requirement");
    } finally {
      setSending(false);
    }

    // console.log("Requirement submitted:", formData)
  };
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const projectTemp = requirements.find(
      (req) => req._id === reviewSubmissionProjectId,
    );
    if (!projectTemp) {
      toast.error("Invalid Project for review submission");
    }
    if (
  !reviewForm.content.trim() ||
  Number(reviewForm.rating) <= 0 ||
  Number(reviewForm.costRating) <= 0 ||
  Number(reviewForm.qualityRating) <= 0 ||
  Number(reviewForm.scheduleRating) <= 0 ||
  Number(reviewForm.willingToReferRating) <= 0
 
) {
  toast.error("All fields are required for review submission");
  return;
}

    //Build correct payload for API
    const payload = {
      content: reviewForm.content.trim(),
      rating: reviewForm.rating,
      costRating: reviewForm.costRating,
      qualityRating: reviewForm.qualityRating,
      scheduleRating: reviewForm.scheduleRating,
      willingToReferRating: reviewForm.willingToReferRating,
      
      providerId: projectTemp?.allocatedToId,
      projectId: projectTemp?._id,
    };
    try {
      // API CALL
      setSending(true);
      const res = await authFetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include" 
      });
      if (res.ok) {
        toast.success("Review submitted successfully");
        setShowReviewModal(false);
        setReviewForm({
          title: "",
          content: "",
          rating: "",
          qualityRating: "",
          costRating: "",
          scheduleRating: "",
          willingToReferRating: "",
          projectStartDate: "",
          projectEndDate: "",
        });

        window.location.reload();
      } else {
        toast.error("Failed to submit the review");
      }
    } catch (error) {
      console.log("Failed to submit the review");
      toast.error("Failed to submit the review");
    } finally {
      setSending(false);
    }

    console.log("Review submitted payload:", payload);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    if (project.status.toLowerCase() === "allocated") {
      toast.error("You cannot edit the project which is allocated to agency");
    } else {
      setFormData({
        title: project.title.trim(),
        image: project.image,
        category: project.category,
        description: project.description.trim(),
        budgetMin: Number(project.budgetMin),
        budgetMax: Number(project.budgetMax),
        documentUrl: project.documentUrl,
        timeline: project.timeline.trim(),
      });
      setShowCreateProject(true);
    }
  };
  console.log("Clicked Project for the edit:::", formData);
  const handleUpdateProject = () => {
    if (
      editingProject &&
      newProject.title &&
      newProject.description &&
      newProject.budget &&
      newProject.category
    ) {
      setProjects(
        projects.map((p) =>
          p.id === editingProject.id ? { ...p, ...newProject } : p,
        ),
      );
      setEditingProject(null);
      setNewProject({ title: "", description: "", budget: "", category: "" });
      setShowCreateProject(false);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
  };
  const getBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "notapproved":
        return "bg-red-500 text-[#fff]"
      case "underreview":
        return "bg-blue-500 text-[#fff]"
      case "open":
        return "bg-[#CFEED2] text-[#39761E]";
      case "shortlisted":
        return "bg-[#D2E4FF] text-[#1E82C1]";
      case "allocated":
        return "bg-[#1C96F4] text-[#fff]";
      case "negotiation":
        return "bg-[#FCF6E3] text-[#AF905D]";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
 
  const filteredRequirements = requirements.filter((project) => {

  //  Search Filter
  const matchesSearch =
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase());

  //  Status Filter
  const matchesStatus =
  !selectedStatus || 
  selectedStatus === "All" ||
  project.status.toLowerCase() === selectedStatus.toLowerCase();

  //  Category Filter
  const matchesCategory =
    !selectedCategory || project.category === selectedCategory;

  //  Date Filter
  const projectDate = new Date(project.createdAt);

  const matchesStartDate =
    !startDate || projectDate >= new Date(startDate);

  const matchesEndDate =
    !endDate || projectDate <= new Date(endDate);

  return (
    matchesSearch &&
    matchesStatus &&
    matchesCategory &&
    matchesStartDate &&
    matchesEndDate
  );
});

  const [currentPage, setCurrentPage] = useState(1);
const requirementsPerPage = 5; // 🔹 control this value

const totalPages = Math.ceil(
  (filteredRequirements?.length || 0) / requirementsPerPage
);

const startIndex = (currentPage - 1) * requirementsPerPage;
const paginatedRequirements = filteredRequirements?.slice(
  startIndex,
  startIndex + requirementsPerPage
);



  if (loading || responseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (failed) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-100">
        <h1 className="text-center font-semibold">
          Failed to Retrive the data
        </h1>
        <Button
          onClick={loadData}
          className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]"
        >
          Reload
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2 -mt-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center ">
        <div>
          <h1 className="text-xl font-bold text-[#182142]  leading-6">
            Projects
          </h1>
          <p className="text-md text-[#2e2f48] font-normal my-custom-class mt-0">
            Manage your projects and track progress
          </p>
        </div>
        <Button
          onClick={() => router.push("/client/dashboard/post-requirement")}
          className="bg-gradient-to-r from-[#6b6ee8] to-[#3c41c6] h-[35px] text-xs mt-2 md:mt-0 rounded-full "
        >
          <Plus className="h-4 w-4" />
          Add New Project
        </Button>
      </div>

      <div className="w-full bg-white border rounded-xl max-w-[96vw] overflow-x-auto mr-2 md:mr-0  mb-3">
        {/* search filters section*/}
        <div className="flex flex-row p-2 lg:p-0 lg:py-4 lg:px-1 xl:px-4 gap-1 xl:gap-3 items-center max-w-[96vw] lg:max-w-full overflow-x-auto">

          {/*  Search */}
          <div className="relative min-w-[150px] lg:min-w-0">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[35px] mt-0.5 placeholder:text-gray-300 placeholder:text-sm border border-[#D0D5DD] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/*  Status Filter */}
          <div className="min-w-[150px] lg:min-w-0">
          <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full h-[35px] border mt-0.5 border-[#D0D5DD] rounded-lg px-3 py-2 text-sm focus:outline-none ${
                !selectedStatus ? "text-gray-300" : "text-black"
              }`}
            >
              <option value="" disabled hidden>
                Select Status
              </option>

              {statusOptions.map((status) => (
                <option key={status} value={status} className="text-[#000]">
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="min-w-[150px] lg:min-w-0">
            <ServiceDropdown
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              triggerClassName="border -mt-0 border-[#D0D5DD] text-[#000000] rounded-lg p-2"
              triggerSpanClassName="text-[#98A0B4] text-sm"
            />
          </div>

          {/*  Start Date */}
          <div className="lg:min-w-0 ">
            <input
              type={startInputType}
              value={startDate}
              max={endDate}
              placeholder="Select start date"
              onFocus={() => setStartInputType("date")}
              onBlur={() => {
                if (!startDate) setStartInputType("text");
              }}
              onChange={(e) => setStartDate(e.target.value)}
              className="placeholder:text-gray-300 placeholder:text-sm w-[80px] xl:w-full -mt-0.5 h-[35px] border border-[#D0D5DD] rounded-lg p-2  text-sm focus:outline-none"
            />
          </div>

          {/*  End Date */}
          <div className=" lg:min-w-0">
            <input
              type={endInputType}
              value={endDate}
              min={startDate}
              placeholder="Select end date"
              onFocus={() => setEndInputType("date")}
              onBlur={() => {
                if (!endDate) setEndInputType("text");
              }}
              onChange={(e) => setEndDate(e.target.value)}
              className="placeholder:text-gray-300 placeholder:text-sm w-[80px] xl:w-full -mt-0.5 h-[35px] border border-[#D0D5DD] rounded-lg  p-2 text-sm focus:outline-none"
            />
          </div>

          <div>
            <Button className="bg-gradient-to-r from-[#6b6ee8] to-[#3c41c6] rounded-[8px] h-[30px] w-[60px] mt-0" onClick={()=>{
          setSearchTerm("");
         setSelectedStatus(""); // fixed
          setSelectedCategory("");
          setStartDate("");
          setStartInputType("text");
          setEndDate("");
          setEndInputType("text");
        }}>
          clear 
        </Button>
          </div>

        </div>
        {/* <Button className="bg-black rounded-[8px] h-[30px] w-[60px] mt-1" onClick={()=>{
          setSearchTerm("");
         setSelectedStatus(""); // fixed
          setSelectedCategory("");
          setStartDate("");
          setStartInputType("text");
          setEndDate("");
          setEndInputType("text");
        }}>
          clear 
        </Button> */}



        {/*projects table */}
        <div className="mt-3">
        {/* projects table */}
        {(filteredRequirements || []).length !== 0 ? (
          <>
            <div className="overflow-x-auto max-w-[96vw]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-100 text-sm text-gray-600">
                  <tr>
                    <th className="p-4">Created</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Budget</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Proposals</th>
                    <th className="p-4">Status</th>
                    
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedRequirements?.map((project) => (
                    <tr key={project._id} className="border-t text-sm">

                      {/* Created */}
                      <td className="p-4 text-xs">
                        {new Date(project.createdAt)
                          .toISOString()
                          .split("T")[0]}
                      </td>

                      {/* Title */}
                      <td className="p-4 text-xs font-semibold text-[#2C34A1]">
                        {project.title}
                      </td>

                      {/* Budget */}
                      <td className="p-4 text-xs">
                        $ {project.budgetMin} - $ {project.budgetMax}
                      </td>

                      {/* Category */}
                      <td className="p-4 text-xs">{project.category}</td>

                      {/* Proposals */}
                      <td className="p-4 text-xs">{project.proposals}</td>

                      {/* Status */}
                      <td className="p-4 text-xs">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${getBgColor(
                            project.status
                          )}`}
                        >
                          {project.status === "NotApproved"
                            ? "Rejected"
                            : project.status}
                        </span>
                      </td>

                      

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex gap-2 justify-center flex-wrap">

                          {/* 🔹 View Proposals */}
                          {project.status.toLowerCase() !== "closed" &&
                            project.status.toLowerCase() !== "completed" &&
                            project.status.toLowerCase() !== "underreview" && (
                              <div
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() =>
                                  router.push(
                                    `/client/dashboard/projects/${project._id}`
                                  )
                                }
                                
                              >
                                <Eye size={15} color="#000"/>
                              </div>
                            )}

                          {/* 🔹 Edit */}
                          {(project.status.toLowerCase() === "underreview" ||
                            project.status.toLowerCase() === "notapproved") && (
                            <div
                              
                              onClick={() => handleEditProject(project)}
                              className="flex items-center gap-1 cursor-pointer"
                            >
                              <SquarePen size={15} />
                            </div>
                          )}

                       

                          {/* 🔹 Submit Review */}
                          {(project.status.toLowerCase() === "closed" ||
                            project.status.toLowerCase() === "completed") &&
                            !project?.isReviewed && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setReviewSubmissionProjectId(project._id);
                                  setShowReviewModal(true);
                                }}
                                className="bg-gradient-to-r from-[#6b6ee8] to-[#3c41c6] h-[30px] w-[80px] rounded-[8px] text-white text-[10px]"
                              >
                                Submit Review
                              </Button>
                            )}
                        </div>

                        {/* Rejection Message */}
                        {project.status === "NotApproved" && (
                          <p className="text-[10px] text-red-500 mt-2">
                            {project?.notApprovedMsg}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-6 mb-4">

              {/* Prev Button */}
              <Button
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </Button>

              {/* Page Numbers */}
              <div className="flex flex-wrap items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.floor((currentPage - 1) / 9) * 9,
                    Math.floor((currentPage - 1) / 9) * 9 + 9
                  )
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[36px] h-[36px] px-3 rounded-md text-sm font-medium transition-all
                        ${
                          currentPage === page
                            ? "bg-[#4F46E5] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
              </div>

              {/* Next Button */}
              <Button
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center text-center py-10">
            <p className="text-lg text-[#656565] font-normal mb-4">
              No projects available
            </p>
          </div>
        )}
      </div>
        
      </div>
      

      {showCreateProject && (
        <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
          <DialogContent className=" md:max-w-xl rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#F4561C]">
                Create New Project
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-[#000]  text-[14px] font-bold"
                >
                  Project Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g., E-commerce Website Development"
                  required
                />
              </div>

              {/* Select Category */}

              {/* <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-[#000]  text-[14px] font-bold"
                >
                  Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger
                    className=" border-2 border-[#D0D5DD] rounded-[8px] data-[placeholder]:text-[#98A0B4] text-[#000]
                            "
                  >
                    <SelectValue
                      placeholder="Select a category"
                      style={{ color: "#98A0B4" }}
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

               <div className="space-y-2">
                    <Label
                      htmlFor="category"
                      className="text-[#000]  text-[14px] font-bold"
                    ></Label>

                    <ServiceDropdown
                    value={formData.category}
                      onChange={(value)=> setFormData((prev) => ({ ...prev, category: value }))}
                      triggerClassName="border-2 border-[#D0D5DD] rounded-[8px] data-[placeholder]:text-[#98A0B4] text-[#000]"
                       triggerSpanClassName = "p-5"
                    />
               </div>

              

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-[#000]  text-[14px] font-bold"
                >
                  Project Description
                </Label>
                <Textarea
                  id="description"
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Provide detailed information about your project requirements, goals, and expectations..."
                  rows={6}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="budgetMin"
                    className="text-[#000]  text-[14px] font-bold"
                  >
                    Budget Range (Min)
                  </Label>
                  <Input
                    id="budgetMin"
                    type="number"
                    value={formData.budgetMin}
                    className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        budgetMin: e.target.value,
                      }))
                    }
                    placeholder="1000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="budgetMax"
                    className="text-[#000]  text-[14px] font-bold"
                  >
                    Budget Range (Max)
                  </Label>
                  <Input
                    id="budgetMax"
                    type="number"
                    value={formData.budgetMax}
                    className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        budgetMax: e.target.value,
                      }))
                    }
                    placeholder="5000"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="timeline"
                  className="text-[#000]  text-[14px] font-bold"
                >
                  Expected Timeline
                </Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      timeline: e.target.value,
                    }))
                  }
                  placeholder="e.g., 3 months, 8 weeks"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#000]  text-[14px] font-bold">
                  Project Attachment (optional)
                </Label>
                <PdfUpload
                  maxSizeMB={10}
                  onUploadSuccess={(url) =>
                    setFormData((prev) => ({
                      ...prev,
                      documentUrl: url,
                    }))
                  }
                />
              </div>
              <div className="flex gap-4 pt-4">
                <DialogClose>
                  <Button className=" bg-[#000] hover:bg-[#000] active:bg-[#000] rounded-full">
                    Cancle
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="  bg-[#2C34A1] hover:bg-[#2C34A1] active:bg-[#2C34A1] rounded-full"
                  disabled={sending}
                >
                  {editingProject ? "Update" : "Post  Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/*Reviews Modal */}
      {showReviewModal && (
        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
          <DialogContent className="md:max-w-xl rounded-2xl h-[90vh] flex flex-col p-0">
            {/* ✅ FIXED HEADER */}
            <DialogHeader className="px-6 py-4 border-b shrink-0">
              <DialogTitle className="text-xl font-bold text-[#F4561C]">
                Submit Project Review
              </DialogTitle>
            </DialogHeader>

            {/* ✅ SCROLLABLE FORM FIELDS */}
            <form
              onSubmit={handleReviewSubmit}
              className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
            >
              {/* Title */}
              {/* <div className="space-y-2">
                <Label className="text-[#000] text-[14px] font-bold">
                  Title
                </Label>
                <Input
                  value={reviewForm.title}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="e.g., E-commerce Website Development"
                  required
                />
              </div> */}

              {/* Summary */}
              <div className="space-y-2">
                <Label className="text-[#000] text-[14px] font-bold">
                  Review Summary
                </Label>
                <Textarea
                  value={reviewForm.content}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  placeholder="Write your detailed review here..."
                  required
                />
              </div>

              {/* Ratings (unchanged UI) */}
              {[
                { label: "Rating 0/5", key: "rating" },
                { label: "Cost Rating 0/5", key: "costRating" },
                { label: "Quality Rating 0/5", key: "qualityRating" },
                {
                  label: "Willing To Refer Rating 0/5",
                  key: "willingToReferRating",
                },
                { label: "Schedule Rating 0/5", key: "scheduleRating" },
              ].map((item) => (
                <div className="space-y-2" key={item.key}>
                  <Label className="text-[#000] text-[14px] font-bold">
                    {item.label}
                  </Label>
                  <Input
                    type="number"
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={reviewForm[item.key] ?? ""}
                    className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-gray-400"
                     onChange={(e) => {
                          const value = e.target.value;

                          // Allow empty input
                          if (value === "") {
                            setReviewForm((prev) => ({
                              ...prev,
                              [item.key]: "",
                            }));
                            return;
                          }

                          let numberValue = parseFloat(value);

                          if (isNaN(numberValue)) return;
                          if (numberValue > 5) numberValue = 5;
                          if (numberValue < 0.1) numberValue = 0.1;

                          setReviewForm((prev) => ({
                            ...prev,
                            [item.key]: numberValue,
                          }));
                        }}
                      placeholder="Enter your rating"

                    required
                  />
                </div>
              ))}

              {/*  Start Date – Calendar Popover */}
              {/* <div className="space-y-2">
                <Label
                  htmlFor="startDate"
                  className="text-[#000] text-[14px] font-bold"
                >
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={reviewForm.projectStartDate}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      projectStartDate: e.target.value,
                    }))
                  }
                  required
                />
              </div> */}

              {/*  End Date – Calendar Popover */}
              {/* <div className="space-y-2">
                <Label
                  htmlFor="endDate"
                  className="text-[#000] text-[14px] font-bold"
                >
                  End Date
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={reviewForm.projectEndDate}
                  className="border-2 border-[#D0D5DD] rounded-[8px] placeholder:text-[#98A0B4]"
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      projectEndDate: e.target.value,
                    }))
                  }
                  min={reviewForm.projectStartDate} // prevents selecting earlier date
                  required
                />
              </div> */}
            </form>

            {/* ✅ FIXED FOOTER */}
            <div className="px-6 py-4 border-t flex gap-5 shrink-0">
              <Button
                type="submit"
                disabled={sending}
                onClick={handleReviewSubmit}
                className="bg-[#2C34A1] rounded-full"
              >
                {sending ? "Submitting..." : "Submit Review"}
              </Button>
              <DialogClose asChild>
                <Button className="bg-[#000] rounded-full">Cancel</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
export default ProjectsPage;
