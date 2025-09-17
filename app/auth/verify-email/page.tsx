"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Mail, CheckCircle, RefreshCw, ArrowLeft, Bus } from "lucide-react"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [email, setEmail] = useState(searchParams?.get("email") || "")
  const [isResending, setIsResending] = useState(false)
  const [resendCount, setResendCount] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "error">("pending")

  useEffect(() => {
    // Check if user is already verified
    checkVerificationStatus()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user?.email_confirmed_at) {
        setVerificationStatus("verified")
        toast({
          title: "Email verified!",
          description: "Your account has been successfully verified.",
        })
        setTimeout(() => {
          router.push("/")
        }, 2000)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, toast])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const checkVerificationStatus = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.email_confirmed_at) {
        setVerificationStatus("verified")
        router.push("/")
      }
    } catch (error) {
      console.error("Error checking verification status:", error)
    }
  }

  const resendVerificationEmail = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to resend verification.",
        variant: "destructive",
      })
      return
    }

    setIsResending(true)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        },
      })

      if (error) throw error

      setResendCount(resendCount + 1)
      setCountdown(60) // 60 second cooldown

      toast({
        title: "Verification email sent!",
        description: `We've sent another verification link to ${email}. Please check your inbox.`,
      })
    } catch (error: any) {
      toast({
        title: "Failed to resend email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  if (verificationStatus === "verified") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ghana-green/10 via-ghana-gold/5 to-ghana-red/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Email Verified!</CardTitle>
            <CardDescription>Your account has been successfully verified</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Welcome to GhanaTransit! You can now access all features of your account.
            </p>
            <Button className="w-full" onClick={() => router.push("/")}>
              Continue to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ghana-green/10 via-ghana-gold/5 to-ghana-red/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
          <CardDescription>We've sent a verification link to your email address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {email && (
            <div className="text-center">
              <Badge variant="secondary" className="px-3 py-1">
                {email}
              </Badge>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Check your email</p>
                  <p className="text-blue-700">
                    Click the verification link in the email we sent you. If you don't see it, check your spam folder.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Didn't receive the email? Enter your email address and we'll send it again.
              </div>

              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ghana-green"
                />

                <Button
                  onClick={resendVerificationEmail}
                  disabled={isResending || countdown > 0 || !email}
                  variant="outline"
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>

              {resendCount > 0 && (
                <div className="text-xs text-muted-foreground text-center">
                  Email sent {resendCount} time{resendCount > 1 ? "s" : ""}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-medium mb-2">Having trouble?</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Check your spam or junk folder</p>
                <p>• Make sure you entered the correct email</p>
                <p>• Wait a few minutes for the email to arrive</p>
                <p>• Contact support if you still need help</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/help">Get Help</Link>
              </Button>
            </div>
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
