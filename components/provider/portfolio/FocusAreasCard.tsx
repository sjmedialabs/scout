"use client"

import { Badge } from "@/components/ui/badge"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function FocusAreasCard({ provider, reviews = [] }) {

// const SERVICE_COLORS = ["#F54A0C", "#FF8A5B", "#FFC1A6", "#FFD9C7"]

// //  Get completed projects (adjust key if needed)
// const completedProjects =
//   provider?.projects?.filter((p) => p.status === "completed") || []

// // Count services
// const serviceCountMap: Record<string, number> = {}

// completedProjects.forEach((project) => {
//   const service = project.service || "Other"

//   serviceCountMap[service] = (serviceCountMap[service] || 0) + 1
// })

// //  Convert to array + sort + take top 5
// const topServices = Object.entries(serviceCountMap)
//   .map(([name, value]) => ({ name, value }))
//   .sort((a, b) => b.value - a.value)
//   .slice(0, 5)

const SERVICE_COLORS = [
  "#2C34A1",
  "#F54A0C",
  "#22C55E",
  "#A855F7",
  "#FACC15",
]

// STEP 1: Try reviews first
let serviceRatings: Record<
  string,
  { total: number; count: number }
> = {}

; (Array.isArray(reviews) ? reviews : []).forEach((review) => {
  const service =
  review?.project?.category ||
  review?.service ||
  review?.category ||
  "Other"

  const rating = review?.rating || 0

  if (!serviceRatings[service]) {
    serviceRatings[service] = { total: 0, count: 0 }
  }

  serviceRatings[service].total += rating
  serviceRatings[service].count += 1
})

// STEP 2: If no reviews → fallback to projects
if (Object.keys(serviceRatings).length === 0) {
  const projects =
    (provider?.projects || []).filter(
      (p) => p?.status?.toLowerCase() === "completed"
    )

  projects.forEach((project) => {
    const service =
      project?.service ||
      project?.category ||
      "Other"

    if (!serviceRatings[service]) {
      serviceRatings[service] = { total: 0, count: 0 }
    }

    serviceRatings[service].total += 1
    serviceRatings[service].count += 1
  })
}

// STEP 3: Final top services
  const totalValue = Object.values(serviceRatings).reduce(
  (acc, curr) => acc + curr.count,
  0
)

const topServices = Object.keys(serviceRatings)
  .map((service) => ({
    name: service,
    value: serviceRatings[service].count, // using count for %
    total: totalValue, // needed for %
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 5)

  console.log("Recieved props :::",provider)

  return (
    <div className="space-y-3">

      {/* Focus Areas */}
      <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-5 space-y-1">
        <h3 className="text-[16px] font-semibold text-orangeButton h-5">
          Focus Areas
        </h3>

        <p className="text-[12px] leading-[1.6] text-gray-600">
          {provider?.focusArea || "Focus area is not added till now"}
        </p>
      </div>

      {/* Industries */}
      <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-5 space-y-1">
        <h3 className="text-[16px] font-semibold text-orangeButton h-5">
          Industries
        </h3>

        {
          (provider?.industries || []).length!==0 ? 
          (
            <div className="flex flex-row gap-2 flex-wrap">
              {
              provider?.industries.map((item)=>(
                <div>
                  <Badge  className="text-[12px] leading-[1.6] bg-[#F54A0C] min-w-[60px] h-[20px]">{item}</Badge>
                </div>
              ))

              }
            </div>
              
            
          ) :<p className="text-[12px] leading-[1.6] text-gray-600">Not working on any industries</p>
        }
      </div>

            {/* Clients */}
      
    { provider?.clients?.length >0 && (<div className="shadow-md rounded-2xl border border-orange-100 bg-white p-5 space-y-1">
        <h3 className="text-[16px] font-semibold text-orangeButton h-5">
          Clients
        </h3>
          <div className="flex flex-wrap gap-2">
            {provider?.clients?.map((client, index) => (
              <Badge
                key={index}
                className="text-[12px] leading-[1.6] bg-[#F54A0C] min-w-[60px] h-[20px]"
              >
                {client}
              </Badge>
            ))}
         </div>
      </div>)}

      {topServices.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-orange-100">
          <h1 className="text-[16px] font-semibold text-orangeButton mb-4 -mt-4">
            Top Services
          </h1>

          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topServices}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label={({ percent }) => {
                    if (typeof window !== "undefined" && window.innerWidth < 768) {
                      // return `${(percent * 100).toFixed(0)}%` 
                    }
                    return "" 
                  }}
                  labelLine={false}
                >
                  {topServices.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SERVICE_COLORS[index % SERVICE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const total = props?.payload?.payload?.total || 0
                    const percent = total
                      ? ((value / total) * 100).toFixed(1)
                      : 0

                    return [`${percent}%`, name]
                  }}
                />
                <Legend
                  layout="vertical"
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"  
                  iconSize={8}
                  wrapperStyle={{
                    fontSize: "10px",
                    paddingTop: "0px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </div>
  )
}
