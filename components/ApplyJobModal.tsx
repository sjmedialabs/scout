"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type ApplyJobModalProps = {
  isOpen: boolean
  onClose: () => void
  jobTitle: string
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

const initialFormState = {
  firstName: "",
  lastName: "",
  phone: "",
  altPhone: "",
  email: "",
  gender: "",
  qualification: "",
  passedOutYear: "",
  experience: "",
  resume: null as File | null,
  coverLetter: null as File | null,
}

export default function ApplyJobModal({
  isOpen,
  onClose,
  jobTitle,
}: ApplyJobModalProps) {
  const [form, setForm] = useState(initialFormState)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  /* ---------------- RESET FORM ---------------- */
  const resetForm = () => {
    setForm(initialFormState)
    setErrors({})
    setLoading(false)
    setSuccess(false)
  }

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e: any) => {
    const { name, value, files } = e.target

    if (files && files.length > 0) {
      const file = files[0]

      if (file.type !== "application/pdf") {
        setErrors((p) => ({ ...p, [name]: "Only PDF files are allowed" }))
        return
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrors((p) => ({
          ...p,
          [name]: "File size must be less than 2 MB",
        }))
        return
      }

      setErrors((p) => ({ ...p, [name]: "" }))
      setForm({ ...form, [name]: file })
      return
    }

    setForm({ ...form, [name]: value })
    setErrors((p) => ({ ...p, [name]: "" }))
  }

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e: Record<string, string> = {}

    if (!form.firstName) e.firstName = "First name is required"
    if (!form.lastName) e.lastName = "Last name is required"
    if (!form.phone) e.phone = "Phone number is required"
    if (!form.email) e.email = "Email is required"
    if (!form.gender) e.gender = "Gender is required"
    if (!form.qualification) e.qualification = "Qualification is required"
    if (!form.passedOutYear) e.passedOutYear = "Passed out year is required"
    if (!form.experience) e.experience = "Experience is required"
    if (!form.resume) e.resume = "Resume is required"

    setErrors(e)
    return Object.keys(e).length === 0
  }

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: any) => {
  e.preventDefault()
  if (!validate()) return

  setLoading(true)

  let resumeUrl = ""
  let coverLetterUrl = ""

  if (form.resume) {
    const fd = new FormData()
    fd.append("file", form.resume)

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    })

    const uploadData = await uploadRes.json()
    resumeUrl = uploadData.url
  }

  if (form.coverLetter) {
    const fd = new FormData()
    fd.append("file", form.coverLetter)

    const uploadRes = await fetch("/api/upload", {
      method: "POST",
      body: fd,
    })

    const uploadData = await uploadRes.json()
    coverLetterUrl = uploadData.url
  }

  await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobTitle,
      ...form,
      resumeUrl,
      coverLetterUrl,
    }),
  })

  setLoading(false)
  setSuccess(true)

  setTimeout(() => {
    resetForm()
    onClose()
  }, 1500)
}



  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-3xl px-4 py-3 relative max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button
          onClick={() => {
            resetForm()
            onClose()
          }}
          className="absolute top-4 right-4 text-gray-500 text-xl"
          disabled={loading}
        >
          ✕
        </button>

        <h2 className="text-xl text-[#F54A0C] font-semibold mb-4">
          Apply for {jobTitle}
        </h2>

        {success ? (
          <div className="bg-green-100 text-green-700 p-6 rounded-xl text-center text-lg">
            ✅ Application submitted successfully!
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {/* First Name */}
            <div>
              <label className="text-sm font-medium">
                First Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-xl px-4 py-3 placeholder:text-gray-400"
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm font-medium">
                Last Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-xl px-4 py-3 placeholder:text-gray-400"
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">{errors.lastName}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium">
                Phone <span className="text-red-500">*</span>
              </label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                 className="w-full border border-gray-400 rounded-xl px-4 py-3 placeholder:text-gray-400"
                 placeholder="Enter your mobile number"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            {/* Alt Phone */}
            <div>
              <label className="text-sm font-medium">
                Alternate Phone <span className="text-gray-400">(Optional)</span>
              </label>
              <Input
                name="altPhone"
                value={form.altPhone}
                onChange={handleChange}
                  className="w-full border border-gray-400 rounded-xl px-4 py-3 placeholder:text-gray-400"
                  placeholder="Enter your alternate mobile number"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                name="email"
                value={form.email}
                onChange={handleChange}
                 className="w-full border border-gray-400 rounded-xl px-4 py-3 placeholder:text-gray-400"
                 placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-medium">
                Gender <span className="text-red-500">*</span>
              </label>

              <Select
                value={form.gender}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger className="w-full border border-gray-400 data-[placeholder]:text-gray-400 rounded-xl px-4 py-3 h-[48px]">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Qualification */}
            <div>
              <label className="text-sm font-medium">
                Qualification <span className="text-red-500">*</span>
              </label>
              <Input
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-xl px-4 py-3 placeholder:text-gray-400"
                placeholder="Enter your qualification"
              />
              {errors.qualification && (
                <p className="text-red-500 text-xs">{errors.qualification}</p>
              )}
            </div>

            {/* Passed Out Year */}
            <div>
              <label className="text-sm font-medium">
                Passed Out Year <span className="text-red-500">*</span>
              </label>
              <Input
                name="passedOutYear"
                value={form.passedOutYear}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-xl px-4 py-3 placeholder:text-gray-400"
                placeholder="Enter your passed out year"
              />
              {errors.passedOutYear && (
                <p className="text-red-500 text-xs">{errors.passedOutYear}</p>
              )}
            </div>

            {/* Experience */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">
                Experience <span className="text-red-500">*</span>
              </label>
              <Input
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-xl px-4 py-3 placeholder:text-gray-400"
                placeholder="Enter your experience"
              />
              {errors.experience && (
                <p className="text-red-500 text-xs">{errors.experience}</p>
              )}
            </div>

            {/* Resume */}
            <div>
              <label className="text-sm font-medium">
                Resume (PDF) <span className="text-red-500">*</span>
              </label>
              
                <Input
                  type="file"
                  accept="application/pdf"
                  name="resume"
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded-xl placeholder:text-gray-400"
                />
              
              <p className="text-xs text-gray-500 mt-1">
                PDF only • Max size 2MB
              </p>
              {form.resume && (
                <p className="text-sm mt-1">{form.resume.name}</p>
              )}
              {errors.resume && (
                <p className="text-red-500 text-xs">{errors.resume}</p>
              )}
            </div>

            {/* Cover Letter */}
            <div>
              <label className="text-sm font-medium">
                Cover Letter (PDF) <span className="text-gray-400">(Optional)</span>
              </label>
             
                <Input
                  type="file"
                  accept="application/pdf"
                  name="coverLetter"
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded-xl placeholder:text-gray-400"
                />
              
              <p className="text-xs text-gray-500 mt-1">
                PDF only • Max size 2MB
              </p>
              {form.coverLetter && (
                <p className="text-sm mt-1">{form.coverLetter.name}</p>
              )}
            </div>

            {/* Submit */}
           
              <Button
                type="submit"
                disabled={loading}
                className="primary-button h-[30px] max-w-[180px]"
              
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>
            
          </form>
        )}
      </div>
    </div>
  )
}
