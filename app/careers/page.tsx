"use client"

const jobs = [
  {
    title: "Account Manager",
    category: "Enterprise Hiring Partnerships (B2B / Revenue Role)",
    mode: "Hybrid",
    location: "Washington, District of Columbia (Hybrid)",
    role: "Account Management",
    type: "Full-Time",
  },
  {
    title: "Sales Executive",
    category: "Enterprise Hiring Partnerships (B2B / Revenue Role)",
    mode: "WFO",
    location: "Washington, District of Columbia (Hybrid)",
    role: "Sales Executive",
    type: "Full-Time",
  },
  {
    title: "Business Development Manager",
    category: "Enterprise Hiring Partnerships (B2B / Revenue Role)",
    mode: "WFH",
    location: "Washington, District of Columbia (Hybrid)",
    role: "BDM",
    type: "Full-Time",
  },
  {
    title: "Marketing Executive",
    category: "Enterprise Hiring Partnerships (B2B / Revenue Role)",
    mode: "WHO",
    location: "Washington, District of Columbia (Hybrid)",
    role: "Marketing Executive",
    type: "Full-Time",
  },
]

export default function CareersPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
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
      <div className="space-y-6 w-6xl">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="border border-gray-400 rounded-3xl px-6 py-6 md:px-10 md:py-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            {/* Left */}
            <div className="lg:w-1/3">
              <h2 className="text-lg font-semibold text-gray-800">
                {job.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {job.category}
              </p>
            </div>

            {/* Middle 1 */}
            <div className="lg:w-1/4">
              <p className="text-lg font-medium text-gray-500">
                {job.mode}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {job.location}
              </p>
            </div>

            {/* Middle 2 */}
            <div className="lg:w-1/4 pt-0">
              <p className="text-lg font-medium text-gray-500">
                {job.role}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {job.type}
              </p>
            </div>

            {/* CTA */}
            <div className="lg:w-auto">
              <button className="bg-orange-600 hover:bg-orange-500 transition text-white text-xs font-medium px-6 py-3 rounded-full">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
