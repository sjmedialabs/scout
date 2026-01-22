"use client"

import { jobs } from "@/lib/jobs"
import { useState } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import ApplyJobModal from "@/components/ApplyJobModal"


export default function JobDetailsPage( {
      params,
}: {
  params: { slug: string }
}) {
  const job = jobs.find((job) => job.slug === params.slug)
 
  if (!job) {
    notFound()
  }

    const [open, setOpen] = useState(false)

  return (
    <>
    <section className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT CONTENT */}
        <div className=" ml-6 lg:col-span-2">
          {/* Title */}
          <h1 className="text-4xl font-medium text-orangeButton mb-4">
            {job.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap gap-6 text-gray-500 text-sm mb-2">
            <span>{job.location}</span>
            <span>{job.email}</span>
            <span>{job.website}</span>
          </div>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed mb-4">
            {job.description}
          </p>

          {/* Responsibilities */}
          <h2 className="text-xl font-semibold mb-2">
            Key Responsibilities
          </h2>

          <div className="space-y-6 text-gray-400 text-sm">
            {job.responsibilities.map((res, i) => (
            <div key={i}>
              <p className="font-medium text-gray-500 mb-1">
                {i + 1}. {res.title}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {res.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
            ))}
         </div>

          {/* Skills */}
          <h2 className="text-xl font-semibold mt-12 mb-4">
            Required Skills & Capabilities
          </h2>

          <ul className="list-disc pl-5 space-y-2 text-gray-400 text-sm">
            {job.skills.map((skill, i) => (
                <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:sticky h-fit">
          <div className="bg-[#eef1f6] rounded-3xl overflow-hidden">
            <div className="divide-y text-sm text-gray-500 space-y-0">
              <div className="p-6">
                <p className="font-bold">Date Posted</p>
                <p>{job.meta.datePosted}</p>
              </div>
              <div className="p-6">
                <p className="font-bold">Experience</p>
                <p>{job.meta.experience}</p>
              </div>
              <div className="p-6">
                <p className="font-bold">Salary Range</p>
                <p>{job.meta.salary}</p>
              </div>
              <div className="p-6">
                <p className="font-bold">Department</p>
                <p>{job.meta.department}</p>
              </div>
              <div className="p-6">
                <p className="font-Bold">Employment Type</p>
                <p>{job.meta.employmentType}</p>
              </div>
            </div>

            {/* CTA */}
            <button 
            onClick={() => setOpen(true)}
            className="w-full bg-orange-600 hover:bg-orange-500 transition text-white text-lg py-6">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* APPLY MODAL */}
      <ApplyJobModal
        isOpen={open}
        onClose={() => setOpen(false)}
        jobTitle={job.title}
      />
    </>
  )
}
