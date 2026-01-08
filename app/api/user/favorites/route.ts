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

    const favorites = await prisma.userFavorite.findMany({
      where: { userId: user.id },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            category: true,
            address: true,
            rating: true,
            photos: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error("Favorites API error:", error)
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
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
    const { destinationId } = body

    if (!destinationId) {
      return NextResponse.json({ error: "destinationId is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const favorite = await prisma.userFavorite.create({
      data: {
        userId: user.id,
        destinationId,
      },
    })

    return NextResponse.json({ favorite })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Already favorited" }, { status: 409 })
    }
    console.error("Favorites API error:", error)
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const destinationId = searchParams.get("destinationId")

    if (!destinationId) {
      return NextResponse.json({ error: "destinationId is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.userFavorite.deleteMany({
      where: {
        userId: user.id,
        destinationId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Favorites API error:", error)
    return NextResponse.json(
      { error: "Failed to remove favorite" },
      { status: 500 }
    )
  }
}

