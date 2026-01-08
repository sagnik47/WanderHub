"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { MapPin, Star, ArrowLeft, Calendar } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Visit {
  id: string
  visitedAt: string
  notes?: string
  destination: {
    id: string
    name: string
    category: string
    address?: string
    rating?: number
  }
}

export default function VisitsPage() {
  const { data: session } = useSession()
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchVisits()
    }
  }, [session])

  const fetchVisits = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/visits")
      if (response.ok) {
        const data = await response.json()
        setVisits(data.visits || [])
      }
    } catch (error) {
      console.error("Error fetching visits:", error)
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
            <Calendar className="h-5 w-5 text-blue-500" />
            My Visits
          </h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : visits.length > 0 ? (
          <div className="space-y-4">
            {visits.map((visit) => (
              <Link key={visit.id} href={`/destination/${visit.destination.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{visit.destination.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(new Date(visit.visitedAt))}</span>
                          </div>
                          {visit.destination.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{visit.destination.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        {visit.destination.address && (
                          <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {visit.destination.address}
                          </p>
                        )}
                        {visit.notes && (
                          <p className="text-sm text-gray-700 mt-2 italic">"{visit.notes}"</p>
                        )}
                        <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded mt-2">
                          {visit.destination.category}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You haven't marked any visits yet.</p>
            <Link href="/search">
              <Button>Explore Destinations</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}


