"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { eventBus, localApi } from "@/lib/local-data"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar,
  Star,
  TrendingUp,
  Clock,
  Gift,
  Bus,
  Wallet,
  Award,
  Activity,
  Target,
  CheckCircle,
  AlertCircle,
  XCircle,
  Phone,
  MessageSquare,
  Shield,
  Crown,
  Bell,
} from "lucide-react"
import { format } from "date-fns"

interface UserStats {
  totalTrips: number
  totalSpent: number
  loyaltyPoints: number
  currentLevel: string
  nextLevelPoints: number
  rewardsEarned: number
  carbonSaved: number
  favoriteRoute: string
}

interface RecentBooking {
  id: string
  route_from: string
  route_to: string
  departure_date: string
  departure_time: string
  status: string
  total_price: number
  booking_reference: string
  passengers: number
  class: string
}

interface UserActivity {
  id: string
  activity_type: string
  description: string
  created_at: string
  points_earned?: number
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  created_at: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<UserStats>({
    totalTrips: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    currentLevel: "Bronze",
    nextLevelPoints: 500,
    rewardsEarned: 0,
    carbonSaved: 0,
    favoriteRoute: "N/A",
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    } else {
      // For demo purposes, show sample data immediately
      setStats({
        totalTrips: 12,
        totalSpent: 2840,
        loyaltyPoints: 284,
        currentLevel: "Gold",
        nextLevelPoints: 500,
        rewardsEarned: 8,
        carbonSaved: 45.2,
        favoriteRoute: "Accra → Kumasi",
      })
      setRecentBookings([
        {
          id: "1",
          route_from: "Accra",
          route_to: "Kumasi",
          departure_date: new Date(Date.now() + 86400000).toISOString(),
          departure_time: "08:00",
          status: "confirmed",
          total_price: 600,
          booking_reference: "GH12345678",
          passengers: 2,
          class: "vip",
        },
        {
          id: "2",
          route_from: "Accra",
          route_to: "Cape Coast",
          departure_date: new Date(Date.now() - 86400000).toISOString(),
          departure_time: "10:00",
          status: "completed",
          total_price: 160,
          booking_reference: "GH87654321",
          passengers: 1,
          class: "vip",
        },
      ])
      setRecentActivities([
        {
          id: "1",
          activity_type: "booking_created",
          description: "Booked VIP trip to Kumasi",
          created_at: new Date().toISOString(),
          points_earned: 60,
        },
        {
          id: "2",
          activity_type: "trip_completed",
          description: "Completed trip to Cape Coast",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          points_earned: 16,
        },
      ])
      setNotifications([
        {
          id: "1",
          title: "VIP Upgrade Available",
          message: "Upgrade to VIP for your next trip and earn 2x points!",
          type: "info",
          read: false,
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          title: "New Route Available",
          message: "Direct route from Accra to Ho is now available!",
          type: "success",
          read: false,
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ])
    }
  }, [user])

