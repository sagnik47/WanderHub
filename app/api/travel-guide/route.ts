import { NextRequest, NextResponse } from "next/server"
import { generateGeneralTravelResponse } from "@/lib/gemini-fixed"

export async function POST(request: NextRequest) {
  try {
    console.log("=== Travel Guide API Called ===")
    
    const body = await request.json()
    const { messages } = body

    console.log("Request data:", { 
      messageCount: messages?.length,
      hasMessages: !!messages,
      isArray: Array.isArray(messages)
    })

    if (!messages || !Array.isArray(messages)) {
      console.log("❌ Invalid messages parameter")
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      )
    }

    if (messages.length === 0) {
      console.log("❌ Empty messages array")
      return NextResponse.json(
        { error: "At least one message is required" },
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

    console.log("🤖 Calling Gemini API for travel guide...")
    // Generate AI response
    const response = await generateGeneralTravelResponse(messages)
    console.log("✅ Travel guide response received, length:", response.length)

    return NextResponse.json({ message: response })
  } catch (error: any) {
    console.error("❌ Travel guide API error:", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
    })
    
    const errorMessage = error?.message || "Failed to generate travel guide response"
    
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
