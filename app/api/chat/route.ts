import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateChatResponse } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { destinationId, messages } = body

    if (!destinationId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "destinationId and messages array are required" },
        { status: 400 }
      )
    }

    // Fetch destination data
    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
    })

    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    // Prepare destination context
    const destinationContext = {
      name: destination.name,
      description: destination.description || undefined,
      category: destination.category,
      address: destination.address || undefined,
      rating: destination.rating || undefined,
      priceLevel: destination.priceLevel || undefined,
      amenities: destination.amenities
        ? (Array.isArray(destination.amenities)
            ? destination.amenities
            : [destination.amenities]) as string[]
        : undefined,
      website: destination.website || undefined,
      openingHours: destination.openingHours
        ? (Array.isArray(destination.openingHours)
            ? destination.openingHours
            : [destination.openingHours]) as string[]
        : undefined,
    }

    // Generate AI response
    const response = await generateChatResponse(messages, destinationContext)

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to generate chat response" },
      { status: 500 }
    )
  }
}


