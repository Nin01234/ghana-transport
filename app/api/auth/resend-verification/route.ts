import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/verify-email`,
      },
    })

    if (error) {
      console.error("Error resending verification email:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: "Verification email sent successfully",
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
