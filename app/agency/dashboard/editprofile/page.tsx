"use client"

import { CompanyProfileEditor } from "@/components/provider/company-profile-editor";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const EditProfile = () => {

    const { user, loading } = useCurrentUser();

    const [provider, setProvider] = useState({
        id: "1",
        name: "Jane Smith",
        email: "jane@sparkdev.com",
        subscriptionTier: "standard",
        isVerified: true,
        isFeatured: true,
        profileCompletion: 85,
        totalProjects: 47,
        activeProjects: 8,
        completedProjects: 39,
        totalEarnings: 125000,
        monthlyEarnings: 12500,
        rating: 4.9,
        responseTime: "2 hours",
        successRate: 98,
        minimumBudget: 500,
        hourlyRate: { min: 25, max: 150 },
    });
    const[userDetails,setUserDetails]=useState({});
    const[providerDetails,setProviderDetails]=useState({});
    const[responseLoading,setResponseLoading]=useState(true);
    const[failed,setFailed]=useState(false)

    const loadData=async()=>{
        setResponseLoading(true);
        setFailed(false)
        try{
          const response=await fetch(`/api/providers/${userDetails.userId}`)
          const data=await response.json();
         
          setProviderDetails(data.provider)
        }catch(error){
            console.log("Failed to get the data::",error)
            setFailed(true)
        }
        finally{
            setResponseLoading(false)
        }
    }
    console.log("Provider Details::::",providerDetails);
    useEffect(() => {
        if (!loading && user) {
            console.log("Logged in user payload::::", user);
            setUserDetails(user);
            loadData();
        }
    }, [user, loading]);


    const handleSaveProfile = () => {
        console.log("Save Profile is called::::");
    };

    if(responseLoading){
        return(
             <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
        )
    }
    if(failed){
        return(
              <div className="flex flex-col justify-center items-center text-center">
                  <h1 className="text-center font-semibold">Failed  to Retrive the data</h1>
                  <Button onClick={loadData} className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]">Reload</Button>
                </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
                <p className="text-muted-foreground">Manage your company information and profile details</p>
            </div>

             {providerDetails && (<CompanyProfileEditor provider={providerDetails} onSave={handleSaveProfile} />)}
        </div>
    );
}

export default EditProfile;
