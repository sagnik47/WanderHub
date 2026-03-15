"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, CalendarDays } from "lucide-react"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [days, setDays] = useState("3")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    router.push(`/search/results?q=${encodeURIComponent(query)}&days=${encodeURIComponent(days || "3")}`)
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
            Search specific places like "Beaches in Goa" and get focused recommendations
          </p>

          <Card className="p-6">
            <form onSubmit={handleSearch}>
              <div className="flex gap-2 mb-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="e.g., Beaches in Goa"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <div className="relative w-40">
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="number"
                    min={1}
                    max={30}
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="pl-10 h-12"
                    placeholder="Days"
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
                {[
                  { label: "Beaches", value: "beaches" },
                  { label: "Mountains", value: "hills" },
                  { label: "Waterfalls", value: "waterfalls" },
                  { label: "Temples", value: "temples" },
                  { label: "Hidden Gems", value: "attractions" },
                ].map((tag) => (
                  <Button
                    key={tag.value}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQuery(tag.label)
                      router.push(
                        `/search/results?q=${encodeURIComponent(tag.label)}&category=${encodeURIComponent(tag.value)}&days=${encodeURIComponent(days || "3")}`
                      )
                    }}
                  >
                    {tag.label}
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

