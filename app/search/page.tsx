"use client"

import type React from "react"
import { ChevronDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ServiceCard from "@/components/ServiceCard"
import type { Provider } from "@/components/types/service"
import { Search } from "lucide-react"
import Image from "next/image"


const options = [
  "Highest Rating",
  "Newest",
  "Oldest",
  "Most Reviews",
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
 
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(options[0])

  type SearchResults = {
  services: any[]
  agencies: any[]
}

const [results, setResults] = useState<SearchResults>({
  services: [],
  agencies: [],
})

  
  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchTerm: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
      const data = await res.json()
      setResults(data)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const providers: Provider[] = [
  ...(Array.isArray(results.services) ? results.services : []),
  ...(Array.isArray(results.agencies) ? results.agencies : []),
]


  return (
    <div className="bg-white">

      {/* HERO SEARCH SECTION */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
      {/* Banner Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/Search-banner.jpg"
          alt="Service Details Banner Image"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center w-full px-4">
        <h1 className="text-orangeButton text-4xl font-extrabold mb-4">
          Search Results
        </h1>

        <form
          onSubmit={handleSearch}
          className="mx-auto relative max-w-3xl border-2 border-[#c8d5e4] flex items-center bg-white rounded-full overflow-hidden"
        >
          <Input
            placeholder="Search for Agency name/service / Project name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 placeholder:text-gray-500 h-16 px-6 text-sm focus-visible:ring-0"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center justify-center 
            h-14 sm:h-12 w-14 sm:w-12 rounded-full bg-[#F54A0C] hover:bg-[#d93f0b] shadow-md transition-all rotate-90"
          >
            <Search className="text-white h-6 w-6" />
          </button>
        </form>
      </div>
    </section>


      {/* RESULTS HEADER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <p className="text-4xl text-gray-500">
            Search Results - {" "}
            <span className="font-medium text-gray-700">
              {providers.length > 0 && `1–${providers.length}`}
            </span>
          </p>

          {/* SORT DROPDOWN (UI ONLY) */}
          <div className="relative inline-flex">
            {/* Trigger */}
            <button
              onClick={() => setOpen(!open)}
              className="
                flex items-center justify-between
                min-w-[200px]
                bg-[#f2f2f2]
                border border-[#e5e5e5]
                rounded-full
                px-6 py-3
                text-xs font-medium text-black
              "
            >
              <span className="text-left">{value}</span>
              <ChevronDown className="h-5 w-5" />
            </button>

            {/* Dropdown */}
            {open && (
              <div
                className="
                  absolute left-0 top-full mt-2
                  w-full
                  rounded-xl
                  border border-[#e5e5e5]
                  bg-white
                  shadow-sm
                  z-50
                  overflow-hidden
                "
              >
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setValue(option)
                      setOpen(false)
                    }}
                    className="
                      w-full
                      px-6 py-3
                      text-left
                      text-xs
                      hover:bg-[#f2f2f2]
                    "
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
         </div> 

        {/* STATES */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            Searching…
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No results found for "{query}"
          </div>
        ) : (
          /* CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {providers.map((provider) => (
            <ServiceCard
              key={provider.id ?? provider._id ?? provider.name}
              provider={provider}
            />
          ))}
        </div>
        )}
      </section>
    </div>
  )
}
