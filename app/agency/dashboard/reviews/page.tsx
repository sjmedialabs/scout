"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/auth-fetch";
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
} from "lucide-react";
import {
  mockNotifications,
  mockProviderProjects,
  mockProviderReviews,
  mockRequirements,
} from "@/lib/mock-data";
import type {
  Provider,
  Requirement,
  Notification,
  Project,
  Review,
} from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import StarRating from "@/components/ui/star-rating";
import { MessageSquareText,MessageSquareMore,CheckCircle2 } from "lucide-react";
import RespondToReviewModal from "@/components/reviews/RespondToReviewModal";
import RatingStars from "@/components/rating-star";
import { FaCircleUser } from "react-icons/fa6";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [resLoading, setResLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setResLoading(true);
    try {
      const reviewRes = await authFetch("/api/reviews");
      const data = await reviewRes.json();

      console.log("Fetched the reviews::::", data);

      if (reviewRes.ok) {
        setReviews(data.reviews);
        setFailed(false);
      }
    } catch (error) {
      console.log("Failed to  fetch the data:::");
      setFailed(true);
    } finally {
      setResLoading(false);
    }
  };

  if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-orangeButton  mb-0">
          Client Reviews
        </h1>
        <p className="text-[#656565] font-medium text-md">
          View and respond to client feedback
        </p>
        <hr className="border-[#d1c7c7] mt-2 border-1 w-full" />
      </div>
      {/* REVIEWS LIST */}
      {reviews.length !== 0 ? (
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
          {
            reviews.map((review) => (
              <div
                key={review._id}
                className="border  border-gray-200 rounded-3xl p-3 bg-white shadow-sm"
              >
                <div className="">
                    {/* <h4 className="font-bold">By</h4> */}

                    

                    <div className=" flex justify-between">
                      {/* <FaCircleUser className="h-5 w-5" /> */}
                      
                        <div className="flex ">
                          {/* <FaCircleUser className="h-6 w-6" /> */}
                        <span className="text-lg text-black font-bold">
                        {review.client?.name}
                      </span>
                      </div>
                      
                      <Badge
                    variant="outline"
                    className="text-[10px] border-[#DEDEDE] bg-[#EDEDED] rounded-full h-[25px] px-3"
                  >
                    {review.project.category}
                  </Badge>
                    </div>
                    <div className="flex items-center w-full justify-between">
                        <div>
                      <p className="text-xs text-gray-500">
                      {review.client?.position}
                      </p> 
                      </div>
                      <div>
                      <div className="flex items-center gap-1">
                    
                    <span className="text-sm font-bold text-[#898383]">
                      {review.rating || 0}
                    </span>
                    
                    <RatingStars rating={review.rating || 0} />
                    
                    {/* <p className="text-sm"> */}
                      {/* <span className="font-semibold">
                        {review.rating || 0}
                      </span>
                      <span className="text-[#898383]">
                        {" "}({reviews.length})
                      </span> */}
                    {/* </p> */}
                  </div>
                  </div>
                      </div>
                      
                  </div>
              
                <div className="flex justify-between items-center">
                    <p className="text-xs text-[#b2b2b2]">
                      {formatDate(review.createdAt)}
                    </p>

                    {/* <h4 className="font-semibold mt-3">
                      Feedback summary
                    </h4>
                    <p className="text-sm text-[#9c9c9c] mt-1 leading-relaxed">
                      {review.content}
                    </p> */}
                    
                </div>

                {/*Review Content */}

                <div>
                    {/* <h4 className="text-lg font-semibold">
                      Feedback summary
                    </h4> */}

                    <p className="text-sm text-[#9c9c9c] ">
                      {review.content}
                    </p>
                </div>

                {/* BOTTOM */}
                <div className="flex :flex-row justify-between gap-6">

                  {/* REVIEWER */}
                  

                    {/* ACTION */}
                    {review.response && Object.keys(review.response).length === 0 && (
                      <div className="flex justify-center sm:justify-start">
                        <button
                          onClick={() => {
                            setSelectedReview(review);
                            setIsModalOpen(true);
                          }}
                          className="flex w-fit primary-button items-center gap-1 px-2  h-[25px] text-xs! 
                             "
                        >
                          <MessageSquareText className="h-3 w-3" />
                          Respond to Review
                        </button>
                      </div>
                    )}

                 
                </div>
              </div>
          ))
          }
          </div>
      ) : (
        <div className="text-center mt-20">
          <p className="text-xl">No Reviews for this provider</p>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && selectedReview && (
        <RespondToReviewModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          review={{
            clientName: selectedReview.client.name,
            date: new Date(selectedReview.createdAt).toLocaleDateString(),
            reviewText: selectedReview.content,
            quality: selectedReview.qualityRating,
            value: selectedReview.costRating,
            timeline: selectedReview.scheduleRating,
            id: selectedReview._id,
          }}
        />
      )}
    </div>
  );
};
export default ReviewsPage;
