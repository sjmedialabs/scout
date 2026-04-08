"use client";

import { Star } from "lucide-react";
import { useState } from "react";

export default function Reviews({ reviews, provider }: any) {
  const [showAll, setShowAll] = useState(false);

  const total = reviews?.length || 0;

  // ================= RATING DISTRIBUTION =================
  const ratingDist: Record<number, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  (reviews || []).forEach((r: any) => {
    const rating = Math.round(r.rating);
    if (ratingDist[rating] !== undefined) {
      ratingDist[rating] += 1;
    }
  });

  // ================= SENTIMENTS =================
  const toPercentage = (rating: number) => {
    return Math.round((rating / 5) * 100);
  };

  const sentiments = [
    { label: "Communication", value: toPercentage(provider?.communicationRating || 0) },
    { label: "On-time delivery", value: toPercentage(provider?.ontimeDeliveryRating || 0) },
    { label: "Design quality", value: toPercentage(provider?.qualityRating || 0) },
    { label: "Strategic thinking", value: toPercentage(provider?.strategicThinkingRating || 0) },
    { label: "ROI clarity", value: toPercentage(provider?.ROIClarityRating || 0) },
    { label: "Would recommend", value: toPercentage(provider?.willingToReferRating || 0) },
    { label: "Flexibility", value: toPercentage(provider?.flexibilityRating || 0) },
    { label: "Transparency", value: toPercentage(provider?.transparencyRating || 0) },
    { label: "Value for money", value: toPercentage(provider?.valueForMoneyRating || 0) },
    { label: "Post-launch support", value: toPercentage(provider?.postLaunchSupportRating || 0) },
  ];

  const visibleReviews = showAll ? reviews : reviews?.slice(0, 6);

  return (
    <section id="reviews" className="px-6 sm:px-6 lg:px-0 py-6 max-w-7xl mx-auto bg-white">

      {/* HEADER */}
      <p className="text-lg font-bold text-gray-500 mb-2">CLIENT REVIEWS</p>
      <h2 className="text-lg font-bold mb-10">
        {provider?.rating} across {total} verified reviews
      </h2>

      {/* TOP GRID */}
      <div className="grid lg:grid-cols-3 gap-10">

        {/* LEFT BLOCK */}
        <div>
          <h1 className="text-6xl font-bold">{provider?.rating}</h1>

          <div className="flex gap-1 text-yellow-500 my-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-6">
            {total} Verified reviews 
          </p>

          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDist[star] || 0;
            const percent = total ? (count / total) * 100 : 0;

            return (
              <div key={star} className="flex items-center gap-2 mb-2">
                <span className="text-xs w-4">{star}★</span>

                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-500 h-2"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <span className="text-xs text-gray-500 w-6 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* SENTIMENT GRID */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-5 gap-4">
          {sentiments.map((s, i) => (
            <div
              key={i}
              className="bg-[#F4F4F4] rounded-xl p-4 text-center border"
            >
              <p className="text-green-700 font-semibold text-lg">
                {s.value}%
              </p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

      </div>

      {/* REVIEW CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {visibleReviews?.map((r: any, i: number) => (
          <div
            key={i}
            className="bg-[#F7F7F5] border rounded-2xl p-6 flex flex-col justify-between"
          >

            {/* STARS */}
            <div className="flex text-yellow-500 mb-3">
              {[...Array(Math.round(r.rating || 5))].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>

            {/* CONTENT */}
            <p className="text-sm text-gray-700 italic leading-relaxed mb-6">
              "{r.content}"
            </p>

            {/* USER */}
            <div className="flex items-center gap-3 mt-auto">

              {/* AVATAR */}
              <div className="h-10 w-10 rounded-full bg-[#E6F4EC] text-[#1F7A4D] flex items-center justify-center text-xs font-semibold">
                {r.client?.name?.slice(0, 2).toUpperCase() || "NA"}
              </div>

              {/* DETAILS */}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {r.client?.name || "Anonymous"}
                </p>

                <p className="text-xs text-gray-500">
                  {r.client?.position || "Client"}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {"Verified on Scout : "}
                  {
                    r.category ||
                    r.project?.category ||
                    r.projectType ||
                    r.service ||
                    r.tags?.[0] ||
                    "General"
                  }
                </p>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* VIEW MORE BUTTON */}
      {reviews?.length > 6 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-semibold cursor-pointer text-black border px-6 py-2 rounded-full hover:bg-[#1447e6] hover:text-white "
          >
            {showAll ? "Show Less" : "View More Reviews"}
          </button>
        </div>
      )}

    </section>
  );
}