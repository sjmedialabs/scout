"use client";

import { CompanyProfileEditor } from "@/components/provider/company-profile-editor";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useEffect, useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { authFetch } from "@/lib/auth-fetch";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const EditProfile = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

 
  const [userDetails, setUserDetails] = useState({});
  const [providerDetails, setProviderDetails] = useState({});
  const [responseLoading, setResponseLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [isCaseStudiesLimitReached, setIsCaseStudiesLimitReached] = useState(false);

  const[serviceRequests,setServiceRequests]=useState([]);
  console.log("fetched user Details are from the edit profie is:::::", user)

  const loadData = async () => {
    setResponseLoading(true);
    setFailed(false);
    try {
      const response = await authFetch(`/api/providers/${user?.id}`);
      const userRes = await authFetch(`/api/users/${user?.id}`)
      const data = await response.json();
      const userData = await userRes.json();

      const serviceRequestsRes=await authFetch(`/api/servicerequests`);
      const serviceRequestsData=await serviceRequestsRes.json();
      console.log("Service Requests data::::", serviceRequestsData)
      
      setUserDetails(userData);
      setProviderDetails(data.provider);
      setServiceRequests(serviceRequestsData.serviceRequests);

      
      //  if(userData.subscription.type==="paid"){

      //     if ((data.provider?.caseStudies.length || 0) >= (userData?.user?.caseStudiesLimit || 0)) {
      //       console.log("Entered into if condition:::::::::::::", userData?.subscription?.caseStudiesCount, data.provider?.caseStudies.length)
      //       setIsCaseStudiesLimitReached(true)
      //     }

           
      //   }
      //   else{
      //         if ((data.provider?.caseStudies.length || 0) >= (userData?.subscription?.caseStudiesCount || 0)) {
      //           console.log("Entered into if condition:::::::::::::", userData?.subscription?.caseStudiesCount, data.provider?.caseStudies.length)
      //           setIsCaseStudiesLimitReached(true)
      //         }

              
      //   }

    } catch (error) {
      console.log("Failed to get the data::", error);
      setFailed(true);
    } finally {
      setResponseLoading(false);
    }
  };
  console.log("Provider Details::::", providerDetails);



  const handleSaveProfile = async (recievedData: any) => {
    console.log("Recieved Form Data to handle save profile:::", recievedData);

    try {
      const response = await authFetch(`/api/providers/${user?.id}`, {
        method: "PUT",
        body: JSON.stringify(recievedData),
      });
      const data = await response.json();
      console.log("Save profile data:::::", data)
      if (response.ok) {
        toast.success("Successfully updated the profile details");
      }
      console.log("Update api response::::", data);
    } catch (error) {
      console.log("Failed to save the data please try again:::", error);
      toast.error("Failed to update the details");
    }
  };
  useEffect(() => {
    if (!loading && (!user || user.role !== "agency")) {
      router.push("/login");
    }
    if (user && user.role === "agency") {
      loadData();
    }
  }, [user, loading, router]);

  if (responseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (failed) {
    return (
      <div className="flex flex-col justify-center items-center text-center">
        <h1 className="text-center font-semibold">
          Failed to Retrive the data
        </h1>
        <Button
          onClick={loadData}
          className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]"
        >
          Reload
        </Button>
      </div>
    );
  }
 
  return (
    <div className="space-y-1">
      {/* <div>
        <h1 className="text-3xl font-bold text-[#F4561C] my-custom-class mb-0">
          Edit Profile
        </h1>
        <p className="text-[#656565] font-normal my-custom-class text-lg">
          Manage your company information and profile details
        </p>
        <hr className="w-full mt-5 border-1 border-[#707070]" />
      </div> */}

      {providerDetails && (
        <CompanyProfileEditor
          provider={providerDetails}
          userDetails={userDetails}
          serviceRequests={serviceRequests}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
};

export default EditProfile;
