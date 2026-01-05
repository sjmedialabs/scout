"use client"

import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ServiceCard from "@/components/ServiceCard"
import type { Provider } from "@/components/types/service"
import { Search } from "lucide-react"
import Image from "next/image"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState({ agencies: [], services: [] })
  const [loading, setLoading] = useState(false)

  
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
      performSearch(searchQuery.trim())
    }
  }

  const providers: Provider[] = [
    ...results.services,
    ...results.agencies,
  ]


  return (
    <div className="bg-white">

      {/* HERO SEARCH SECTION */}
      <section className="relative h-[280px] flex items-center justify-center overflow-hidden">
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
        <h1 className="text-orange-500 text-3xl font-semibold mb-6">
          Search Results
        </h1>

        <form
          onSubmit={handleSearch}
          className="mx-auto max-w-3xl flex items-center bg-white rounded-full shadow-md overflow-hidden"
        >
          <Input
            placeholder="Search for Agency name/service / Project name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 h-14 px-6 text-sm focus-visible:ring-0"
          />
          <button
            type="submit"
            className="h-14 w-16 bg-orange-500 flex items-center justify-center"
          >
            <Search className="text-white h-5 w-5" />
          </button>
        </form>
      </div>
    </section>


      {/* RESULTS HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <p className="text-lg text-gray-500">
            Search Results{" "}
            <span className="font-medium text-gray-700">
              {providers.length > 0 && `1–${providers.length}`}
            </span>
          </p>

          {/* SORT DROPDOWN (UI ONLY) */}
          <select
            className="border rounded-full px-4 py-2 text-sm text-gray-600"
            defaultValue="rating"
          >
            <option value="rating">Highest Rating</option>
            <option value="newest">Newest</option>
            <option value="projects">Most Projects</option>
          </select>
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
          <div className="grid gap-8 md:grid-cols-2">
            {providers.map((provider) => (
              <ServiceCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
