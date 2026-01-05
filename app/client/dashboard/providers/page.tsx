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
  Search
} from "lucide-react"
import { mockRequirements, mockProposals, mockProviders } from "@/lib/mock-data"
import type { Requirement, Proposal, Provider, Notification } from "@/lib/types"
import Link from "next/link"
import RatingStars from "@/components/rating-star"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CiCalendar } from "react-icons/ci";
import { Content } from "next/font/google"
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaArrowRightLong, FaS } from "react-icons/fa6";
import { MdMailOutline } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
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

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    id: "overview",
    label: "OVERVIEW",
    icon: Home,
    children: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "profile", label: "Profile", icon: User },
      { id: "requirements", label: "My Requirements", icon: FileText },
      { id: "proposals", label: "Proposals", icon: MessageSquare },
      { id: "projects", label: "Projects", icon: Briefcase },
      { id: "providers", label: "Find Agencies", icon: Users },
    ],
  },
  {
    id: "performance",
    label: "PERFORMANCE",
    icon: BarChart3,
    children: [
      { id: "analytics", label: "Project Analytics", icon: TrendingUp },
      { id: "spending", label: "Spending Insights", icon: Eye },
      { id: "provider-comparison", label: "Provider Comparison", icon: GitCompare },
    ],
  },
  {
    id: "account-settings",
    label: "ACCOUNT & SETTINGS",
    icon: Settings,
    children: [
      { id: "billing", label: "Billing & Payments", icon: CreditCard },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "account-settings", label: "Account Settings", icon: Shield },
    ],
  },
]

