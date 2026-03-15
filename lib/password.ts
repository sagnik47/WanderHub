import { randomBytes, scryptSync, timingSafeEqual } from "crypto"

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, storedPasswordHash: string) {
  const [salt, key] = storedPasswordHash.split(":")

  if (!salt || !key) {
    return false
  }

  const derivedKey = scryptSync(password, salt, 64)
  const storedKeyBuffer = Buffer.from(key, "hex")

  if (storedKeyBuffer.length !== derivedKey.length) {
    return false
  }

  return timingSafeEqual(storedKeyBuffer, derivedKey)
}
