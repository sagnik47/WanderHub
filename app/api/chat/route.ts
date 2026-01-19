import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    console.log("=== Chat API Called ===")
    
    const body = await request.json()
    const { destinationId, messages } = body

    console.log("Request data:", { 
      destinationId, 
      messageCount: messages?.length,
      hasMessages: !!messages,
      isArray: Array.isArray(messages)
    })

    if (!destinationId || !messages || !Array.isArray(messages)) {
      console.log("❌ Invalid request parameters")
      return NextResponse.json(
        { error: "destinationId and messages array are required" },
        { status: 400 }
      )
    }

    // Check API key
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    console.log("API Key check:", {
      present: !!apiKey,
      length: apiKey?.length,
      starts: apiKey?.substring(0, 10)
    })

    if (!apiKey) {
      console.log("❌ No API key found")
      return NextResponse.json(
        { error: "GOOGLE_GEMINI_API_KEY not configured" },
        { status: 500 }
      )
    }

    // Fetch destination data
    console.log("🔍 Fetching destination:", destinationId)
    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
    })

    if (!destination) {
      console.log("❌ Destination not found:", destinationId)
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    console.log("✅ Found destination:", destination.name)

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

    // Validate messages
    if (messages.length === 0) {
      console.log("❌ No messages provided")
      return NextResponse.json(
        { error: "At least one message is required" },
        { status: 400 }
      )
    }

    console.log("🤖 Calling Gemini API...")
    // Dynamic import to avoid build-time evaluation
    const { generateChatResponse } = await import("@/lib/gemini-fixed")
    const response = await generateChatResponse(messages, destinationContext)
    console.log("✅ Gemini API response received, length:", response.length)

    return NextResponse.json({ message: response })
  } catch (error: any) {
    console.error("❌ Chat API error:", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
    })
    
    const errorMessage = error?.message || "Failed to generate chat response"
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? {
          stack: error?.stack,
          name: error?.name
        } : undefined
      },
      { status: 500 }
    )
  }
}


