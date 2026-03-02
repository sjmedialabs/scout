"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  MessageSquareMore,
  Building,
  Star,
  MapPin,
  Calendar,
  Award,
  MessageCircle,
  ExternalLink,
  Users,
  Clock,
  DollarSign,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  Briefcase,
  CircleUser,
  Share2,
} from "lucide-react";
import { FaCircleUser } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockProviders } from "@/lib/mock-data";
import RatingStars from "@/components/rating-star";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";

export default function ProviderProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // Find provider by ID
  const provider = mockProviders.find((p) => p.id === id);
  const [serviceFilter, setServiceFilter] = useState("");
  const [sortByFilter, setSortByFilter] = useState("");
  const [providerDetails, setProviderDetails] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch(`/api/providers/${id}`);
      const data = await response.json();
      const reviewsResponse = await fetch(
        `/api/reviews/${data.provider.userId}`,
      );
      const reviewsdata = await reviewsResponse.json();
      console.log("Fetched Reviews are the::::", reviewsdata);
      setProviderDetails(data.provider);
      setReviews(reviewsdata.reviews);
      setFailed(false);
    } catch (error) {
      console.log("Failed to get the data error:::", error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  const mockReviews = [
    {
      id: 1,
      project: {
        title: "The Project",
        type: "UX/UI Design Web Design Web Development",
        timeline: "July 2024 - Oct. 2025",
        budget: "$50,000 to $199,999",
        summary:
          "Goji Labs has been hired by an investment firm to build their website. The team has been tasked with creating solutions for the client’s unique requests.",
      },
      review: {
        quote:
          "They are fantastic in almost every aspect and my experience so far has been great.",
        date: "May 31, 2025",
        summary:
          "Goji Labs has successfully built the website and helped the client solve real-world problems through digital means. The team has been transparent and communicative throughout the collaboration. Overall, their strategic planning and problem-solving skills have pleased the client.",
      },
      rating: {
        overall: 4.5,
        totalReviews: 357,
        quality: 5.0,
        cost: 4.5,
        schedule: 4.2,
        refer: 5.0,
      },
      reviewer: {
        name: "Sudheer uppuluri",
        role: "Founder, Investment Firm",
        industry: "Advertising & marketing",
        location: "New Delhi",
        employees: "1-10 Employees",
        reviewType: "Online Review",
        verified: true,
      },
    },
    {
      id: 2,
      project: {
        title: "The Project",
        type: "UX/UI Design Web Design Web Development",
        timeline: "July 2024 - Oct. 2025",
        budget: "$50,000 to $199,999",
        summary:
          "Goji Labs has been hired by an investment firm to build their website. The team has been tasked with creating solutions for the client’s unique requests.",
      },
      review: {
        quote:
          "They are fantastic in almost every aspect and my experience so far has been great.",
        date: "May 31, 2025",
        summary:
          "Goji Labs has successfully built the website and helped the client solve real-world problems through digital means. The team has been transparent and communicative throughout the collaboration. Overall, their strategic planning and problem-solving skills have pleased the client.",
      },
      rating: {
        overall: 4.5,
        totalReviews: 357,
        quality: 5.0,
        cost: 4.5,
        schedule: 4.2,
        refer: 5.0,
      },
      reviewer: {
        name: "Sudheer uppuluri",
        role: "Founder, Investment Firm",
        industry: "Advertising & marketing",
        location: "New Delhi",
        employees: "1-10 Employees",
        reviewType: "Online Review",
        verified: true,
      },
    },
  ];

  console.log("Providers Details are :::", providerDetails);

  if (!providerDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Provider Not Found</h1>
          <p className="text-muted-foreground">
            The provider you're looking for doesn't exist.
          </p>
        </div>
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

  const stats = [
    { label: "Year founded", value: providerDetails.foundedYear || "N/A" },
    { label: "Team Size", value: providerDetails.teamSize || 0 },
    { label: "Projects", value: providerDetails.projectsCompleted || 0 },
    { label: "Min Project Size", value: providerDetails.minProjectSize || 0 },
    { label: "Hourly rate", value: `${providerDetails.hourlyRate}$/hr` || 0 },
  ];

  useEffect(() => {
    let tempFilteredReviews = [...reviews];

    // 🔹 Service filter
    if (serviceFilter && serviceFilter !== "all") {
      tempFilteredReviews = tempFilteredReviews.filter((eachItem) =>
        eachItem.project.category
          .toLowerCase()
          .includes(serviceFilter.toLowerCase()),
      );
    }

    // 🔹 Rating sort
    if (sortByFilter) {
      if (sortByFilter === "low-to-high") {
        tempFilteredReviews.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
      }

      if (sortByFilter === "high-to-low") {
        tempFilteredReviews.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      }
    }

    setFilteredReviews(tempFilteredReviews);
  }, [serviceFilter, sortByFilter, reviews]);

  const webisteClickHandle = async (e, id) => {
    e.preventDefault();
    console.log(providerDetails.websiteClicks + 1);

    try {
      await authFetch(`/api/providers/${id}/website-clicks`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Failed to update click count", err);
    }

    window.open(providerDetails.website, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (failed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-lg mb-2 font-medium">Failed to get the data</h1>
        <Button
          className="h-[30px] w-[80px] bg-[#2C34A1] hover:bg-[#2C34A1] active:bg-[#2C34A1]"
          onClick={loadData}
        >
          Reload
        </Button>
      </div>
    );
  }

  // Group reviews by service & calculate avg rating
const serviceRatings = {};

reviews.forEach((review) => {
  const service = review.project?.category || "Other";
  if (!serviceRatings[service]) {
    serviceRatings[service] = {
      total: 0,
      count: 0,
    };
  }

  serviceRatings[service].total += review.rating || 0;
  serviceRatings[service].count += 1;
});

// Convert to array with avg rating
const topServices = Object.keys(serviceRatings)
  .map((service) => ({
    name: service,
    value:
      serviceRatings[service].total /
      serviceRatings[service].count,
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 5);

  const SERVICE_COLORS = [
  "#2C34A1", // primary blue
  "#F54A0C", // orange
  "#22C55E", // green
  "#A855F7", // purple
  "#FACC15", // yellow
];


  return (
    <>
    <div className="min-h-screen mt-0 bg-[#fff]">
      {/* Hero Section */}
      <div
        className="text-white py-10 pb-10"
        style={{
          backgroundImage: `url(/ProviderDetailBanner.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "350px",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-12 lg:px-30">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div>
              <img
                src={providerDetails.logo || "/provider4.jpg"}
                className="h-45 w-48  rounded-2xl"
              />
            </div>
            <div className="flex-1">
              <div className="mb-0">
                {providerDetails.isVerified && (
                  <Badge className="bg-[#2C34A1] backdrop-blur-sm rounded-2xl mr-3">
                    <CheckCircle2 className="h-3 w-3 mr-0.2" />
                    Verified
                  </Badge>
                )}
                {/* {providerDetails.isFeatured && (
                  <Badge className="bg-[#e84816]  backdrop-blur-sm rounded-2xl">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    Featured
                  </Badge>
                )} */}
                <h1 className="text-4xl font-extrabold mt-1 tracking-widest">
                  {providerDetails.name.toUpperCase()}
                </h1>
              </div>
              <p className="text-lg text-white/90 mb-2">
                {providerDetails.tagline || "Professional service provider"}
              </p>
              <div className="grid grid-cols-3 gap-1 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <img
                    src="/ProviderDetailPageBannerIconLoactionFilled.png"
                    className="h-5 w-4"
                  />

                  <span className="text-[#fff] font-semibold text-sm">
                    {providerDetails.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/ProviderDetailPageBannerIconBriefCase.png"
                    className="h-5 w-5"
                  />
                  <span className="text-[#fff] font-semibold text-sm">
                    {providerDetails.projectsCompleted} projects
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/ProviderDetailPageBannerIconChatOperational.png"
                    className="h-5 w-5"
                  />
                  <span className="text-[#fff] font-semibold text-sm">
                    Response: {providerDetails?.responseTime || "2 hrs"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <RatingStars rating={providerDetails.rating} />
                  <span className="font-semibold text-lg">
                    {providerDetails.rating}
                  </span>
                  <span className="text-white/80">
                    ({providerDetails.reviewCount} reviews)
                  </span>
                </div>

                {/* <Badge className="bg-[#fff] text-[#000] rounded-2xl backdrop-blur-sm border-white/30 capitalize">
                  {providerDetails.subscriptionPlanId || "Basic"} Plan
                </Badge> */}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <a href={`mailto:${providerDetails.email}`}>
                <Button
                  size="lg"
                  className="bg-white text-[#2C34A1] hover:bg-white/90 text-sm font-semibold  active:bg-white  rounded-3xl"
                >
                  <img
                    src="/providerDetailPageBannerButton.jpg"
                    className="h-4 w-4 mr-0.5"
                  />
                  Contact Provider
                </Button>
              </a>
              {providerDetails.website && (
                <a href={`${providerDetails.website}`} target="_blank">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white rounded-3xl w-48 mt-2 font-semibold text-white hover:bg-white/10 bg-transparent  active:bg-transparent"
                    onClick={(e) => webisteClickHandle(e, id)}
                  >
                    <ExternalLink className="mr-0.5" height={16} width={16} />
                    View Website
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="bg-[#7fa5c2]">
    <div className="bg-white border-b border-[#E5E7EB] rounded-t-2xl">
      <div className="max-w-7xl mx-auto px-10 flex gap-10 font-medium text-[16px]">
        {["overview","services","portfolio","awards","reviews"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 capitalize border-b-2 transition
              ${
                activeTab === tab
                  ? "border-[#2C34A1] text-[#2C34A1]"
                  : "border-transparent text-gray-500"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
    </div>

    {/* ================= CONTENT ================= */}
    <div className="max-w-7xl mx-auto px-10 py-8">

      {/* ================= OVERVIEW TAB ================= */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6 -mt-4">

          {/* LEFT STATS */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#ECEEF3]">
            <h1 className="text-2xl font-semibold mb-4 -mt-4">Company Overview</h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats.map((item, i) => (
                <div
                  key={i}
                  className="bg-[#e9ecfc] border border-[#ECEEF3] rounded-xl p-4 text-center"
                >
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT TECHNOLOGIES */}
          <div className="bg-white rounded-2xl p-6 border border-[#ECEEF3]">
            <h1 className="text-lg font-semibold mb-4 -mt-4">
              Technologies Offered
            </h1>

            <div className="flex flex-wrap gap-2">
              {(providerDetails.technologies || []).map((tech, i) => (
                <span
                  key={i}
                  className="px-3 py-2 bg-[#e9ecfc] text-gray-500 rounded-xl text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= SERVICES TAB ================= */}
      {activeTab === "services" && (
        <div className="grid lg:grid-cols-3 gap-6 -mt-4">

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#ECEEF3]">
            <h1 className="text-2xl font-semibold mb-4 -mt-4">
              Services Offered
            </h1>

            <div className="flex flex-wrap gap-3">
              {(providerDetails.services || []).map((service, i) => (
                <div
                  key={i}
                  className="px-4 py-2 bg-[#e9ecfc] text-black rounded-xl text-sm font-medium"
                >
                  {service}
                </div>
              ))}
            </div>
          </div>

          {/* TOP SERVICES CHART */}
          <div className="bg-white rounded-2xl p-6 border border-[#ECEEF3]">
            <h1 className="text-lg font-semibold mb-4 -mt-4">
              Top Services
            </h1>

            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topServices}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                >
                  {topServices.map((_, index) => (
                    <Cell 
                    key={`cell-${index}`}
    fill=           {SERVICE_COLORS[index % SERVICE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ================= PORTFOLIO TAB ================= */}
      {activeTab === "portfolio" && (
        <div className="grid sm:grid-cols-2 gap-8">
          {(providerDetails.portfolio || []).map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-[#ECEEF3] shadow-sm"
            >
              <img
                src={item.image}
                className="aspect-video w-full object-cover rounded-t-2xl"
              />

              <div className="p-4">
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-gray-500 mb-2">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {item.technologies?.map((tech, i) => (
                    <Badge key={i}>{tech}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= AWARDS TAB ================= */}
      {activeTab === "awards" && (
        <div className="bg-white rounded-2xl p-6 border border-[#ECEEF3]">
          <h1 className="text-2xl font-semibold mb-4">Awards</h1>

          <div className="flex flex-wrap gap-3">
            {(providerDetails.awards || []).map((award, i) => (
              <Badge key={i}>{award}</Badge>
            ))}
          </div>
        </div>
      )}

     
      {/* ================= REVIEWS TAB ================= */}
        {activeTab === "reviews" && (
          <div className="space-y-6 mt-6">

            {/* Filters */}
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <h2 className="text-2xl font-bold">
                Creative Design Studios Reviews
              </h2>

              <div className="flex gap-3">
                {/* Service Filter */}
                <Select
                  onValueChange={(value) => setServiceFilter(value)}
                  value={serviceFilter}
                >
                  <SelectTrigger className="bg-[#f5f5f5] rounded-full w-[170px] h-12 border-[#e5e5e5]">
                    <SelectValue placeholder="Select Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select
                  onValueChange={(value) => setSortByFilter(value)}
                  value={sortByFilter}
                >
                  <SelectTrigger className="bg-[#f5f5f5] rounded-full w-[170px] h-12 border-[#e5e5e5]">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low-to-high">Low to high</SelectItem>
                    <SelectItem value="high-to-low">High to low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reviews List */}
            {filteredReviews.length !== 0 ? (
              <div className=" grid grid-cols-2 gap-4">
                {
                  filteredReviews.map((review) => (
                <div
                  key={review._id}
                  className="border  border-gray-200 rounded-3xl p-8 bg-white shadow-sm"
                >
                  {/* TOP */}
                  <div className="flex flex-col lg:flex-row justify-between gap-6">

                    {/* LEFT CONTENT */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold">The Review</h3>

                      <p className="text-sm text-[#b2b2b2]">
                        {formatDate(review.createdAt)}
                      </p>

                      <h4 className="font-semibold mt-3">
                        Feedback summary
                      </h4>

                      <p className="text-sm text-[#9c9c9c] mt-1 leading-relaxed">
                        {review.content}
                      </p>
                    </div>

                    {/* RIGHT RATING */}
                    <div className="flex flex-col items-end min-w-[120px]">
                      <span className="text-5xl font-bold text-[#898383]">
                        {review.rating || 0}
                      </span>

                      <RatingStars rating={review.rating || 0} />

                      <p className="text-sm mt-1">
                        {/* <span className="font-semibold">
                          {review.rating || 0}
                        </span>
                        <span className="text-[#898383]">
                          {" "}({reviews.length})
                        </span> */}
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM */}
                  <div className="flex flex-col lg:flex-row justify-between mt-6 gap-6">

                    {/* REVIEWER */}
                    <div>
                      <h4 className="font-bold">The Reviewer</h4>

                      <p className="text-sm text-[#b2b2b2]">
                        {review.client?.position}
                      </p>

                      <div className="flex items-center gap-2 text-[#bdbdbd] mt-1">
                        <FaCircleUser className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          {review.client?.name}
                        </span>
                      </div>
                    </div>

                    {/* META INFO — RESTORED */}
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#9c9c9c]">

                      {/* {review.client?.industry && (
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {review.client.industry}
                        </div>
                      )} */}

                      {/* {review.client?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {review.client.location}
                        </div>
                      )} */}

                      {review.client?.employees && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {review.client.employees}
                        </div>
                      )}

                      {review.client?.reviewType && (
                        <div className="flex items-center gap-1">
                          <MessageSquareMore className="h-4 w-4" />
                          {review.client.reviewType}
                        </div>
                      )}

                      {review.client?.verified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Verified
                        </div>
                      )}

                    </div>
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
          </div>
        )}

    </div>
  </div>
  </>
);
}