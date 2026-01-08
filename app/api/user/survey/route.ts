import { NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { interests, budget, travelStyle, preferredCategories } = body

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Upsert survey
    await prisma.userSurvey.upsert({
      where: { userId: user.id },
      update: {
        interests,
        budget,
        travelStyle,
        preferredCategories,
      },
      create: {
        userId: user.id,
        interests,
        budget,
        travelStyle,
        preferredCategories,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Survey API error:", error)
    return NextResponse.json(
      { error: "Failed to save survey" },
      { status: 500 }
    )
  }
}

