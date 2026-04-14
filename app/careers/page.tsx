"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import ApplyJobModal from "@/components/ApplyJobModal"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function CareersPage() {
  const router=useRouter();
  const [jobs, setJobs] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState("")

  useEffect(() => {
    fetch("/api/careers")
      .then((res) => res.json())
      .then(setJobs)
  }, [])

  return (
    <>
    <section className="w-full px-6 md:px-8 xl:px-27 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl text-orangeButton">
          Current Openings
        </h1>
        <p className="text-gray-500 mt-0 text-xl md:text-base">
          Thanks for checking out our job openings. See something that interests you? Apply here.
        </p>
      </div>

      {/* Job Cards */}
     <div className="flex flex-col gap-4">
        {jobs.map((job) => (
          <div
            key={job.slug}
            onClick={() => router.push(`/careers/${job.slug}`)}
            className="w-full  cursor-pointer border border-gray-400 h-full 
            rounded-2xl sm:rounded-3xl 
            px-4 py-4 sm:px-6 sm:py-6 md:px-6 md:py-3
            flex flex-col lg:flex-row 
            lg:items-center lg:justify-between 
            gap-4 sm:gap-6"
          >
            {/* Title */}
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-md font-semibold text-gray-800">
                {job.title}
              </h2>
            </div>

            {/* Department + Location */}
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm text-gray-500 mt-1">
                <span className="text-[#000] font-medium">
                  Department:
                </span>{" "}
                {job.department}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                <span className="text-[#000] font-medium">
                  Location:
                </span>{" "}
                {job.location}
              </p>
            </div>

            {/* Experience + Employment */}
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm text-gray-500 mt-1">
                <span className="text-[#000] font-medium">
                  Experience:
                </span>{" "}
                {job.experience}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                <span className="text-[#000] font-medium">
                  Employment Type:
                </span>{" "}
                {job.employmentType}
              </p>
            </div>

            {/* Button */}
            <div className="lg:flex-shrink-0 flex lg:justify-end">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedJob(job.title);
                  setOpen(true);
                }}
                className="primary-button h-[30px]"
              >
                Apply Now
              </Button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && (
          <p className="text-center text-gray-500 py-10">No jobs posted yet.</p>
        )}
      </div>
    </section>

    <ApplyJobModal
  isOpen={open}
  onClose={() => setOpen(false)}
  jobTitle={selectedJob}
/>
</>
  )
}

