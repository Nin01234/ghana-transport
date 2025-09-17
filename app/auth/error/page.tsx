"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Bus, RefreshCw } from "lucide-react"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams?.get("error")
  const description = searchParams?.get("description")

  const getErrorMessage = () => {
    switch (error) {
      case "access_denied":
        return {
          title: "Access Denied",
          message: "You cancelled the authentication process. Please try again if you want to sign in.",
        }
      case "server_error":
        return {
          title: "Server Error",
          message: "There was a problem with our authentication server. Please try again in a few minutes.",
        }
      case "temporarily_unavailable":
        return {
          title: "Service Temporarily Unavailable",
          message: "Our authentication service is temporarily unavailable. Please try again later.",
        }
      case "invalid_request":
        return {
          title: "Invalid Request",
          message: "There was an issue with your authentication request. Please try signing in again.",
        }
      case "exchange_failed":
        return {
          title: "Verification Failed",
          message:
            "We couldn't verify your email. The link may have expired. Please try requesting a new verification email.",
        }
      case "unexpected":
        return {
          title: "Unexpected Error",
          message: "An unexpected error occurred during authentication. Please try again.",
        }
      default:
        return {
          title: "Authentication Error",
          message: description || "An error occurred during authentication. Please try again.",
        }
    }
  }

  const errorInfo = getErrorMessage()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ghana-green/10 via-ghana-gold/5 to-ghana-red/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700">{errorInfo.title}</CardTitle>
          <CardDescription>Something went wrong during authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">{errorInfo.message}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">What you can do:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Try signing in again</li>
              <li>Check your internet connection</li>
              <li>Clear your browser cache and cookies</li>
              <li>Contact support if the problem persists</li>
            </ul>
          </div>

          <div className="flex space-x-2">
            <Button className="flex-1" asChild>
              <Link href="/auth/login">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/help">Get Help</Link>
            </Button>
          </div>

          <div className="text-center">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <Bus className="mr-2 h-4 w-4" />
              Back to GhanaTransit
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
