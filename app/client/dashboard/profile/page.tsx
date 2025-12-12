



"use client"

import type React from "react"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
} from "lucide-react"
 const ClientProfilePage=()=>{
    const [isEditingProfile, setIsEditingProfile] = useState(false)
      const [profileData, setProfileData] = useState({
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        company: "Tech Innovations Inc.",
        position: "Chief Technology Officer",
        industry: "Technology",
        location: "San Francisco, CA",
        website: "https://techinnovations.com",
        bio: "Experienced technology leader with over 10 years in software development and digital transformation. Passionate about leveraging cutting-edge solutions to drive business growth.",
        timezone: "America/Los_Angeles",
        preferredCommunication: "email",
        projectBudgetRange: "$10,000 - $50,000",
        companySize: "51-200 employees",
        joinedDate: "January 2024",
      })
       const handleProfileUpdate = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveProfile = () => {
    // In a real app, this would make an API call to update the profile
    console.log("Saving profile:", profileData)
    setIsEditingProfile(false)
    // Show success message or toast
  }

  const handleCancelEdit = () => {
    // Reset to original data if needed
    setIsEditingProfile(false)
  }
    return(
         <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your client profile information</p>
              </div>
              <div className="flex gap-2">
                {isEditingProfile ? (
                  <>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditingProfile(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Overview Card */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{profileData.name}</h3>
                    <p className="text-sm text-muted-foreground">{profileData.position}</p>
                    <p className="text-sm text-muted-foreground">{profileData.company}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge className="bg-green-100 text-green-800">Active Client</Badge>
                      <Badge variant="secondary">Verified</Badge>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {profileData.joinedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.companySize}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    {isEditingProfile ? "Edit your profile information" : "Your profile information"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditingProfile ? (
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => handleProfileUpdate("name", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm py-2">{profileData.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditingProfile ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleProfileUpdate("email", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-sm py-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {profileData.email}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditingProfile ? (
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => handleProfileUpdate("phone", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-sm py-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {profileData.phone}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      {isEditingProfile ? (
                        <Input
                          id="company"
                          value={profileData.company}
                          onChange={(e) => handleProfileUpdate("company", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm py-2">{profileData.company}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      {isEditingProfile ? (
                        <Input
                          id="position"
                          value={profileData.position}
                          onChange={(e) => handleProfileUpdate("position", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm py-2">{profileData.position}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      {isEditingProfile ? (
                        <Select
                          value={profileData.industry}
                          onValueChange={(value) => handleProfileUpdate("industry", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Retail">Retail</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2">{profileData.industry}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      {isEditingProfile ? (
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => handleProfileUpdate("location", e.target.value)}
                        />
                      ) : (
                        <p className="text-sm py-2">{profileData.location}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      {isEditingProfile ? (
                        <Input
                          id="website"
                          value={profileData.website}
                          onChange={(e) => handleProfileUpdate("website", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center gap-2 text-sm py-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <a
                            href={profileData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {profileData.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditingProfile ? (
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                        rows={4}
                        placeholder="Tell us about yourself and your company..."
                      />
                    ) : (
                      <p className="text-sm py-2 leading-relaxed">{profileData.bio}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      {isEditingProfile ? (
                        <Select
                          value={profileData.timezone}
                          onValueChange={(value) => handleProfileUpdate("timezone", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="Europe/London">GMT</SelectItem>
                            <SelectItem value="Europe/Paris">CET</SelectItem>
                            <SelectItem value="Asia/Tokyo">JST</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2">{profileData.timezone.replace("_", " ")}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="communication">Preferred Communication</Label>
                      {isEditingProfile ? (
                        <Select
                          value={profileData.preferredCommunication}
                          onValueChange={(value) => handleProfileUpdate("preferredCommunication", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="chat">Chat</SelectItem>
                            <SelectItem value="video">Video Call</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2 capitalize">{profileData.preferredCommunication}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Typical Project Budget</Label>
                      {isEditingProfile ? (
                        <Select
                          value={profileData.projectBudgetRange}
                          onValueChange={(value) => handleProfileUpdate("projectBudgetRange", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="$1,000 - $5,000">$1,000 - $5,000</SelectItem>
                            <SelectItem value="$5,000 - $10,000">$5,000 - $10,000</SelectItem>
                            <SelectItem value="$10,000 - $50,000">$10,000 - $50,000</SelectItem>
                            <SelectItem value="$50,000 - $100,000">$50,000 - $100,000</SelectItem>
                            <SelectItem value="$100,000+">$100,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2">{profileData.projectBudgetRange}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      {isEditingProfile ? (
                        <Select
                          value={profileData.companySize}
                          onValueChange={(value) => handleProfileUpdate("companySize", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                            <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                            <SelectItem value="51-200 employees">51-200 employees</SelectItem>
                            <SelectItem value="201-500 employees">201-500 employees</SelectItem>
                            <SelectItem value="500+ employees">500+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2">{profileData.companySize}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
    )
}
export default ClientProfilePage;