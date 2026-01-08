import { NextRequest, NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const visits = await prisma.userVisit.findMany({
      where: { userId: user.id },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            category: true,
            address: true,
            rating: true,
          },
        },
      },
      orderBy: { visitedAt: "desc" },
    })

    return NextResponse.json({ visits })
  } catch (error) {
    console.error("Visits API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch visits" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { destinationId, notes } = body

    if (!destinationId) {
      return NextResponse.json({ error: "destinationId is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const visit = await prisma.userVisit.create({
      data: {
        userId: user.id,
        destinationId,
        notes,
      },
    })

    return NextResponse.json({ visit })
  } catch (error) {
    console.error("Visits API error:", error)
    return NextResponse.json(
      { error: "Failed to add visit" },
      { status: 500 }
    )
  }
}

