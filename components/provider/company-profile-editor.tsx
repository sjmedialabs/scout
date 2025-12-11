"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, ExternalLink, Lock } from "lucide-react"
import type { Provider, PortfolioItem } from "@/lib/types"
import { categories } from "@/lib/mock-data"
import { ImageUpload } from "../ui/image-upload"

interface CompanyProfileEditorProps {
  provider: Provider
  onSave: (provider: Provider) => void
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateURL = (url: string): boolean => {
  if (!url) return true // Optional field
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const validatePhone = (phone: string): boolean => {
  if (!phone) return true // Optional field
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}

const validateTagline = (tagline: string): boolean => {
  return tagline.length <= 50
}

const employeeSizes = ["1-9", "10-49", "50-99", "100-249", "250-499", "500-999", "1000+"]

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Russian",
]

export function CompanyProfileEditor({ provider, onSave }: CompanyProfileEditorProps) {
 
  const [formData, setFormData] = useState({
    ...provider,
    companyName: provider.companyName || provider.name || "",
    logo:provider.logo || "",
    coverImage:provider.coverImage || "",
    location:provider.location || "",
    projectsCompleted:provider.projectsCompleted || "",
    hourlyRate:provider.hourlyRate || "",
    website: provider.website || "",
    salesEmail: provider.salesEmail || "",
    schedulingLink: provider.schedulingLink || "",
    adminContactPhone: provider.adminContactPhone || "",
    foundedYear: provider.foundedYear || new Date().getFullYear(),
    totalEmployees: provider.teamSize || "",
    tagline: provider.tagline || "",
    companyVideoLink: provider.companyVideoLink || "",
    languagesSpoken: provider.languagesSpoken || [],
    services: provider.services || [],
    technologies:provider.technologies || [],
    awards:provider.awards || [],
    certification:provider.certifications || [],
    industries:provider.industries || [],
    portfolio: provider.portfolio || [],
  })

  const [newService, setNewService] = useState("")
  const [portfolioForm, setPortfolioForm] = useState<Partial<PortfolioItem>>({})
  const [showPortfolioForm, setShowPortfolioForm] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [taglineCount, setTaglineCount] = useState(formData.tagline?.length || 0)
  const[newTechnology,setNewTechnology]=useState("");
  const[newIndustry,setNewIndustry]=useState("");
  const[newAward,setNewAward]=useState("");
  const[portfolioTechnology,setPortfolioTechnology]=useState("");

  const handleSave = () => {
    const newErrors: Record<string, string> = {}

    // console.log("Form Data ::::",formData);

    // Required field validations
    if (!formData.companyName?.trim()) {
      newErrors.companyName = "Company name is required"
    }

    if (!formData.website?.trim()) {
      newErrors.website = "Company website is required"
    } else if (!validateURL(formData.website)) {
      newErrors.website = "Please enter a valid URL"
    }

    if (!formData.salesEmail?.trim()) {
      newErrors.salesEmail = "Sales email is required"
    } else if (!validateEmail(formData.salesEmail)) {
      newErrors.salesEmail = "Please enter a valid email address"
    }

    if (!formData.foundedYear) {
      newErrors.foundedYear = "Founding year is required"
    } else if (formData.foundedYear < 1900 || formData.foundedYear > new Date().getFullYear()) {
      newErrors.foundedYear = "Please enter a valid year"
    }

    if (!formData.totalEmployees) {
      newErrors.totalEmployees = "Total employees is required"
    }

    if (!formData.tagline?.trim()) {
      newErrors.tagline = "Tagline is required"
    } else if (!validateTagline(formData.tagline)) {
      newErrors.tagline = "Tagline must be 50 characters or less"
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Company description is required"
    }

    // Optional field validations
    if (formData.schedulingLink && !validateURL(formData.schedulingLink)) {
      newErrors.schedulingLink = "Please enter a valid URL"
    }

    if (formData.adminContactPhone && !validatePhone(formData.adminContactPhone)) {
      newErrors.adminContactPhone = "Please enter a valid phone number"
    }

    if (formData.companyVideoLink && !validateURL(formData.companyVideoLink)) {
      newErrors.companyVideoLink = "Please enter a valid URL"
    }


    setErrors(newErrors)



    if (Object.keys(newErrors).length === 0) {
      console.log("Calling save Profile:::")
      const payload = {
  name: formData.companyName,          // schema: name
  tagline: formData.tagline,
  description: formData.description,
  logo: formData.logo,
  coverImage: formData.coverImage,
  location: formData.location,
  website: formData.website,
  email: formData.email,
  salesEmail: formData.salesEmail,
  phone: formData.phone,
  adminContactPhone: formData.adminContactPhone,

  services: formData.services || [],
  technologies: formData.technologies || [],
  industries: formData.industries || [],

  foundedYear: formData.foundedYear,
  teamSize: formData.totalEmployees,   // OR map to teamSize if needed
  portfolio: formData.portfolio || [],
  
  certifications: formData.certification || [],
  awards: formData.awards || [],

  socialLinks: {
    linkedin: formData.linkedin || "",
    twitter: formData.twitter || "",
    facebook: formData.facebook || "",
    instagram: formData.instagram || "",
  },
}

      onSave(payload)
    }
  }

  const addService = () => {
    if (newService && !(formData.services || []).includes(newService)) {
      setFormData((prev) => ({
        ...prev,
        services: [...(prev.services || []), newService],
      }))
      setNewService("")
    }
  }

  const removeService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: (prev.services || []).filter((s) => s !== service),
    }))
  }
 
  const addTech=()=>{
    if (newTechnology.trim() && !(formData.technologies || []).includes(newTechnology)) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...(prev.technologies || []), newTechnology],
      }))
      setNewTechnology("")
    }
  }

  const removeTech = (tech: string) => {
  console.log("Removing:", tech, formData.technologies);
  setFormData(prev => ({
    ...prev,
    technologies: prev.technologies.filter((item: string) => item !== tech),
  }));
};

 const addPorfolioTech=()=>{
  if(portfolioTechnology.trim() && !(portfolioForm.technologies || []).includes(portfolioTechnology)){
    setPortfolioForm((prev)=>({
      ...prev,
      technologies:[...(prev.technologies || []),portfolioTechnology]
    }))
    setPortfolioTechnology("");
  }
 }

 const removePortfolioTech=(tech:string)=>{
  setPortfolioForm((prev)=>({
    ...prev,
    technologies:(prev.technologies || []).filter((item)=>(item !==tech))
  }))
 }

 const addIndustry=()=>{
   if(newIndustry.trim() &&  !(formData.industries || []).includes(newIndustry)){
    setFormData((prev)=>({
      ...prev,
      industries:[...(prev.industries || []),newIndustry]
    }))
    setNewIndustry("")
   }
 }

 const removeIndustry=(industry:string)=>{
    setFormData(prev => ({
    ...prev,
    industries: prev.industries.filter((item: string) => item !== industry),
  }));
 }

  const addLanguage = (language: string) => {
    if (language && !(formData.languagesSpoken || []).includes(language)) {
      setFormData((prev) => ({
        ...prev,
        languagesSpoken: [...(prev.languagesSpoken || []), language],
      }))
    }
  }

  const removeLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languagesSpoken: (prev.languagesSpoken || []).filter((l) => l !== language),
    }))
  }

  const addAward=()=>{
    if(newAward.trim() && !(formData.awards || []).includes(newAward)){
      setFormData((prev)=>({
        ...prev,
        awards:[...(prev.awards || []),newAward]
      }))
      setNewAward("")
    }
  }
  const removeAward=(award:string)=>{
    setFormData((prev)=>({...prev,awards:(prev.awards || []).filter((a:string)=>a!==award)}))
  }

  const handleTaglineChange = (value: string) => {
    if (value.length <= 50) {
      setFormData((prev) => ({ ...prev, tagline: value }))
      setTaglineCount(value.length)
      if (errors.tagline) {
        setErrors((prev) => ({ ...prev, tagline: "" }))
      }
    }
  }

  const addPortfolioItem = () => {
    if (portfolioForm.title && portfolioForm.description && portfolioForm.category) {
      const newItem: PortfolioItem = {
        id: Date.now().toString(),
        title: portfolioForm.title,
        description: portfolioForm.description,
        category: portfolioForm.category,
        imageUrl: portfolioForm.imageUrl,
        projectUrl: portfolioForm.projectUrl,
        completedAt: portfolioForm.completedAt || new Date(),
        technologies: portfolioForm.technologies || [],
      }

      setFormData((prev) => ({
        ...prev,
        portfolio: [...(prev.portfolio || []), newItem],
      }))

      setPortfolioForm({})
      setShowPortfolioForm(false)
    }
  }

  const removePortfolioItem = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: (prev.portfolio || []).filter((item) => item.id !== id),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Update your company details and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {/*comapny loago and coverimage */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ">
            {/*logo  */}
            <div className="space-y-2">
              <ImageUpload
              label="Company Logo"
              value={formData.logo}
              onChange={(value) => setFormData({ ...formData, logo: value })}
              description="Upload your company logo (PNG, JPG) or provide a URL"
              previewClassName="w-24 h-24"
              />
            </div>
 
            {/*cover image */}

            <div className="space-y-2">
              <ImageUpload
              label="Company Cover Image"
              value={formData.coverImage}
              onChange={(value) => setFormData({ ...formData, coverImage: value })}
              description="Upload your company ccover image (PNG, JPG) or provide a URL"
              previewClassName="w-24 h-24"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, companyName: e.target.value }))
                  if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: "" }))
                }}
                className={`${errors.companyName ? "border-red-500" : ""} placeholder:text-[#b2b2b2]`}
                placeholder="digiDZN"
              />
              {errors.companyName && <p className="text-sm text-red-500">{errors.companyName}</p>}
            </div>

            

            <div className="space-y-2">
              <Label htmlFor="website">
                Company Website <span className="ml-1 text-xs text-muted-foreground">ℹ️</span>
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, website: e.target.value }))
                  if (errors.website) setErrors((prev) => ({ ...prev, website: "" }))
                }}
                className={`${errors.website ? "border-red-500" : ""} placeholder:text-[#b2b2b2]`}
                placeholder="https://digidzn.com/"
              />
              {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesEmail">
                Sales Email <span className="ml-1 text-xs text-muted-foreground">ℹ️</span>
              </Label>
              <Input
                id="salesEmail"
                type="email"
                value={formData.salesEmail}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, salesEmail: e.target.value }))
                  if (errors.salesEmail) setErrors((prev) => ({ ...prev, salesEmail: "" }))
                }}
                className={`${errors.salesEmail ? "border-red-500" : ""} placeholder:text-[#b2b2b2]`}
                placeholder="value@digidzn.com"
              />
              {errors.salesEmail && <p className="text-sm text-red-500">{errors.salesEmail}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedulingLink">
                Scheduling Link
                <span className="ml-2 text-xs text-muted-foreground">Optional</span>
              </Label>
              <Input
                id="schedulingLink"
                value={formData.schedulingLink}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, schedulingLink: e.target.value }))
                  if (errors.schedulingLink) setErrors((prev) => ({ ...prev, schedulingLink: "" }))
                }}
                className={`${errors.schedulingLink ? "border-red-500" : ""} placeholder:text-[#b2b2b2]`}
                placeholder="Scheduling Link"
              />
              {errors.schedulingLink && <p className="text-sm text-red-500">{errors.schedulingLink}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminContactPhone">
                Admin Contact Phone
                <span className="ml-2 text-xs text-muted-foreground">Optional</span>
              </Label>
              <Input
                id="adminContactPhone"
                type="tel"
                value={formData.adminContactPhone}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, adminContactPhone: e.target.value }))
                  if (errors.adminContactPhone) setErrors((prev) => ({ ...prev, adminContactPhone: "" }))
                }}
                className={`${errors.adminContactPhone ? "border-red-500" : ""} placeholder:text-[#b2b2b2]`}
                placeholder="Admin Contact Phone"
              />
              {errors.adminContactPhone && <p className="text-sm text-red-500">{errors.adminContactPhone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedYear">Founding Year</Label>
              <Select
                value={formData.foundedYear?.toString() || ""}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, foundedYear: Number.parseInt(value) }))
                  if (errors.foundedYear) setErrors((prev) => ({ ...prev, foundedYear: "" }))
                }}
              >
                <SelectTrigger className={`${errors.foundedYear ? "border-red-500" : ""} placeholder:text-[#b2b2b2]`}>
                  <SelectValue placeholder="2022" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: new Date().getFullYear() - 1949 }, (_, i) => new Date().getFullYear() - i).map(
                    (year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              {errors.foundedYear && <p className="text-sm text-red-500">{errors.foundedYear}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalEmployees">Total Employees</Label>
              <Select
                value={formData.totalEmployees}
                onValueChange={(value) => {
                  setFormData((prev) => ({ ...prev, totalEmployees: value }))
                  if (errors.totalEmployees) setErrors((prev) => ({ ...prev, totalEmployees: "" }))
                }}
              >
                <SelectTrigger className={errors.totalEmployees ? "border-red-500" : ""}>
                  <SelectValue placeholder="10 - 49" />
                </SelectTrigger>
                <SelectContent>
                  {employeeSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.totalEmployees && <p className="text-sm text-red-500">{errors.totalEmployees}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">
                Tagline <span className="ml-1 text-xs text-muted-foreground">ℹ️</span>
              </Label>
              <div className="relative">
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => handleTaglineChange(e.target.value)}
                  className={`${errors.tagline ? "border-red-500" : ""} placeholder:text-[#b2b2b2]`}
                  placeholder="We value your Needs"
                  maxLength={50}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                  {taglineCount} / 50
                </div>
              </div>
              {errors.tagline && <p className="text-sm text-red-500">{errors.tagline}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyVideoLink">
                Company Video Link
                <Lock className="inline h-3 w-3 ml-1" />
                <span className="ml-2 text-xs text-muted-foreground">Optional</span>
              </Label>
              <Input
                id="companyVideoLink"
                value={formData.companyVideoLink}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, companyVideoLink: e.target.value }))
                  if (errors.companyVideoLink) setErrors((prev) => ({ ...prev, companyVideoLink: "" }))
                }}
                className={`${errors.companyVideoLink ? "border-red-500" : ""} placeholder:text-[#b2b2b2]`}
                placeholder="Company Video Link"
              />
              {errors.companyVideoLink && <p className="text-sm text-red-500">{errors.companyVideoLink}</p>}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projects">
                Projects Completed 
              </Label>
              <div className="relative">
                <Input
                  id="projects"
                  type="number"
                  min={1}
                  value={formData.projectsCompleted}
                  onChange={(e) => setFormData((prev)=>({...prev,projectsCompleted:e.target.value}))}
                  className={`${errors.tagline ? "border-red-500" : ""} placeholder:text-[#b2b2b2]`}
                  placeholder="Enter number of projects completed"
        
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">
                Location 
              </Label>
              <div className="relative">
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData((prev)=>({...prev,location:e.target.value}))}
                  className={`${errors.tagline ? "border-red-500" : ""} placeholder:text-[#b2b2b2]`}
                  placeholder="Enter your company location"
        
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">
                Hourly Rate  
              </Label>
              <div className="relative">
                <Input
                  id="rate"
                  type="number"
                  min={1}
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData((prev)=>({...prev,hourlyRate:e.target.value}))}
                  className={`${errors.tagline ? "border-red-500" : ""} placeholder:text-[#b2b2b2]`}
                  placeholder="Enter starting proice per hour"
        
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="languagesSpoken">Languages Spoken</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(formData.languagesSpoken || []).map((language) => (
                <Badge key={language} variant="secondary" className="flex items-center gap-2">
                  {language}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeLanguage(language)} />
                </Badge>
              ))}
            </div>
            <Select onValueChange={addLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Languages Spoken" />
              </SelectTrigger>
              <SelectContent>
                {languages
                  .filter((lang) => !(formData.languagesSpoken || []).includes(lang))
                  .map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, description: e.target.value }))
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }))
              }}
              rows={6}
              className={`${errors.description ? "border-red-500" : ""} placeholder:text-[#b2b2b2]`}
              placeholder="about company"
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Services Offered */}
      <Card>
        <CardHeader>
          <CardTitle>Services Offered</CardTitle>
          <CardDescription>Manage the services you provide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(formData.services || []).map((service) => (
              <Badge key={service} variant="secondary" className="flex items-center gap-2">
                {service}
                <div onClick={() => removeService(service)}>
                   <X className="h-3 w-3 cursor-pointer"  />
                </div>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Select value={newService} onValueChange={setNewService}>
              <SelectTrigger className="flex-1 placeholder:text-[#b2b2b2]">
                <SelectValue placeholder="Select a service to add" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((cat) => !(formData.services || []).includes(cat))
                  .map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button onClick={addService} disabled={!newService}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/*Technologies offered */}
      <Card>
        <CardHeader>
          <CardTitle>Technologies Offered</CardTitle>
          <CardDescription>Manage the Technologies you provide</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(formData.technologies || []).map((tech) => (
              <Badge key={tech} variant="secondary" className="flex items-center gap-2">
                {tech}
                <div onClick={() => removeTech(tech)}>
                   <X className="h-3 w-3 cursor-pointer" />
                </div>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
           <Input type="text"
           value={newTechnology}
            onChange={(e)=>setNewTechnology(e.target.value)}
            placeholder="Datsience..."
            className=" placeholder:text-[#b2b2b2] "
            />
            
            <Button onClick={addTech} disabled={!newTechnology}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/*Industries working */}

       <Card>
        <CardHeader>
          <CardTitle>Industries Working</CardTitle>
          <CardDescription>Manage the Industries you working</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(formData.industries || []).map((ind) => (
              <Badge key={ind} variant="secondary" className="flex items-center gap-2">
                {ind}
                <div onClick={() => removeIndustry(ind)}>
                   <X className="h-3 w-3 cursor-pointer" />
                </div>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
           <Input type="text"
           value={newIndustry}
            onChange={(e)=>setNewIndustry(e.target.value)}
            placeholder="Consulting..."
            className=" placeholder:text-[#b2b2b2] "
            />
            
            <Button onClick={addIndustry} disabled={!newIndustry}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/*Awards added */}

      <Card>
        <CardHeader>
          <CardTitle>Awards Recieved</CardTitle>
          <CardDescription>Manage the Awards you recieved</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(formData.awards || []).map((item) => (
              <Badge key={item} variant="secondary" className="flex items-center gap-2">
                {item}
                <div onClick={() => removeAward(item)}>
                   <X className="h-3 w-3 cursor-pointer" />
                </div>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
           <Input type="text"
           value={newAward}
            onChange={(e)=>setNewAward(e.target.value)}
            placeholder="Best Company of the Year..."
            className=" placeholder:text-[#b2b2b2] "
            />
            
            <Button onClick={addAward} disabled={!newAward}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Portfolio</CardTitle>
              <CardDescription>Showcase your past projects</CardDescription>
            </div>
            <Button onClick={() => setShowPortfolioForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showPortfolioForm && (
            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-4">
                {/*project image */}
                <div className="space-y-2">
                    <ImageUpload
                    label="Project Image"
                    value={portfolioForm.imageUrl}
                    onChange={(value) => setPortfolioForm({ ...portfolioForm, imageUrl: value })}
                    description="Upload your company ccover image (PNG, JPG) or provide a URL"
                    previewClassName="w-24 h-24"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project Title</Label>
                    <Input
                      value={portfolioForm.title || ""}
                      onChange={(e) => setPortfolioForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Project name"
                      className=" placeholder:text-[#b2b2b2]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={portfolioForm.category || ""}
                      onValueChange={(value) => setPortfolioForm((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" className=" placeholder:text-[#b2b2b2]" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={portfolioForm.description || ""}
                    onChange={(e) => setPortfolioForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the project and your role..."
                    rows={3}
                    className=" placeholder:text-[#b2b2b2]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project URL (Optional)</Label>
                    <Input
                      value={portfolioForm.projectUrl || ""}
                      onChange={(e) => setPortfolioForm((prev) => ({ ...prev, projectUrl: e.target.value }))}
                      placeholder="https://project-url.com"
                      className=" placeholder:text-[#b2b2b2]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Completion Date</Label>
                    <Input
                      type="date"
                      value={portfolioForm.completedAt?.toISOString().split("T")[0] || ""}
                      onChange={(e) => setPortfolioForm((prev) => ({ ...prev, completedAt: new Date(e.target.value) }))}
                    />
                  </div>
                </div>

                 {/*Technologies used in this project */} 
                  <div className="space-y-5 mt-3">
                    <Label>Technologies Used</Label>
                    <div className="flex flex-wrap gap-2">
                      {(portfolioForm.technologies || []).map((tech) => (
                        <Badge key={tech} variant="secondary" className="flex items-center gap-2">
                          {tech}
                          <div onClick={() => removePortfolioTech(tech)}>
                            <X className="h-3 w-3 cursor-pointer" />
                          </div>
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                    <Input type="text"
                    value={portfolioTechnology}
                      onChange={(e)=>setPortfolioTechnology(e.target.value)}
                      placeholder="Datsience..."
                      className=" placeholder:text-[#b2b2b2] "
                      />
                      
                      <Button onClick={addPorfolioTech} disabled={!portfolioTechnology}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                <div className="flex gap-2">
                  <Button onClick={addPortfolioItem}>Add Project</Button>
                  <Button variant="outline" onClick={() => setShowPortfolioForm(false)}>
                    Cancel
                  </Button>
                </div>

               
                

              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {(formData.portfolio || []).map((item) => (
              <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                        <img
                          src={
                            item.imageUrl ||
                            `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(item.title) || "/placeholder.svg"}`
                          }
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <Badge variant="outline" className="mb-2 bg-[#ebecee] rounded-2xl text-[12px] text-[#000]">
                          {item.category}
                        </Badge>
                        <h4 className="font-semibold text-md mb-1">{item.title}</h4>
                        <p className="text-sm text-[#b2b2b2] line-clamp-2 mb-3">{item.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.technologies.slice(0, 3).map((tech, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs bg-[#d9e4f6] text-[#000] rounded-2xl">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                        {/* {item.projectUrl && (
                          <a
                            href={item.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                          >
                            View Project <ExternalLink className="h-3 w-3" />
                          </a>
                        )} */}
                      </div>
                    </div>
             
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}
