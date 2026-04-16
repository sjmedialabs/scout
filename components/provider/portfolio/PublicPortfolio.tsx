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
    awards?: any[]
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

  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // const [filter, setFilter] = useState<"all" | "portfolio" | "awards">("all")

  const portfolioItems = provider.portfolio ?? []
  const awardItems = provider.awards ?? []

  return (
    <section id="portfolio" className="px-6 sm:px-6 lg:px-0 py-2 max-w-7xl mx-auto bg-white">

      {/* ================= PORTFOLIO CARD ================= */}

       {/* Header */}

        <div className="mb-2">
          <h3 className="text-xl font-bold text-orangeButton">
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
              className="border border-gray-200 bg-white overflow-hidden rounded-xl flex flex-col cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative h-[150px] w-full bg-black">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-2">
                    <Badge
                      variant="outline"
                      className="bg-[#ebecee] rounded-2xl text-[12px] text-[#000]"
                    >
                      {item.category}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-md mb-1">{item.title}</h4>
                  <p className="text-xs text-[#b2b2b2] line-clamp-2 mb-3 flex-1">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-auto">
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

      {awardItems.length > 0 && (
        <>
          {/* Header */}
          <div className="mb-2 mt-12">
            <h3 className="text-xl font-bold text-orangeButton">
              AWARDS
            </h3>

            <p className="text-sm text-gray-500">
              Recognitions and achievements earned by the company.
            </p>
          </div>

          <div className=" rounded-lg border bg-white p-6 py-4 space-y-2">
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
          </div>
        </>
      )}

      {/* ================= PORTFOLIO MODAL ================= */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 sm:p-6"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div className="relative w-full h-48 sm:h-72 md:h-96 bg-gray-100 flex-shrink-0">
              <Image
                src={selectedItem.image}
                alt={selectedItem.title}
                fill
                className="object-contain sm:object-cover"
              />
            </div>
            
            <div className="p-5 sm:p-8 overflow-y-auto bg-white flex-1">
              <div className="mb-4">
                <Badge variant="outline" className="bg-[#ebecee] px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-gray-800 border-none">
                  {selectedItem.category}
                </Badge>
              </div>
              
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {selectedItem.title}
              </h3>
              
              <div className="prose prose-sm sm:prose-base max-w-none text-gray-600 mb-8 whitespace-pre-wrap leading-relaxed">
                {selectedItem.description}
              </div>
              
              {selectedItem.technologies && selectedItem.technologies.length > 0 && (
                <div className="mt-auto pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-sm text-gray-900 mb-3 tracking-wide uppercase">Technologies & Skills</h4>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {selectedItem.technologies.map((tech, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="text-xs sm:text-sm px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors rounded-full border border-blue-100"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
