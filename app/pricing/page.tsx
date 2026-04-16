"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CmsPlan {
  _id: string;
  title: string;
  pricePerMonth: number;
  pricePerYear?: number;
  yearlySubscription?: boolean;
  description?: string;
  features: string[];
  isActive: boolean;
  slug?: string;
  monthlyDiscountPercentage?: number;
  yearlyDiscountPercentage?: number;
}


export default function PricingPage() {
  const router=useRouter();
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<CmsPlan[]>([]);

  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const fetchCmsFeatures = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const [res, freeTrailRes] = await Promise.all([
          fetch("/api/subscription"),
          fetch("/api/free-trail-config"),
        ]);

        if (res.ok && freeTrailRes.ok) {
          const data: CmsPlan[] = await res.json();
          const freeTrailData = await freeTrailRes.json();
          console.log("Fetched CMS subscription plans:", data);

          const freePlan: CmsPlan = {
            _id: "free-trial",
            title: "Free Trial",
            pricePerMonth: 0,
            pricePerYear: 0,
            description:
              freeTrailData.description || "Perfect to get started",
            features: [
              
              ...(freeTrailData.features || []),
            ],
            isActive: freeTrailData.isActive,
            monthlyDiscountPercentage: 0,
            yearlyDiscountPercentage: 0,
          };

          // show only active plans on public page
          const activePlans = data.filter((plan) => plan.isActive);

          const allPlans = [];
          if (freePlan.isActive) {
            allPlans.push(freePlan);
          }
          allPlans.push(...activePlans);

          setSubscriptions(allPlans);
          setFailed(false);
        } else {
          setFailed(true);
        }
      } catch (error) {
        console.error("Failed to fetch CMS features", error);
        setFailed(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCmsFeatures();
  }, []);

  const getDisplayPrice = (plan: any) => {
    if (!isAnnual) {
      return {
        price: plan.price,
        label: "month",
      };
    }

    // yearly pricing (CMS or fallback)
    const yearlyPrice = Math.round(plan.price * 12 * 0.85); // 15% discount fallback

    return {
      price: yearlyPrice,
      label: "year",
    };
  };

  return (
  <div>
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-1xl font-medium text-orangeButton mb-1">
            Choose Your Plan
          </p>
          <p className="text-xl text-muted-foreground text-balance text-center max-w-xl mx-auto leading-tight">
            Select the perfect plan for your business needs.
            <br /> Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Toggle */}
        <div className="mt-2 mb-10 flex items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <span
            className={`text-lg font-bold transition-colors ${
              isAnnual ? "text-slate-500" : "text-slate-900"
            }`}
          >
            Monthly
          </span>

          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-9 w-20 items-center rounded-full bg-slate-700 shadow-inner transition-colors focus:outline-none shrink-0"
          >
            <div
              className={`absolute left-1 top-1 h-7 w-8 rounded-full bg-white shadow transition-transform duration-300 ${
                isAnnual ? "translate-x-10" : "translate-x-0"
              }`}
            />
          </button>

          <span
            className={`text-lg font-bold transition-colors ${
              isAnnual ? "text-slate-900" : "text-slate-500"
            }`}
          >
            Annually
          </span>
        </div>

        {/* Pricing Cards */}
      {!loading && !failed && subscriptions.length > 0 && (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
    {subscriptions.map((plan) => {
      const selected = selectedId === plan._id
      const { label } = getDisplayPrice(plan)
      const discount = isAnnual ? plan.yearlyDiscountPercentage : plan.monthlyDiscountPercentage;

      return (
        <div
          key={plan._id}
          
          tabIndex={0}
          onClick={() =>router.push(plan.title === "Free Trial" ? "/register" : `/subscribe/${plan._id}?billing=${
                  isAnnual ? "yearly" : "monthly"
                }`)}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") &&
            setSelectedId(plan._id)
          }
         className={[
            "group cursor-pointer rounded-xl border border-slate-100 bg-white shadow-sm",
            "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
            "flex flex-col",
            "h-full",
            selected
              ? "ring-1 ring-zinc-200 border-slate-300"
              : "",
          ].join(" ")}
        >
          {/* Card body */}
          <div className="flex flex-col flex-1 p-6">

            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-semibold text-zinc-900">
                {plan.title}
              </h3>
              {discount && discount > 0 ? (
                <div className="text-sm text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full">
                  {discount}% off
                </div>
              ) : null}
            </div>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-1">
            <span className="text-4xl font-semibold text-zinc-900">
              ₹{isAnnual ? plan.pricePerYear : plan.pricePerMonth}
            </span>
            <span className="text-sm font-medium text-zinc-900">
              /{label}
            </span>
          </div>

            {/* Description */}
            <p className="mt-2 text-[15px] text-zinc-400">
              {plan.description}
            </p>

            {/* Features */}
            <ul className="mt-6 space-y-4 flex-1">
              {(plan.features || []).map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100">
                    <span className="text-[#e0332c] font-bold text-sm">✓</span>
                  </span>

                  <span className="text-[16px] text-zinc-700">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

          </div>

          {/* Button */}
          <div className="p-6 pt-0">
            <Button
              className={[
                "w-full h-12 text-base font-medium",
                "border border-red-200 text-[#e0332c] bg-[#feefe8]",
                "hover:bg-[#ff001e] hover:text-white hover:border-[#ff4d1d]",
                "group-hover:bg-[#e0332c] group-hover:text-white",
                selected
                  ? "bg-[#ff4d1d]/10 border-[#ff4d1d]/30"
                  : "",
              ].join(" ")}
              variant="outline"
              asChild
            >
              <Link
                href={plan.title === "Free Trial" ? "/register" : `/subscribe/${plan._id}?billing=${
                  isAnnual ? "yearly" : "monthly"
                }`}
              >
                {plan.title === "Free Trial"
                  ? "Get Started"
                  : `Choose ${plan.title}`}
              </Link>
            </Button>
          </div>
        </div>
      )
    })}
  </div>
)}

        {loading && (
          <div className="mt-40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

      </div>
    </div>
  </div>
)
}
