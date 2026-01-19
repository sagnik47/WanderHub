import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import getServerSession from "next-auth"  // Changed this line

export async function getAuthSession() {
  return await getServerSession(authOptions)
}