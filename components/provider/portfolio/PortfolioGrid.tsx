"use client"

import Image from "next/image"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type PortfolioItem = {
  title: string
  description: string
  image: string
  technologies?: string[]
  category?: string
}

type PortfolioGridProps = {
  provider: {
    portfolio?: PortfolioItem[]
    awards?: string[]
  }
}

const categoryColorClasses = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-pink-100 text-pink-700",
  "bg-yellow-100 text-yellow-700",
  "bg-indigo-100 text-indigo-700",
]

const getCategoryColor = (index: number) =>
  categoryColorClasses[index % categoryColorClasses.length]

export default function PortfolioGrid(
  { provider, variant = "default" }: PortfolioGridProps & { variant?: "default" | "compact" | "large" }
) {

  const isCompact = variant === "compact";
const isLarge = variant === "large";

  // const [filter, setFilter] = useState<"all" | "portfolio" | "awards">("all")

  const portfolioItems = provider.portfolio ?? []
  const awardItems = provider.awards ?? []

 return (
    <div className="space-y-6">

      {/* ================= PORTFOLIO CARD ================= */}
      <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-6 py-2 space-y-2">

        {/* Header */}
        <div>
          <h3 className={`${
            isCompact ? "text-[14px]" :
            isLarge ? "text-[18px]" :
            "text-[16px]"
          } font-semibold text-orangeButton`}>
            Portfolio
          </h3>

          <p className={`${
            isCompact ? "text-[10px] text-gray-600" :
            isLarge ? "text-[13px] text-gray-600" :
            "text-[11px] text-gray-600"
          }`}>
            Selected case studies with visuals and measurable outcomes.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {portfolioItems.map((item, index) => (
            <div
              key={`portfolio-${index}`}
              className="border border-gray-200 bg-white overflow-hidden rounded-xl flex flex-col"
            >
              <div className="relative h-[100px] w-full bg-black">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-2 flex flex-col flex-1">
                <h4 className="text-[12px] font-semibold text-gray-900">
                  {item.title}
                </h4>

                <p className="text-[10px] text-gray-500">
                  {item.description}
                </p>

                <div className="flex items-end justify-between pt-2 mt-auto">
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-medium ${getCategoryColor(index)}`}
                  >
                    {item.category ?? "Portfolio"}
                  </span>

                  {item.technologies?.[0] && (
                    <span className="text-[11px] font-semibold text-green-600">
                      {item.technologies[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* ================= AWARDS CARD ================= */}
      <div className="shadow-md rounded-2xl border border-orange-100 bg-white p-6 py-2 space-y-2">

        {/* Header */}
        <div>
          <h3 className={`${
            isCompact ? "text-[14px]" :
            isLarge ? "text-[18px]" :
            "text-[16px]"
          } font-semibold text-orangeButton`}>
            Awards
          </h3>

          <p className={`${
            isCompact ? "text-[10px] text-gray-600" :
            isLarge ? "text-[13px] text-gray-600" :
            "text-[11px] text-gray-600"
          }`}>
            Recognitions and achievements earned by the company.
          </p>
        </div>

        {/* Awards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {awardItems.map((item, index) => (
            <div
              key={index}
              className="border rounded-xl flex flex-col items-center overflow-hidden"
            >
              <img
                src={item?.imageUrl}
                alt={item.title}
                className="w-full h-[120px] object-cover"
              />

              <div className="p-2">
                <p className="text-[12px] font-medium text-center">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
