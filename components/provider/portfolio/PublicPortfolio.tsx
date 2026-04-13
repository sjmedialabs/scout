"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
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

export default function PublicPortfolioGrid(
  { provider, variant = "default" }: PortfolioGridProps & { variant?: "default" | "compact" | "large" }
) {

  const isCompact = variant === "compact";
const isLarge = variant === "large";

  // const [filter, setFilter] = useState<"all" | "portfolio" | "awards">("all")

  const portfolioItems = provider.portfolio ?? []
  const awardItems = provider.awards ?? []

 return (
    <section id="portfolio" className="px-6 sm:px-6 lg:px-0 py-12 max-w-7xl mx-auto bg-white">

      {/* ================= PORTFOLIO CARD ================= */}

       {/* Header */}

        <div className="mb-2">
          <h3 className="text-xl font-bold text-gray-500">
            PORTFOLIO
          </h3>

          <p className="text-sm text-gray-500">
            Selected case studies with visuals and measurable outcomes.
          </p>
        </div>
      <div className=" rounded-lg border  bg-white  p-6 py-4 space-y-2">

        {/* Portfolio Grid */}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {portfolioItems.map((item, index) => (
            <div
              key={`portfolio-${index}`}
              className="border border-gray-200 bg-white overflow-hidden rounded-xl flex flex-col"
            >
              <div className="relative h-[150px] w-full bg-black">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-[#ebecee] rounded-2xl text-[12px] text-[#000]"
                  >
                    {item.category}
                  </Badge>
                  <h4 className="font-semibold text-md mb-1">{item.title}</h4>
                  <p className="text-xs text-[#b2b2b2] line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(item?.technologies || []).map((tech, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs bg-[#d9e4f6] text-[#000] rounded-2xl"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                
                </div>
            </div>
          ))}
         
        </div>
        {/* No Portfolio Items Message*/}
         {
            portfolioItems.length === 0 && (
              <p className="text-gray-500 text-center my-10 text-md">No portfolio items available</p>
            )
          }
      </div>


      {/* ================= AWARDS CARD ================= */}

      {/* Header */}
        <div className="mb-2">
          <h3 className="text-xl font-bold text-gray-500">
            AWARDS
          </h3>

          <p className="text-sm text-gray-500">
            Recognitions and achievements earned by the company.
          </p>
        </div>

      <div className=" rounded-lg border  bg-white p-6 py-4 space-y-2">

        {/* Awards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {awardItems.map((item, index) => (
            <div
              key={index}
              className="border rounded-xl flex flex-col items-center overflow-hidden"
            >
              <img
                src={item?.imageUrl}
                alt={item.title}
                className="w-full h-[150px] object-cover"
              />

              <div className="p-2">
                <p className="text-[12px] font-medium text-center">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* No Awards Items Message*/}
         {
            awardItems.length === 0 && (
              <p className="text-gray-500 text-center my-10 text-md">No awards items available</p>
            )
          }
      </div>

    </section>
  )
}
