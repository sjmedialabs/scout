"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import RatingStars from "@/components/rating-star";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";
import ContactProviderModal from "@/components/leadPopupForm";
import CompanyOverviewCard from "@/components/provider/portfolio/CompanyOverviewCard";
import FocusAreasCard from "@/components/provider/portfolio/FocusAreasCard";
import PortfolioGrid from "@/components/provider/portfolio/PortfolioGrid";
import PricingSnapshot from "@/components/provider/portfolio/PricingSnapshot";
import ServiceLines from "@/components/provider/portfolio/ServiceLines";
import Testimonials from "@/components/provider/portfolio/Testimonials";

export default function ProviderProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [open, setOpen] = useState(false)

  const [providerDetails, setProviderDetails] = useState({});
  const [reviews, setReviews] = useState([]);
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


  return (
    <>
    <div className="min-h-screen mt-0 bg-white">
      {/* Hero Section */}
      <div
        className="text-white flex  justify-center lg:justify-start md:py-10"
        style={{
          backgroundImage: `url(/ProviderDetailBanner.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "350px",
        }}
      >
        <div className="max-w-7xl px-6 lg:px-20 flex justify-start   lg:py-12 ">
          <div className="flex flex-col md:flex-row justify-center md:items-center gap-6">
            <div className="flex flex-row gap-4 items-center">
            <div>
              <img
                src={providerDetails.logo || "/provider4.jpg"}
                alt=""
                className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-40 rounded-2xl object-contain bg-white/10 shrink-0"
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
                <h1 className="text-2xl font-extrabold mt-1">
                  {providerDetails.name.toUpperCase()}
                </h1>
              </div>
              <p className="text-lg text-white/90 mb-2">
                {providerDetails.tagline || "Professional service provider"}
              </p>
              {/* location */}
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
                {/* <div className="flex items-center gap-2">
                  <img
                    src="/ProviderDetailPageBannerIconBriefCase.png"
                    className="h-5 w-5"
                  />
                  <span className="text-[#fff] font-semibold text-sm">
                    {providerDetails.projectsCompleted} projects
                  </span>
                </div> */}
                {/* <div className="flex items-center gap-2">
                  <img
                    src="/ProviderDetailPageBannerIconChatOperational.png"
                    className="h-5 w-5"
                  />
                  <span className="text-[#fff] font-semibold text-sm">
                    Response: {providerDetails?.responseTime || "2 hrs"}
                  </span>
                </div> */}
              </div>
              {/* stars rating */}
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
            </div>
            {/* buttons section */}
            <div className="flex flex-col justify-center items-end gap-1">
              
                <Button
                  size="lg"
                  onClick={() => setOpen(true)}
                  className="bg-white  text-[#2C34A1] hover:bg-white/90 text-sm font-semibold  active:bg-white  rounded-3xl"
                >
                  <img
                    src="/providerDetailPageBannerButton.jpg"
                    className="h-4 w-4 mr-0.5"
                  />
                  Contact Provider
                </Button>
                  <ContactProviderModal
                  open={open}
                  onClose={() => setOpen(false)}
                  userId={providerDetails.userId}    
                  />

              
              {providerDetails?.website && (
                <a href={`${providerDetails.website}`} target="_blank" className="flex justify-center">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white rounded-3xl w-51 mt-2 font-semibold text-white hover:bg-white/10 bg-transparent  active:bg-transparent"
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <CompanyOverviewCard provider={providerDetails} />
            <ServiceLines provider={providerDetails} />
            <PricingSnapshot provider={providerDetails} />
            <PortfolioGrid provider={providerDetails} />
            <Testimonials testimonials={reviews} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:h-screen ">
            <FocusAreasCard provider={providerDetails} />
          </div>
        </div>
    </div>
  </div>
  </>
);
}