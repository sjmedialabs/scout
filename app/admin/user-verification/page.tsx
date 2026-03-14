"use client";

import EditSubscriberModal from "@/components/EditSubscriberModal";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Pencil, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus } from "lucide-react";
import { authFetch } from "@/lib/auth-fetch";

/* ---------------- TYPES ---------------- */

type Subscriber = {
  id: string;
  company: string;
  email: string;
  role: "client" | "agency";
  plan: string;
  status: "Active" | "Inactive" | "Suspended";
  users: number;
  revenue: number;
  joined: string;
  billingCycle?: "Monthly" | "Yearly";
};



export default function AllSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const[subscriptions,setSubscriptions]=useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [role, setRole] = useState<"all" | "client" | "agency">("all");

 const toggleStatus = async (sub: Subscriber) => {
  // const sub = subscribers[index];
  console.log("recived sub::::",sub)
  // const newIsActive = sub.status === "Active" ? false : true;

  try {
    const res = await authFetch(`/api/providers/${sub.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isVerified: !sub.isVerified,
      }),
    });

    if (!res.ok) throw new Error("Update failed");

    // Update UI after DB success
    setSubscribers((prev) =>
      prev.map((s, i) =>
        s.id === sub.id
          ? { ...s, isVerified: !s.isVerified}
          : s
      )
    );
  } catch (error) {
    alert("Failed to update user status");
  }
};


async function loadSubscribers() {
    try {
      setLoading(true)


      const res = await authFetch("/api/providers");
      const subsRes=await authFetch("/api/subscription");

      if (!res.ok || !subsRes.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      const subsData=await subsRes.json();
      
      setSubscribers(data.providers);
      setSubscriptions(subsData)
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
  

  loadSubscribers();
}, [role]);


console.log("Subscrbefrs are :::::",subscribers)
  const filtered = subscribers.filter((s) => {
  const searchText = search.toLowerCase();

  const matchesSearch =
    s.name?.toLowerCase().includes(searchText) ||
    s.email?.toLowerCase().includes(searchText);

  const matchesStatus =
    status === "all"
      ? true
      : status === "verified"
      ? s.isVerified === true
      : s.isVerified === false;

  return matchesSearch && matchesStatus;
});


const getPlanName=(recievedProvider)=>{
  let name="Free Trail"
   subscriptions.map((item)=>{
    if(item._id===recievedProvider?.subscriptionDetails?.subscriptionPlanId){
      name=item.title
    }
   })
  return name;
}
if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }


  return (
    <div className="mx-auto max-w-7xl   space-y-2">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold  text-orangeButton">
            User Verification

          </h1>
          <p className="text-gray-500  text-md">
            Review documents and verify provider/business profiles.
          </p>
        </div>

        
      </div>

      {/* FILTERS */}
      <div className="flex flex-row  gap-4">
        <div className="border rounded-full h-[35px] lg:w-100">
          <Input
            placeholder="Search Subscribers"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[35px] rounded-full placeholder:text-gray-500 bg-transparent"
          />
        </div>
        <div className="">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="rounded-full h-[40px] w-[120px] border text-xs border-gray-200  py-0 flex items-center ">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">unVerified</SelectItem>
              
            </SelectContent>        
          </Select>
        </div>

        {/* <div className="rounded-xl border">
          <Select value={role} onValueChange={(v) => setRole(v as any)}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="client">Clients</SelectItem>
              <SelectItem value="agency">Agencies</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto max-w-[95vw] rounded-2xl border bg-white shadow-md">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm font-semibold border-b">
              <th className="p-4 ">Company</th>
              <th className="p-4 ">Plan</th>
              <th className="p-4 ">Status</th>
              
             
              <th className="p-4 ">Join Date</th>
              <th className="p-4 ">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((sub, i) => (
              <tr
                key={i}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <div className="font-bold text-sm h-4 ">
                    {sub.name}
                  </div>
                  <div className="text-sm text-gray-500">{sub.email}</div>
                </td>

                <td className="p-4">
                  <Badge
                    className={
                      getPlanName(sub) === "Free Trial"
                        ? "bg-yellow-100 text-yellow-700 rounded-2xl"
                        : sub.plan === "—"
                        ? "bg-gray-50 text-gray-400 rounded-2xl"
                        : sub.plan === "Pro"
                        ? "bg-pink-100 text-pink-600 rounded-2xl"
                        : "bg-blue-100 text-blue-600 rounded-2xl"
                    }
                  >
                    {getPlanName(sub)}
                  </Badge>

                </td>

                <td className="p-4">
                  <Badge
                    className={
                      sub.isVerified
                        ? "bg-green-100 text-green-600 rounded-2xl"
                        : "bg-red-200 text-red-600 rounded-2xl"
                    }
                  >
                    {sub.isVerified?"Verified":"Unverified"}
                  </Badge>
                </td>

                

               
                <td className="p-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                 {new Date(sub.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <div className="flex items-center justify-center gap-3">
                    {/* <EditSubscriberModal subscriber={sub} /> */}
                    <UserX
                    onClick={() => toggleStatus(sub)}
                    className={`h-4 w-4 cursor-pointer ${
                      sub.isVerified
                        ? "text-red-600 hover:text-red-800"
                        : "text-green-600 hover:text-green-800"
                    }`}
                  />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
