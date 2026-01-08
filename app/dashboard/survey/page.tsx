"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import Link from "next/link"

const INTERESTS = [
  "Beaches",
  "Mountains",
  "Waterfalls",
  "Temples",
  "Museums",
  "Adventure Sports",
  "Wildlife",
  "Food & Culture",
  "Photography",
  "Relaxation",
]

const BUDGET_OPTIONS = ["low", "medium", "high", "luxury"]
const TRAVEL_STYLES = ["solo", "couple", "family", "group"]

export default function SurveyPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [interests, setInterests] = useState<string[]>([])
  const [budget, setBudget] = useState<string>("")
  const [travelStyle, setTravelStyle] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (interests.length === 0 || !budget || !travelStyle) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/user/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interests: interests.map((i) => i.toLowerCase()),
          budget,
          travelStyle,
          preferredCategories: interests.map((i) => i.toLowerCase()),
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        alert("Failed to save preferences")
      }
    } catch (error) {
      console.error("Survey error:", error)
      alert("Failed to save preferences")
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">Please sign in to complete the survey</p>
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
            WanderHub
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Travel Preferences</CardTitle>
            <CardDescription>
              Help us personalize your travel recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Interests */}
              <div>
                <label className="text-sm font-semibold mb-3 block">
                  What are you interested in? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {INTERESTS.map((interest) => (
                    <Button
                      key={interest}
                      type="button"
                      variant={interests.includes(interest) ? "default" : "outline"}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="text-sm font-semibold mb-3 block">Budget Range</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {BUDGET_OPTIONS.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={budget === option ? "default" : "outline"}
                      onClick={() => setBudget(option)}
                      className="capitalize"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Travel Style */}
              <div>
                <label className="text-sm font-semibold mb-3 block">Travel Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TRAVEL_STYLES.map((style) => (
                    <Button
                      key={style}
                      type="button"
                      variant={travelStyle === style ? "default" : "outline"}
                      onClick={() => setTravelStyle(style)}
                      className="capitalize"
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Skip
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


