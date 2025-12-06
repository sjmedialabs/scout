"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Star, MapPin } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchTerm: string) => {
    setLoading(true)

    // Mock search results - in real app, this would call an API
    const mockResults = [
      {
        id: "1",
        type: "provider",
        name: "TechCraft Solutions",
        description: "Full-stack development company specializing in modern web and mobile applications.",
        rating: 4.9,
        reviews: 127,
        location: "San Francisco, CA",
        services: ["Web Development", "Mobile Apps", "E-commerce"],
      },
      {
        id: "2",
        type: "requirement",
        title: "E-commerce Website Development",
        description: "Looking for a modern e-commerce platform with payment integration...",
        budget: "$5,000 - $10,000",
        category: "Web Development",
        timeline: "3 months",
      },
      {
        id: "3",
        type: "provider",
        name: "Digital Marketing Pro",
        description: "Comprehensive digital marketing strategies for growing businesses.",
        rating: 4.7,
        reviews: 89,
        location: "Austin, TX",
        services: ["SEO", "Social Media", "Content Marketing"],
      },
    ].filter(
      (item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setTimeout(() => {
      setResults(mockResults)
      setLoading(false)
    }, 500)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim())
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for services, providers, or projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Searching...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {query && (
            <p className="text-muted-foreground">
              Showing {results.length} results for "{query}"
            </p>
          )}

          {results.length === 0 && query ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No results found for "{query}"</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try different keywords or browse our service categories
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {result.type === "provider" ? result.name : result.title}
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">{result.description}</p>
                      </div>
                      <Badge variant={result.type === "provider" ? "default" : "secondary"}>
                        {result.type === "provider" ? "Provider" : "Project"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {result.type === "provider" ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>
                              {result.rating} ({result.reviews} reviews)
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{result.location}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {result.services.map((service: string) => (
                            <Badge key={service} variant="outline">
                              {service}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="outline">View Profile</Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{result.category}</Badge>
                          <span>Budget: {result.budget}</span>
                          <span>Timeline: {result.timeline}</span>
                        </div>
                        <Button variant="outline">View Details</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
