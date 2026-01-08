"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MapPin,
  Star,
  ExternalLink,
  Navigation as NavIcon,
  Heart,
  MessageSquare,
} from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { ChatBot } from "@/components/chatbot"

interface Destination {
  id: string
  name: string
  description?: string
  category: string
  address?: string
  latitude: number
  longitude: number
  rating?: number
  priceLevel?: number
  photos: string[]
  website?: string
  phoneNumber?: string
  openingHours?: string[]
  hotels: Array<{
    id: string
    name: string
    price: number
    currency: string
    provider: string
    bookingUrl: string
    rating?: number
  }>
  transports: Array<{
    id: string
    type: string
    provider: string
    price: number
    currency: string
    bookingUrl: string
    duration?: string
  }>
  placeDetails?: {
    reviews?: Array<{
      author_name: string
      rating: number
      text: string
    }>
  }
}

export default function DestinationPage() {
  const params = useParams()
  const id = params.id as string
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)

  useEffect(() => {
    if (id) {
      fetchDestination()
    }
  }, [id])

  const fetchDestination = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/destination/${id}`)
      const data = await response.json()
      setDestination(data)
    } catch (error) {
      console.error("Error fetching destination:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGetDirections = () => {
    if (destination) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`
      window.open(url, "_blank")
    }
  }

  const handleViewOnGoogleMaps = () => {
    if (destination) {
      const url = `https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`
      window.open(url, "_blank")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-6" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Destination not found</h2>
          <Link href="/search">
            <Button>Back to Search</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Hero Image */}
      {destination.photos && destination.photos.length > 0 && (
        <div className="relative h-96 w-full">
          <Image
            src={destination.photos[0]}
            alt={destination.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute top-4 right-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className="bg-white/90 backdrop-blur-sm"
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{destination.name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {destination.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{destination.rating.toFixed(1)}</span>
                        </div>
                      )}
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                        {destination.category}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {destination.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <p className="text-gray-600">{destination.address}</p>
                  </div>
                )}

                {destination.description && (
                  <p className="text-gray-700 leading-relaxed">{destination.description}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleGetDirections} variant="outline">
                    <NavIcon className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                  <Button onClick={handleViewOnGoogleMaps} variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Google Maps
                  </Button>
                  {destination.website && (
                    <Button
                      onClick={() => window.open(destination.website, "_blank")}
                      variant="outline"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Photo Gallery */}
            {destination.photos && destination.photos.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(destination.photos?.slice(1, 7) || []).map((photo, index) => (
                      <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                        <Image
                          src={photo}
                          alt={`${destination.name} ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hotels */}
            {destination.hotels && destination.hotels.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Hotels Nearby</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(destination.hotels || []).map((hotel) => (
                      <div
                        key={hotel.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-semibold">{hotel.name}</h4>
                          <p className="text-sm text-gray-600">{hotel.provider}</p>
                          {hotel.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{hotel.rating}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatPrice(hotel.price, hotel.currency)}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(hotel.bookingUrl, "_blank")}
                          >
                            Book
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            {destination.placeDetails?.reviews && destination.placeDetails.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(destination.placeDetails?.reviews || []).map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{review.author_name}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${destination.latitude},${destination.longitude}`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Opening Hours */}
            {destination.openingHours && destination.openingHours.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Opening Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {(destination.openingHours || []).map((hours, index) => (
                      <li key={index} className="text-gray-700">
                        {hours}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Chatbot Toggle */}
            <Button
              onClick={() => setShowChatbot(!showChatbot)}
              className="w-full"
              size="lg"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Ask AI Assistant
            </Button>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      {showChatbot && (
        <ChatBot destinationId={destination.id} onClose={() => setShowChatbot(false)} />
      )}
    </div>
  )
}

