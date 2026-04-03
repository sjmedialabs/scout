"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, } from "recharts";
import { useState } from "react";

export default function Overview({ provider, reviews = [] , proposalData = [] }) {

// STEP 1: collect from reviews
const serviceCountMap: Record<string, number> = {};

// ================= CLIENT TYPE DISTRIBUTION =================


const industryMap: Record<string, number> = {};

// STEP 1: from reviews (best source)
(proposalData || []).forEach((proposal: any) => {

  if(
    proposal.status=== "accepted" || proposal.status=== "completed"
  ){
     const industry = proposal.client?.industry;

  if (!industry) return;

  industryMap[industry] = (industryMap[industry] || 0) + 1;
  }
 
});

// STEP 2: fallback → projects
if (Object.keys(industryMap).length === 0) {
  (provider?.projects || []).forEach((project: any) => {
    const industry =
      project?.client?.industry

    if (!industry) return;

    industryMap[industry] =
      (industryMap[industry] || 0) + 1;
  });
}

// STEP 3: top 5 industries
const industriesRaw = Object.entries(industryMap)
  .map(([name, value]) => ({
    name,
    value,
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 5);

// STEP 4: percentage (ONLY top 5)
const industryTotal = industriesRaw.reduce(
  (acc, item) => acc + item.value,
  0
);

const industries = industriesRaw.map((item) => ({
  ...item,
  percent: industryTotal
    ? ((item.value / industryTotal) * 100).toFixed(0)
    : 0,
}));

const [showAllServices, setShowAllServices] = useState(false);

(reviews || []).forEach((review: any) => {
  const service =
    review?.project?.category ||
    review?.project?.service ||
    review?.service ||
    review?.category ||
    "Other";

  serviceCountMap[service] = (serviceCountMap[service] || 0) + 1;
});

// STEP 2: fallback → projects if no reviews
if (Object.keys(serviceCountMap).length === 0) {
  (provider?.projects || []).forEach((project: any) => {
    const service =
      project?.category ||
      project?.service ||
      "Other";

    serviceCountMap[service] =
      (serviceCountMap[service] || 0) + 1;
  });
}
// 3. Total
const total = Object.values(serviceCountMap).reduce(
  (acc, val) => acc + val,
  0
);

// 4. Top 5 services
// 1. Get top 5 first
const topServicesRaw = Object.entries(serviceCountMap)
  .map(([name, value]) => ({
    name,
    value,
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 5);

// 2. Total ONLY of top 5
const topTotal = topServicesRaw.reduce(
  (acc, item) => acc + item.value,
  0
);

// 3. Add percentage based on top 5
const topServices = topServicesRaw.map((item) => ({
  ...item,
  percent: topTotal
    ? ((item.value / topTotal) * 100).toFixed(0)
    : 0,
}));

const hasServiceData = topServices.length > 0;
const hasIndustryData = industries.length > 0;
const hasAnyChartData = hasServiceData || hasIndustryData;

  
  return (
    <section id="overview" className="px-6 sm:px-6 lg:px-0 py-12 max-w-7xl mx-auto bg-[#F7F7F5]">
      <h2 className="text-lg font-bold text-gray-500 mb-6">AGENCY PROFILE</h2>

      <div className="grid lg:grid-cols-2 gap-6 items-stretch">

        {/* LEFT */}
        <div className="border rounded-xl p-6 bg-[#F7F7F5] h-full flex flex-col">
          <h3 className="font-semibold mb-4 text-sm">COMPANY DETAILS</h3>

          <Row label="Founded" value={provider?.foundedYear || "N/A"} />
          <Row label="HQ" value={provider?.location  || "N/A"} />
          {/* <Row label="Offices" value="NY · London · Berlin" /> */}
          <Row label="Team size" value={`${provider?.teamSize  || "N/A"}`} />
          <Row
            label="Hourly rate"
            value={
              provider?.hourlyRate
                ? `$${provider.hourlyRate }`
                : "N/A"
            }
          />

          <Row
            label="Min. project"
            value={
              provider?.minProjectSize
                ? `$${provider.minProjectSize}`
                : "N/A"
            }
          />
          {/* <Row label="Avg. timeline" value="8–16 weeks" />
          <Row label="Pricing model" value="Project + Retainer" />
          <Row label="Languages" value="EN · ES · FR · DE" /> */}
        </div>

        {/* RIGHT */}
        <div className="border rounded-xl p-6 bg-[#F7F7F5] h-full flex flex-col justify-between">
          <div>
            <h3 className="font-semibold mb-4 text-sm">SERVICES</h3>

            {/* SERVICES */}
            {
              provider?.services?.length === 0?(
                <div className = "text-center text-gray-500"> No services data available for this agency.</div>

              ):
              (
                <div>
            <div
              className={`flex flex-wrap gap-3 mb-0 transition-all duration-300 ${
                showAllServices ? "" : "max-h-[100px] overflow-hidden"
              }`}
            >
              {(provider?.services || []).map((s: string, i: number) => (
                <span
                  key={i}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* SHOW MORE BUTTON */}
            {provider?.services?.length > 8 && (
              <div className="text-right">
              <button
                onClick={() => setShowAllServices(!showAllServices)}
                className="text-xs  text-right font-semibold text-black cursor-pointer underline mb-3"
              >
                {showAllServices ? "Show Less" : "View More"}
              </button>
              </div>
            )}
            </div>
              )
            }
            

            {/* FOCUS AREAS */}
            {provider?.focusArea &&
             <div>
             <h3 className="font-semibold mb-4 text-sm">FOCUS AREAS</h3>
            <p className="text-sm text-gray-600">
              {provider?.focusArea || "Focus area not added yet"}
            </p>
            </div>
            }

            {/* <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            Not ideal for one-off social content, projects under $10K, or clients needing purely managed service.
          </div> */}
          </div>
        </div>
        

      </div>

      {hasAnyChartData && (
      <div className="grid lg:grid-cols-2 gap-6 mt-6">

        {/* SERVICE FOCUS */}
        
          <div className="border rounded-xl p-6 bg-[#F7F7F5]">
            <h3 className="font-semibold mb-1 text-sm">
              Service focus breakdown
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              % of team capacity allocated
            </p>
              {!hasServiceData ? (
              <div className="text-sm text-gray-500 text-center py-10">
                No data available
              </div>
            ) : (
            <div className="flex flex-col lg:flex-row items-center gap-6">
              
              {/* DONUT */}
              <DonutChart
                data={topServices}
                colors={["#14532D", "#15803D", "#34D399", "#6EE7B7", "#A7F3D0"]}
              />

              {/* LEGEND */}
              <div className="text-sm space-y-2">
                {topServices.map((item: any, i: number) => (
                  <LegendItem
                    key={i}
                    label={item.name}
                    value={`${item.percent}%`}
                    color={["#14532D", "#15803D", "#34D399", "#6EE7B7", "#A7F3D0"][i]}
                  />
                ))}
              </div>
            
            </div>
            )}
          </div>
          
        

        {/* CLIENT TYPE */}
        
        <div className="border rounded-xl p-6  bg-[#F7F7F5]">
          <h3 className="font-semibold mb-1 text-sm">
            Client type distribution
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            By company stage
          </p>
          {!hasIndustryData ? (
            <div className="text-sm text-gray-500 text-center py-10">
              No data available
            </div>
          ) : (
          <div className="flex flex-col lg:flex-row items-center gap-6">
            
            <DonutChart
              data={industries}
              colors={["#1E3A8A", "#2563EB", "#60A5FA", "#93C5FD", "#BFDBFE"]}
            />
            <div className="text-sm space-y-2">
              {industries.map((item: any, i: number) => (
                <LegendItem
                  key={i}
                  label={item.name}
                  value={`${item.percent}%`}
                  color={["#1E3A8A", "#2563EB", "#60A5FA", "#93C5FD", "#BFDBFE"][i]}
                />
              ))}
            </div>
            

          </div>
          )}
        </div>

      </div>
      )}
    </section>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between border-b py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}

function DonutChart({ data, colors }: any) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="w-[220px] h-[220px] mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>

          {/* Tooltip */}
          <Tooltip />

          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={95}
            paddingAngle={2}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((_: any, index: number) => (
              <Cell
                key={index}
                fill={colors[index]}
                style={{
                  transform:
                    activeIndex === index ? "scale(1.08)" : "scale(1)",
                  transformOrigin: "center",
                  transition: "0.2s",
                  cursor: "pointer",
                }}
              />
            ))}
          </Pie>

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function LegendItem({ label, value, color }: any) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-gray-700">
        {label} — {value}
      </span>
    </div>
  );
}