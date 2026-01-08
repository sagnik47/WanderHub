import { NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { calculateDistance } from "@/lib/haversine"

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        surveys: true,
      },
    })

    if (!user || !user.location) {
      return NextResponse.json({ notifications: [] })
    }

    const location = user.location as { lat: number; lng: number }
    const survey = user.surveys[0]

    // Find destinations within 50km
    const allDestinations = await prisma.destination.findMany({
      where: {
        latitude: {
          gte: location.lat - 0.5, // Rough bounding box
          lte: location.lat + 0.5,
        },
        longitude: {
          gte: location.lng - 0.5,
          lte: location.lng + 0.5,
        },
      },
    })

    // Calculate distances and filter
    const nearbyDestinations = allDestinations
      .map((dest) => ({
        ...dest,
        distance: calculateDistance(
          location.lat,
          location.lng,
          dest.latitude,
          dest.longitude
        ),
      }))
      .filter((dest) => dest.distance <= 50) // Within 50km
      .sort((a, b) => a.distance - b.distance)

    // Score destinations based on user preferences
    const scoredDestinations = nearbyDestinations.map((dest) => {
      let score = 100 - dest.distance // Base score from distance

      // Boost score if category matches user interests
      if (survey) {
        const categoryMatch = survey.preferredCategories.includes(dest.category)
        if (categoryMatch) {
          score += 30
        }

        // Boost score based on rating
        if (dest.rating) {
          score += dest.rating * 5
        }

        // Boost score based on popularity
        score += dest.popularityScore * 0.1
      }

      return {
        ...dest,
        score,
      }
    })

    // Sort by score and return top 10
    const notifications = scoredDestinations
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((dest) => ({
        id: dest.id,
        name: dest.name,
        category: dest.category,
        distance: dest.distance,
        rating: dest.rating,
        score: dest.score,
      }))

    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Notifications API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    )
  }
}

