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

export default function PortfolioGrid({ provider }: PortfolioGridProps) {
  const [filter, setFilter] = useState<"all" | "portfolio" | "awards">("all")

  const portfolioItems = provider.portfolio ?? []
  const awardItems = provider.awards ?? []

  return (
    <div
      className="shadow-md rounded-2xl border border-orange-100 bg-white p-6 space-y-4"
      
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[16px] font-semibold h-5 text-orangeButton">
            Portfolio & Awards
          </h3>
          <p className="text-[12px] text-gray-500">
            Selected case studies with visuals and measurable outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
        <span className="text-[12px] text-gray-600">
          Show:
        </span>

        <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
          <SelectTrigger className="h-8 w-[90px] text-[12px] rounded-md border border-gray-200">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="portfolio">Portfolio</SelectItem>
            <SelectItem value="awards">Awards</SelectItem>
          </SelectContent>
        </Select>
      </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Portfolio cards */}
        {(filter === "all" || filter === "portfolio") &&
          portfolioItems.map((item, index) => (
            <div
              key={`portfolio-${index}`}
              className=" border border-gray-200 bg-white overflow-hidden rounded-xl flex flex-col"
            >
              <div className="relative h-[100px] w-full bg-black flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-2 flex flex-col flex-1">
                <h4 className="text-[10px] h-4 font-semibold text-gray-900">
                  {item.title}
                </h4>

                <p className="text-[8px] text-gray-500">
                  {item.description}
                </p>

                <div className="flex items-end justify-between pt-2 mt-auto">
                  <span
                    className={`rounded-full px-2 py-1 text-[8px] font-medium ${getCategoryColor(
                      index
                    )}`}
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

        {/* Award cards */}
        {(filter === "all" || filter === "awards") &&
          awardItems.map((item, index) => (
             <div
                    key={index}
                    className="relative border rounded-xl flex flex-col gap-2 items-center"
                  >
                    <img
                      src={item?.imageUrl}
                      alt={item.title}
                      className="w-full h-30 object-cover rounded-t-xl border"
                    />

                    <div className="px-2 pb-2">
                      <p className="font-medium">{item.title}</p>
                    </div>
                  </div>
          ))}
      </div>
    </div>
  )
}
