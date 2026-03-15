import { NextResponse } from "next/server"
import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const protectedRoutePatterns = [
  /^\/search(?:\/.*)?$/,
  /^\/dashboard(?:\/.*)?$/,
  /^\/destination(?:\/.*)?$/,
]

export default async function middleware(request: NextRequest) {
  const isProtected = protectedRoutePatterns.some((pattern) =>
    pattern.test(request.nextUrl.pathname)
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const signInUrl = new URL("/auth/signin", request.nextUrl.origin)
    signInUrl.searchParams.set(
      "callbackUrl",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    )
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/search/:path*", "/dashboard/:path*", "/destination/:path*"],
}
