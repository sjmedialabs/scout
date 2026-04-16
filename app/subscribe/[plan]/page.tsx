"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getSubscriptionPlan } from "@/lib/subscription-plans";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { features } from "process";
import { authFetch } from "@/lib/auth-fetch";

interface SubscribePageProps {
  params: {
    plan: string;
  };
}

export default function SubscribePage({ params }: SubscribePageProps) {
  const router = useRouter();

  const searchParams = useSearchParams();
  // const params = useParams()

  //  const id = params.id as string
  const billing = searchParams.get("billing"); // "yearly"

  console.log("Billing:", billing);

  const [selectedPlan, setSelectedPlan] = useState();

  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const [showMoreFeatures, setShowMoreFeatures] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch(`/api/subscription/${params.plan}`);
      if (!response.ok) {
        throw new Error("Failed to fetch subscription plan data");
      } else {
        const data = await response.json();
        console.log("Fetched subscription plan data:", data);
        setSelectedPlan(data.data);
        setFailed(false);
      }
    } catch (error) {
      console.error("Error fetching subscription plan data:", error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const discountPercentage =
    selectedPlan &&
    (billing === "yearly"
      ? selectedPlan.yearlyDiscountPercentage
      : selectedPlan.monthlyDiscountPercentage);
  const originalPrice =
    selectedPlan &&
    (billing === "yearly"
      ? selectedPlan.pricePerYear
      : selectedPlan.pricePerMonth);
  const discountAmount =
    selectedPlan && discountPercentage > 0
      ? (originalPrice * discountPercentage) / 100
      : 0;
  const finalPrice = selectedPlan ? originalPrice - discountAmount : 0;

  // if (!selectedPlan) {
  //   return(
  //     <div className="py-20 text-center">
  //       <p className="text-lg font-medium">
  //         Plan Not Found
  //         </p>
  //         <Link href="/pricing" className="text-orange-500 underline">
  //         Back to Pricing
  //         </Link>
  //     </div>
  //   )
  // }

  // const visibleFeatures = selectedPlan.features.slice(0, 5)
  // const remainingCount = selectedPlan.features.length - visibleFeatures.length

  return (
    <div className="bg-background min-h-screen">
      <div className="px-4 py-10">
        {!loading && !failed && selectedPlan && (
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <p className="text-[#e0332c] text-sm font-medium mb-2">
                Subscribe to {selectedPlan.title}
              </p>
              <h1 className="text-2xl sm:text-2xl font-medium">
                Complet your subscription to unlock all {selectedPlan.title}{" "}
                features
              </h1>
            </div>

            {/* Order Summary Card*/}
            <div className="flex justify-center">
              <Card className="w-full max-w-md rounded-2xl shadow-md border border-slate-200 bg-white">
                <CardContent className="p-5 pt-2 space-y-6">
                  <div className="flex items-center h-0 justify-between">
                    <h2 className="text-orangeButton font-bold text-lg">
                      Order Summary
                    </h2>
                  </div>

                  {/* Plan Row */}
                  <div className="flex items-center pt-7 justify-between border-b pb-4">
                    {/* Left */}
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-zinc-900">
                        {selectedPlan.title} Plan
                      </p>
                      {discountPercentage > 0 && (
                        <div className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full">
                          {discountPercentage}% off
                        </div>
                      )}
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-zinc-900">
                        ₹
                        {originalPrice}/{billing === "yearly" ? "yearly" : "monthly"}
                      </p>
                      <Link href="/pricing">
                        <button
                          type="button"
                          className="h-[25px] w-[70px] bg-black text-white hover:bg-gray-800 rounded-full text-xs"
                        >
                          Change
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <p className="font-bold text-md mb-3">
                      What's included:
                    </p>
                    <ul className="space-y-3">
                      {(selectedPlan.features || [])
                        .slice(0, 2)
                        .map((feature, index) => (
                          <li
                            key={index}
                            className="flex items-startgap-3 text-sm text-zinc-700"
                          >
                            <IoIosCheckmarkCircle className="h-4 w-5 text-orangeButton shrink-0 mt-px" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      {(selectedPlan.features || []).length > 2 &&
                        !showMoreFeatures && (
                          <li
                            className="text-sm text-zinc-700 underline cursor-pointer"
                            onClick={() => setShowMoreFeatures(true)}
                          >
                            + {(selectedPlan.features || []).length - 2} more
                            features
                          </li>
                        )}
                      {/*{remainingCount > 0 && (
                      <li className="text-sm text-zinc-700 underline cursor-pointer">
                        + {remainingCount} more features
                      </li>
                    )} */}

                      {showMoreFeatures &&
                        (selectedPlan.features || [])
                          .slice(2)
                          .map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-startgap-3 text-sm text-zinc-700"
                            >
                              <IoIosCheckmarkCircle className="h-4 w-5 text-orangeButton shrink-0 mt-px" />
                              <span>{feature}</span>
                            </li>
                          ))}

                      {showMoreFeatures &&
                        (selectedPlan.features || []).length > 2 && (
                          <li
                            className="text-sm text-zinc-700 underline cursor-pointer"
                            onClick={() => setShowMoreFeatures(false)}
                          >
                            hide
                          </li>
                        )}
                    </ul>
                  </div>

                  {/* Total*/}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center justify-between text-zinc-700">
                      <span>Plan Price</span>
                      <span>₹{originalPrice.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex items-center justify-between text-green-600">
                        <span>Discount ({discountPercentage}%)</span>
                        <span>-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between font-bold text-zinc-900 pt-2 border-t mt-2">
                      <span>Total</span>
                      <span>₹{finalPrice.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-right text-zinc-500">
                      /{billing === "yearly" ? "year" : "month"}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    {/* Proceed to pay */}
                    <button
                      type="button"
                      className="primary-button h-[33px] w-[100px]"
                      onClick={() => {
                        // BACKEND CHECKOUT HOOK (to be implemented)
                        router.push("/register");
                      }}
                    >
                      Proceed to pay
                    </button>

                    {/* Cancel / Exit */}
                    <Link href="/pricing">
                      <button
                        type="button"
                        className="h-[33px] w-[100px] bg-black text-white hover:bg-gray-800 rounded-full text-xs"
                      >
                        Cancel / Exit
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Back Link */}
            <div className="mt-8 text-center">
              <Link
                href="/pricing"
                className="inline-flex items-center text-sm text-zinc-500 hover:text-[#e0332c]"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Pricing
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
