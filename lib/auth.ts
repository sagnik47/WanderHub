import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return null
  }

  const { prisma } = await import("@/lib/prisma")
  return await prisma.user.findUnique({
    where: { email: session.user.email },
  })
}


