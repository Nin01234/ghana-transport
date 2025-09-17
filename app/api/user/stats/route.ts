import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    // Get user from auth header
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user stats using the database function
    const { data, error } = await supabase.rpc("get_user_stats", { user_uuid: user.id })

    if (error) {
      console.error("Error fetching user stats:", error)
      return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
    }

    return NextResponse.json(
      data || {
        total_bookings: 0,
        wallet_balance: 0,
        loyalty_points: 0,
        upcoming_trips: 0,
      },
    )
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
