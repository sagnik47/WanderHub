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
    const { location } = body

    if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
      return NextResponse.json({ error: "Invalid location data" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        location: location,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Location API error:", error)
    return NextResponse.json(
      { error: "Failed to save location" },
      { status: 500 }
    )
  }
}

