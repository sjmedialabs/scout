"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Edit, Check, X, CreditCard, PlusCircle } from "lucide-react";

// ------------------------------
// MOCK DATA (Replace with API)
// ------------------------------
const mockPlans = [
  {
    id: "plan-basic",
    name: "Basic Plan",
    price: 99,
    duration: "Monthly",
    features: ["Limited Access", "Email Support"],
    status: "active",
  },
  {
    id: "plan-pro",
    name: "Pro Plan",
    price: 199,
    duration: "Monthly",
    features: ["Full Access", "Priority Support", "Faster Matching"],
    status: "active",
  },
  {
    id: "plan-enterprise",
    name: "Enterprise Plan",
    price: 499,
    duration: "Yearly",
    features: ["Dedicated Manager", "API Access", "Unlimited Usage"],
    status: "inactive",
  },
];

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState(mockPlans);
  const [editingId, setEditingId] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    duration: "Monthly",
    features: "",
  });

  /*
  ---------------------------------------------------
  OPTIONAL: Fetch subscription plans from backend API
  ---------------------------------------------------
  useEffect(() => {
    async function loadPlans() {
      const res = await fetch("/api/admin/subscription-plans");
      const data = await res.json();
      setPlans(data);
    }
    loadPlans();
  }, []);
  */

  // ------------------------------
  // ADD NEW PLAN
  // ------------------------------
  const addPlan = () => {
    if (!newPlan.name || !newPlan.price) return;

    const newData = {
      id: "plan-" + Math.random().toString(36).substring(2, 8),
      name: newPlan.name,
      price: parseFloat(newPlan.price),
      duration: newPlan.duration,
      features: newPlan.features.split(",").map((f) => f.trim()),
      status: "active",
    };

    setPlans((prev) => [...prev, newData]);
    setNewPlan({ name: "", price: "", duration: "Monthly", features: "" });

    // Future API:
    // await fetch("/api/admin/subscription-plans/add", { method: "POST", body: JSON.stringify(newData) });
  };

  // ------------------------------
  // EDIT PLAN
  // ------------------------------
  const saveEdit = (id: string, updated: any) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    setEditingId(null);
  };

  const togglePlanStatus = (id: string) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p
      )
    );
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
            placeholder="Plan Name"
            value={newPlan.name}
            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
          />
          <Input
            placeholder="Price (e.g. 199)"
            value={newPlan.price}
            onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
          />
          <select
            className="border rounded-lg px-3 py-2"
            value={newPlan.duration}
            onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
          >
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Yearly</option>
          </select>
          <Input
            placeholder="Features (comma separated)"
            value={newPlan.features}
            onChange={(e) => setNewPlan({ ...newPlan, features: e.target.value })}
          />
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700" onClick={addPlan}>
          Add Plan
        </Button>
      </div>

      {/* Plans List */}
      <div className="space-y-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-xl transition-all"
          >
            {/* Top: Plan Info */}
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center shadow">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  {editingId === plan.id ? (
                    <Input
                      value={plan.name}
                      onChange={(e) =>
                        setPlans((prev) =>
                          prev.map((p) =>
                            p.id === plan.id ? { ...p, name: e.target.value } : p
                          )
                        )
                      }
                      className="font-semibold text-xl"
                    />
                  ) : (
                    <h3 className="text-xl font-semibold">{plan.name}</h3>
                  )}

                  <p className="text-gray-600 mt-1">
                    {editingId === plan.id ? (
                      <Input
                        value={plan.price}
                        onChange={(e) =>
                          setPlans((prev) =>
                            prev.map((p) =>
                              p.id === plan.id ? { ...p, price: e.target.value } : p
                            )
                          )
                        }
                      />
                    ) : (
                      <span className="font-bold text-lg">
                        ${plan.price.toLocaleString()}
                      </span>
                    )}
                    {" "} / {plan.duration}
                  </p>

                  {/* Features */}
                  <div className="mt-2">
                    {editingId === plan.id ? (
                      <Input
                        value={plan.features.join(", ")}
                        onChange={(e) =>
                          setPlans((prev) =>
                            prev.map((p) =>
                              p.id === plan.id
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
                        plan.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }
                    >
                      {plan.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {editingId === plan.id ? (
                  <>
                    <Button
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      onClick={() => saveEdit(plan.id, plan)}
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
                    onClick={() => setEditingId(plan.id)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                )}

                <Button
                  className={
                    plan.status === "active"
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }
                  onClick={() => togglePlanStatus(plan.id)}
                >
                  {plan.status === "active" ? "Disable" : "Activate"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
