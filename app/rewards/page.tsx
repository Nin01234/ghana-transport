"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import {
  Star,
  Gift,
  Trophy,
  Crown,
  Zap,
  Coffee,
  Fuel,
  Ticket,
  Wallet,
  Users,
  Calendar,
  TrendingUp,
  Award,
  Target,
  Sparkles,
} from "lucide-react"

interface Reward {
  id: string
  title: string
  description: string
  pointsCost: number
  category: "travel" | "food" | "fuel" | "shopping" | "premium"
  icon: string
  available: boolean
  expiryDate?: string
  discount?: number
  value?: number
}

interface UserReward {
  id: string
  rewardId: string
  redeemedAt: string
  expiresAt: string
  used: boolean
  code: string
}

const availableRewards: Reward[] = [
  {
    id: "1",
    title: "Free Bus Ticket",
    description: "Get a free ticket for any route within Accra",
    pointsCost: 500,
    category: "travel",
    icon: "ticket",
    available: true,
    value: 25,
  },
  {
    id: "2",
    title: "20% Off Next Trip",
    description: "Save 20% on your next intercity journey",
    pointsCost: 300,
    category: "travel",
    icon: "discount",
    available: true,
    discount: 20,
  },
  {
    id: "3",
    title: "Coffee Voucher",
    description: "Free coffee at partner stations",
    pointsCost: 150,
    category: "food",
    icon: "coffee",
    available: true,
    value: 10,
  },
  {
    id: "4",
    title: "Fuel Discount",
    description: "₵20 off fuel at Shell stations",
    pointsCost: 400,
    category: "fuel",
    icon: "fuel",
    available: true,
    value: 20,
  },
  {
    id: "5",
    title: "VIP Upgrade",
    description: "Upgrade to VIP class on your next trip",
    pointsCost: 800,
    category: "premium",
    icon: "crown",
    available: true,
    value: 50,
  },
  {
    id: "6",
    title: "Group Booking Discount",
    description: "30% off when booking for 5+ people",
    pointsCost: 600,
    category: "travel",
    icon: "users",
    available: true,
    discount: 30,
  },
]

