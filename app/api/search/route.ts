import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sortByDistance } from "@/lib/haversine"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const userLat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null
    const userLon = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // Dynamic import to avoid build-time evaluation
    const { searchPlaces, mapPlaceTypeToCategory, getPhotoUrl } = await import("@/lib/google-places")

    // Search Google Places API
    const places = await searchPlaces(
      query,
      userLat && userLon ? { lat: userLat, lng: userLon } : undefined,
      userLat && userLon ? 50000 : undefined // 50km radius
    )

    // Process and save places to database
    const destinations = await Promise.all(
      places.map(async (place) => {
        const category = mapPlaceTypeToCategory(place.types || [])
        const photoUrl = place.photos?.[0]
          ? getPhotoUrl(place.photos[0].photo_reference)
          : null

        // Upsert destination
        const destination = await prisma.destination.upsert({
          where: { placeId: place.place_id },
          update: {
            name: place.name,
            address: place.formatted_address,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            rating: place.rating,
            priceLevel: place.price_level,
            photos: place.photos ? place.photos.map((p) => p.photo_reference) : undefined,
            category,
            lastAccessedAt: new Date(),
          },
          create: {
            placeId: place.place_id,
            name: place.name,
            address: place.formatted_address,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
            rating: place.rating,
            priceLevel: place.price_level,
            photos: place.photos ? place.photos.map((p) => p.photo_reference) : undefined,
            category,
          },
        })

        // Calculate distance if user location provided
        let distance: number | undefined
        if (userLat && userLon) {
          const { calculateDistance } = await import("@/lib/haversine")
          distance = calculateDistance(
            userLat,
            userLon,
            destination.latitude,
            destination.longitude
          )
        }

        return {
          id: destination.id,
          name: destination.name,
          description: destination.description,
          category: destination.category,
          address: destination.address,
          rating: destination.rating,
          distance,
          photoUrl,
        }
      })
    )

    // Sort by distance if user location provided
    let sortedDestinations = destinations
    if (userLat && userLon) {
      sortedDestinations = destinations.sort((a, b) => {
        const distA = a.distance || Infinity
        const distB = b.distance || Infinity
        return distA - distB
      })
    }

    return NextResponse.json({ destinations: sortedDestinations })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json(
      { error: "Failed to search destinations" },
      { status: 500 }
    )
  }
}

