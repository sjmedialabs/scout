"use client"

import {useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock } from "lucide-react"


export default function ContactPage() {
  const [cms, setCms] = useState<any>(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
    country: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchCMS = async () => {
      const res = await fetch("/api/cms")
      const data = await res.json()
      setCms(data)
    }
    fetchCMS()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try{
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setSuccess(true)
      setForm({
        name: "",
        email: "",
        company: "",
        website: "",
        country: "",
        phone: "",
      })
    } finally {
      setLoading(false)
    }
  }


return (
  <div className="min-h-screen pc-4 py-14">
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* LEFT */}
      <div>
        <h2 className="text-xl font-normal text-[#F54A0C]">
          {cms?.contact?.heading || "How Can We Help?"}
        </h2>
        <p className="mt-1 text-sm">
          {cms?.contact?.description || "Share a few details about your queries and we'll get back to you soon."}
        </p>


        <div className="mt-8 w-full max-w-xl rounded-2xl bg-white shadow-[0_0_5px_rgba(0,0,0,0.15)] p-6 overflow-hidden">

          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold">Media Enqueries :</span>
            <span className="text-lg text-gray-500">{cms?.contact?.mediaEmail || "enquiry@scout.com"}</span>
          </div>

          <div className="-mx-6 my-6 border border-t-gray-700  bg-[#707070]" />

          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold">Contact Number :</span>
            <span className="text-lg text-gray-500">
              {cms?.contact?.phone || "+91-9848123456 , 99491237894"}
            </span>
          </div>

          <div className="-mx-6 my-6 border border-t-gray-700 bg-[#707070]" />

          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold">Email :</span>
              <span className="text-lg text-gray-500">
                {cms?.contact?.email ||"info@scout.com"}
              </span>
            </div>  

            <div className="pl-[87px] leading-4 text-lg text-gray-500">
              {cms?.contact?.supportEmail || "support@scout.com"}
            </div> 
          </div>
        </div>  

          <div className="mt-8">
            <p className=" text-3xl font-semibold">
              Grow  your business by registering with us.
            </p>
            <button className="mt-3 rounded-full bg-orangeButton px-6 py-2 text-white text-sm">
              Get Listed
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="mt-15 rounded-2xl vorder p-6 shadow-[0_0_5px_rgba(0,0,0,0.15)]">
          <h3 className="font-semibold text-orangeButton">Send Message</h3>
          <p className="text-sm mt-1">
            Share a few datails about your queries and we'll get back to you soon.
          </p>

          {!success ? (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

              <div className="mt-0 leading-0">
                <label className="text-xs font-medium">
                  Your Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Search for agency name/service name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-0 w-full border rounded-full border-blue-200 px-4 py-3 text-[10px] outline-none"
                />
              </div>

              <div className="mt-0 leading-0">
                <label className="text-xs font-medium">
                  Email address<span className="text-red-500">*</span>
                </label>
                  <input
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-0 w-full border rounded-full border-blue-200 px-4 py-3 text-[10px] outline-none"
                  />
              </div>

              <div className="mt-0 leading-0">
                <label className="text-xs font-medium">
                  Enter company name<span className="text-red-500">*</span>
                </label>
                  <input
                    placeholder="Enter your company name"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="mt-0 w-full border rounded-full border-blue-200 px-4 py-3 text-[10px] outline-none" 
                  />
              </div>

              <div className="mt-0 leading-0">
                <label className="text-xs font-medium">
                  Website<span className="text-red-500">*</span>
                </label>
                  <input 
                    placeholder="Website"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="mt-0 w-full border rounded-full border-blue-200 px-4 py-3 text-[10px] outline-none"
                  />
              </div>

              <div className="mt-0 leading-0">
                <label className="text-xs font-medium">
                  Select Country<span className="text-red-500">*</span>
                </label>
                  <input 
                    placeholder="Select"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="mt-0 w-full border rounded-full border-blue-200 px-4 py-3 text-[10px] outline-none"
                  />
              </div>

              <div className="mt-0 leading-0">
                <label className="text-xs font-medium">
                  Phone number<span className="text-red-500">*</span>
                </label>
                  <input
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="mt-0 w-full border rounded-full border-blue-200 px-4 py-3 text-[10px] outline-none"
                  />
              </div>

              <button
              onClick={handleSubmit}
              disabled={loading}    
              className="mt-0 max-w-[190px] rounded-full bg-orangeButton px-6 py-3 text-white text-[10px] outline-none"
            >
              {loading ? "Submitting..." : "Submit Request"}
              </button>  
            </div>
          ) : (
            <p className="mt-6 text-green-600 text-sm">
              Thank you! Your message has been sent successfully.
            </p>
          )}
        </div>
      </div>
    </div>
 )  
}
