"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Star } from "lucide-react"
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

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      fetchResults()
    }
  }, [query])

  const fetchResults = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setDestinations(data.destinations || [])
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
          <p className="text-gray-600">
            Results for: <span className="font-semibold text-gray-900">{query}</span>
          </p>
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
        ) : destinations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Link key={destination.id} href={`/destination/${destination.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  {destination.photoUrl && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={destination.photoUrl}
                        alt={destination.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{destination.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      {destination.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{destination.rating.toFixed(1)}</span>
                        </div>
                      )}
                      {destination.distance && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{destination.distance.toFixed(1)} km</span>
                        </div>
                      )}
                    </div>
                    {destination.address && (
                      <p className="text-sm text-gray-500 mb-2">{destination.address}</p>
                    )}
                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                      {destination.category}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No destinations found. Try a different search term.</p>
          </Card>
        )}
      </div>
    </div>
  )
}

