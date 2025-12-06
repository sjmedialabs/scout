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
    companyName: provider.name || provider.companyName || "",
    website: provider.website || "",
    salesEmail: provider.salesEmail || "",
    schedulingLink: provider.schedulingLink || "",
    adminContactPhone: provider.adminContactPhone || "",
    foundedYear: provider.foundedYear || new Date().getFullYear(),
    totalEmployees: provider.totalEmployees || "",
    tagline: provider.tagline || "",
    companyVideoLink: provider.companyVideoLink || "",
    languagesSpoken: provider.languagesSpoken || [],
    services: provider.services || [],
    portfolio: provider.portfolio || [],
  })

  const [newService, setNewService] = useState("")
  const [portfolioForm, setPortfolioForm] = useState<Partial<PortfolioItem>>({})
  const [showPortfolioForm, setShowPortfolioForm] = useState(false)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [taglineCount, setTaglineCount] = useState(formData.tagline?.length || 0)

  const handleSave = () => {
    const newErrors: Record<string, string> = {}

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
      onSave(formData)
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
                className={errors.companyName ? "border-red-500" : ""}
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
                className={errors.website ? "border-red-500" : ""}
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
                className={errors.salesEmail ? "border-red-500" : ""}
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
                className={errors.schedulingLink ? "border-red-500" : ""}
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
                className={errors.adminContactPhone ? "border-red-500" : ""}
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
                <SelectTrigger className={errors.foundedYear ? "border-red-500" : ""}>
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
                  className={errors.tagline ? "border-red-500" : ""}
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
                className={errors.companyVideoLink ? "border-red-500" : ""}
                placeholder="Company Video Link"
              />
              {errors.companyVideoLink && <p className="text-sm text-red-500">{errors.companyVideoLink}</p>}
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
              className={errors.description ? "border-red-500" : ""}
              placeholder="We provide impressive tailor-made digital services, branding & creative graphic designing for Indian & International businesses. We are a team of best digital marketing professionals that thrive on creating impactful outcomes. DIGIDZN help you to build, create, manage, and promote the brand at the worldwide level which helps to meet your requirements and expectations. Through a combination of research, engagement & creativity, we develop visual aesthetics for your business creating a lasting impression. We work thoroughly to understand your goals & help achieve success for you. We love to grow with you as we work for the long-term relationship. As a leading digital marketing agency, we maintain your valuable brands. We also have created brand experiences for our clients worldwide. With the team of best digital marketing experts, we offer all services of digital marketing that contribute to the online business promotion. As all know, web promotion is one of the effective forms of marketing. By utilizing the advantages of web world we try to..."
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
                <X className="h-3 w-3 cursor-pointer" onClick={() => removeService(service)} />
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Select value={newService} onValueChange={setNewService}>
              <SelectTrigger className="flex-1">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project Title</Label>
                    <Input
                      value={portfolioForm.title || ""}
                      onChange={(e) => setPortfolioForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Project name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={portfolioForm.category || ""}
                      onValueChange={(value) => setPortfolioForm((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Project URL (Optional)</Label>
                    <Input
                      value={portfolioForm.projectUrl || ""}
                      onChange={(e) => setPortfolioForm((prev) => ({ ...prev, projectUrl: e.target.value }))}
                      placeholder="https://project-url.com"
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
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{item.title}</h4>
                    <Button variant="ghost" size="sm" onClick={() => removePortfolioItem(item.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge variant="outline" className="mb-2">
                    {item.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  {item.projectUrl && (
                    <a
                      href={item.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View Project <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </CardContent>
              </Card>
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
