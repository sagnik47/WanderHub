"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Star } from "lucide-react"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    router.push(`/search/results?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Navigation />

      {/* Search Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Discover Your Next Adventure
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Search for beaches, hills, waterfalls, temples, or describe what you're looking for
          </p>

          <Card className="p-6">
            <form onSubmit={handleSearch}>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="e.g., quiet hills, hidden beaches, waterfalls near me..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <Button type="submit" size="lg" disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {["beaches", "hills", "waterfalls", "temples", "hidden gems"].map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery(tag)
                      router.push(`/search/results?q=${encodeURIComponent(tag)}`)
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

