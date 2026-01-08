import { getServerSession } from "next-auth"

export async function getCurrentUser() {
  const session = await getServerSession()
  if (!session?.user?.email) {
    return null
  }

  const { prisma } = await import("@/lib/prisma")
  return await prisma.user.findUnique({
    where: { email: session.user.email },
  })
}


