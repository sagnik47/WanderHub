"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const { status } = useSession()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [callbackUrl, setCallbackUrl] = useState("/dashboard")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasGoogleProvider, setHasGoogleProvider] = useState(false)
  useEffect(() => {
    const authError = new URLSearchParams(window.location.search).get("error")
    const callback = new URLSearchParams(window.location.search).get("callbackUrl")
    if (callback) {
      setCallbackUrl(callback)
    }

    if (!authError) return

    if (authError === "Configuration") {
      setError("Authentication configuration error. Common causes: unreachable database, incorrect NEXTAUTH_URL for local dev, or Google OAuth redirect URI mismatch.")
      return
    }

    setError("Authentication failed. Please try again.")
  }, [])

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl)
    }
  }, [status, callbackUrl, router])

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/api/auth/providers")
        const providers = await response.json()
        setHasGoogleProvider(Boolean(providers?.google))
      } catch {
        setHasGoogleProvider(false)
      }
    }

    fetchProviders()
  }, [])

  const handleCredentialsSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (mode === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === "signup") {
        const signupResponse = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email, password }),
        })

        const signupData = await signupResponse.json()

        if (!signupResponse.ok) {
          setError(signupData.error || "Failed to create account")
          return
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError("Invalid email or password")
        return
      }

      router.replace(result?.url || callbackUrl)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-2">Welcome to WanderHub</CardTitle>
          <CardDescription>
            {mode === "signin"
              ? "Sign in to get personalized travel recommendations"
              : "Create an account to get personalized travel recommendations"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-md bg-gray-100 p-1">
            <Button
              type="button"
              variant={mode === "signin" ? "default" : "ghost"}
              onClick={() => setMode("signin")}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={mode === "signup" ? "default" : "ghost"}
              onClick={() => setMode("signup")}
            >
              Sign Up
            </Button>
          </div>

          <form onSubmit={handleCredentialsSubmit} className="space-y-3">
            {mode === "signup" && (
              <Input
                type="text"
                placeholder="Full name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "signin"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "signin"
                ? "Sign In with Email"
                : "Create Account"}
            </Button>
          </form>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          {hasGoogleProvider && (
            <Button
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full"
              size="lg"
              variant="outline"
              type="button"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          )}

          <div className="text-center text-sm text-gray-600">
            <Link href="/" className="text-primary-600 hover:underline">
              Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


