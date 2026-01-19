const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!GOOGLE_PLACES_API_KEY) {
  throw new Error("GOOGLE_PLACES_API_KEY is not set")
}

export interface GooglePlace {
  place_id: string
  name: string
  formatted_address?: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  rating?: number
  price_level?: number
  photos?: Array<{ photo_reference: string }>
  types?: string[]
  website?: string
  formatted_phone_number?: string
  opening_hours?: {
    weekday_text?: string[]
  }
}

export interface GooglePlaceDetails extends GooglePlace {
  editorial_summary?: {
    overview?: string
  }
  reviews?: Array<{
    author_name: string
    rating: number
    text: string
    time: number
  }>
}

/**
 * Search for places using Google Places API Text Search
 */
export async function searchPlaces(
  query: string,
  location?: { lat: number; lng: number },
  radius?: number
): Promise<GooglePlace[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error("Google Places API key is not configured")
  }

  const params = new URLSearchParams({
    query,
    key: GOOGLE_PLACES_API_KEY,
  })

  if (location && radius) {
    params.append("location", `${location.lat},${location.lng}`)
    params.append("radius", radius.toString())
  }

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(`Google Places API error: ${response.statusText}`)
  }

  const data = await response.json()

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Google Places API error: ${data.status}`)
  }

  return data.results || []
}

/**
 * Get place details by place_id
 */
export async function getPlaceDetails(placeId: string): Promise<GooglePlaceDetails> {
  if (!GOOGLE_PLACES_API_KEY) {
    throw new Error("Google Places API key is not configured")
  }

  const params = new URLSearchParams({
    place_id: placeId,
    fields: [
      "place_id",
      "name",
      "formatted_address",
      "geometry",
      "rating",
      "price_level",
      "photos",
      "types",
      "website",
      "formatted_phone_number",
      "opening_hours",
      "editorial_summary",
      "reviews",
    ].join(","),
    key: GOOGLE_PLACES_API_KEY,
  })

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error(`Google Places API error: ${response.statusText}`)
  }

  const data = await response.json()

  if (data.status !== "OK") {
    throw new Error(`Google Places API error: ${data.status}`)
  }

  return data.result
}

/**
 * Get photo URL from photo reference
 */
export function getPhotoUrl(photoReference: string, maxWidth: number = 800): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`
}

/**
 * Map Google Place types to our category system
 */
export function mapPlaceTypeToCategory(types: string[]): string {
  const typeMap: Record<string, string> = {
    beach: "beaches",
    natural_feature: "nature",
    park: "parks",
    tourist_attraction: "attractions",
    place_of_worship: "temples",
    waterfall: "waterfalls",
    mountain: "hills",
    hiking_area: "hills",
    campground: "camping",
    museum: "museums",
    restaurant: "restaurants",
    cafe: "cafes",
  }

  for (const type of types) {
    if (typeMap[type]) {
      return typeMap[type]
    }
  }

  return "other"
}


