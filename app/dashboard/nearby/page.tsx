"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { MapPin, Star, ArrowLeft } from "lucide-react"
import Image from "next/image"

interface Notification {
  id: string
  name: string
  category: string
  distance: number
  rating?: number
  score: number
}

export default function NearbyPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchNotifications()
    }
  }, [session])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
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
          <h1 className="text-xl font-semibold">Nearby Destinations</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600 mb-6">
          Destinations within 50km, ranked by your preferences
        </p>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notifications.map((notification) => (
              <Link key={notification.id} href={`/destination/${notification.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{notification.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      {notification.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{notification.rating.toFixed(1)}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{notification.distance.toFixed(1)} km</span>
                      </div>
                    </div>
                    <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                      {notification.category}
                    </span>
                    <p className="text-xs text-gray-500 mt-2">
                      Match score: {notification.score.toFixed(0)}%
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-4">
              No nearby destinations found. Make sure your location is set in your profile.
            </p>
            <Link href="/dashboard/settings">
              <Button>Update Location</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}


