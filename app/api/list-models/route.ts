import { NextRequest, NextResponse } from "next/server"
import { listAvailableModels } from "@/lib/gemini-fixed"

export async function GET(request: NextRequest) {
  try {
    const models = await listAvailableModels()
    
    return NextResponse.json({ 
      success: true,
      models: models,
      count: models.length
    })
  } catch (error: any) {
    console.error("List models error:", error)
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