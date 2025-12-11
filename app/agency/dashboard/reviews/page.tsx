"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

const ReviewsPage=()=>{
     const [reviews, setReviews] = useState<Review[]>(mockProviderReviews)
     const handleRespondToReview=()=>{
        // logic to respond the review
     }
     return(
       <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Client Reviews</h1>
                  <p className="text-muted-foreground">View and respond to client feedback</p>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    {reviews.length === 0 ? (
                      <div className="text-center py-8">
                        <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No reviews yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {reviews.map((review) => (
                          <Card key={review.id}>
                            <CardContent className="pt-6">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium">{review.rating}/5</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {review.createdAt.toLocaleDateString()}
                                </span>
                              </div>

                              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                                <div>Quality: {review.qualityRating}/5</div>
                                <div>Cost: {review.costRating}/5</div>
                                <div>Timeliness: {review.timelinessRating}/5</div>
                              </div>

                              <p className="text-sm mb-3">{review.comment}</p>

                              {review.providerResponse ? (
                                <div className="bg-muted p-3 rounded-md">
                                  <p className="text-sm font-medium mb-1">Your Response:</p>
                                  <p className="text-sm">{review.providerResponse}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Responded on {review.responseDate?.toLocaleDateString()}
                                  </p>
                                </div>
                              ) : (
                                <Button variant="outline" size="sm" onClick={() => handleRespondToReview(review)}>
                                  Respond to Review
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
    
     )
}
export default ReviewsPage;