import { auth } from "@/auth"

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.email) {
    return null
  }

  const { prisma } = await import("@/lib/prisma")
  return await prisma.user.findUnique({
    where: { email: session.user.email },
  })
}


