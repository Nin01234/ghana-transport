import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
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

    // Fetch upcoming trips
    const { data: upcomingTrips, error: tripsError } = await supabase
      .from("bookings")
      .select(`
        *,
        routes:route_id (
          name,
          origin,
          destination,
          distance_km,
          duration_minutes
        ),
        buses:bus_id (
          bus_number,
          bus_type,
          amenities
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "confirmed")
      .gte("travel_date", new Date().toISOString().split('T')[0])
      .order("travel_date", { ascending: true })
      .limit(5)

    if (tripsError) {
      console.error("Error fetching upcoming trips:", tripsError)
    }

    // Fetch recent activities
    const { data: recentActivities, error: activitiesError } = await supabase
      .from("user_activities")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    if (activitiesError) {
      console.error("Error fetching recent activities:", activitiesError)
    }

    // Transform data
    const transformedTrips = upcomingTrips?.map(trip => ({
      id: trip.id,
      route: trip.routes?.name || `${trip.route_from} → ${trip.route_to}`,
      origin: trip.routes?.origin || trip.route_from,
      destination: trip.routes?.destination || trip.route_to,
      travelDate: trip.travel_date,
      departureTime: trip.departure_time,
      busNumber: trip.buses?.bus_number || "N/A",
      busType: trip.buses?.bus_type || trip.class || "Standard",
      seatNumber: trip.seat_number || "N/A",
      status: trip.status,
      totalPrice: trip.total_price || trip.fare_amount
    })) || []

    const transformedActivities = recentActivities?.map(activity => ({
      id: activity.id,
      type: activity.activity_type,
      description: activity.description,
      timestamp: new Date(activity.created_at),
      metadata: activity.metadata
    })) || []

    return NextResponse.json({
      upcomingTrips: transformedTrips,
      recentActivities: transformedActivities,
      stats: {
        totalUpcomingTrips: transformedTrips.length,
        totalActivities: transformedActivities.length
      }
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
