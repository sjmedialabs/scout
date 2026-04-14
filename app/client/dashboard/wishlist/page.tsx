"use client";
import { authFetch } from "@/lib/auth-fetch";
import { useEffect, useState } from "react";

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
  Search,
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
import Link from "next/link";
import RatingStars from "@/components/rating-star";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CiCalendar } from "react-icons/ci";
import { Content } from "next/font/google";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast } from "@/lib/toast";

const WishListPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resLoading, setResLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [wishListData, setWishListData] = useState([]);

  const loadData = async () => {
    setResLoading(true);
    setFailed(false);
    try {
      const response = await authFetch("/api/wishlist", {
        credentials: "include",
      });
      const data = await response.json();
      console.log("Fetched  Data:::", data);
      setWishListData(data.data);
      setFailed(false);
    } catch (error) {
      console.log("Failded To retrive the data:::", error);
      setFailed(true);
    } finally {
      setResLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
      if (!loading && (!user || user.role !== "client")) {
        router.push("/login");
      }
      if (user && !loading) {
        loadData();
      }
    }, [user, loading, router]);
  const handleRemove = async (recievedId: string) => {
    try {
      const res = await authFetch(`/api/wishlist/${recievedId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        setWishListData((prev) =>
          prev.filter((eachItem) => eachItem.agency._id !== recievedId),
        );
        toast.success("Successfully removed from the wishlist");
      }
    } catch (error) {
      console.log("Failed to delete the provider from");
      // toast.error(`Failed to remove the provider ${error.message}`)
    }
  };
  const handleViewProfile = async (providerId: string) => {
    // open profile page
    window.open(`/provider/${providerId}`, "_blank");
  };
  const handleContact = (provider: any) => {
    if (!provider.email) return;
    window.location.href = `mailto:${provider.email}?subject=Service Inquiry&body=Hi ${provider.name},%0D%0A%0D%0AI am interested in your services.`;
  };
  const handleMessage = async(agencyId:string) => {
        console.log("The recieved Agency Id is::",agencyId)
        console.log("The recieved Client Id is::",user.id)
        try{
          const conRes=await authFetch(`/api/chat/conversation`,{
                  method:"POST",
                  headers:{
                    "Content-Type":"application/json"
                  },
                  body:JSON.stringify({agencyId,clientId:user?.id})
      
                })
          const data=await conRes.json();
          console.log("Chat response is:::",data);
          if(conRes.ok){
            router.push(`/client/dashboard/message?conversationId=${data.conversationId}&agencyId=${agencyId}`)
          }
        }catch(error){
          console.log("Failed to create the conversation:::",error)
        }
  };

  console.log("Fetched Wish list data is:::", wishListData);
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-xl text-[#F4561C]  font-bold">
          Favourites
        </h1>
        <p className="text-md text-[#656565]  mt-0">
          Compare vendors side-by-side to make informed decisions
        </p>
      </div>

      {(wishListData || []).length === 0 && !resLoading && !failed && (
        <div>
          <p className="text-xl text-[#6b6b6b] font-medium">
            No providers are added to wishlist
          </p>
        </div>
      )}
      {resLoading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {!resLoading && failed && (
        <div className="flex flex-col min-h-[100vh] justify-center items-center text-center">
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
      )}

      {(wishListData || []).length !== 0 && !resLoading && !failed && (
        <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-4 gap-3">
          {wishListData.map((p) => (
            // <Card
            //   key={provider._id}
            //   className="rounded-4xl flex flex-col overflow-hidden border-2 border-[#E0E0E0]  py-0 shadow-sm hover:shadow-md transition-shadow"
            // >
              
              
            //   <div className="w-full">
            //     <img
            //       src={provider?.coverImage || "/uploads/15ac2d8f-31f9-48ac-aadd-b67ba9f4d860-Artificial-intelligence-platforms-copy.jpg"}
            //       alt={provider.name}
            //       className="w-full h-[200px] sm:h-[240px] md:h-[300px] object-cover block"
            //     />
            //   </div>

            //   <div className="p-4 sm:p-6">
              
            //     <div className="flex flex-wrap items-start justify-between gap-3">
            //       <div className="flex flex-wrap gap-2">
            //         {provider.agency.isVerified && (
            //           <Badge className="bg-[#2C34A1] text-white h-7 px-3 rounded-2xl">
            //             Verified
            //           </Badge>
            //         )}
            //         {provider.agency.isFeatured && (
            //           <Badge className="bg-[#F54A0C] text-white h-7 px-3 rounded-2xl">
            //             Featured
            //           </Badge>
            //         )}
            //       </div>

            //       <div className="flex items-center gap-1 text-sm">
            //         <RatingStars rating={provider.agency.rating} />
            //         <span className="font-semibold">
            //           {provider.agency.rating}
            //         </span>
            //         <span className="text-muted-foreground">
            //           ({provider.agency.reviewCount})
            //         </span>
            //       </div>
            //     </div>

                
            //     <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-left">
            //       {provider.agency.name}
            //     </h3>
            //     <p className="mt-1 text-sm text-[#b2b2b2] text-left">
            //       {provider.agency.tagline}
            //     </p>

                
            //     <div className="flex flex-wrap gap-2 mt-3 sm:mt-3 mb-4">
            //       {provider.agency.services.slice(0,3).map((service) => (
            //         <Badge
            //           key={service}
            //           variant="outline"
            //           className="h-7 px-3 rounded-2xl bg-[#f2f2f2] text-[#000] text-xs sm:text-sm"
            //         >
            //           {service}
            //         </Badge>
            //       ))}
            //     </div>
            //     </div>

              
            //     <div className="justify-end mt-auto px-4 mb-3">
            //     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs sm:text-sm">
                
            //       <div className="flex items-center gap-2">
            //         <img src="/location-filled.jpg" className="h-5 w-4" />
            //         <span className="text-[#808080] font-semibold break-words">
            //           {provider?.agency.location || "N/A"}
            //         </span>
            //       </div>
            //       <div className="flex items-center gap-2">
            //         <img src="/briefcase.jpg" className="h-4 w-4" />
            //         <span className="text-[#808080] font-semibold">
            //           {provider.agency.projectsCompleted} projects
            //         </span>
            //       </div>
            //       <div className="flex items-center gap-2">
            //         <img src="/chat-operational.jpg" className="h-4 w-4" />
            //         <span className="text-[#808080] font-semibold">
            //           Response: {provider?.agency.responseTime || "2 hrs"}
            //         </span>
            //       </div>
            //     </div>

            //     {/* Price + buttons */}
            //     <p className="text-[#808080] text-sm sm:text-base font-semibold">
            //       Starting Price: {provider?.agency?.hourlyRate || 0}$/hour
            //     </p>

            //     <div className="mt-3 flex flex-col sm:flex-row gap-2">
            //      <a href={`/provider/${provider._id}`} target="_blank" rel="noopener noreferrer">
            //       <Button
            //         className="w-full sm:w-30 bg-[#2C34A1] hover:bg-[#2C34A1] rounded-3xl text-white"
                    
            //       >
            //         View Profile
            //       </Button>

            //      </a>
            //       <Button
            //         className="w-full sm:w-30 bg-[#4d4d4d] rounded-3xl text-white"
            //         onClick={() => {
            //           window.location.href = `mailto:${provider.email}`;
            //         }}
            //       >
            //         Contact Provider
            //       </Button>
            //       <Button
            //         className="rounded-full bg-red-500 text-[#fff] hover:bg-red-500 active:bg-red-500"
            //         onClick={() => handleRemove(provider.agency._id)}
            //       >
            //         Delete
            //       </Button>
            //     </div>
            //   </div>
            // </Card>
            <div className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:shadow-md flex flex-col h-full">

                {/* Image */}
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <img
                    src={
                      p?.agency.coverImage ||
                      "/uploads/15ac2d8f-31f9-48ac-aadd-b67ba9f4d860-Artificial-intelligence-platforms-copy.jpg"
                    }
                    alt={p.agency.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-col flex-1 p-4 justify-between">

                  {/* Verified + Rating */}
                  <div className="relative flex items-center -mt-1 h-2">

                    {/* LEFT — Verified */}
                    <div className="absolute left-0">
                      {p.agency.isVerified && (
                        <span className="inline-flex items-center rounded-lg border font-bold px-2 py-0 text-[10px] text-white bg-[#232a8f]">
                          Verified
                        </span>
                      )}
                      {p.agency.isFeatured && (
                        <span className="inline-flex items-center rounded-lg border font-bold px-2 py-0 text-[10px] text-white bg-[#f54a0c]">
                          Featured
                        </span>
                      )}
                    </div> 

                    {/* RIGHT — Rating */}
                    <div className="absolute right-0 flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        <RatingStars rating={p.agency.rating} size={12} />
                      </div>

                      <span className="text-xs font-semibold text-[#0E0E0E]">
                        {p?.agency.rating?.toFixed(1)}
                      </span>
                    </div>

                  </div>

                  {/* Title + Description */}
                  <div className="mt-2">
                    <h3
                      className="text-md font-bold text-[#0E0E0E] leading-tight"
                      
                    >
                      {p.agency.name}
                    </h3>

                    {/* <p
                      className="text-[10px] font-semibold text-[#adb0b3] mt-0"
                      style={{ fontFamily: "CabinetGrotesk2" }}
                    >
                      {p.description}
                    </p> */}
                  </div>

                  {/* Tags */}
                  {/* <div className="flex flex-wrap py-0 -mt-2">
                    {activeService && (
                      <span
                        className="inline-flex items-center rounded-lg bg-[#f2f2f2] border px-3 py-0.5 text-[10px] font-semibold text-slate-700"
                      >
                        {activeService}
                      </span>
                    )}
                  </div> */}

                  {/* Info Row */}
                  <div className=" grid-cols-3 text-[10px] font-semibold text-[#616161] mt-1">
                    <div className="inline-flex items-center mr-6 gap-1">
                      <img
                        src="/Location_Icon.jpg"
                        alt="Location"
                        className="h-3 w-3 object-contain"
                      />
                      {p.agency.location || "Not specified"}
                    </div>

                    <div className="inline-flex items-center mr-6 gap-1">
                      <img
                        src="/Projects_Icon.jpg"
                        alt="Projects"
                        className="h-3 w-3 object-contain"
                      />
                      {p.agency.projectsCompleted} projects
                    </div>

                    <div className="inline-flex items-center gap-1">
                      <Users className="h-3 w-3 text-orangeButton" />
                      {p.agency.teamSize || "Not specified"}
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="text-xs text-[#616161] font-bold py-1">
                    Starting Price:
                    <span className="ml-1 text-gray-400">{p.agency.hourlyRate ||0}/hr</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between gap-1 pt-1">
                    <button
                      // className="flex-1 border hover:border-[#000000] cursor-pointer rounded-xl bg-[#e0332c] py-1 text-[10px] font-bold text-white hover:bg-white hover:text-black"
                      className="primary-button h-[25px] w-[75px] !text-[10px]"
                      onClick={() =>
                        handleViewProfile(p.agency._id)
                      }
                    >
                      View Profile
                    </button>

                    <button
                      // className="flex-1 border hover:border-[#000000] cursor-pointer rounded-xl bg-[#000000] py-1 text-[10px] font-bold text-white hover:bg-white hover:text-black"
                      className="btn-blackButton h-[25px] w-[70px] !text-[10px]"
                      onClick={() => handleMessage(p.agency.userId)}
                    >
                      Contact
                    </button>
                     <button
                      // className="flex-1 border hover:border-[#000000] cursor-pointer rounded-xl bg-[#e0332c] py-1 text-[10px] font-bold text-white hover:bg-white hover:text-black"
                      className="bg-red-500 text-white h-[25px] w-[70px] rounded-full text-[10px] cursor-pointer"
                     onClick={() => handleRemove(p.agency._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default WishListPage;
