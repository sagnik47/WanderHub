import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const query = body?.query?.toString().trim()
    const days = Number(body?.days) || 3

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const prompt = `Create a concise travel itinerary for ${Math.max(1, Math.min(days, 14))} days for: ${query}.

Requirements:
- Keep it short and practical.
- Use day-wise format (Day 1, Day 2, etc.).
- Include morning, afternoon, evening highlights.
- Mention one local food suggestion each day.
- Return plain markdown with **bold** section labels.`

    const { generateGeneralTravelResponse } = await import("@/lib/gemini-fixed")
    const itinerary = await generateGeneralTravelResponse([
      {
        role: "user",
        content: prompt,
      },
    ])

    return NextResponse.json({ itinerary })
  } catch (error) {
    console.error("Itinerary API error:", error)
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    )
  }
}
