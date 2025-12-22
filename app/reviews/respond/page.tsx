"use client"

import Image from "next/image"
import { X, ChevronDown } from "lucide-react"
import { useState } from "react"

const tabs = [
  "About Your Company",
  "About Your Project",
  "About the Vendor",
  "About the Work",
]

const locations = [
  "Hyderabad, India",
  "Bangalore, India",
  "Mumbai, India",
]

const services = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
]

const tags = [
  "High ratings",
  "Close to my geographic location",
  "Pricing fit our budget",
]

const TAGS = [
  "High ratings",
  "Close to my geographic location",
  "Pricing fit our budget",
  "Great culture fit",
  "Good value for cost",
  "Referred to me",
  "Company values aligned",
  "Other",
]

export default function RespondToReviewPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [company, setCompany]= useState("")
  const [location, setLocation] = useState("")
  const [open, setOpen] = useState(false) 
  const [employees, setEmployees] = useState<string | null>(null)
  const [budget, setBudget] = useState<string | null>(null)
  const [isConfidential, setIsConfidential] = useState(false)
  const [serviceQuery, setServiceQuery] = useState("")
  const [showServices, setShowServices] = useState(false)
  const [service, setService] = useState("")
  const [serviceOpen, setServiceOpen] = useState(false)
  const [tag, setTag] = useState("")
  const [tagOpen, setTagOpen] = useState(false)
  const [teamSize, setTeamSize] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag) // deselect
        : [...prev, tag]               // select
    )
  }

    
  return (
    <div className="min-h-screen w-full bg-[#EAF6F8] overflow-x-hidden">

      {/* HERO */}
      <section className="relative w-screen bg-[#EAF6F8]">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">

    <h1 className="
      text-center font-semibold text-[#FF4D00]
      text-[24px] sm:text-[32px] lg:text-[40px]
      mb-10
    ">
      Respond to Review
    </h1>

    {/* CONTENT */}
    <div className="flex flex-col items-center lg:flex-row lg:items-start justify-center gap-12">

      {/* LOGO */}
      <div className="shrink-0 mt-10 lg:mt-0">
        <div className="w-[160px] h-[160px] rounded-full border overflow-hidden">
          <img
            src="/images/Facebook.png" 
            alt="Creative Design"
            className="w-full h-full object-cover text-center"
          />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="flex flex-col items-center mt-6 lg:items-start">
        <span className="text-[#FF4D00] text-[16px] font-bold mb-2">
          Review Summary
        </span>

        <div className="flex items-center gap-3 mb-1">
          <span className="text-[52px] font-extrabold text-[#FF4D00] leading-none">
            4.2
          </span>

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg
                key={i}
                viewBox="0 0 24 24"
                className={`w-6 h-6 ${
                  i <= 4 ? "fill-[#FFB400]" : "fill-[#E5E5E5]"
                }`}
              >
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.264L12 18.897l-7.417 4.637L6 15.27 0 9.423l8.332-1.268z" />
              </svg>
            ))}
          </div>
        </div>

        <span className="text-[18px] text-[#2E2E2E]">
          (Based on 357 Reviews)
        </span>
      </div>

      {/* DIVIDER */}
      <div className="hidden lg:block w-px mt-3 h-[130px] bg-[#D6D6D8]" />

      {/* RATING BARS */}
      <div className="w-full max-w-[420px] space-y-4">
        {[
          { star: 5, count: 57, width: "75%" },
          { star: 4, count: 102, width: "60%" },
          { star: 3, count: 86, width: "48%" },
          { star: 2, count: 32, width: "28%" },
          { star: 1, count: 27, width: "18%" },
        ].map((item) => (
          <div key={item.star} className="flex items-center gap-4">
            <span className="text-[#FF4D00] text-sm w-6">
              {item.star} ★
            </span>

            <div className="flex-1 h-[8px] bg-[#D6D6D6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5E5E5E] rounded-full"
                style={{ width: item.width }}
              />
            </div>

            <span className="text-[#6B6B6B] text-sm w-8 text-right">
              {item.count}
            </span>
          </div>
        ))}
      </div>

    </div>
  </div>
