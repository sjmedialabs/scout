"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import "react-quill/dist/quill.snow.css"

export default function AdminCareersPage() {
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    email: "",
    website: "",
    experience: "",
    salaryRange: "",
    department: "",
    employmentType: "",
  })

  const [responsibilities, setResponsibilities] = useState("")
  const [skills, setSkills] = useState("")

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const payload = {
        ...formData,
        responsibilities,
        skills,
      }

      const res = await fetch("/api/admin/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to create job")

      alert("Job posted successfully!")

      setFormData({
        title: "",
        description: "",
        location: "",
        email: "",
        website: "",
        experience: "",
        salaryRange: "",
        department: "",
        employmentType: "",
      })
      setResponsibilities("")
      setSkills("")
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-0 max-w-7xl">
    <div className="mt-auto">
    <h1 className=" font-bold text-orangeButton text-3xl my-custom-class">
     Job Listing
    </h1>
    <p>
        Listed Jobs
    </p>
    </div>
      <Card className="mt-3 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl my-custom-class text-orangeButton">Post Job</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label className="my-custom-class">Job Title</Label>
            <Input
            className="rounded-xl border-gray-200 shadow-md"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="my-custom-class">Job Description</Label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 shadow-md"
              rows={4}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="my-custom-class">Location</Label>
            <Input
            className="rounded-xl border-gray-200 shadow-md"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="my-custom-class">Email</Label>
            <Input
            className="rounded-xl border-gray-200 shadow-md"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label className="my-custom-class">Website</Label>
            <Input
            className="rounded-xl border-gray-200 shadow-md"
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          {/* Responsibilities Editor */}
          <div className="space-y-2 rounded-xl">
            <Label className="my-custom-class">Key Responsibilities</Label>
            <ReactQuill
            className="rounded-xl border-gray-200 shadow-md"
              value={responsibilities}
              onChange={setResponsibilities}
              placeholder="Enter responsibilities..."
            />
          </div>

          {/* Skills Editor */}
          <div className="space-y-2">
            <Label className="my-custom-class">Required Skills</Label>
            <ReactQuill
            className="rounded-xl border-gray-200 shadow-md"
              value={skills}
              onChange={setSkills}
              placeholder="Enter required skills..."
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label className="my-custom-class">Experience</Label>
            <Input
            className="rounded-xl border-gray-200 shadow-md"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
            />
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <Label className="my-custom-class">Salary Range</Label>
            <Input
            className="rounded-xl border-gray-200 shadow-md"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label className="my-custom-class">Department</Label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border shadow-md rounded-xl p-3"
            >
              <option value="">Select Department</option>
              <option>Engineering</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>HR</option>
            </select>
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <Label className="my-custom-class">Employment Type</Label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full border shadow-md rounded-xl p-3"
            >
              <option value="">Select Type</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Remote</option>
            </select>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-30 rounded-full bg-orange-600 hover:bg-orange-500 text-white"
          >
            {loading ? "Posting..." : "Post Job"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
