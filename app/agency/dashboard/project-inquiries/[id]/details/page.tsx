"use client"
import { useState,useEffect } from "react"
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { authFetch } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";
import { Requirement } from "@/lib/types";
import { Clock, MapPin, Briefcase, DollarSign } from "lucide-react";
import RequirementCard from "@/components/provider/requirement-card";

export default function PostedRequirementDetailPage(){
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [resLoading, setResLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [requirement, setRequirement] = useState<Requirement[]>([]);
    const[isProposalSubmitted,setIsProposalSubmitted]=useState(false);
    const loadData = async () => {
    setResLoading(true);
    setFailed(false);
    try {
        const res = await authFetch(`/api/requirements/${id}`);
         const allRequirements = await authFetch("/api/requirements/agency");
        
        if (res.ok && allRequirements.ok) {
        const data = await res.json();
        const allData = await allRequirements.json();
        const filteredRequirements = allData.requirements.find(
            (eachItem) => eachItem._id===id)
        
               console.log("Filtered Requirement in detail::::",filteredRequirements)
        setFailed(false);
        setRequirement(data.requirements[0]);
        setIsProposalSubmitted(filteredRequirements.hasSubmittedProposal)

        console.log("Requirement details::::",data.requirements[0])
        
        }
    } catch (error) {
        console.log("Failed to fetch project details::::", error);
        setFailed(true);
    } finally {
        setResLoading(false);
    }
    };
  
    useEffect(() => {
        loadData();
    }, []);
     if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
    return(
        <>
        <RequirementCard data={requirement} isProposalSubmitted={isProposalSubmitted} />
        </>
    )
}