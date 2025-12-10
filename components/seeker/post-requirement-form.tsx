"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import { categories } from "@/lib/mock-data"
import FileUpload from "../file-upload"

interface PostRequirementFormProps {
  onSubmit: (requirement: any) => void
  onCancel: () => void
}

export function PostRequirementForm({ onSubmit, onCancel }: PostRequirementFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    timeline: "",
  })
  const [attachments, setAttachments] = useState<File[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Build correct payload for API
    const payload = {
      title: formData.title.trim(),
      image: formData.image,
      category: formData.category,
      description: formData.description.trim(),
      budgetMin: Number(formData.budgetMin),
      budgetMax: Number(formData.budgetMax),
      timeline: formData.timeline.trim(),
    }

    onSubmit(payload)
    console.log("Requirement submitted:", payload)
  }


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Post New Requirement</CardTitle>
        <CardDescription>Describe your project needs to receive proposals from qualified providers</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., E-commerce Website Development"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
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

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Provide detailed information about your project requirements, goals, and expectations..."
              rows={6}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budgetMin">Budget Range (Min)</Label>
              <Input
                id="budgetMin"
                type="number"
                value={formData.budgetMin}
                onChange={(e) => setFormData((prev) => ({ ...prev, budgetMin: e.target.value }))}
                placeholder="1000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetMax">Budget Range (Max)</Label>
              <Input
                id="budgetMax"
                type="number"
                value={formData.budgetMax}
                onChange={(e) => setFormData((prev) => ({ ...prev, budgetMax: e.target.value }))}
                placeholder="5000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeline">Expected Timeline</Label>
            <Input
              id="timeline"
              value={formData.timeline}
              onChange={(e) => setFormData((prev) => ({ ...prev, timeline: e.target.value }))}
              placeholder="e.g., 3 months, 8 weeks"
              required
            />
          </div>
          <FileUpload
            value={formData.image}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev, image: url }))
            }
            accept="image/*"
          />


          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1">
              Post Requirement
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
