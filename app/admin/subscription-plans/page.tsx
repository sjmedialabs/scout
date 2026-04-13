"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Check, X, CreditCard, PlusCircle, Loader2 } from "lucide-react";
import { ISubscription } from "@/lib/types";
import { authFetch } from "@/lib/auth-fetch";
import { AuthGuard } from "@/components/auth-guard";
import { toast } from "@/lib/toast";
import { Textarea } from "@/components/ui/textarea";

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<ISubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [freeTrailProposalCount, setFreeTrailProposalCount] = useState(0);
  const [freeTrailCaseStudiesCount, setFreeTrailCaseStudiesCount] = useState(0);
  const [freeTrailSending, setFreeTrailSending] = useState(false);

  // Feature tag-input state
  const [newFeatureInput, setNewFeatureInput] = useState("");
  const [planFeatureInput, setPlanFeatureInput] = useState<Record<string, string>>({});


  const [newPlan, setNewPlan] = useState({
    title: "",
    pricePerMonth: "",
    pricePerYear: "",
    proposalsPerMonth: "",
    caseStudiesCount: "",
    isFeatured: false,
    description: "",
    features: [] as string[],
    yearlySubscription: false,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await authFetch("/api/subscription");
      const freeTrailRes = await authFetch("/api/free-trail-config")

      if (res.ok && freeTrailRes.ok) {
        const data = await res.json();
        const freeTrailData = await freeTrailRes.json();

        console.log("Free Trail Plans Data::::", freeTrailData);
        setPlans(data);
        setFreeTrailProposalCount(freeTrailData.proposalLimit);
        setFreeTrailCaseStudiesCount(freeTrailData.caseStudiesCount ?? 0);
      }
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // ADD NEW PLAN
  // ------------------------------
  const addPlan = async () => {
    if (!newPlan.title || !newPlan.pricePerMonth) return;

    const newData = {
      title: newPlan.title,
      pricePerMonth: parseFloat(newPlan.pricePerMonth),
      pricePerYear:
        parseFloat(newPlan.pricePerYear) ||
        parseFloat(newPlan.pricePerMonth) * 12,
      proposalsPerMonth: parseInt(newPlan.proposalsPerMonth) || 0,
      caseStudiesCount: parseInt(newPlan.caseStudiesCount) || 0,
      isFeatured: newPlan.isFeatured,
      description: newPlan.description,
      features: newPlan.features,
      yearlySubscription: newPlan.yearlySubscription,
      isActive: true,
    };

    const res = await authFetch("/api/subscription", {
      method: "POST",
      body: JSON.stringify(newData),
    });

    if (res.ok) {
      const created = await res.json();
      setPlans((prev) => [...prev, created]);
      setNewPlan({
        title: "",
        pricePerMonth: "",
        pricePerYear: "",
        proposalsPerMonth: "",
        caseStudiesCount: "",
        isFeatured: false,
        description: "",
        features: [],
        yearlySubscription: false,
      });
      toast.success("Plan added successfully");
      await fetchPlans();
    }
  };

  // ------------------------------
  // EDIT PLAN
  // ------------------------------
  const saveEdit = async (id: string, updated: Partial<ISubscription>) => {
    const res = await authFetch(`/api/subscription/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      const result = await res.json();
      // Map API response (id) back to frontend interface (_id)
      const updatedPlan = { ...result.data, _id: result.data.id };
      setPlans((prev) => prev.map((p) => (p._id === id ? updatedPlan : p)));

      setEditingId(null);
      await fetchPlans();
    }
  };

  const togglePlanStatus = async (plan: ISubscription) => {
    await saveEdit(plan._id, { isActive: !plan.isActive });
  };

  // free trail plan updation

  const freeTrailProposalCountUpdate = async () => {
    setFreeTrailSending(true)
    try {
      const res = await authFetch("/api/free-trail-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          proposalLimit: freeTrailProposalCount,
          caseStudiesCount: freeTrailCaseStudiesCount,
        })
      })
      if (res.ok) {
        toast.success("Updated the Free trail config")
      }

    } catch (error) {
      console.log("Failed to update the free trail proposal count::::", error)
      toast.error("Failed to update please try again")
    } finally {
      setFreeTrailSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold  text-orangeButton">
          Subscription Plans
        </h1>
        <p className="text-gray-500 text-md ">
          Select the perfect plan for your business needs. Upgrade or downgrade
          at any time.
        </p>
      </div>

      {/*Free Plan */}

      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Update Free Trial Config
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Proposal Limit */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Free Proposals / Month</label>
            <Input
              className="border-gray-300 rounded-2xl placeholder:text-gray-500"
              type="number"
              min={1}
              placeholder="Number of free proposals"
              value={freeTrailProposalCount}
              onChange={(e) => setFreeTrailProposalCount(parseInt(e.target.value))}
            />
          </div>
          {/* Case Studies Count */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Free Case Studies Count</label>
            <Input
              className="border-gray-300 rounded-2xl placeholder:text-gray-500"
              type="number"
              min={0}
              placeholder="Number of free case studies"
              value={freeTrailCaseStudiesCount}
              onChange={(e) => setFreeTrailCaseStudiesCount(parseInt(e.target.value))}
            />
          </div>
        </div>

        <Button
          className={`${freeTrailSending ? "bg-orange-400 cursor-not-allowed" : "bg-orangeButton cursor-pointer"} primary-button h-[30px]`}
          disabled={freeTrailSending}
          onClick={freeTrailProposalCountUpdate}
        >
          {freeTrailSending ? "Updating..." : "Update"}
        </Button>
      </div>

      {/* ADD PLAN */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-2">
        <h2 className="text-xl font-semibold flex  items-center gap-2">
          Add New Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            className="border-gray-300 rounded-2xl placeholder:text-gray-500"
            placeholder="Enter Plan Title"
            value={newPlan.title}
            onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
          />
          <Input
            className="border-gray-300 rounded-2xl placeholder:text-gray-500"
            placeholder="Price / Month"
            type="number"
            value={newPlan.pricePerMonth}
            onChange={(e) =>
              setNewPlan({ ...newPlan, pricePerMonth: e.target.value })
            }
          />
          <Input
            className="border-gray-300 rounded-2xl placeholder:text-gray-500"
            placeholder="Price / Year"
            type="number"
            value={newPlan.pricePerYear}
            onChange={(e) =>
              setNewPlan({ ...newPlan, pricePerYear: e.target.value })
            }
          />
          <Input
            className="border-gray-300 rounded-2xl placeholder:text-gray-500"
            placeholder="Proposals / Month"
            type="number"
            min={0}
            value={newPlan.proposalsPerMonth}
            onChange={(e) =>
              setNewPlan({ ...newPlan, proposalsPerMonth: e.target.value })
            }
          />
          <Input
            className="border-gray-300 rounded-2xl placeholder:text-gray-500"
            placeholder="Case Studies Count"
            type="number"
            min={0}
            value={newPlan.caseStudiesCount}
            onChange={(e) =>
              setNewPlan({ ...newPlan, caseStudiesCount: e.target.value })
            }
          />
          <Select
            value={newPlan.isFeatured ? "true" : "false"}
            onValueChange={(val) =>
              setNewPlan({ ...newPlan, isFeatured: val === "true" })
            }
          >
            <SelectTrigger className="border-gray-300 rounded-2xl data-[placeholder]:text-gray-500 text-[#000]">
              <SelectValue placeholder="Featured?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Not Featured</SelectItem>
              <SelectItem value="true">Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Textarea
            className="border-gray-300 rounded-2xl placeholder:text-gray-500"
            placeholder="Enter plan description"
            value={newPlan.description}
            onChange={(e) =>
              setNewPlan({ ...newPlan, description: e.target.value })
            }
          />
        </div>

        {/* Feature Tag Input */}
        <div className="space-y-2 mb-2">
          <p className="text-sm text-[#000] font-semibold text-gray-600">Plan Features</p>
          <div className="flex gap-2">
            <Input
              className="border-gray-300 rounded-2xl placeholder:text-gray-500"
              placeholder="Type a feature and click Add"
              value={newFeatureInput}
              onChange={(e) => setNewFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newFeatureInput.trim()) {
                  e.preventDefault();
                  setNewPlan((prev) => ({
                    ...prev,
                    features: [...prev.features, newFeatureInput.trim()],
                  }));
                  setNewFeatureInput("");
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="primary-button h-[35px]"
              onClick={() => {
                if (newFeatureInput.trim()) {
                  setNewPlan((prev) => ({
                    ...prev,
                    features: [...prev.features, newFeatureInput.trim()],
                  }));
                  setNewFeatureInput("");
                }
              }}
            >
              <PlusCircle className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          {newPlan.features.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {newPlan.features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm px-3 py-1 rounded-xl"
                >
                  <span>{f}</span>
                  <button
                    type="button"
                    title="Edit feature"
                    onClick={() => {
                      setNewFeatureInput(f);
                      setNewPlan((prev) => ({
                        ...prev,
                        features: prev.features.filter((_, idx) => idx !== i),
                      }));
                    }}
                    className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    title="Remove feature"
                    onClick={() =>
                      setNewPlan((prev) => ({
                        ...prev,
                        features: prev.features.filter((_, idx) => idx !== i),
                      }))
                    }
                    className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>



        <Button
          className="primary-button h-[30px]"
          onClick={addPlan}
        >
          Add Plan
        </Button>
      </div>

      {/* PLANS */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orangeButton" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const isPopular = index === 1;

            return (
              <div
                key={plan._id}
                className={`relative bg-[#fafafa] border rounded-2xl p-8 flex flex-col h-full ${isPopular ? "border-gray-900 shadow-xl" : ""
                  }`}
              >
                {/* {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 bg-gray-900  text-white text-xs px-3 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-white text-white" />
                      Most Popular
                    </span>
                  </div>
                )} */}

                <h3 className="text-xl font-semibold text-center ">
                  {editingId === plan._id ? (
                    <Input
                      value={plan.title}
                      onChange={(e) =>
                        setPlans((prev) =>
                          prev.map((p) =>
                            p._id === plan._id
                              ? { ...p, title: e.target.value }
                              : p,
                          ),
                        )
                      }
                      className="border-gray-300 rounded-2xl placeholder:text-gray-500"
                    />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {plan.title}
                      {plan.isFeatured && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                          Featured
                        </span>
                      )}
                    </span>
                  )}
                </h3>

                {/* isFeatured select — edit mode only */}
                {editingId === plan._id && (
                  <div className="mt-2">
                    <Select
                      value={plan.isFeatured ? "true" : "false"}
                      onValueChange={(val) =>
                        setPlans((prev) =>
                          prev.map((p) =>
                            p._id === plan._id
                              ? { ...p, isFeatured: val === "true" }
                              : p,
                          ),
                        )
                      }
                    >
                      <SelectTrigger className="border-gray-300 rounded-2xl text-gray-500 w-full">
                        <SelectValue placeholder="Featured?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false">Not Featured</SelectItem>
                        <SelectItem value="true">Featured</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="text-center mt-4 ">
                  {editingId === plan._id ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={plan.pricePerMonth}
                        className="border-gray-300 rounded-2xl placeholder:text-gray-500"
                        onChange={(e) =>
                          setPlans((prev) =>
                            prev.map((p) =>
                              p._id === plan._id
                                ? {
                                  ...p,
                                  pricePerMonth: Number(e.target.value),
                                }
                                : p,
                            ),
                          )
                        }
                      />
                      <Input
                        type="number"
                        value={plan.pricePerYear}
                        className="border-gray-300 rounded-2xl placeholder:text-gray-500"
                        onChange={(e) =>
                          setPlans((prev) =>
                            prev.map((p) =>
                              p._id === plan._id
                                ? {
                                  ...p,
                                  pricePerYear: Number(e.target.value),
                                }
                                : p,
                            ),
                          )
                        }
                      />
                    </div>
                  ) : (
                    <p className="text-3xl font-bold">
                      ${plan.pricePerMonth}
                      <span className="text-sm text-gray-500 font-medium">
                        /monthly
                      </span>
                    </p>
                  )}
                </div>

                {/* Proposals / Month & Case Studies Count */}
                <div className="mt-3">
                  {editingId === plan._id ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min={0}
                        value={plan.proposalsPerMonth ?? 0}
                        className="border-gray-300 rounded-2xl placeholder:text-gray-500"
                        placeholder="Proposals / Month"
                        onChange={(e) =>
                          setPlans((prev) =>
                            prev.map((p) =>
                              p._id === plan._id
                                ? { ...p, proposalsPerMonth: Number(e.target.value) }
                                : p,
                            ),
                          )
                        }
                      />
                      <Input
                        type="number"
                        min={0}
                        value={plan.caseStudiesCount ?? 0}
                        className="border-gray-300 rounded-2xl placeholder:text-gray-500"
                        placeholder="Case Studies Count"
                        onChange={(e) =>
                          setPlans((prev) =>
                            prev.map((p) =>
                              p._id === plan._id
                                ? { ...p, caseStudiesCount: Number(e.target.value) }
                                : p,
                            ),
                          )
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center gap-4 text-sm text-gray-500">
                      <span>
                        <span className="font-semibold text-gray-700">{plan.proposalsPerMonth ?? 0}</span> proposals/mo
                      </span>
                      <span>
                        <span className="font-semibold text-gray-700">{plan.caseStudiesCount ?? 0}</span> case studies
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center mt-2">
                  {editingId === plan._id ? (
                    <Textarea
                      value={plan.description || ""}
                      onChange={(e) =>
                        setPlans((prev) =>
                          prev.map((p) =>
                            p._id === plan._id
                              ? { ...p, description: e.target.value }
                              : p,
                          ),
                        )
                      }
                      placeholder="Enter plan description"
                      className="border-gray-300 rounded-2xl placeholder:text-gray-500"
                    />
                  ) : (
                    <p className="text-gray-500 text-sm">
                      {plan.description || "Perfect for growing businesses"}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex-1">
                  {editingId === plan._id ? (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500">Features</p>
                      <div className="flex gap-2">
                        <Input
                          className="border-gray-300 rounded-2xl placeholder:text-gray-500 text-sm"
                          placeholder="Type a feature and click Add"
                          value={planFeatureInput[plan._id] || ""}
                          onChange={(e) =>
                            setPlanFeatureInput((prev) => ({
                              ...prev,
                              [plan._id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && planFeatureInput[plan._id]?.trim()) {
                              e.preventDefault();
                              setPlans((prev) =>
                                prev.map((p) =>
                                  p._id === plan._id
                                    ? { ...p, features: [...p.features, planFeatureInput[plan._id].trim()] }
                                    : p,
                                ),
                              );
                              setPlanFeatureInput((prev) => ({ ...prev, [plan._id]: "" }));
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="primary-button h-[35px]"
                          onClick={() => {
                            const val = planFeatureInput[plan._id]?.trim();
                            if (val) {
                              setPlans((prev) =>
                                prev.map((p) =>
                                  p._id === plan._id
                                    ? { ...p, features: [...p.features, val] }
                                    : p,
                                ),
                              );
                              setPlanFeatureInput((prev) => ({ ...prev, [plan._id]: "" }));
                            }
                          }}
                        >
                          <PlusCircle className="w-3.5 h-3.5 mr-1" />
                          Add
                        </Button>
                      </div>
                      {plan.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {plan.features.map((f, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-xl"
                            >
                              <span>{f}</span>
                              <button
                                type="button"
                                title="Edit feature"
                                onClick={() => {
                                  setPlanFeatureInput((prev) => ({ ...prev, [plan._id]: f }));
                                  setPlans((prev) =>
                                    prev.map((p) =>
                                      p._id === plan._id
                                        ? { ...p, features: p.features.filter((_, idx) => idx !== i) }
                                        : p,
                                    ),
                                  );
                                }}
                                className="text-gray-400 hover:text-blue-500 transition-colors"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                title="Remove feature"
                                onClick={() =>
                                  setPlans((prev) =>
                                    prev.map((p) =>
                                      p._id === plan._id
                                        ? { ...p, features: p.features.filter((_, idx) => idx !== i) }
                                        : p,
                                    ),
                                  )
                                }
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {plan.features.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-gray-500"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                          {f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* <Button
                  className={cn(
                    "mt-6",
                    isPopular
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-white border hover:bg-gray-50"
                  )}
                >
                  {plan.title === "Basic"
                    ? "Get Started Free"
                    : `Choose ${plan.title}`}
                </Button> */}

                <div className="mt-auto pt-6 flex items-center gap-3">
                  {editingId === plan._id ? (
                    <>
                      <Button
                        className="primary-button h-[30px]"
                        onClick={() => saveEdit(plan._id, plan)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        className="btn-blackButton h-[30px]"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setEditingId(plan._id)}
                      className="flex items-center gap-2 rounded-2xl"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  )}

                  <Button
                    onClick={() => togglePlanStatus(plan)}
                    className={
                      plan.isActive
                        ? "bg-red-100 text-red-700 hover:bg-red-200 rounded-2xl"
                        : "bg-green-100 text-green-700 hover:bg-green-200 rounded-2xl"
                    }
                  >
                    {plan.isActive ? "Disable" : "Activate"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
