import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth/next"

export async function getAuthSession() {
  return await getServerSession(authOptions)
}