  // Realtime: listen for new bookings, activities, and profile updates
  useEffect(() => {
    if (!user) return

    // Listen for new bookings
    const offBookings = eventBus.on<{ type: string; new: any }>(`bookings:${user.id}`, (payload) => {
      if (payload?.type === "INSERT" && payload.new) {
        setRecentBookings((prev) => [payload.new, ...prev].slice(0, 5))
        setStats((prev) => ({
          ...prev,
          totalTrips: prev.totalTrips + 1,
          totalSpent: prev.totalSpent + (payload.new.total_price || 0),
        }))
        
        // Add notification for new booking
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: "New Booking Confirmed!",
          message: `Your trip from ${payload.new.route_from} to ${payload.new.route_to} has been confirmed.`,
          type: "success",
          read: false,
          created_at: new Date().toISOString(),
        }
        setNotifications((prev) => [newNotification, ...prev].slice(0, 5))
        setLastUpdated(new Date())
      }
    })

    // Listen for new activities
    const offActivities = eventBus.on<{ type: string; new: any }>(`activities:${user.id}`, (payload) => {
      if (payload?.type === "INSERT" && payload.new) {
        setRecentActivities((prev) => [payload.new, ...prev].slice(0, 10))
        setLastUpdated(new Date())
      }
    })

    // Listen for profile updates (points, etc.)
    const offProfile = eventBus.on<{ type: string; new: any }>(`profile:${user.id}`, (payload) => {
      if (payload?.type === "UPDATE" && payload.new) {
        setStats((prev) => ({
          ...prev,
          loyaltyPoints: payload.new.loyalty_points || prev.loyaltyPoints,
        }))
        setLastUpdated(new Date())
      }
    })

    return () => {
      offBookings()
      offActivities()
      offProfile()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Try to fetch from local API first for instant updates
      const localBookings = localApi.getBookings(user.id, 5)
      const localActivities = localApi.getActivities(user.id, 10)
      const localProfile = localApi.getProfile(user.id)

      if (localBookings.length > 0 || localActivities.length > 0) {
        // Use local data for immediate display
        setRecentBookings(localBookings)
        setRecentActivities(localActivities)
        
        if (localProfile) {
          setStats((prev) => ({
            ...prev,
            loyaltyPoints: localProfile.loyalty_points,
          }))
        }
      }

      // Fetch from Supabase for persistence (background sync)
      if (supabase) {
        try {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          const { data: bookings } = await supabase
            .from("bookings")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(5)

          const { data: activities } = await supabase
            .from("user_activities")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10)

          // Calculate stats
          const totalBookings = bookings?.length || 0
          const totalSpent = bookings?.reduce((sum, booking) => sum + booking.total_price, 0) || 0
          const loyaltyPoints = profile?.loyalty_points || 0

          // Determine level based on points
          let currentLevel = "Bronze"
          let nextLevelPoints = 500
          if (loyaltyPoints >= 2000) {
            currentLevel = "Platinum"
            nextLevelPoints = 5000
          } else if (loyaltyPoints >= 1000) {
            currentLevel = "Gold"
            nextLevelPoints = 2000
          } else if (loyaltyPoints >= 500) {
            currentLevel = "Silver"
            nextLevelPoints = 1000
          }

          // Find favorite route
          const routeCounts: { [key: string]: number } = {}
          bookings?.forEach((booking) => {
            const route = `${booking.route_from} → ${booking.route_to}`
            routeCounts[route] = (routeCounts[route] || 0) + 1
          })
          const favoriteRoute = Object.keys(routeCounts).reduce((a, b) => (routeCounts[a] > routeCounts[b] ? a : b), "N/A")

          setStats({
            totalTrips: totalBookings,
            totalSpent,
            loyaltyPoints,
            currentLevel,
            nextLevelPoints,
            rewardsEarned: Math.floor(loyaltyPoints / 100), // Estimate rewards earned
            carbonSaved: totalBookings * 12.5, // Estimate kg CO2 saved per trip
            favoriteRoute,
          })

          setRecentBookings(bookings || [])
          setRecentActivities(activities || [])

          // Generate sample notifications
          setNotifications([
            {
              id: "1",
              title: "Trip Reminder",
              message: "Your trip to Kumasi is tomorrow at 8:00 AM",
              type: "info",
              read: false,
              created_at: new Date().toISOString(),
            },
            {
              id: "2",
              title: "Points Earned",
              message: "You earned 25 loyalty points from your last trip!",
              type: "success",
              read: false,
              created_at: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: "3",
              title: "Level Up!",
              message: `Congratulations! You've reached ${currentLevel} level`,
              type: "success",
              read: true,
              created_at: new Date(Date.now() - 172800000).toISOString(),
            },
          ])
        } catch (error) {
          console.error("Error fetching Supabase data:", error)
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error loading dashboard",
        description: "Please refresh the page to try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setLastUpdated(new Date())
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking_created":
        return <Bus className="h-4 w-4 text-blue-600" />
      case "trip_completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "reward_redeemed":
        return <Gift className="h-4 w-4 text-purple-600" />
      case "points_earned":
        return <Star className="h-4 w-4 text-yellow-600" />
      case "level_up":
        return <Award className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Bronze":
        return "text-amber-600"
      case "Silver":
        return "text-gray-500"
      case "Gold":
        return "text-yellow-500"
      case "Platinum":
        return "text-purple-500"
      default:
        return "text-gray-600"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Platinum":
        return <Crown className="h-5 w-5" />
      default:
        return <Award className="h-5 w-5" />
    }
  }

  const progressPercentage = (stats.loyaltyPoints / stats.nextLevelPoints) * 100



  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation />

        <div className="container py-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0]}!
                </h1>
                <p className="text-lg text-muted-foreground">
                  Here's your travel overview
                  <span className="text-sm text-muted-foreground ml-2">
                    • Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDashboardData}
                  disabled={loading}
                  className="flex items-center space-x-2"
                >
                  <Activity className="h-4 w-4" />
                  {loading ? "Refreshing..." : "Refresh"}
                </Button>
                <Badge className={`${getLevelColor(stats.currentLevel)} bg-white/80 backdrop-blur-sm px-4 py-2`}>
                  {getLevelIcon(stats.currentLevel)}
                  <span className="ml-2">{stats.currentLevel} Member</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Trips</p>
                    <p className="text-3xl font-bold">{stats.totalTrips}</p>
                  </div>
                  <Bus className="h-12 w-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100">Total Spent</p>
                    <p className="text-3xl font-bold">₵{stats.totalSpent.toFixed(0)}</p>
                  </div>
                  <Wallet className="h-12 w-12 text-red-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Loyalty Points</p>
                    <p className="text-3xl font-bold">{stats.loyaltyPoints.toLocaleString()}</p>
                  </div>
                  <Star className="h-12 w-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">CO₂ Saved</p>
                    <p className="text-3xl font-bold">{stats.carbonSaved.toFixed(1)}kg</p>
                  </div>
                  <Shield className="h-12 w-12 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Level Progress */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-purple-600" />
                    Level Progress
                  </CardTitle>
                  <CardDescription>
                    {stats.nextLevelPoints - stats.loyaltyPoints} points to reach next level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className={`font-medium ${getLevelColor(stats.currentLevel)}`}>{stats.currentLevel}</span>
                      <span>
                        {stats.loyaltyPoints} / {stats.nextLevelPoints}
                      </span>
                    </div>
                    <Progress value={progressPercentage} className="h-3">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </Progress>
                    <div className="grid grid-cols-4 gap-2 text-xs text-center">
                      <div
                        className={stats.loyaltyPoints >= 0 ? "text-amber-600 font-medium" : "text-muted-foreground"}
                      >
                        Bronze
                      </div>
                      <div
                        className={stats.loyaltyPoints >= 500 ? "text-gray-500 font-medium" : "text-muted-foreground"}
                      >
                        Silver
                      </div>
                      <div
                        className={
                          stats.loyaltyPoints >= 1000 ? "text-yellow-500 font-medium" : "text-muted-foreground"
                        }
                      >
                        Gold
                      </div>
                      <div
                        className={
                          stats.loyaltyPoints >= 2000 ? "text-purple-500 font-medium" : "text-muted-foreground"
                        }
                      >
                        Platinum
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                    Recent Bookings
                  </CardTitle>
                  <CardDescription>Your latest travel bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Bus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No bookings yet</p>
                      <Button className="mt-4" onClick={() => (window.location.href = "/book")}>
                        Book Your First Trip
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold">
                                {booking.route_from} → {booking.route_to}
                              </h3>
                              <Badge className={getStatusColor(booking.status)}>
                                {getStatusIcon(booking.status)}
                                <span className="ml-1 capitalize">{booking.status}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{format(new Date(booking.departure_date), "PPP")}</span>
                              <span>{booking.departure_time}</span>
                              <span>
                                {booking.passengers} passenger{booking.passengers > 1 ? "s" : ""}
                              </span>
                              <span className="capitalize">{booking.class}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">Ref: {booking.booking_reference}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₵{booking.total_price.toFixed(2)}</div>
                            <div className="flex space-x-1 mt-2">
                              <Button size="sm" variant="outline">
                                <Phone className="h-3 w-3 mr-1" />
                                Call
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-green-700 flex items-center">
                      <TrendingUp className="mr-2 h-5 w-5" />
                      Travel Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Favorite Route:</span>
                      <span className="text-sm font-medium">{stats.favoriteRoute}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Average Trip Cost:</span>
                      <span className="text-sm font-medium">
                        ₵{stats.totalTrips > 0 ? (stats.totalSpent / stats.totalTrips).toFixed(0) : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Points per ₵:</span>
                      <span className="text-sm font-medium">
                        {stats.totalSpent > 0 ? (stats.loyaltyPoints / stats.totalSpent).toFixed(1) : "0"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-blue-700 flex items-center">
                      <Award className="mr-2 h-5 w-5" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">First Trip</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">5 Trips Completed</span>
                      <CheckCircle
                        className={`h-4 w-4 ${stats.totalTrips >= 5 ? "text-green-500" : "text-gray-300"}`}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Loyalty Member</span>
                      <CheckCircle
                        className={`h-4 w-4 ${stats.loyaltyPoints >= 100 ? "text-green-500" : "text-gray-300"}`}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Rewards Available</span>
                      <Gift className={`h-4 w-4 ${stats.rewardsEarned > 0 ? "text-green-500" : "text-gray-300"}`} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activities */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Activity className="mr-2 h-5 w-5 text-indigo-600" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>Your latest actions and updates</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {recentActivities.length} activities
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {recentActivities.length === 0 ? (
                    <div className="text-center py-4">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                      <p className="text-xs text-muted-foreground">Book a trip to see your activity here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentActivities.slice(0, 8).map((activity, index) => (
                        <div 
                          key={activity.id} 
                          className={`flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors ${
                            index === 0 ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                        >
                          <div className="mt-1 p-1 rounded-full bg-muted/50">
                            {getActivityIcon(activity.activity_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium">{activity.description}</p>
                              {index === 0 && (
                                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(activity.created_at), "MMM d, h:mm a")}
                            </p>
                            {activity.points_earned && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                +{activity.points_earned} points
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      {recentActivities.length > 8 && (
                        <div className="text-center pt-2">
                          <Button variant="ghost" size="sm" className="text-xs">
                            View all activities
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5 text-yellow-600" />
                    Notifications
                  </CardTitle>
                  <CardDescription>Important updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg ${notification.read ? "bg-muted/30" : "bg-blue-50"}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(notification.created_at), "MMM d, h:mm a")}
                            </p>
                          </div>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-purple-700">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => (window.location.href = "/book")}
                  >
                    <Bus className="mr-2 h-4 w-4" />
                    Book New Trip
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => (window.location.href = "/tracking")}
                  >
                    <Target className="mr-2 h-4 w-4" />
                    Track Bus
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => (window.location.href = "/rewards")}
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    View Rewards
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => (window.location.href = "/wallet")}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Top Up Wallet
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
