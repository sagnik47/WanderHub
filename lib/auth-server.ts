import { auth } from "@/auth"

export async function getAuthSession() {
  return auth()
}