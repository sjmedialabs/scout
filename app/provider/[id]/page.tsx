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
import Hero from "@/components/provider/portfolio/Hero";
import Stats from "@/components/provider/portfolio/Stats";
import Overview from "@/components/provider/portfolio/Overview";
import CaseStudies from "@/components/provider/portfolio/CaseStudies";
import Reviews from "@/components/provider/portfolio/Reviews";
import SectionTabs from "@/components/provider/portfolio/SectionTabs";


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
  const [proposalData, setProposalData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch(`/api/providers/${id}`);
      const data = await response.json();
      const proposalResponse = await fetch(`/api/proposals/${data.provider.userId}/public`)
      const proposalData = await proposalResponse.json()
      setProposalData(proposalData.proposals)
      console.log("Fetched proosal data ::::::::::", proposalData)
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
  <div className="bg-white">

    <Hero provider={providerDetails} onContact={() => setOpen(true)} />
    <Stats provider={providerDetails} reviews={reviews} proposalData={proposalData} />
    <SectionTabs />
    <Overview provider={providerDetails} reviews={reviews} proposalData={proposalData}  />
   {
    providerDetails.caseStudies.length!== 0 && <CaseStudies provider={providerDetails} />
   }
    <Reviews reviews={reviews} provider={providerDetails} />

  </div>
);
}