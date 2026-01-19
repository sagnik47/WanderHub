import { NextRequest, NextResponse } from "next/server"
import { generateGeneralTravelResponse } from "@/lib/gemini-fixed"

export async function POST(request: NextRequest) {
  try {
    const testMessages = [
      {
        role: "user" as const,
        content: "Hello, can you help me with travel planning?"
      }
    ]

    // Test the Gemini API directly with gemini-pro model
    const response = await generateGeneralTravelResponse(testMessages)

    return NextResponse.json({ 
      success: true,
      message: response,
      test: "Gemini API is working correctly with gemini-pro model"
    })
  } catch (error: any) {
    console.error("Gemini test error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error?.message || "Unknown error",
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}