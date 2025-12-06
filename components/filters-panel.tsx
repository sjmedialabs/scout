"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"

interface FiltersState {
  serviceType: string
  location: string
  minRating: number
  budgetRange: [number, number]
  skills: string[]
}

interface FiltersPanelProps {
  onFiltersChange: (filters: FiltersState) => void
  className?: string
}

export function FiltersPanel({ onFiltersChange, className }: FiltersPanelProps) {
  const [filters, setFilters] = useState<FiltersState>({
    serviceType: "",
    location: "",
    minRating: 0,
    budgetRange: [0, 100000],
    skills: [],
  })
  const [skillInput, setSkillInput] = useState("")

  const serviceTypes = [
    "Web Development",
    "Mobile Development",
    "UI/UX Design",
    "Digital Marketing",
    "Content Writing",
    "Data Analysis",
    "Consulting",
  ]

  const locations = ["Remote", "New York, NY", "San Francisco, CA", "London, UK", "Toronto, CA", "Sydney, AU"]

  const handleFilterChange = (key: keyof FiltersState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const addSkill = () => {
    if (skillInput.trim() && !filters.skills.includes(skillInput.trim())) {
      const newSkills = [...filters.skills, skillInput.trim()]
      handleFilterChange("skills", newSkills)
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    const newSkills = filters.skills.filter((s) => s !== skill)
    handleFilterChange("skills", newSkills)
  }

  const clearFilters = () => {
    const clearedFilters: FiltersState = {
      serviceType: "",
      location: "",
      minRating: 0,
      budgetRange: [0, 100000],
      skills: [],
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Type */}
        <div className="space-y-2">
          <Label>Service Type</Label>
          <Select value={filters.serviceType} onValueChange={(value) => handleFilterChange("serviceType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select service type" />
            </SelectTrigger>
            <SelectContent>
              {serviceTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label>Minimum Rating: {filters.minRating}/5</Label>
          <Slider
            value={[filters.minRating]}
            onValueChange={(value) => handleFilterChange("minRating", value[0])}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>

        {/* Budget Range */}
        <div className="space-y-2">
          <Label>
            Budget Range: ${filters.budgetRange[0].toLocaleString()} - ${filters.budgetRange[1].toLocaleString()}
          </Label>
          <Slider
            value={filters.budgetRange}
            onValueChange={(value) => handleFilterChange("budgetRange", value as [number, number])}
            max={100000}
            min={0}
            step={1000}
            className="w-full"
          />
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
            />
            <Button onClick={addSkill} size="sm">
              Add
            </Button>
          </div>
          {filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
