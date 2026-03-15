import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const categoryTypeFilters: Record<string, string[]> = {
  beaches: ["beach", "natural_feature", "tourist_attraction"],
  hills: ["mountain", "hiking_area", "natural_feature", "tourist_attraction"],
  waterfalls: ["waterfall", "natural_feature", "tourist_attraction", "park"],
  temples: ["place_of_worship", "hindu_temple", "tourist_attraction"],
  museums: ["museum", "tourist_attraction"],
  attractions: ["tourist_attraction", "natural_feature", "park"],
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const category = searchParams.get("category")
    const userLat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null
    const userLon = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // Dynamic import to avoid build-time evaluation
    const { searchPlaces, mapPlaceTypeToCategory, getPhotoUrl } = await import("@/lib/google-places")

    // Search Google Places API
    let places = await searchPlaces(
      query,
      userLat && userLon ? { lat: userLat, lng: userLon } : undefined,
      userLat && userLon ? 50000 : undefined // 50km radius
    )

    // Retry with a broader search phrase when no direct matches are returned
    if (places.length === 0) {
      places = await searchPlaces(
        `${query} tourist attractions`,
        userLat && userLon ? { lat: userLat, lng: userLon } : undefined,
        userLat && userLon ? 50000 : undefined
      )
    }

    // Fallback to cached DB results if Google returns no results
    if (places.length === 0) {
      const cachedDestinations = await prisma.destination.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { category: { contains: query, mode: "insensitive" } },
            { address: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 30,
        orderBy: [{ popularityScore: "desc" }, { updatedAt: "desc" }],
      })

      return NextResponse.json({
        destinations: cachedDestinations.map((destination) => ({
          id: destination.id,
          name: destination.name,
          description: destination.description,
          category: destination.category,
          address: destination.address,
          rating: destination.rating,
          photoUrl: Array.isArray(destination.photos) && destination.photos.length > 0
            ? getPhotoUrl(destination.photos[0] as string)
            : null,
        })),
      })
    }

    const allowedTypes = category ? categoryTypeFilters[category.toLowerCase()] : undefined

    const filteredPlaces = allowedTypes
      ? places.filter((place) => {
          const placeTypes = place.types || []
          return placeTypes.some((type) => allowedTypes.includes(type))
        })
      : places

    const placesToUse = filteredPlaces.length > 0 ? filteredPlaces : places

    // Process and save places to database
    const destinations = await Promise.all(
      placesToUse.map(async (place) => {
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
      {
        error: error instanceof Error ? error.message : "Failed to search destinations",
      },
      { status: 500 }
    )
  }
}

