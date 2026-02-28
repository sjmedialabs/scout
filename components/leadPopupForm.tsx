"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { isValidPhoneNumber } from "libphonenumber-js"
import PdfUpload from "./pdfUpload"
import ServiceDropdown from "./select-category-filter"
interface ContactProviderModalProps {
  open: boolean
  onClose: () => void
  userId: string
}

const MAX_LENGTH = 100

export default function ContactProviderModal({
  open,
  onClose,
  userId,
}: ContactProviderModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    countryCode: "",
    message: "",
    projectTitle: "",
    category: "",
    description: "",
    minbudget: "",
    maxbudget: "",
    timeline: "",
    attachmentUrls: [] as string[],
  })

  const isValidPhone = (phone: string) => {
    return isValidPhoneNumber("+" + phone)
  }

  const validate = () => {
    if (!form.name.trim()) return "Name is required"
    if (!form.email.trim()) return "Email is required"
    if (!/^\S+@\S+\.\S+$/.test(form.email))
      return "Invalid email format"
    if (!form.phone) return "Phone number is required"
    if (!isValidPhone(form.phone))
      return "Invalid phone number"
    // if (!form.projectTitle.trim()) return "Project title is required"
    // if (!form.category.trim()) return "Category is required"
    // if (!form.description.trim()) return "Project description is required"
    // if (!form.minbudget.trim() || !form.maxbudget.trim())
    //   return "Budget range is required"
    // if (!form.timeline.trim()) return "Timeline is required"
    // if (!form.message.trim()) return "Message is required"
    return ""
  }

  const handleSubmit = async () => {
    setError("")
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setLoading(true)

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: form.name,
          email: form.email,
          contactNumber: form.phone,
          countryCode: form.countryCode,
          country: form.country,
          message: form.message,
          status: "pending",
          projectTitle: form.projectTitle,
          category: form.category,
          description: form.description,
          minbudget: form.minbudget,
          maxbudget: form.maxbudget,
          timeline: form.timeline,
          attachmentUrls: form.attachmentUrls,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Something went wrong")
        setLoading(false)
        return
      }

      setLoading(false)
      onClose()
      setForm({
        name: "",
        email: "",
        phone: "",
        country: "",
        countryCode: "",
        message: "",
        projectTitle: "",
        category: "",
        description: "",
        minbudget: "",
        maxbudget: "",
        timeline: "",
        attachmentUrls: [],
      })
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Provider</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone Number</Label>
            <PhoneInput
              country={"in"}
              enableSearch
              value={form.phone}
              onChange={(phone, data) =>
                setForm({
                  ...form,
                  phone,
                  country: data.name,
                  countryCode: "+" + data.dialCode,
                })
              }
              inputStyle={{
                width: "100%",
                borderRadius: "8px",
                height: "40px",
              }}
            />
          </div>

          {/* Project Title */}
          <div>
            <Label>Project Title</Label>
            <Input
              value={form.projectTitle}
              onChange={(e) =>
                setForm({ ...form, projectTitle: e.target.value })
              }
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            {/* <Input
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            /> */}
             <ServiceDropdown
                              value={form.category}
                              onChange={(value) =>
                                setForm((p) => ({ ...p, category: value }))
                              }
                              placeholder="Select service"
                              triggerClassName="border-2 border-[#D0D5DD] text-[#000] rounded-[8px] p-4
                                  text-xs"
                              triggerSpanClassName="text-[#000]"
                            />
          </div>

          {/* Description */}
          <div>
            <Label>Project Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Budget */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Label>Minimum Budget</Label>
              <Input
                type="number"
                value={form.minbudget}
                onChange={(e) =>
                  setForm({ ...form, minbudget: e.target.value })
                }
              />
            </div>

            <div className="flex-1">
              <Label>Maximum Budget</Label>
              <Input
                type="number"
                value={form.maxbudget}
                onChange={(e) =>
                  setForm({ ...form, maxbudget: e.target.value })
                }
              />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <Label>Expected Timeline</Label>

            <div className="flex gap-3">
              <Input
                type="number"
                min={1}
                placeholder="Enter Timeline"
                className="w-40"
                onChange={(e) => {
                  const value = e.target.value
                  const unit = form.timeline.split(" ")[1] || "days"

                  setForm((p) => ({
                    ...p,
                    timeline: value
                      ? `${value} ${
                          Number(value) === 1
                            ? unit.replace(/s$/, "")
                            : unit
                        }`
                      : "",
                  }))
                }}
              />

              <Select
                defaultValue="days"
                onValueChange={(unit) => {
                  const value = form.timeline.split(" ")[0] || "1"

                  setForm((p) => ({
                    ...p,
                    timeline: `${value} ${
                      Number(value) === 1
                        ? unit.replace(/s$/, "")
                        : unit
                    }`,
                  }))
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                  <SelectItem value="years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <Label>Attachments</Label>
            <PdfUpload
              maxSizeMB={10}
              onUploadSuccess={(url) =>
                setForm((p) => ({
                  ...p,
                  attachmentUrls: [...p.attachmentUrls, url],
                }))
              }
            />
          </div>

          {/* Message */}
          <div>
            <Label>Message</Label>
            <Textarea
              value={form.message}
              maxLength={MAX_LENGTH}
              onChange={(e) =>
                setForm({
                  ...form,
                  message: e.target.value.slice(0, MAX_LENGTH),
                })
              }
            />
            <div className="text-right text-xs text-gray-500">
              {form.message.length}/{MAX_LENGTH}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-[120px]"
          >
            {loading ? "Sending..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}