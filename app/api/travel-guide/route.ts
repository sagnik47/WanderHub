import { NextRequest, NextResponse } from "next/server"
import { generateGeneralTravelResponse } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      )
    }

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "At least one message is required" },
        { status: 400 }
      )
    }

    // Generate AI response
    const response = await generateGeneralTravelResponse(messages)

    return NextResponse.json({ message: response })
  } catch (error: any) {
    console.error("Travel guide API error:", error)
    const errorMessage = error?.message || "Failed to generate travel guide response"
    console.error("Error details:", {
      message: errorMessage,
      stack: error?.stack,
      name: error?.name,
    })
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}
