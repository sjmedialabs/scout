"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Star, MapPin } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState({ agencies: [], services: [] })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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

      // API returns: { agencies: [], services: [] }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Search Results</h1>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="text-sm"
          >
            ← Back
          </Button>
        </div>
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
        <div>
          {results.agencies.length === 0 && results.services.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No results found for "{query}"</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-10">

              {/* Services */}
              {results.services.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Services</h2>
                  <div className="space-y-4">
                    {results.services.map((s: any) => (
                      <Card key={s.id}>
                        <CardHeader>
                          <CardTitle>{s.name}</CardTitle>
                          <p className="text-muted-foreground">{s.description}</p>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Agencies */}
              {results.agencies.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-3">Agencies</h2>
                  <div className="space-y-4">
                    {results.agencies.map((a: any) => (
                      <Card key={a._id}>
                        <CardHeader>
                          <CardTitle>{a.name}</CardTitle>
                          <p className="text-muted-foreground">{a.description}</p>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  )
}
