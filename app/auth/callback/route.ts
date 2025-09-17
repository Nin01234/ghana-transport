import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"
  const error = searchParams.get("error")
  const error_description = searchParams.get("error_description")

  // Handle errors
  if (error) {
    console.error("Auth callback error:", error, error_description)
    return NextResponse.redirect(`${origin}/auth/error?error=${error}&description=${error_description}`)
  }

  if (code) {
    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("Error exchanging code for session:", exchangeError)
        return NextResponse.redirect(`${origin}/auth/error?error=exchange_failed`)
      }

      if (data.user) {
        // Check if email is confirmed
        if (data.user.email_confirmed_at) {
          // Email is verified, redirect to dashboard
          return NextResponse.redirect(`${origin}${next}`)
        } else {
          // Email not verified yet, redirect to verification page
          return NextResponse.redirect(`${origin}/auth/verify-email?email=${data.user.email}`)
        }
      }
    } catch (error) {
      console.error("Unexpected error in auth callback:", error)
      return NextResponse.redirect(`${origin}/auth/error?error=unexpected`)
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(`${origin}/auth/login`)
}
