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

    // Generate AI response
    const response = await generateGeneralTravelResponse(messages)

    return NextResponse.json({ message: response })
  } catch (error) {
    console.error("Travel guide API error:", error)
    return NextResponse.json(
      { error: "Failed to generate travel guide response" },
      { status: 500 }
    )
  }
}
