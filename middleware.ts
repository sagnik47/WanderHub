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

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

  const candidateCookieNames = [
    "__Secure-authjs.session-token",
    "authjs.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.session-token",
  ]

  let token = null
  for (const cookieName of candidateCookieNames) {
    token = await getToken({
      req: request,
      secret,
      cookieName,
    })

    if (token) {
      break
    }
  }

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
