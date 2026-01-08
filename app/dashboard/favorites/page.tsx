"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { MapPin, Star, ArrowLeft, Heart } from "lucide-react"
import Image from "next/image"

interface Favorite {
  id: string
  destination: {
    id: string
    name: string
    category: string
    address?: string
    rating?: number
    photos?: string[]
  }
}

export default function FavoritesPage() {
  const { data: session } = useSession()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchFavorites()
    }
  }, [session])

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/favorites")
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites || [])
      }
    } catch (error) {
      console.error("Error fetching favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            My Favorites
          </h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <Link key={favorite.id} href={`/destination/${favorite.destination.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  {favorite.destination.photos && favorite.destination.photos[0] && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={favorite.destination.photos[0]}
                        alt={favorite.destination.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{favorite.destination.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      {favorite.destination.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{favorite.destination.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    {favorite.destination.address && (
                      <p className="text-sm text-gray-500 mb-2">{favorite.destination.address}</p>
                    )}
                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                      {favorite.destination.category}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You haven't favorited any destinations yet.</p>
            <Link href="/search">
              <Button>Explore Destinations</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}