</section>

      {/*  TABS */}
      <section className="bg-white px-4 py-6">
        <div className="w-full flex justify-center">
            <div
            className="
                flex
                w-full
                max-w-6xl
                rounded-xl
                border
                p-1
                bg-white

                overflow-x-auto sm:overflow-visible
                sm:justify-between
            "
            >
            {tabs.map((tab, index) => (
                <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className="
                    shrink-0
                    px-4 py-2
                    sm:px-6 sm:py-3
                    rounded-lg
                    font-semibold
                    text-sm sm:text-base lg:text-lg
                    whitespace-nowrap
                    transition-all
                "
                style={{
                    backgroundColor: activeTab === index ? "#FF4D00" : "white",
                    color: activeTab === index ? "white" : "black",
                }}
                >
                {tab}
                </button>
            ))}
            </div>
        </div>
        </section>
            

      {/* FORM */}
      <section className="bg-white p-6 pb-24">
        <div className="max-w-5xl mx-auto px-4 space-y-10">

          {/* COMPANY */}
          <div>
            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            text-center
                            sm:text-left m-4 block">
              What company are you reviewing today?
            </label>
            <div className="relative w-full">
            <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-full placeholder-black border
                 border-slate-400 px-5 py-4 pr-12 sm:px-4 sm:py-3
                   text-sm sm:text-base"
                placeholder="Company name or website"
            />

            {company && (
                <button
                type="button"
                onClick={() => setCompany("")}
                className="absolute right-4 top-1/2 -translate-y-1/2
                            text-gray-400 hover:text-gray-600"
                >
                <X className="h-7 w-6" />
                </button>
            )}
          </div>
        </div>  

          <div>
            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            text-center
                            sm:text-left m-4 block">
                Where is your company located?
            </label>

            {/* WRAPPER */}
            <div className="relative w-full">
                <input
                value={location}
                onChange={(e) => {
                    setLocation(e.target.value)
                    setOpen(true)
                }}
                onFocus={() => setOpen(true)}
                className="w-full rounded-full border text-sm sm:text-base placeholder-black border-slate-400
                            px-5 py-4 pr-12 sm:px-4 sm:py-3"
                placeholder="Enter your company location"
                />

                {/* DROPDOWN ICON */}
                <button
                type="button"
                onClick={() => setOpen(!open)}
                className="absolute right-5 top-1/2 -translate-y-1/2
                            text-gray-500 hover:text-gray-700"
                >
                <ChevronDown className= {`h-6 w-6 transition-transform ${
                    open ? "rotate-180" : ""
                }`}
                 />
                </button>

                {/* DROPDOWN LIST */}
                {open && (
                <div className="absolute z-10 mt-2 w-full rounded-xl border bg-white shadow-md">
                    {locations
                    .filter((item) =>
                        item.toLowerCase().includes(location.toLowerCase())
                    )
                    .map((item) => (
                        <button
                        key={item}
                        type="button"
                        onClick={() => {
                            setLocation(item)
                            setOpen(false)
                        }}
                        className="w-full text-left px-5 py-3 text-sm
                                    hover:bg-gray-100"
                        >
                        {item}
                        </button>
                    ))}

                    {locations.filter((item) =>
                    item.toLowerCase().includes(location.toLowerCase())
                    ).length === 0 && (
                    <div className="px-5 py-3 text-sm text-gray-400">
                        No results found
                    </div>
                    )}
                </div>
                )}
            </div>
            </div>

          {/* EMPLOYEES */}
          <div>
            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            sm:text-left m-4 block text-center">
              How many employees does your company have?
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4
             max-w-[900px] mx-auto sm:mx-0 gap-3">
              {[
                "1-10","11-50","51-100","101-150","151-200","201-500",
                "501-1000","1001-5000","5001-10,000","10,000+","None",
              ].map((item) => {
                const isSelected = employees === item

                return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setEmployees(item)}
                  className={`
                    rounded-full text-[9px] sm:text-sm lg:text-base font-medium transition-all
                    border px-4 py-3 sm:px-5 sm:py-2 whitespace-nowrap text-center
                    ${
                    isSelected
                        ? "bg-[#FF4D00] border-[#FF4D00] text-white"
                        : "bg-white border-slate-400 text-[#959292] hover:bg-slate-100"
                    }
                `}
                >
                {item}
                </button>
                )
              })}
            </div>
          </div>

          {/* COMPANY DESCRIPTION */}
          <div>
            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            sm:text-left m-4 block text-center">
              Tell us what your company does in a single sentence.
            </label>
            <textarea
              className=" w-full
                rounded-3xl
                text-sm
                md:text-base
                lg:text-lg
                placeholder:text-xs
                sm:placeholder:text-[10px]
                md:placeholder:text-base
                lg:placeholder:text-base

                border border-slate-400
                px-5 py-4
                sm:py-3"
              placeholder="Enter your Company’s Description"
            />
          </div>

          {/* GOALS */}
          <div>
            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            sm:text-left m-4 block text-center">
              What specific goals did you hire Fusion Tech to accomplish?
            </label>
            <div className="space-y-3">
              <input className="placeholder-black w-full rounded-full border border-slate-400 px-5 py-5 sm:px-4 sm:py-3" 
              placeholder="Goal 1" />
              <input className="w-full placeholder-black rounded-full border border-slate-400 px-5 py-5 sm:px-4 sm:py-3" 
              placeholder="Goal 2" />
              <input className="placeholder-black w-full rounded-full border border-slate-400 px-5 py-5 sm:px-4 sm:py-3" 
              placeholder="Goal 3" />
            </div>
          </div>

          {/* TIMELINE */}
          <div>
            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            sm:text-left m-4 block text-center">
              What was the timeline of this project?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className="rounded-full border border-slate-400 placeholder-black px-5 py-5" 
              placeholder="MM/YYYY" />
              <input className="rounded-full border border-slate-400 placeholder-black px-5 py-5" 
              placeholder="MM/YYYY" />
            </div>
          </div>

          {/* BUDGET */}
          <div>
            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            sm:text-left m-4 block text-center">
              How much money have you spent/invested in this project?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-[900px] mx-auto sm:mx-0">
              {[
                "Less than $10,000",
                "$10,000 to $49,999",
                "$50,000 to $199,999",
                "$200,000 to $999,999",
                "$1,000,000 to $9,999,999",
                "$10,000,000+",
              ].map((item) => {
                 const isSelected = budget === item

             return (
                    <button
                    key={item}
                    type="button"
                    onClick={() => setBudget(item)}
                    className={`
                        rounded-full py-4 px-4 text-base font-medium transition-all
                        border
                        ${
                        isSelected
                            ? "bg-[#FF4D00] border-[#FF4D00] text-white"
                            : "bg-white border-slate-400 text-gray-400 hover:bg-slate-50"
                        }
                    `}
                    >
                    {item}
                    </button>
                )
                })}
            </div>

            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            sm:text-left m-4 block text-center">
              <input type="checkbox" 
              checked={isConfidential}
              onChange={() => setIsConfidential(!isConfidential)}
              className="h-6 w-6 "/>
              Please keep this information confidential.
            </label>
          </div>

          {/* SERVICES */}
          <div>
            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            sm:text-left m-4 block text-center">
                What services did Fusion Tech provide during this project?
            </label>

            <div className="relative w-full">
            <input
                value={service}
                onChange={(e) => {
                setService(e.target.value)
                setServiceOpen(true)
                }}
                onFocus={() => setServiceOpen(true)}
                className="w-full rounded-full border placeholder-black border-slate-400 px-5 py-5 pr-10 sm:px-4 sm:py-3"
                placeholder="Search for services"
            />

            {/* DROPDOWN ICON */}
            <button
                type="button"
                onClick={() => setServiceOpen(!serviceOpen)}
                className="absolute right-5 top-1/2 -translate-y-1/2
                            text-gray-500 hover:text-gray-700"
                >
                <ChevronDown className= {`h-6 w-6 transition-transform ${
                    serviceOpen ? "rotate-180" : ""
                }`}
                 />
                </button>

            {/* DROPDOWN */}
            {serviceOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-2xl border bg-white shadow-lg overflow-hidden">
                {services
                    .filter((item) =>
                    item.toLowerCase().includes(serviceQuery.toLowerCase())
                    )
                    .map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => {
                        setService(item)
                        setServiceOpen(false)
                        }}
                        className="w-full text-left px-5 py-5 text-sm hover:bg-slate-100"
                    >
                        {item}
                    </button>
                    ))}

                {services.filter((item) =>
                    item.toLowerCase().includes(service.toLowerCase())
                ).length === 0 && (
                    <div className="px-5 py-3 text-sm text-gray-400">
                    No results found
                    </div>
                )}
                </div>
            )}
            </div>
            </div>

           {/* Optional Tags*/}
            <div>
            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            sm:text-left m-4 block text-center">
                Select any additional tags that applied to this project:
            </label>

            <div className="relative w-full">
                <input
                value={tag}
                onChange={(e) => {
                    setTag(e.target.value)
                    setTagOpen(true)
                }}
                onFocus={() => setTagOpen(true)}
                className="w-full rounded-full border placeholder-black border-slate-400
                            px-5 py-5 pr-12 sm:px-4 sm:py-3"
                placeholder="Search for tags (optional)"
                />

                {/* CHEVRON */}
                <button
                type="button"
                onClick={() => setTagOpen(!tagOpen)}
                className="absolute right-5 top-1/2 -translate-y-1/2
                            text-gray-500 hover:text-gray-700"
                >
                <ChevronDown
                    className={`h-6 w-6 transition-transform ${
                    tagOpen ? "rotate-180" : ""
                    }`}
                />
                </button>

                {/* DROPDOWN */}
                {tagOpen && (
                <div className="absolute z-10 mt-2 w-full rounded-xl
                                border bg-white shadow-md">
                    {tags
                    .filter((item) =>
                        item.toLowerCase().includes(tag.toLowerCase())
                    )
                    .map((item) => (
                        <button
                        key={item}
                        type="button"
                        onClick={() => {
                            setTag(item)
                            setTagOpen(false)
                        }}
                        className="w-full text-left px-5 py-3 text-sm
                                    hover:bg-gray-100"
                        >
                        {item}
                        </button>
                    ))}

                    {tags.filter((item) =>
                    item.toLowerCase().includes(tag.toLowerCase())
                    ).length === 0 && (
                    <div className="px-5 py-3 text-sm text-gray-400">
                        No results found
                    </div>
                    )}
                </div>
                )}
            </div>
            </div>

          {/* Description */}
          <div>
            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            sm:text-left m-4 block text-center">
                Describe the scope of work in detail. Please include a summary of key deliverables.
            </label>

            <textarea
                className="
                w-full
                min-h-[220px]
                rounded-[32px]
                border
                border-slate-400
                px-6
                py-6
                text-xl
                placeholder:text-gray-400
                resize-none
                focus:outline-none
                focus:ring-0
                "
                placeholder="Enter Description here"
            />
            </div>

          {/* TAGS */}
          <div>
            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            sm:text-left m-4 block text-center">
                Why did you select creative designs over others?
            </label>

            <div className="flex flex-wrap gap-3">
                {TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag)

                return (
                    <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`
                        flex items-center gap-2
                        px-4 py-2
                        text-sm font-bold
                        border
                        rounded-lg
                        transition-all
                        ${
                        isSelected
                            ? "bg-[#0E5FD8] text-white border-[#307396]"
                            : "bg-white text-[#307396] border-[#307396]"
                        }
                    `}
                    >
                    {tag}
                    <span className="text-xl leading-none">
                        +</span>
                    </button>
                )
                })}
            </div>
            </div>

          {/* TEAM SIZE */}
          <div>
            <label className="font-bold text-base
                            sm:text-lg
                            lg:text-2xl
                            leading-snug
                            mb-3
                            sm:text-left m-4 block text-center">
                How many teammates from Fusion Tech were assigned to this project?
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 max-w-[900px] mx-auto sm:mx-0 gap-3">
                {["1", "2-5", "6-10", "Other"].map((item) => {
                const isSelected = teamSize === item

                return (
                    <button
                    key={item}
                    type="button"
                    onClick={() => setTeamSize(item)}
                    className={`
                        rounded-full text-base font-medium transition-all
                        border py-5
                        ${
                        isSelected
                            ? "bg-[#FF4D00] border-[#FF4D00] text-white"
                            : "bg-white border-slate-400 text-[#959292] hover:bg-slate-100"
                        }
                    `}
                    >
                    {item}
                    </button>
                )
                })}
            </div>
            </div>

            {/* SUBMIT */}
            <div className="flex justify-center pt-16 pb-6">
            <button
                type="button"
                className="
                px-14 py-4
                rounded-full
                text-lg font-semibold
                bg-[#FF4D00] text-white
                hover:bg-[#e64500]
                transition-all
                shadow-md
                disabled:opacity-50
                disabled:cursor-not-allowed
                "
            >
                Submit
            </button>
            </div>

        </div>
      </section>
    </div>
  )
}
