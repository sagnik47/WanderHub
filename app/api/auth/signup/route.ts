import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/password"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const name = body?.name?.toString().trim() || null
    const email = body?.email?.toString().trim().toLowerCase()
    const password = body?.password?.toString() || ""

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error: any) {
    console.error("Signup API error:", error)

    if (error?.code === "P1001") {
      return NextResponse.json(
        {
          error:
            "Database connection failed. Please verify your Supabase connection string/network and try again.",
        },
        { status: 503 }
      )
    }

    if (error?.code === "P2002") {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
