"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { HeroSlider } from "@/components/hero-slider"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-provider"
import { EmailVerificationBanner } from "@/components/email-verification-banner"
import { supabase } from "@/lib/supabase"
import {
  MapPin,
  Clock,
  Star,
  Bus,
  Route,
  Wallet,
  ArrowRight,
  Shield,
  Globe,
  Users,
  Ticket,
  MessageCircle,
  TrendingUp,
  Award,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Activity,
  BarChart3,
  Gift,
} from "lucide-react"

interface QuickStats {
  total_bookings: number
  wallet_balance: number
  loyalty_points: number
  upcoming_trips: number
}

interface RecentActivity {
  id: string
  type: string
  description: string
  timestamp: Date
  icon: any
  color: string
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<QuickStats>({
    total_bookings: 0,
    wallet_balance: 0,
    loyalty_points: 0,
    upcoming_trips: 0,
  })
  const [statsLoading, setStatsLoading] = useState(false)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loyaltyLevel, setLoyaltyLevel] = useState({
    level: "Bronze",
    progress: 0,
    nextLevel: "Silver",
    pointsNeeded: 100,
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/landing")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchUserStats()
      fetchRecentActivities()
    }
  }, [user])

  const fetchUserStats = async () => {
    if (!user) return

    setStatsLoading(true)
    try {
      const { data, error } = await supabase.rpc("get_user_stats", { user_uuid: user.id })

      if (error) {
        console.error("Error fetching user stats:", error)
        setStats({
          total_bookings: 5,
          wallet_balance: 125.5,
          loyalty_points: 340,
          upcoming_trips: 2,
        })
      } else {
        setStats(
          data || {
            total_bookings: 5,
            wallet_balance: 125.5,
            loyalty_points: 340,
            upcoming_trips: 2,
          },
        )
      }

      // Calculate loyalty level
      const points = data?.loyalty_points || 340
      if (points < 100) {
        setLoyaltyLevel({ level: "Bronze", progress: points, nextLevel: "Silver", pointsNeeded: 100 - points })
      } else if (points < 500) {
        setLoyaltyLevel({
          level: "Silver",
          progress: ((points - 100) / 400) * 100,
          nextLevel: "Gold",
          pointsNeeded: 500 - points,
        })
      } else if (points < 1000) {
        setLoyaltyLevel({
          level: "Gold",
          progress: ((points - 500) / 500) * 100,
          nextLevel: "Platinum",
          pointsNeeded: 1000 - points,
        })
      } else {
        setLoyaltyLevel({ level: "Platinum", progress: 100, nextLevel: "Platinum", pointsNeeded: 0 })
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
      setStats({
        total_bookings: 5,
        wallet_balance: 125.5,
        loyalty_points: 340,
        upcoming_trips: 2,
      })
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchRecentActivities = () => {
    // Simulate recent activities
    const activities: RecentActivity[] = [
      {
        id: "1",
        type: "booking",
        description: "Booked Accra to Kumasi trip",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        icon: Bus,
        color: "text-green-600",
      },
      {
        id: "2",
        type: "payment",
        description: "Wallet topped up with ₵50",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        icon: Wallet,
        color: "text-blue-600",
      },
      {
        id: "3",
        type: "reward",
        description: "Earned 25 loyalty points",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        icon: Star,
        color: "text-yellow-600",
      },
      {
        id: "4",
        type: "trip",
        description: "Completed Cape Coast trip",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        icon: CheckCircle,
        color: "text-green-600",
      },
    ]
    setRecentActivities(activities)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ghana-green/5 to-ghana-gold/5">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-ghana-green border-t-transparent mx-auto"></div>
          <p className="text-lg font-medium text-muted-foreground">Loading your journey...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />
        <EmailVerificationBanner />
        <HeroSlider />

        <div className="container py-12">
          {user ? (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      Welcome back, {user.user_metadata?.full_name || user.email?.split("@")[0] || "Traveler"}! 👋
                    </h1>
                    <p className="text-muted-foreground">Ready for your next adventure across Ghana?</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Today</div>
                    <div className="text-lg font-semibold">
                      {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Dashboard Stats */}
              <div className="mb-12">
                <h2 className="mb-8 text-2xl font-bold">Your Travel Dashboard</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                      <Ticket className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-700">
                        {statsLoading ? "..." : stats.total_bookings}
                      </div>
                      <p className="text-xs text-green-600">
                        <TrendingUp className="inline h-3 w-3 mr-1" />
                        +2 this month
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
                      <Wallet className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-700">
                        {statsLoading ? "..." : `₵${Number(stats.wallet_balance).toFixed(2)}`}
                      </div>
                      <p className="text-xs text-blue-600">
                        <Button variant="link" className="p-0 h-auto text-xs text-blue-600" asChild>
                          <Link href="/wallet">Top up wallet</Link>
                        </Button>
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Loyalty Points</CardTitle>
                      <Star className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-700">
                        {statsLoading ? "..." : stats.loyalty_points}
                      </div>
                      <p className="text-xs text-yellow-600">
                        <Award className="inline h-3 w-3 mr-1" />
                        {loyaltyLevel.level} Member
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Upcoming Trips</CardTitle>
                      <Calendar className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-700">
                        {statsLoading ? "..." : stats.upcoming_trips}
                      </div>
                      <p className="text-xs text-purple-600">
                        <Button variant="link" className="p-0 h-auto text-xs text-purple-600" asChild>
                          <Link href="/bookings">View details</Link>
                        </Button>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Loyalty Progress */}
              <div className="mb-12">
                <Card className="bg-gradient-to-r from-yellow-50 via-yellow-100 to-orange-50 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="mr-2 h-5 w-5 text-yellow-600" />
                      Loyalty Status: {loyaltyLevel.level} Member
                    </CardTitle>
                    <CardDescription>
                      {loyaltyLevel.pointsNeeded > 0
                        ? `${loyaltyLevel.pointsNeeded} points needed to reach ${loyaltyLevel.nextLevel}`
                        : "You've reached the highest tier!"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{loyaltyLevel.level}</span>
                        <span>{loyaltyLevel.nextLevel}</span>
                      </div>
                      <Progress value={loyaltyLevel.progress} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current: {stats.loyalty_points} points</span>
                        <span>Benefits: Free upgrades, priority booking</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="mb-12">
                <h3 className="mb-6 text-2xl font-semibold">Quick Actions</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Button
                    asChild
                    className="h-24 flex-col space-y-2 hover:scale-105 transition-transform bg-gradient-to-br from-blue-500 to-blue-600"
                  >
                    <Link href="/book">
                      <Route className="h-8 w-8" />
                      <span className="text-lg">Book Trip</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-24 flex-col space-y-2 hover:scale-105 transition-transform border-green-200 hover:bg-green-50"
                  >
                    <Link href="/tracking">
                      <MapPin className="h-8 w-8 text-green-600" />
                      <span className="text-lg">Live Tracking</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-24 flex-col space-y-2 hover:scale-105 transition-transform border-yellow-200 hover:bg-yellow-50"
                  >
                    <Link href="/wallet">
                      <Wallet className="h-8 w-8 text-yellow-600" />
                      <span className="text-lg">Manage Wallet</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-24 flex-col space-y-2 hover:scale-105 transition-transform border-purple-200 hover:bg-purple-50"
                  >
                    <Link href="/rewards">
                      <Gift className="h-8 w-8 text-purple-600" />
                      <span className="text-lg">Rewards</span>
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Recent Activity & Upcoming Trips */}
              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {/* Recent Activity */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="mr-2 h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => {
                        const IconComponent = activity.icon
                        return (
                          <div
                            key={activity.id}
                            className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div
                              className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center ${activity.color}`}
                            >
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{activity.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {activity.timestamp.toLocaleDateString()} at{" "}
                                {activity.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Trips */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      Upcoming Trips
                    </CardTitle>
                    <CardDescription>Your scheduled journeys</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 border rounded-lg bg-blue-50 border-blue-200">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <Bus className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Accra → Kumasi</p>
                          <p className="text-sm text-muted-foreground">Tomorrow, 8:30 AM • GT-001</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              VIP Class
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Seat 12A
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Call Driver
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                          <Bus className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Kumasi → Tamale</p>
                          <p className="text-sm text-muted-foreground">Dec 25, 2:00 PM • GT-006</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Standard
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Seat 8B
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>

                      <div className="text-center pt-4">
                        <Button variant="link" asChild>
                          <Link href="/bookings">View All Bookings</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Insights */}
              <div className="mb-12">
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="mr-2 h-5 w-5 text-indigo-600" />
                      Your Travel Insights
                    </CardTitle>
                    <CardDescription>Statistics about your travel patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">2,450 km</div>
                        <div className="text-sm text-muted-foreground">Total Distance Traveled</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">₵890</div>
                        <div className="text-sm text-muted-foreground">Total Spent This Year</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">4.9★</div>
                        <div className="text-sm text-muted-foreground">Average Trip Rating</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Support & Contact */}
              <div className="mb-12">
                <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="mr-2 h-5 w-5 text-orange-600" />
                      Need Help?
                    </CardTitle>
                    <CardDescription>We're here to assist you 24/7</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Button variant="outline" className="h-16 flex-col space-y-1" asChild>
                        <Link href="/help">
                          <MessageCircle className="h-5 w-5" />
                          <span>Live Chat</span>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-16 flex-col space-y-1"
                        onClick={() => window.open("tel:+233509921758")}
                      >
                        <Phone className="h-5 w-5" />
                        <span>Call Support</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-16 flex-col space-y-1"
                        onClick={() => window.open("mailto:manuel.young84@gmail.com")}
                      >
                        <Mail className="h-5 w-5" />
                        <span>Email Us</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <>
              {/* Features for Non-authenticated Users */}
              <section className="py-16">
                <div className="mx-auto max-w-4xl text-center mb-16">
                  <h2 className="text-4xl font-bold mb-6">Why Choose GhanaTransit?</h2>
                  <p className="text-xl text-muted-foreground">Experience the future of public transport in Ghana</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="h-16 w-16 rounded-xl bg-ghana-green/10 flex items-center justify-center mb-4">
                        <MapPin className="h-8 w-8 text-ghana-green" />
                      </div>
                      <CardTitle className="text-xl">Real-time Tracking</CardTitle>
                      <CardDescription className="text-base">
                        Track your bus in real-time with GPS precision. Never miss your ride again.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="h-16 w-16 rounded-xl bg-ghana-gold/10 flex items-center justify-center mb-4">
                        <Shield className="h-8 w-8 text-ghana-gold" />
                      </div>
                      <CardTitle className="text-xl">Secure Payments</CardTitle>
                      <CardDescription className="text-base">
                        Pay safely with Mobile Money, cards, or our secure wallet system.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="h-16 w-16 rounded-xl bg-ghana-red/10 flex items-center justify-center mb-4">
                        <Globe className="h-8 w-8 text-ghana-red" />
                      </div>
                      <CardTitle className="text-xl">Multilingual Support</CardTitle>
                      <CardDescription className="text-base">
                        Available in English, Twi, Ewe, and Hausa for all Ghanaians.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Star className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Loyalty Rewards</CardTitle>
                      <CardDescription className="text-base">
                        Earn points with every trip and unlock exclusive benefits.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="h-16 w-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8 text-secondary-foreground" />
                      </div>
                      <CardTitle className="text-xl">Smart Scheduling</CardTitle>
                      <CardDescription className="text-base">
                        AI-powered route suggestions based on traffic and demand.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="h-16 w-16 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                        <Users className="h-8 w-8 text-accent-foreground" />
                      </div>
                      <CardTitle className="text-xl">Community Driven</CardTitle>
                      <CardDescription className="text-base">
                        Built for Ghanaians, by Ghanaians. Join our growing community.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </section>

              {/* CTA Section */}
              <section className="py-16 text-center">
                <Card className="mx-auto max-w-3xl hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-3xl">Ready to Start Your Journey?</CardTitle>
                    <CardDescription className="text-xl">
                      Join thousands of satisfied travelers across Ghana
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" className="text-lg px-8 py-4" asChild>
                        <Link href="/auth/register">
                          Get Started Free
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
                        <Link href="/routes">Browse Routes</Link>
                      </Button>
                    </div>
                    <p className="text-muted-foreground">No credit card required • Free to join • Instant booking</p>
                  </CardContent>
                </Card>
              </section>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
