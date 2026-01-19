import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Next.js 15 (Promise) and older versions
    const resolvedParams = params instanceof Promise ? await params : params
    
    const destination = await prisma.destination.findUnique({
      where: { id: resolvedParams.id },
      include: {
        hotels: {
          orderBy: { price: "asc" },
          take: 5,
        },
        transports: {
          orderBy: { price: "asc" },
          take: 5,
        },
      },
    })

    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    // Dynamic import to avoid build-time evaluation
    const { getPlaceDetails, getPhotoUrl } = await import("@/lib/google-places")

    // Fetch fresh details from Google Places if needed
    let placeDetails = null
    try {
      placeDetails = await getPlaceDetails(destination.placeId)
      
      // Update description if we got new data
      if (placeDetails.editorial_summary?.overview) {
        await prisma.destination.update({
          where: { id: destination.id },
          data: {
            description: placeDetails.editorial_summary.overview,
            rating: placeDetails.rating || destination.rating,
            priceLevel: placeDetails.price_level || destination.priceLevel,
            website: placeDetails.website || destination.website,
            phoneNumber: placeDetails.formatted_phone_number || destination.phoneNumber,
            openingHours: placeDetails.opening_hours?.weekday_text || undefined,
            lastAccessedAt: new Date(),
          },
        })
      }
    } catch (error) {
      console.error("Error fetching place details:", error)
      // Continue with cached data
    }

    // Get photo URLs
    const photos = destination.photos
      ? (destination.photos as string[]).slice(0, 10).map((ref) => getPhotoUrl(ref))
      : []

    return NextResponse.json({
      ...destination,
      photos,
      placeDetails: placeDetails
        ? {
            reviews: placeDetails.reviews?.slice(0, 5) || [],
            openingHours: placeDetails.opening_hours?.weekday_text || [],
          }
        : null,
    })
  } catch (error) {
    console.error("Destination API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch destination" },
      { status: 500 }
    )
  }
}


