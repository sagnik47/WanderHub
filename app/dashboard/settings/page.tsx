"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MapPin } from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [location, setLocation] = useState({ lat: "", lng: "" })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        }
      )
    }
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lng),
          },
        }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error("Error saving location:", error)
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
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Location Settings</CardTitle>
            <CardDescription>
              Set your location to get personalized nearby destination recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Latitude</label>
              <Input
                type="number"
                step="any"
                value={location.lat}
                onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                placeholder="e.g., 28.6139"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">Longitude</label>
              <Input
                type="number"
                step="any"
                value={location.lng}
                onChange={(e) => setLocation({ ...location, lng: e.target.value })}
                placeholder="e.g., 77.2090"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={loading || !location.lat || !location.lng}
              className="w-full"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {loading ? "Saving..." : saved ? "Saved!" : "Save Location"}
            </Button>
            <p className="text-xs text-gray-500">
              Your location is used to find destinations within 50km and provide distance-based
              recommendations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


