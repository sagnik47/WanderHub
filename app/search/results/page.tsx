"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { ChatMessageContent } from "@/components/chat-message-content"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Star, Sparkles, ImageIcon, Search } from "lucide-react"
import Image from "next/image"

interface Destination {
  id: string
  name: string
  description?: string
  category: string
  address?: string
  rating?: number
  distance?: number
  photoUrl?: string
}

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""
  const days = searchParams.get("days") || "3"
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [itinerary, setItinerary] = useState("")
  const [itineraryLoading, setItineraryLoading] = useState(false)
  const [searchInput, setSearchInput] = useState(query)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    setSearchInput(query)
  }, [query])

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => {
        setUserLocation(null)
      }
    )
  }, [])

  useEffect(() => {
    if (query) {
      fetchResults()
      fetchItinerary()
    }
  }, [query, category, userLocation?.lat, userLocation?.lng, days])

  const fetchResults = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ q: query })
      if (category) params.set("category", category)
      if (userLocation) {
        params.set("lat", userLocation.lat.toString())
        params.set("lng", userLocation.lng.toString())
      }

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        setDestinations([])
        setError(data.error || "Unable to fetch destinations")
        return
      }

      setDestinations(data.destinations || [])
    } catch (error) {
      console.error("Search error:", error)
      setError("Unable to fetch destinations")
      setDestinations([])
    } finally {
      setLoading(false)
    }
  }

  const fetchItinerary = async () => {
    setItineraryLoading(true)
    try {
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          days: parseInt(days, 10) || 3,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setItinerary("")
        return
      }

      setItinerary(data.itinerary || "")
    } catch {
      setItinerary("")
    } finally {
      setItineraryLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return

    const params = new URLSearchParams()
    params.set("q", searchInput.trim())
    if (days) params.set("days", days)
    window.location.href = `/search/results?${params.toString()}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-600">
          Results for: <span className="font-semibold text-gray-900">{query}</span>
        </p>
        <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
              placeholder="Search places like Beaches in Goa"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-12 text-center">
          <p className="text-red-600">{error}</p>
        </Card>
      ) : destinations.length > 0 ? (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6 items-start">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Link key={destination.id} href={`/destination/${destination.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full overflow-hidden">
                  {destination.photoUrl ? (
                    <div className="relative h-48 w-full">
                      <Image
                        src={destination.photoUrl}
                        alt={destination.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <div className="text-center text-primary-700">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-xs font-medium">Photo unavailable</p>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{destination.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      {destination.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{destination.rating.toFixed(1)}</span>
                        </div>
                      )}
                      {destination.distance !== undefined && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{destination.distance.toFixed(1)} km</span>
                        </div>
                      )}
                    </div>
                    {destination.address && (
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{destination.address}</p>
                    )}
                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                      {destination.category}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="sticky top-24">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary-600" />
                <h3 className="font-semibold">AI Mini Itinerary ({days} days)</h3>
              </div>

              {itineraryLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : itinerary ? (
                <ChatMessageContent content={itinerary} />
              ) : (
                <p className="text-sm text-gray-500">
                  Itinerary will appear here once destinations are loaded.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-gray-600">No destinations found. Try a different search term.</p>
        </Card>
      )}
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />
      
      <Suspense fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      }>
        <SearchResults />
      </Suspense>
    </div>
  )
}