export default function RewardsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [userPoints, setUserPoints] = useState(1250)
  const [userLevel, setUserLevel] = useState("Gold")
  const [nextLevelPoints, setNextLevelPoints] = useState(2000)
  const [userRewards, setUserRewards] = useState<UserReward[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    if (user) {
      fetchUserRewards()
    }
  }, [user])

  const fetchUserRewards = async () => {
    if (!user) return

    try {
      // Fetch user profile for points
      const { data: profile } = await supabase.from("profiles").select("loyalty_points").eq("id", user.id).single()

      if (profile) {
        setUserPoints(profile.loyalty_points || 0)
      }
    } catch (error) {
      console.error("Error fetching user rewards:", error)
    }
  }

  const redeemReward = async (reward: Reward) => {
    if (userPoints < reward.pointsCost) {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.pointsCost - userPoints} more points to redeem this reward.`,
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Update user points
      const newPoints = userPoints - reward.pointsCost
      const { error } = await supabase.from("profiles").update({ loyalty_points: newPoints }).eq("id", user!.id)

      if (error) throw error

      // Generate reward code
      const rewardCode = `GH${Date.now().toString().slice(-6)}`

      // Add to user rewards (in a real app, this would be a separate table)
      const newUserReward: UserReward = {
        id: Date.now().toString(),
        rewardId: reward.id,
        redeemedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        used: false,
        code: rewardCode,
      }

      setUserRewards([...userRewards, newUserReward])
      setUserPoints(newPoints)

      toast({
        title: "Reward Redeemed!",
        description: `${reward.title} has been added to your account. Code: ${rewardCode}`,
      })

      // Log activity for dashboard
      await logActivity("reward_redeemed", `Redeemed ${reward.title}`)
    } catch (error) {
      console.error("Error redeeming reward:", error)
      toast({
        title: "Redemption Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const logActivity = async (type: string, description: string) => {
    try {
      await supabase.from("user_activities").insert({
        user_id: user!.id,
        activity_type: type,
        description,
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error logging activity:", error)
    }
  }

  const getLevelInfo = (points: number) => {
    if (points < 500) return { level: "Bronze", next: 500, color: "text-amber-600" }
    if (points < 1000) return { level: "Silver", next: 1000, color: "text-gray-500" }
    if (points < 2000) return { level: "Gold", next: 2000, color: "text-yellow-500" }
    return { level: "Platinum", next: 5000, color: "text-purple-500" }
  }

  const levelInfo = getLevelInfo(userPoints)
  const progressPercentage = (userPoints / levelInfo.next) * 100

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case "ticket":
        return <Ticket className="h-6 w-6" />
      case "discount":
        return <Zap className="h-6 w-6" />
      case "coffee":
        return <Coffee className="h-6 w-6" />
      case "fuel":
        return <Fuel className="h-6 w-6" />
      case "crown":
        return <Crown className="h-6 w-6" />
      case "users":
        return <Users className="h-6 w-6" />
      default:
        return <Gift className="h-6 w-6" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "travel":
        return "bg-blue-100 text-blue-800"
      case "food":
        return "bg-orange-100 text-orange-800"
      case "fuel":
        return "bg-green-100 text-green-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredRewards =
    selectedCategory === "all" ? availableRewards : availableRewards.filter((r) => r.category === selectedCategory)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Navigation />

        <div className="container py-6">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Rewards & Loyalty
            </h1>
            <p className="text-lg text-muted-foreground">Earn points with every trip and unlock amazing rewards</p>
          </div>

          {/* User Stats */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Your Points</p>
                    <p className="text-3xl font-bold">{userPoints.toLocaleString()}</p>
                  </div>
                  <Star className="h-12 w-12 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Current Level</p>
                    <p className="text-3xl font-bold">{levelInfo.level}</p>
                  </div>
                  <Trophy className="h-12 w-12 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100">Rewards Earned</p>
                    <p className="text-3xl font-bold">{userRewards.length}</p>
                  </div>
                  <Award className="h-12 w-12 text-indigo-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Level Progress */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-purple-600" />
                Level Progress
              </CardTitle>
              <CardDescription>
                {levelInfo.next - userPoints} points to reach{" "}
                {levelInfo.level === "Platinum" ? "next milestone" : "next level"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{levelInfo.level}</span>
                  <span>
                    {userPoints} / {levelInfo.next}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-3">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </Progress>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Rewards Catalog */}
            <div className="lg:col-span-3">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className="bg-white/80 backdrop-blur-sm"
                >
                  All Rewards
                </Button>
                <Button
                  variant={selectedCategory === "travel" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("travel")}
                  className="bg-white/80 backdrop-blur-sm"
                >
                  Travel
                </Button>
                <Button
                  variant={selectedCategory === "food" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("food")}
                  className="bg-white/80 backdrop-blur-sm"
                >
                  Food & Drinks
                </Button>
                <Button
                  variant={selectedCategory === "fuel" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("fuel")}
                  className="bg-white/80 backdrop-blur-sm"
                >
                  Fuel
                </Button>
                <Button
                  variant={selectedCategory === "premium" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("premium")}
                  className="bg-white/80 backdrop-blur-sm"
                >
                  Premium
                </Button>
              </div>

              {/* Rewards Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {filteredRewards.map((reward) => (
                  <Card
                    key={reward.id}
                    className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
                            {getRewardIcon(reward.icon)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{reward.title}</h3>
                            <Badge className={getCategoryColor(reward.category)}>{reward.category}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-purple-600 font-bold">
                            <Star className="h-4 w-4 mr-1" />
                            {reward.pointsCost}
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4">{reward.description}</p>

                      {reward.value && (
                        <div className="flex items-center text-sm text-green-600 mb-2">
                          <Wallet className="h-4 w-4 mr-1" />
                          Value: ₵{reward.value}
                        </div>
                      )}

                      {reward.discount && (
                        <div className="flex items-center text-sm text-orange-600 mb-2">
                          <Zap className="h-4 w-4 mr-1" />
                          {reward.discount}% Discount
                        </div>
                      )}

                      <Button
                        onClick={() => redeemReward(reward)}
                        disabled={userPoints < reward.pointsCost || loading}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        {userPoints < reward.pointsCost ? (
                          `Need ${reward.pointsCost - userPoints} more points`
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Redeem Now
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* My Rewards */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gift className="mr-2 h-5 w-5 text-purple-600" />
                    My Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userRewards.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No rewards redeemed yet</p>
                  ) : (
                    <div className="space-y-3">
                      {userRewards.slice(0, 3).map((userReward) => {
                        const reward = availableRewards.find((r) => r.id === userReward.rewardId)
                        return (
                          <div key={userReward.id} className="p-3 bg-muted rounded-lg">
                            <div className="font-medium text-sm">{reward?.title}</div>
                            <div className="text-xs text-muted-foreground">Code: {userReward.code}</div>
                            <Badge variant={userReward.used ? "secondary" : "default"} className="mt-1">
                              {userReward.used ? "Used" : "Active"}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Earning Tips */}
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-yellow-700 flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Earn More Points
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Ticket className="h-4 w-4 mr-2 text-yellow-600" />
                    <span>+10 points per trip</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-yellow-600" />
                    <span>+50 points for referrals</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-yellow-600" />
                    <span>+25 points for reviews</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 mr-2 text-yellow-600" />
                    <span>Bonus points on weekends</span>
                  </div>
                </CardContent>
              </Card>

              {/* Level Benefits */}
              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-purple-700 flex items-center">
                    <Crown className="mr-2 h-5 w-5" />
                    Level Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Bronze (0-499)</span>
                    <span>Basic rewards</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Silver (500-999)</span>
                    <span>5% bonus points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gold (1000-1999)</span>
                    <span>10% bonus + priority</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platinum (2000+)</span>
                    <span>15% bonus + VIP</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
