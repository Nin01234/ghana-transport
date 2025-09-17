"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Mail, X, RefreshCw } from "lucide-react"

export function EmailVerificationBanner() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isVisible, setIsVisible] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show banner if user is logged in but email is not verified
    if (user && !user.email_confirmed_at && !isDismissed) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [user, isDismissed])

  const resendVerificationEmail = async () => {
    if (!user?.email) return

    setIsResending(true)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        },
      })

      if (error) throw error

      toast({
        title: "Verification email sent!",
        description: `We've sent a new verification link to ${user.email}`,
      })
    } catch (error: any) {
      toast({
        title: "Failed to resend email",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsResending(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 mb-4">
      <Mail className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <strong>Verify your email address</strong>
          <p className="text-sm mt-1">
            Please check your email and click the verification link to access all features.
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            onClick={resendVerificationEmail}
            disabled={isResending}
            className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Email"
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}


