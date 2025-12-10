"use client"

import { CompanyProfileEditor } from "@/components/provider/company-profile-editor";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useState } from "react";

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

    const loadData=async()=>{
        try{
          const response=await fetch(`/api/providers/${userDetails.userId}`)
          const data=await response.json();
          console.log("Profile Data:::::",data);
        }catch(error){
            console.log("Failed to get the data::",error)
        }
    }

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
                <p className="text-muted-foreground">Manage your company information and profile details</p>
            </div>

            <CompanyProfileEditor provider={provider} onSave={handleSaveProfile} />
        </div>
    );
}

export default EditProfile;
