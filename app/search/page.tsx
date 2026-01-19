"use client"

import type React from "react"
import { ChevronDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ServiceCard from "@/components/ServiceCard"
import type { Provider } from "@/components/types/service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import Image from "next/image"
import { categories } from "@/lib/mock-data"

const options = [
  "High to Low Rating",
  "Low to High Rating",
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const[dynamicProviders,setDynamicProviders]=useState<Provider[]>([])
  const[filteredDynamicProviders,setDynamicFilteredProviders]=useState<Provider[]>([])
  console.log("search param is:::",query)

 
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

    const res = await fetch("/api/providers")
    const data = await res.json()

    setDynamicProviders(data.providers)
    console.log("Fetched providers::::",data.providers)

    if (searchTerm.trim()) {
      console.log('Entered to if')
      const filtered = data.providers.filter((eachItem: Provider) =>
        eachItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eachItem.services?.some(service =>
          service.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
       console.log("dynamic filtered queris are:::",filtered)
      setDynamicFilteredProviders(filtered)
    } else {
      setDynamicFilteredProviders(data.providers)
    }

  } catch (error) {
    console.error("Search error:", error)
  } finally {
    setLoading(false)
  }
}


 
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
     if (searchQuery.trim()) {
      console.log('Entered to if')
      const filtered = dynamicProviders.filter((eachItem: Provider) =>
        eachItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eachItem.services?.some(service =>
          service.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
       console.log("dynamic filtered queris are:::",filtered)
      setDynamicFilteredProviders(filtered)
  }}
 const handleHighestRating = (value: string) => {
  let sortedData = [...filteredDynamicProviders];

  if (value === "high-to-low") {
    sortedData.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  } 
  else if (value === "low-to-high") {
    sortedData.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
  } 
  else {
    // reset to original filtered data
    setDynamicFilteredProviders(filteredDynamicProviders);
    return;
  }

  setDynamicFilteredProviders(sortedData);
};


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
         <div className="flex justify-between my-8">
          
          <Select onValueChange={handleHighestRating}>
            <SelectTrigger
              className="
                bg-[#f5f5f5]
                h-12
                w-[180px]
                rounded-full
                shadow-none
                border border-[#e5e5e5]
                text-[#555]
                px-4
                focus:outline-none
                focus:ring-0
                focus:ring-offset-0
                focus:border-[#e5e5e5]
              "
            >
              <SelectValue placeholder="Highest Rating" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="high-to-low">High to Low</SelectItem>
              <SelectItem value="low-to-high">Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
         </div> 

        {/* STATES */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">
            Searching…
          </div>
        ) : filteredDynamicProviders.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No results found for "{query}"
          </div>
        ) : (
          /* CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredDynamicProviders.map((provider) => (
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
