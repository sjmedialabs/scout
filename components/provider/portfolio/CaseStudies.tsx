"use client";

import { useState } from "react";

export default function CaseStudies({ provider }: any) {

    const caseStudies = provider?.caseStudies || [];
const [currentIndex, setCurrentIndex] = useState(0);
const updatedProvider = {
  ...provider,
  caseStudies: [caseStudies[currentIndex]],
};
//   const project = provider?.caseStudies?.[0] || {};
const project = updatedProvider?.caseStudies?.[0] || {};
  console.log("Recived prop case studies :::::::")

  const handleNext = () => {
  setCurrentIndex((prev) =>
    prev === caseStudies.length - 1 ? 0 : prev + 1
  );
};

const handlePrev = () => {
  setCurrentIndex((prev) =>
    prev === 0 ? caseStudies.length - 1 : prev - 1
  );
};

  return (
    <section id="case-studies" className="px-6 sm:px-6 lg:px-0 py-6 max-w-7xl mt-4 mx-auto bg-white">

      {/* HEADER */}
      <p className="text-lg font-extrabold text-orangeButton mb-0 uppercase tracking-wide">
        CASE STUDIES
      </p>

      <h2 className="text-md text-gray-500  mb-1">
        Detailed outcomes
      </h2>

      <p className="text-sm text-gray-500 mb-2 max-w-2xl">
        Every project below includes scope, timeline, methodology, and verified post-launch metrics.
      </p>

      {/* MAIN CARD */}
      <div className="border rounded-xl bg-white overflow-hidden">

        {/* ================= TOP ================= */}
        <div className="p-4">
            {caseStudies.length > 1 && (
                <div className="flex justify-between items-center mb-4">
                    
                    <button
                    onClick={handlePrev}
                    className="px-3 py-1 text-xs bg-[#232a8f] text-white border cursor-pointer rounded-md hover:bg-blue-800"
                    >
                    ← Prev
                    </button>

                    <span className="text-xs text-gray-400">
                    {currentIndex + 1} / {caseStudies.length}
                    </span>

                    <button
                    onClick={handleNext}
                    className="px-3 py-1 text-xs border bg-[#232a8f] text-white cursor-pointer rounded-md hover:bg-blue-800"
                    >
                    Next →
                    </button>

                </div>    
                )}

          {/* META */}
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
            {project?.clientCompanyName || "Client"} · CASE STUDY
          </p>

          <div className="flex flex-col md:flex-row justify-between items-start gap-10">

            {/* LEFT */}
            <div className="max-w-3xl">

              <h3 className="text-2xl text-blueButton font-semibold mb-3">
                {project?.projectTitle || "Project Title"}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {project?.projectDescription ||
                  "Project description goes here."}
              </p>

              {/* TAGS */}
              <div className="flex flex-wrap gap-2">
                {(project?.technologiesUsed || []).map((t: string, i: number) => (
                  <span
                    key={i}
                    className="bg-green-100 text-[#1F7A4D] px-3 py-1 rounded-full text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex sm:flex-row md:flex-col gap-6 min-w-[140px] space-y-6">

              <div>
                <p className="text-xl font-semibold">Budget</p>
                <p className="text-xs text-gray-500">
                  ₹{project?.budget || "$0"}
                </p>
              </div>

              <div>
                <p className="text-xl font-semibold">Timeline</p>
                <p className="text-xs text-gray-500">
                  {project?.timeline || "-"}
                </p>
              </div>

            </div>

          </div>
        </div>

        {/* ================= METRICS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-5 border-t items-center justify-between p-8">

          {(project?.stats || []).map((stat: any, i: number) => (
            <div
              key={i}
              className="text-center p-6 border-r last:border-r-0"
            >
              <p className="text-xl font-semibold text-green-700">
                {stat.value}
              </p>

              <p className="text-sm text-gray-600 mt-1">
                {stat.title}
              </p>

              {stat.description && (
                <p className="text-xs text-gray-400 mt-1">
                  {stat.description}
                </p>
              )}
            </div>
          ))}

        </div>

        {/* ================= BOTTOM ================= */}
        <div className="grid lg:grid-cols-3 border-t">

          {/* LEFT - TIMELINE */}
          <div className="lg:col-span-2 p-8">

            <p className="text-xs text-gray-500 mb-6 uppercase tracking-wide">
              PROJECT TIMELINE
            </p>

            <div className="space-y-6">
              {(project?.projectSteps || []).map((step: any, i: number) => (
                <div key={i} className="flex gap-4">

                  {/* NUMBER */}
                  <div className="h-7 w-7 flex items-center justify-center rounded-full bg-gray-100 text-xs font-semibold">
                    {i + 1}
                  </div>

                  {/* CONTENT */}
                  <div>
                    <p className="font-semibold text-sm">
                      {step.title}
                    </p>

                    <p className="text-sm text-gray-600">
                      {step.description}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {step.timeline}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>

         
          {/* <div className="p-8 border-l flex flex-col justify-between">

            
            <p className="text-xs text-gray-500 mb-4 uppercase tracking-wide">
              DEMO REQUESTS — MONTHLY
            </p>

         
            <div className="h-[180px] bg-gray-100 rounded-md mb-4 flex items-center justify-center text-xs text-gray-400">
              Chart Placeholder
            </div>

            
            <div className="bg-[#E6F4EC] text-[#1F7A4D] text-sm p-4 rounded-lg">
              Arrow marks launch date. Results tracked via HubSpot + GA4.
            </div>

          </div> */}

        </div>

      </div>
    </section>
  );
}