"use client";

import type React from "react";
import { authFetch } from "@/lib/auth-fetch";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "@/lib/toast";
import { MdVerified } from "react-icons/md";
import { LuCircleX } from "react-icons/lu";
import {
  Plus,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Eye,
  Home,
  User,
  Briefcase,
  BarChart3,
  Settings,
  CreditCard,
  Bell,
  Shield,
  GitCompare,
  ChevronDown,
  ChevronRight,
  Edit,
  Save,
  X,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  MoreHorizontal,
  Trash2,
  DollarSign,
  Target,
  Heart,
  SeparatorVertical as Separator,
} from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";

const styles = {
  input:
    "border-2 rounded-[8px] border-[#D0D5DD] placeholder:text-gray-300",
 
  label:"text-[#000000] font-normal text-sm mb-0 my-custom-class ml-1 -mb-0.5",

  inputCardContainer:
    "border-2 rounded-[8px] border-[#D0D5DD] placeholder:text-gray-300",

  paraTag:
    "text-sm py-2 my-custom-class ml-[10px]",

  descriptionText:
    "text-gray-500 text-sm",

  badge:
    "text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full",
};

const ClientProfilePage = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [responseLoading, setResponseLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const { user, loading } = useCurrentUser();
  const [profileData, setProfileData] = useState({});
  console.log("userDeatails:::", user);
  const requiredFields = [
    "name",
    "email",
    "phoneNumber",
    "companyName",
    "position",
    "industry",
    "bio",
  ];
  const loadData = async (userId: String) => {
    setResponseLoading(true);
    setFailed(false);
    try {
      const response = await authFetch(`/api/seeker/${userId}`);
      if (!response.ok) {
        throw new Error("Failed response");
      }
      const data = await response.json();
      console.log("getting data:::", data);
      setProfileData(data.data);
      setFailed(false);
    } catch (error) {
      console.log("Failed to get the details", error);
      setFailed(true);
    } finally {
      setResponseLoading(false);
    }
  };
  useEffect(() => {
    if (!loading && user) {
      // setUserDetails(user);
      loadData(user.userId);
    }
  }, [user, loading]);
  const handleProfileUpdate = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^[6-9]\d{9}$/.test(phone); // Indian phone numbers
  };

  const isValidURL = (url: string) => {
  return /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/.test(url);
};

  const handleSaveProfile = async () => {
    // In a real app, this would make an API call to update the profile
    try {
      for (const field of requiredFields) {
        if (!profileData[field]?.trim()) {
          toast.error(`${field.replace(/([A-Z])/g, " $1")} is required`);
          return;
        }
      }

      // 🔹 Email validation
      if (!isValidEmail(profileData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      // 🔹 Phone validation
      if (!isValidPhone(profileData.phoneNumber)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }

      if(profileData.website && !isValidURL(profileData.website)) {
        toast.error("Please enter a valid website URL");
        return;
      }

      const response = await authFetch(`/api/seeker/${user.userId}`, {
        method: "PUT",
        body: JSON.stringify(profileData),
        credentials: "include",
      });

      const data=await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      if (response.ok) {
        toast.success("User details updated successfully");
        setIsEditingProfile(false);
      }
    } catch (error: any) {
      console.log("failed to save::", error);
      toast.error(error.message || "Failed to update profile");
    }
    // Show success message or toast
  };

  const handleCancelEdit = () => {
    // Reset to original data if needed
    setIsEditingProfile(false);
  };

  if (loading || responseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  // if(failed){
  //     return(
  //       <div className="flex flex-col justify-center items-center text-center">
  //         <h1 className="text-center font-semibold">Failed  to Retrive the data</h1>
  //         <Button onClick={loadData} className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]">Reload</Button>
  //       </div>
  //     )
  // }

  return (
    <div className="space-y-3 -mt-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#c4c3c3] pb-2 gap-4 ">
        {/* Left section */}
        <div className="w-full">
          <h1 className="text-xl font-bold my-custom-class text-[#F54A0C] ">
            Profile Overview
          </h1>
          <p className="text-[#656565] text-sm md:text-md my-custom-class font-normal">
            Manage your client profile information
          </p>
        </div>

        {/* Right section */}
        <div className="flex gap-2 w-full md:w-auto justify-start md:justify-end">
          {isEditingProfile ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="h-[40px] w-[100px] rounded-3xl bg-[#E8E8E8]"
              >
                <LuCircleX className="h-4 w-4 mr-1" />
                Cancel
              </Button>

              <Button
                onClick={handleSaveProfile}
                className="h-[40px] w-[140px] rounded-3xl bg-[#000]"
              >
                <Save className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditingProfile(true)}
              className="h-[30px] w-[140px] rounded-3xl bg-[#000]"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="lg:col-span-1 bg-[#fff] rounded-[24px] ">
          <CardHeader>
            {/* <CardTitle className="-mt-3 text-center text-[#F54A0C]  font-bold text-[14px] my-custom-class">
              Profile Overview
            </CardTitle> */}
          </CardHeader>
          <CardContent className="space-y-2 px-0 py-0 -mt-5">
            <div className="flex flex-col items-center text-center">
              {isEditingProfile ? (
                <div className="space-y-2 m-5 items-center">
                  <ImageUpload
                    label="Profile Image"
                    value={profileData.image}
                    onChange={(value) =>
                      setProfileData({ ...profileData, image: value })
                    }
                    description="Upload your Profile image (PNG, JPG) or provide a URL"
                    previewClassName="w-24 h-24"
                  />
                </div>
              ) : (
                <div className="h-[110px] w-[110px] rounded-full overflow-hidden  flex items-center justify-center">
                  <img
                    src={profileData.image || "/uploadImage.png"}
                    alt={profileData.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-md font-bold my-custom-class text-[#F54A0C]">
                {profileData.name}
              </h3>
              <p className="text-xs   text-[#656565] my-custom-class font-normal">
                {profileData.position}
              </p>
              <p className="text-xs   text-[#656565] my-custom-class font-normal">
                {profileData.companyName}
              </p>
              <div className="flex gap-2 mt-3 my-custom-class">
                {/* <Badge className="bg-[#39A935] text-[#fff] h-[30px] w-[90px] font-light rounded-3xl">
                  Active User
                </Badge> */}
               {
                profileData.isVerified && (
                   <Badge
                  variant="secondary"
                  className="bg-[#2C34A1] h-[30px] w-[90px] font-light rounded-3xl"
                >
                  <MdVerified color="#fff" height={16} width={16} />
                  Verified
                </Badge>
                )
               }
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-[#E6E6E6] mt-2">
              <div className="flex items-center gap-2 text-sm pb-3 px-6 border-b border-[#E6E6E6]">
                <MapPin className="h-6 w-6 text-muted-foreground" />
                <span>{profileData.location || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 pb-3 text-sm px-6 border-b border-[#E6E6E6]">
                <Calendar className="h-6 w-6 text-muted-foreground" />
                <span className="mt-0.5">{new Date(profileData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 pb-3 text-sm px-6">
                <Building className="h-6 w-6 text-muted-foreground" />
                <span>{profileData.companySize || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2 bg-[#fff] rounded-[24px]">
          <CardHeader>
            <CardTitle className="-mt-3 text-[#F54A0C]  font-semibold text-[14px] my-custom-class">
              Profile Details
            </CardTitle>
            <CardDescription className="text-[14px] font-normal text-[#656565] -mt-2 my-custom-class">
              {isEditingProfile
                ? "Edit your profile information"
                : "Your profile information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 -mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className={styles.label}
                >
                  Full Name
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="name"
                    className={styles.input}
                    placeholder="Enter your full name"
                    value={profileData.name}
                    onChange={(e) =>
                      handleProfileUpdate("name", e.target.value)
                    }
                  />
                ) : (
                  <div className={`${styles.inputCardContainer} ${!profileData.name ? "text-gray-300":""}`}>
                    {" "}
                    <p className={styles.paraTag}>
                      {profileData?.name || "No name provided"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className={styles.label}
                >
                  Email Address
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="email"
                    className={styles.input}
                    placeholder="Enter your company email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      handleProfileUpdate("email", e.target.value)
                    }
                  />
                ) : (
                  <div className={`${styles.inputCardContainer} ${!profileData.email ? "text-gray-300":""}`}>
                    {" "}
                    <p className={styles.paraTag}>
                      {profileData.email || "No email provided"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className={styles.label}
                >
                  Phone Number
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="phone"
                    className={styles.input}
                    placeholder="Enter your phone number"
                    value={profileData.phoneNumber}
                    onChange={(e) =>
                      handleProfileUpdate("phoneNumber", e.target.value)
                    }
                  />
                ) : (
                  <div className={`${styles.inputCardContainer} ${!profileData.phoneNumber ? "text-gray-300":""}`}>
                    {" "}
                    <p className={styles.paraTag}>
                      {profileData.phoneNumber || "No phone number provided"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="company"
                  className={styles.label}
                >
                  Company
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="company"
                    className={styles.input}
                    placeholder="Enter your company name"
                    value={profileData.companyName}
                    onChange={(e) =>
                      handleProfileUpdate("companyName", e.target.value)
                    }
                  />
                ) : (
                  <div className={`${styles.inputCardContainer} ${!profileData.companyName ? "text-gray-300":""}`}>
                    {" "}
                    <p className={styles.paraTag}>
                      {profileData.companyName || "No company name provided"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="position"
                  className={styles.label}
                >
                  Position
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="position"
                    className={styles.input}
                    placeholder="Enter your position in the company"
                    value={profileData.position}
                    onChange={(e) =>
                      handleProfileUpdate("position", e.target.value)
                    }
                  />
                ) : (
                  <div className={`${styles.inputCardContainer} ${!profileData.position ? "text-gray-300":""}`}>
                    {" "}
                    <p className={styles.paraTag}>
                      {profileData.position || "No position provided"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="industry"
                  className={styles.label}
                >
                  Industry
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileData.industry}
                    onValueChange={(value) =>
                      handleProfileUpdate("industry", value)
                    }
                  >
                    <SelectTrigger className={styles.input}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Manufacturing">
                        Manufacturing
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className={`${styles.inputCardContainer} ${!profileData.industry ? "text-gray-300":""}`}>
                    {" "}
                    <p className={styles.paraTag}>
                      {profileData.industry || "No industry provided"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className={styles.label}
                >
                  City Name
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="location"
                    className={styles.input}
                    placeholder="Enter your city name"
                    value={profileData.location}
                    onChange={(e) =>
                      handleProfileUpdate("location", e.target.value)
                    }
                  />
                ) : (
                  <div className={`${styles.inputCardContainer} ${!profileData.location ? "text-gray-300":""}`}>
                    {" "}
                    <p className={styles.paraTag}>
                      {profileData.location || "No location provided"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="website"
                  className={styles.label}
                >
                  Website
                </Label>
                {isEditingProfile ? (
                  <Input
                    id="website"
                    className={styles.input}
                    placeholder="htts://media.com"
                    value={profileData.website}
                    onChange={(e) =>
                      handleProfileUpdate("website", e.target.value)
                    }
                  />
                ) : (
                  <div className={`${styles.inputCardContainer} ${!profileData.website ? "text-gray-300":""}`}>
                    {" "}
                    <p className={styles.paraTag}>
                      {profileData.website || "No website provided"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className={styles.label}
              >
                Bio
              </Label>
              {isEditingProfile ? (
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  className={styles.input}
                  placeholder="about your company"
                  onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                  rows={4}

                  
                  placeholder="Tell us about yourself and your company..."
                />
              ) : (

                <div className={`${styles.inputCardContainer} ${!profileData.bio ? "text-gray-300":""}`}>
                  <p className={styles.paraTag}>
                  {profileData.bio || "No bio provided"} 
                </p>
                </div>
                
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="timezone"
                  className={styles.label}
                >
                  Timezone
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileData.timeZone}
                    onValueChange={(value) =>
                      handleProfileUpdate("timeZone", value)
                    }
                  >
                    <SelectTrigger className={`${styles.input} data-[placeholder]:text-gray-300`}>
                      <SelectValue  placeholder="Select timezone"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="Europe/London">GMT</SelectItem>
                      <SelectItem value="Europe/Paris">CET</SelectItem>
                      <SelectItem value="Asia/Tokyo">JST</SelectItem>
                      <SelectItem value="Asia/Kolkata">
                        Indian Standard Time (IST)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className={`${styles.inputCardContainer} ${!profileData.timeZone ? "text-gray-300":""}`}>
                    {" "}
                    <p className={styles.paraTag}>
                      {profileData.timeZone || "No timezone provided"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="communication"
                  className={styles.label}
                >
                  Preferred Communication
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileData.preferredCommunication}
                    onValueChange={(value) =>
                      handleProfileUpdate("preferredCommunication", value)
                    }
                  >
                    <SelectTrigger className={`${styles.input} data-[placeholder]:text-gray-300`}>
                      <SelectValue  placeholder="Select preferred communication method"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                      <SelectItem value="video">Video Call</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className={`${styles.inputCardContainer} ${!profileData.preferredCommunication ? "text-gray-300":""}`}>
                    {" "}
                    <p className={styles.paraTag}>
                      {profileData.preferredCommunication || "No preferred communication method provided"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="budget"
                  className={styles.label}
                >
                  Typical Project Budget
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileData.typicalProjectBudget}
                    onValueChange={(value) =>
                      handleProfileUpdate("typicalProjectBudget", value)
                    }
                  >
                    <SelectTrigger className={`${styles.input} data-[placeholder]:text-gray-300`}>
                      <SelectValue  placeholder="Select typical project budget"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$1,000 - $5,000">
                        $1,000 - $5,000
                      </SelectItem>
                      <SelectItem value="$5,000 - $10,000">
                        $5,000 - $10,000
                      </SelectItem>
                      <SelectItem value="$10,000 - $50,000">
                        $10,000 - $50,000
                      </SelectItem>
                      <SelectItem value="$50,000 - $100,000">
                        $50,000 - $100,000
                      </SelectItem>
                      <SelectItem value="$100,000+">$100,000+</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className={`${styles.inputCardContainer} ${!profileData.typicalProjectBudget ? "text-gray-300":""}`}>
                    {" "}
                    <p className={styles.paraTag}>
                      {profileData.typicalProjectBudget || "No typical project budget provided"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="companySize"
                  className={styles.label}
                >
                  Company Size
                </Label>
                {isEditingProfile ? (
                  <Select
                    value={profileData.companySize}
                    onValueChange={(value) =>
                      handleProfileUpdate("companySize", value)
                    }
                  >
                    <SelectTrigger className={`${styles.input} data-[placeholder]:text-gray-300`}>
                      <SelectValue  placeholder="Select company size"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10 employees">
                        1-10 employees
                      </SelectItem>
                      <SelectItem value="11-50 employees">
                        11-50 employees
                      </SelectItem>
                      <SelectItem value="51-200 employees">
                        51-200 employees
                      </SelectItem>
                      <SelectItem value="201-500 employees">
                        201-500 employees
                      </SelectItem>
                      <SelectItem value="500+ employees">
                        500+ employees
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className={`${styles.inputCardContainer} ${!profileData.companySize ? "text-gray-300":""}`}>
                    {" "}
                    <p className={styles.paraTag}>
                      {profileData.companySize || "No company size provided"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default ClientProfilePage;
