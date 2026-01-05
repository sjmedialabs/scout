"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit, Check, X, CreditCard, PlusCircle, Loader2 } from "lucide-react";
import { ISubscription } from "@/lib/types";

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<ISubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [newPlan, setNewPlan] = useState({
    title: "",
    pricePerMonth: "",
    pricePerYear: "",
    description: "",
    features: "",
    yearlySubscription: false,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/subscription");
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
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
      pricePerYear: parseFloat(newPlan.pricePerYear) || parseFloat(newPlan.pricePerMonth) * 12,
      description: newPlan.description,
      features: newPlan.features.split(",").map((f) => f.trim()),
      yearlySubscription: newPlan.yearlySubscription,
      isActive: true,
    };

    const res = await fetch("/api/subscription", {
      method: "POST",
      body: JSON.stringify(newData),
    });

    if (res.ok) {
      const created = await res.json();
      setPlans((prev) => [...prev, created]);
      setNewPlan({ title: "", pricePerMonth: "", pricePerYear: "", description: "", features: "", yearlySubscription: false });
    }
  };

  // ------------------------------
  // EDIT PLAN
  // ------------------------------
  const saveEdit = async (id: string, updated: Partial<ISubscription>) => {
    const res = await fetch(`/api/subscription/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      const result = await res.json();
      // Map API response (id) back to frontend interface (_id)
      const updatedPlan = { ...result.data, _id: result.data.id };
      setPlans((prev) =>
        prev.map((p) => (p._id === id ? updatedPlan : p))
      );
      setEditingId(null);
    }
  };

  const togglePlanStatus = async (plan: ISubscription) => {
    await saveEdit(plan._id, { isActive: !plan.isActive });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-gray-500">Create and manage pricing tiers for the platform.</p>
      </div>

      {/* Add New Plan */}
      <div className="bg-white p-6 rounded-xl shadow border space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-blue-600" />
          Add New Plan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Plan Title"
            value={newPlan.title}
            onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
          />
          <Input
            placeholder="Price/Month"
            type="number"
            value={newPlan.pricePerMonth}
            onChange={(e) => setNewPlan({ ...newPlan, pricePerMonth: e.target.value })}
          />
          <Input
            placeholder="Price/Year"
            type="number"
            value={newPlan.pricePerYear}
            onChange={(e) => setNewPlan({ ...newPlan, pricePerYear: e.target.value })}
          />
          <Input
            placeholder="Features (comma separated)"
            value={newPlan.features}
            onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
          />
        </div>
        
        <div className="flex items-center gap-2">
            <input 
                type="checkbox" 
                id="yearlySub"
                checked={newPlan.yearlySubscription}
                onChange={(e) => setNewPlan({...newPlan, yearlySubscription: e.target.checked})}
                className="w-4 h-4"
            />
            <label htmlFor="yearlySub" className="text-sm text-gray-700">Yearly Subscription Only?</label>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700" onClick={addPlan}>
          Add Plan
        </Button>
      </div>

      {/* Plans List */}
      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-blue-600" /></div>
      ) : (
      <div className="space-y-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-xl transition-all"
          >
            {/* Top: Plan Info */}
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  {editingId === plan._id ? (
                    <Input
                      value={plan.title}
                      onChange={(e) =>
                        setPlans((prev) =>
                          prev.map((p) =>
                            p._id === plan._id ? { ...p, title: e.target.value } : p
                          )
                        )
                      }
                      className="font-semibold text-xl"
                    />
                  ) : (
                    <h3 className="text-xl font-semibold">{plan.title}</h3>
                  )}

                  <p className="text-gray-600 mt-1">
                    {editingId === plan._id ? (
                      <div className="flex gap-2">
                      <Input
                        placeholder="Month"
                        value={plan.pricePerMonth}
                        onChange={(e) =>
                          setPlans((prev) =>
                            prev.map((p) =>
                              p._id === plan._id ? { ...p, pricePerMonth: parseFloat(e.target.value) } : p
                            )
                          )
                        }
                      />
                      <Input
                        placeholder="Year"
                        value={plan.pricePerYear}
                        onChange={(e) =>
                          setPlans((prev) =>
                            prev.map((p) =>
                              p._id === plan._id ? { ...p, pricePerYear: parseFloat(e.target.value) } : p
                            )
                          )
                        }
                      />
                      </div>
                    ) : (
                      <span className="font-bold text-lg">
                        ${plan.pricePerMonth}/mo • ${plan.pricePerYear}/yr
                      </span>
                    )}
                  </p>

                  {/* Features */}
                  <div className="mt-2">
                    {editingId === plan._id ? (
                      <Input
                        value={plan.features.join(", ")}
                        onChange={(e) =>
                          setPlans((prev) =>
                            prev.map((p) =>
                              p._id === plan._id
                                ? { ...p, features: e.target.value.split(",").map((f) => f.trim()) }
                                : p
                            )
                          )
                        }
                      />
                    ) : (
                      <ul className="text-gray-600 list-disc ml-5">
                        {plan.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Status */}
                  <div className="mt-3">
                    <Badge
                      className={
                        plan.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {plan.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {editingId === plan._id ? (
                  <>
                    <Button
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => saveEdit(plan._id, plan)}
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setEditingId(plan._id)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                )}

                <Button
                  className={
                    plan.isActive
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }
                  onClick={() => togglePlanStatus(plan)}
                >
                  {plan.isActive ? "Disable" : "Activate"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
