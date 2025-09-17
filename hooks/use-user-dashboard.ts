import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { supabase } from "@/lib/supabase"

interface UpcomingTrip {
  id: string
  route: string
  origin: string
  destination: string
  travelDate: string
  departureTime: string
  busNumber: string
  busType: string
  seatNumber: string
  status: string
  totalPrice: number
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: Date
  metadata?: any
}

interface DashboardData {
  upcomingTrips: UpcomingTrip[]
  recentActivities: RecentActivity[]
  stats: {
    totalUpcomingTrips: number
    totalActivities: number
  }
}

export function useUserDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData>({
    upcomingTrips: [],
    recentActivities: [],
    stats: { totalUpcomingTrips: 0, totalActivities: 0 }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError("No active session")
        return
      }

      const response = await fetch("/api/user/dashboard", {
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }

      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch data")
      
      // Set empty data for new users
      setData({
        upcomingTrips: [],
        recentActivities: [],
        stats: { totalUpcomingTrips: 0, totalActivities: 0 }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const refreshData = () => {
    fetchDashboardData()
  }

  return {
    data,
    loading,
    error,
    refreshData
  }
}