const ClientProvidersPage=()=>{
    const { user, loading } = useAuth()
      const router = useRouter()
      // const [locationFilter, setLocationFilter] = useState("")
      const [technologyFilter, setTechnologyFilter] = useState("")
      const[selectedProvider,setSelectedProvider]=useState()
      // const [ratingFilter, setRatingFilter] = useState("")

      //filters functions
        const[searchFilter,setSearchFilter]=useState("");
  const[serviceFilter,setServiceFilter]=useState("");
  const[locationFilter,setLocationFilter]=useState("");
  const[ratingFilter,setRatingFilter]=useState("");
  const[filteredData,setFilteredData]=useState([]);
  const[providersData,setProvidersData]=useState([])
  const[responseLoading,setResponseLoading]=useState(true)
  const[Failed,setFailed]=useState(false)
  const[dialogOpen,setDialogOpen]=useState(false)

  //contact provider functions
  const[showContactProviderDialog,setShowContactProviderDialog]=useState(false)
  const[contactProviderForm,setContactProviderForm]=useState({
    name:"",
    email:"",
    message:"",
    intrestedIn:"",
  })
  const[contactProviderData,setContactProviderData]=useState();
  const[sendingFormResponse,setSendigFormResponse]=useState(false);
  const[formResponseMessage,setFormResponseMessage]=useState({});

  
  useEffect(()=>{
    loadData();
  },[])
  console.log("Providers Datat::::::::::",providersData)
  const loadData=async()=>{
    setResponseLoading(true)
    setFailed(false)
     try{
         const response=await fetch("/api/providers");
         const data=await response.json();
         console.log("Fetched  Data:::",data)
         setProvidersData(data.providers)
         setFilteredData(data.providers)
         setFailed(false)
     }catch(error){
      console.log("Failded To retrive the data:::",error)
      setFailed(true);
     }
     finally{
      setResponseLoading(false)
     }
  }

  const searchHandle=()=>{
    console.log("Search Filter:::",searchFilter);
    console.log("Service Filter::",serviceFilter);
    console.log("Location Filter:::",locationFilter);
    let tempFilteredData=providersData;
    if(searchFilter.trim()!=""){
      tempFilteredData= tempFilteredData.filter((item) =>
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
  
      item.location.toLowerCase().includes(searchFilter.toLowerCase())
    );
    }
    if (serviceFilter !== "all") {
    tempFilteredData = tempFilteredData.filter((eachItem) =>
      eachItem.services.some((service) =>
        service.toLowerCase().includes(serviceFilter.toLowerCase())
      )
    );
    }
    if(locationFilter !="all"){
      tempFilteredData=tempFilteredData.filter((eachItem)=>eachItem.location.toLocaleLowerCase().includes(locationFilter.toLocaleLowerCase()));
    }
    setFilteredData(tempFilteredData);
  }
  const handleHighestRating=(value:any)=>{
    let sortedData = [...filteredData]; // avoid mutating original array

  switch (value) {

    case "low-high":
      sortedData.sort((a, b) => parseInt(a.rating) - parseInt(b.rating));
      break;

    case "high-low":
      sortedData.sort((a, b) => parseInt(b.rating) - parseInt(a.rating));
      break;

    default:
      return filteredData; // no sorting applied
  }

    setFilteredData(sortedData);
  }

      //end
    
      useEffect(() => {
        if (!loading && (!user || user.role !== "client")) {
          router.push("/login")
        }
      }, [user, loading, router])
  
      const handleViewProvider = (providerId: string) => {
        const provider = providersData.find((p) => p.id === providerId)
        if (provider) {
          setSelectedProvider(provider)
          setDialogOpen(true)
        }
      }
    
      const handleContactProvider = (providerId: string) => {
        console.log("Contacting provider:", providerId)
        // In real app, this would open a contact form or chat
         const provider = providersData.find((p) => p.id === providerId)
        if (provider) {
          setContactProviderData(provider)
          setFormResponseMessage({})
          setShowContactProviderDialog(true)
          
        }
        
        
      }
    
     
     const clearFilters = () => {
    setLocationFilter("")
    setTechnologyFilter("")
    setRatingFilter("")
  }
   const filteredProviders = mockProviders.filter((provider) => {
      const matchesLocation = !locationFilter || provider.location.toLowerCase().includes(locationFilter.toLowerCase())
      const matchesTechnology =
        !technologyFilter ||
        provider.services.some((service) => service.toLowerCase().includes(technologyFilter.toLowerCase()))
      const matchesRating = !ratingFilter || provider.rating >= Number.parseFloat(ratingFilter)
  
      return matchesLocation && matchesTechnology && matchesRating
    })
  
    const handleFormSubmit=async(e)=>{
        e.preventDefault()
        console.log("Form Submit::::",contactProviderForm);
        if(!contactProviderForm.name || !contactProviderForm.email || !contactProviderForm.message || !contactProviderForm.intrestedIn){
          setFormResponseMessage({status:"failed",value:"Required all fileds"})
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contactProviderForm.email)) {
          setFormResponseMessage({
            status: "failed",
            value: "Invalid email",
          })
        }
        const payload={
          ...contactProviderForm,
          agencyId:contactProviderData.userId
        }

        try{
          setSendigFormResponse(true)
          const res=await fetch("/api/contactprovider",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(payload)
          })
          const data=await res.json()
          console.log("POsst form response",data)
          if(res.ok){
            setContactProviderForm({
             name:"",
              email:"",
              message:"",
              intrestedIn:"",
            })
            setFormResponseMessage({status:"success",value:"submitted form successfully"})

          }

        }catch(error){

        }finally{
          setSendigFormResponse(false)
        }
    }
    return(
          <div className="space-y-6 p-2 md:p-6">
            <div>
                <h1 className="text-4xl font-bold text-[#F4561C] my-custom-class tracking-tight">Find Agencies</h1>
                <p className="text-lg font-light text-[#656565] my-custom-class tracking-tight">Browse and connect with verified agencies</p>
            </div>

            <div className="max-w-7xl mx-auto text-center ">
                {/* Header */}
                {/* <div className="mb-8 px-2 sm:px-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#F54A0C] pt-6 sm:pt-10 mb-2">{bannerData.title}</h1>
                  <p className="text-sm sm:text-base md:text-lg text-[#b2b2b2] leading-sung px-3 sm:px-0">{bannerData.description}</p>
                </div> */}

                {/* Filters */}
                <Card className="mb-8 text-center rounded-3xl shadow-md sm:shadow-lg">
                  <CardContent className="pt-6 pb-6 px-4 sm:px-6 md:px-9">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">

                      {/* Search Input */}
                      <div className="relative w-full min-w-0">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search providers..."
                          className="
                            pl-10 w-full text-sm md:text-base
                            border-0 border-b-2 border-b-[#b2b2b2]
                            bg-transparent rounded-none shadow-none
                            focus:outline-none focus:ring-0 focus:ring-offset-0
                            focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0
                            focus:border-[#F54A0C]
                          "
                          onChange={(e) => setSearchFilter(e.target.value)}
                        />
                      </div>

                      <div className="w-full min-w-0">
                        <Select onValueChange={(value)=>setServiceFilter(value)}>
                          <SelectTrigger
                            className="
                              mt-1
                              border-0
                              border-b-2
                              border-b-[#b2b2b2]
                              rounded-none
                              shadow-none
                              focus:outline-none focus:ring-0 focus:ring-offset-0
                              focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0
                              focus:border-[#b2b2b2]
                              placeholder:text-[#b2b2b2]
                              px-0
                              w-full
                              h-12
                              text-sm
                              md:text-base
                            "
                          >
                            <SelectValue placeholder="Service Category" className="text-[#b2b2b2]"/>
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="all">All Services</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                          </SelectContent>
                        </Select>
                        </div>

                      <div className="w-full min-w-0">
                        <Select onValueChange={handleHighestRating}>
                      <SelectTrigger
                        className="
                              mt-1
                              border-0
                              border-b-2
                              border-b-[#b2b2b2]
                              rounded-none
                              shadow-none
                              focus:outline-none focus:ring-0 focus:ring-offset-0
                              focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0
                              focus:border-[#b2b2b2]
                              placeholder:text-[#b2b2b2]
                              px-0
                              w-full
                              h-12
                              text-sm
                              md:text-base
                            "
                      >
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>

                      <SelectContent>
                        
                        <SelectItem value="low-high">Rating: Low to High</SelectItem>
                        <SelectItem value="high-low">Rating: High to Low</SelectItem>
                      </SelectContent>
                    </Select>

                      </div>
                       

                      <div className="w-full min-w-0">
                      <Button className="w-full sm:w-[150px] lg:w-[120px] h-10 mt-2 lg:mt-1
                        rounded-3xl bg-[#F54A0C] text-white
                        hover:bg-[#d93f0b] transition-all duration-300" onClick={searchHandle}>
                            Search Now
                      </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>
   
            {/* Dialog content */}

           {
            dialogOpen && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="
                  sm:max-w-[425px]
                  overflow-y-auto
                  max-h-[90%]
                  rounded-2xl
                  [&_[aria-label='Close']]:hidden
                  [&::-webkit-scrollbar]:hidden
                ">
                   {/* Custom Close Icon */}
                  {/* <DialogClose asChild>
                    <button
                      className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-100"
                    >
                      <IoIosCloseCircleOutline className="h-6 w-6 text-red-600" />
                    </button>
                  </DialogClose> */}
                 <div className="flex justify-between items-start">
                  <div>
                   <h1 className="text-xl text-[#F4561C] font-bold my-custom-class">{selectedProvider.name}</h1>
                   <p className="text-sm text-[#939191] -mt-0.5 font-normal">{selectedProvider.tagline}</p>
                   <div className="flex justify-start gap-2">
                    <RatingStars rating={selectedProvider.rating}/>
                   <span className="text-md font-bold text-[#000] font-normal">{selectedProvider.rating}</span>
                   </div>
                   {/* Badges */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mt-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedProvider.isVerified && (
                          <Badge className="bg-[#2C34A1] text-white h-7 px-3 rounded-2xl">Verified</Badge>
                        )}
                        {selectedProvider.isFeatured && (
                          <Badge className="bg-[#000] text-white h-7 px-3 rounded-2xl">Featured</Badge>
                        )}
                      </div>

                      
                    </div>
                   
                  </div>
                  <div className="px-0">
                      <Badge className="bg-[#CFEED2] text-[#39761E] rounded-md text-sm">
                      Open
                    </Badge>
                  </div>
                  <div>

                  </div>
                 </div>
                  <hr className="border-1 w-full border-[#E4E4E4]"/>
                  <h1 className="text-lg text-[#F4561C] font-bold my-custom-class">Company Information</h1>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-0 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <img src="/location-filled.jpg" className="h-5 w-4" />
                          <span className="text-[#808080] font-semibold break-words">
                            {selectedProvider?.location || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CiCalendar color=" #F54A0C" className="h-5 w-5"/>
                          <span className="text-[#808080] font-semibold">
                           Founded Year: {selectedProvider.foundedYear}
                          </span>
                        </div>
                        
                  </div>
                  <p className="text-md mt-0 text-[#656565] font-normal">{selectedProvider.description}</p>
                   <hr className="border-1 w-full border-[#E4E4E4] mt-2"/>
                   <h1 className="text-lg text-[#F4561C] font-bold my-custom-class">Services Offered</h1>
                   {/*services offered*/}
                   <div className="flex flex-wrap gap-2 -mt-3 mb-0">
                        {selectedProvider.services.map((service) => (
                          <Badge
                            key={service}
                            variant="outline"
                            className="h-7 px-3 mb-2 rounded-2xl bg-[#f2f2f2] text-[#000] text-xs sm:text-sm"
                          >
                            {service}
                          </Badge>
                        ))}
                    </div>
                    <hr className="border-1 w-full border-[#E4E4E4]"/>
                    <h1 className="text-lg text-[#F4561C] font-bold my-custom-class">Portfolio</h1>
                    <div>
                    {selectedProvider.portfolio.length !== 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
                        {selectedProvider.portfolio.map((item: any) => (
                          <Card
                            key={item._id}
                            className="border py-0 border-[#E5E7EB] rounded-[20px] overflow-hidden bg-white hover:shadow-md transition-shadow"
                          >
                            {/* Image Section */}
                            <div className="w-full h-[180px] bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
                              <img
                                src={item.image || "ecommerce-fashion-website.png"}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Content Section */}
                            <div className="p-4 space-y-2">
                              <h1 className="text-[16px] font-semibold text-[#111827] leading-snug">
                                {item.title}
                              </h1>

                              <p className="text-[14px] text-[#6B7280] font-normal line-clamp-3">
                                {item.description}
                              </p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center py-10">
                        <h1 className="text-xl font-normal text-[#656565]">
                          No Portfolio Items
                        </h1>
                      </div>
                    )}
                  </div>

                  <DialogFooter className="text-start">
                    
                    <Button className="bg-[#2C34A1] hover:bg-[#2C34A1]  active:bg-[#2C34A1] text-sm rounded-full text-[#fff] w-[50%]">Contact Provider <FaArrowRightLong className="w-4 h-4" color="#fff"/> </Button>
                    <DialogClose asChild>
                       <Button className="w-[50%] sm:w-[160px] bg-[#000] rounded-3xl text-white">
                          Close
                        </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              
            </Dialog>
            )
           }

           {/*Contact providers modal */}

           {
            showContactProviderDialog &&(
             <div>
               <Dialog onOpenChange={setShowContactProviderDialog} open={showContactProviderDialog}>
                <DialogContent className="max-w-7xl max-h-[95%] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-5">
                    {/*left side content */}
                    <div className="flex flex-col justify-between">
                      <div>
                        <h1 className="my-custom-class text-2xl text-[#000] mb-8 font-bold">Les’t talk on something <span className="text-[#F54A0C]">great</span> together</h1>
                       <div className="flex flex-row justify-start  items-center mb-8 gap-2">
                          <MdMailOutline color="#F54A0C" className="h-6 w-6"/>
                          <p className="text-sm text-[#000000] my-custom-class font-normal">{contactProviderData.email || "example@gmail.com"}</p>
                       </div>
                       <div className="flex flex-row justify-start  items-center mb-8 gap-2">
                          <FaPhone color="#F54A0C" className="h-4 w-4"/>
                          <p className="text-sm text-[#000000] my-custom-class font-normal">{contactProviderData.phone || "8900776543"}</p>
                       </div>
                       <div className="flex flex-row justify-start  items-center mb-4 gap-2">
                          <FaLocationDot color="#F54A0C" className="h-4 w-4"/>
                          <p className="text-sm text-[#000000] my-custom-class font-normal">{contactProviderData.location || "N/A"}</p>
                       </div>
                      </div>
                      <div className="flex flex-row gap-4">
                        <FaLinkedin color="#F54A0C" className="h-6 w-6"/>
                        <RiInstagramFill color="#F54A0C" className="h-6 w-6"/>
                      </div>
                    </div>

                    {/*right side content */}
                    <div className="mt-8">
                      <p className="text-[#00000] text-md my-custom-class font-bold">I'm intertsed in</p>
                      {
                        (contactProviderData.services || []).map((eachItem,index)=>(
                          <Badge className={`
                            border-1  m-2 border-[#787878] rounded-full min-w-[80px] text-sm
                            ${contactProviderForm.intrestedIn===eachItem?"bg-[#F4561C] border-[#F4561C] text-[#fff]":"bg-transparent text-[#787878]"}`} 
                          id={index} 
                          onClick={()=>setContactProviderForm((prev)=>({...prev,intrestedIn:eachItem}))}>
                           {eachItem}
                          </Badge>
                        ))
                      }
                        <form onSubmit={handleFormSubmit} >
                          <div className="flex flex-col gap-0 group mt-5">
                            <Label
                              htmlFor="clientName"
                              className="text-[#cdcdcd] text-sm group-focus-within:text-[#F44336] font-medium transition-colors"
                            >
                              Your name
                            </Label>

                            <Input
                              id="clientName"
                              type="text"
                              placeholder="John Smith"
                              value={contactProviderForm.name}
                              onChange={(e)=>setContactProviderForm((prev)=>({...prev,name:e.target.value}))}
                              className="
                                pl-0
                                border-0
                                border-b-2
                                border-b-[#cdcdcd]
                                rounded-none
                                bg-transparent
                                text-base
                                text-black
                                shadow-none

                                placeholder:text-[#cdcdcd]

                                focus:!border-b-[#F44336]
                                focus:outline-none
                                focus:ring-0
                                focus:ring-offset-0
                                focus-visible:ring-0
                                focus-visible:ring-offset-0
                              "
                            />
                          </div>

                          <div className="flex flex-col gap-0 group mt-5">
                            <Label
                              htmlFor="email"
                              className="text-[#cdcdcd] text-sm group-focus-within:text-[#F44336] font-medium transition-colors"
                            >
                              Your name
                            </Label>

                            <Input
                              id="email"
                              type="text"
                              placeholder="John@gmail.com"
                              value={contactProviderForm.email}
                              onChange={(e)=>setContactProviderForm((prev)=>({...prev,email:e.target.value}))}
                              className="
                                pl-0
                                border-0
                                border-b-2
                                border-b-[#cdcdcd]
                                rounded-none
                                bg-transparent
                                text-base
                                text-black
                                shadow-none

                                placeholder:text-[#cdcdcd]

                                focus:!border-b-[#F44336]
                                focus:outline-none
                                focus:ring-0
                                focus:ring-offset-0
                                focus-visible:ring-0
                                focus-visible:ring-offset-0
                              "
                            />
                          </div>

                          <div className="flex flex-col gap-0 group mt-5">
                            <Label
                              htmlFor="message"
                              className="text-[#cdcdcd] text-sm group-focus-within:text-[#F44336] font-medium transition-colors"
                            >
                              Your name
                            </Label>

                            <Textarea
                              id="message"
                              
                              placeholder="John Smith"
                              value={contactProviderForm.message}
                              onChange={(e)=>setContactProviderForm((prev)=>({...prev,message:e.target.value}))}
                              className="
                                pl-3
                                
                                border-2
                                border-[#cdcdcd]
                                rounded-xl
                                bg-transparent
                                text-base
                                text-black
                                shadow-none

                                placeholder:text-[#cdcdcd]

                                focus:!border-[#F44336]
                                focus:outline-none
                                focus:ring-0
                                focus:ring-offset-0
                                focus-visible:ring-0
                                focus-visible:ring-offset-0
                              "
                            ></Textarea>
                            {formResponseMessage && (<p className={`text-sm ${formResponseMessage?.status==="failed"?"text-red-500":"text-green-500"}`}>{formResponseMessage.value}</p>)}
                          </div>

                          <Button type="submit"
                           className="w-full mt-5 rounded-full bg-[#F44336] hover:bg-[#F44336] active:bg-[#F44336] text-[#fff]"
                           disabled={sendingFormResponse}>
                            {sendingFormResponse?"Submiting":"Submit"}
                          </Button>
                        </form>




                    </div>
                   
                  </div>
                </DialogContent>
              </Dialog>
              </div>
            )
           }





              {/* Providers Grid */}

           {
              Failed && (
                <div className="flex flex-col justify-center items-center text-center">
                  <h1 className="text-center font-semibold">Failed  to Retrive the data</h1>
                  <Button onClick={loadData} className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]">Reload</Button>
                </div>
              )
            }
            {loading && (
              <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          <div className="grid md:grid-cols-2 gap-6">
            {(filteredData.length!=0 && !loading && !Failed)?(filteredData.map((provider) => (

                <Card
                    key={provider.id}
                    className="rounded-4xl overflow-hidden border-2 border-[#E0E0E0]  py-0 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Image flush to top */}
                    <div className="w-full">
                      <img
                        src={provider.coverImage}
                        alt={provider.name}
                        className="w-full h-[200px] sm:h-[240px] md:h-[300px] object-cover block"
                      />
                    </div>

                    <div className="p-4 sm:p-6">
                      {/* Badges + rating */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {provider.isVerified && (
                            <Badge className="bg-[#2C34A1] text-white h-7 px-3 rounded-2xl">Verified</Badge>
                          )}
                          {provider.isFeatured && (
                            <Badge className="bg-[#F54A0C] text-white h-7 px-3 rounded-2xl">Featured</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-sm">
                          <RatingStars rating={provider.rating} />
                          <span className="font-semibold">{provider.rating}</span>
                          <span className="text-muted-foreground">({provider.reviewCount})</span>
                        </div>
                      </div>

                      {/* Title + description (left aligned) */}
                      <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-left">
                        {provider.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#b2b2b2] text-left">
                        {provider.tagline}
                      </p>

                      {/* Tags – tighter gap to description */}
                      <div className="flex flex-wrap gap-2 mt-3 sm:mt-3 mb-4">
                        {provider.services.map((service) => (
                          <Badge
                            key={service}
                            variant="outline"
                            className="h-7 px-3 rounded-2xl bg-[#f2f2f2] text-[#000] text-xs sm:text-sm"
                          >
                            {service}
                          </Badge>
                        ))}
                      </div>

                      {/* Info row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <img src="/location-filled.jpg" className="h-5 w-4" />
                          <span className="text-[#808080] font-semibold break-words">
                            {provider?.location || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img src="/briefcase.jpg" className="h-4 w-4" />
                          <span className="text-[#808080] font-semibold">
                            {provider.projectsCompleted} projects
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <img src="/chat-operational.jpg" className="h-4 w-4" />
                          <span className="text-[#808080] font-semibold">
                            Response: {provider?.responseTime || "2 hrs"}
                          </span>
                        </div>
                      </div>

                      {/* Price + buttons */}
                      <p className="text-[#808080] text-sm sm:text-base font-semibold">
                        From: {provider.hourlyRate}/hour
                      </p>

                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                          <Button className="w-full sm:w-[140px] bg-[#2C34A1] hover:bg-[#2C34A1] rounded-3xl text-white" onClick={()=>(handleViewProvider(provider.id))}>
                            View Profile
                          </Button>
                        <Button className="w-full sm:w-[160px] bg-[#4d4d4d] rounded-3xl text-white" onClick={()=>handleContactProvider(provider.id)}>
                          Contact Provider
                        </Button>
                      </div>
                    </div>
                  </Card>

                ))):(<div className="text-center ml-[80px]">
                  <p className="text-lg"></p>
            </div>)}
          </div>
       </div>
    )
}
export default ClientProvidersPage;