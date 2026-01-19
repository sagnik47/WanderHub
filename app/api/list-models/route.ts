import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Dynamic import to avoid build-time evaluation
    const { testGeminiConnection } = await import("@/lib/gemini-fixed")
    const result = await testGeminiConnection()
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        workingModel: result.model,
        message: `Gemini API is working with model: ${result.model}`
      })
    } else {
      return NextResponse.json({ 
        success: false,
        error: result.error,
        message: "No working Gemini models found"
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Test Gemini connection error:", error)
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