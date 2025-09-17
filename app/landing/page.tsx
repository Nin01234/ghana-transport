"use client"

import { LandingHero } from "@/components/landing-hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import {
  MapPin,
  Clock,
  Star,
  Bus,
  Shield,
  Globe,
  ArrowRight,
  Smartphone,
  Award,
  Users,
  Zap,
  TrendingUp,
  CheckCircle,
  Play,
  Quote,
  Heart,
  Share2,
  Download,
  Sparkles,
  Target,
  Rocket,
  Crown,
  Gift,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHero />

      {/* Modern Features Section */}
      <section className="py-32 bg-gradient-to-b from-background via-muted/10 to-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,107,107,0.1),transparent_50%)]"></div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-gradient-to-r from-ghana-green to-ghana-gold text-white border-0 px-6 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Sparkles className="mr-2 h-5 w-5" />
              Revolutionary Features
            </Badge>
            <h2 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              The Future of Transport
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Experience cutting-edge technology that transforms how Ghana moves. Every feature designed with you in
              mind.
            </p>
          </div>

          <Tabs defaultValue="smart" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12 bg-muted/50 p-2 rounded-2xl">
              <TabsTrigger
                value="smart"
                className="text-lg py-4 rounded-xl data-[state=active]:bg-ghana-green data-[state=active]:text-white"
              >
                <Zap className="mr-2 h-5 w-5" />
                Smart Tech
              </TabsTrigger>
              <TabsTrigger
                value="safety"
                className="text-lg py-4 rounded-xl data-[state=active]:bg-ghana-gold data-[state=active]:text-white"
              >
                <Shield className="mr-2 h-5 w-5" />
                Safety First
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="text-lg py-4 rounded-xl data-[state=active]:bg-ghana-red data-[state=active]:text-white"
              >
                <Users className="mr-2 h-5 w-5" />
                Social
              </TabsTrigger>
              <TabsTrigger
                value="rewards"
                className="text-lg py-4 rounded-xl data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Crown className="mr-2 h-5 w-5" />
                Rewards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="smart" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
                  <CardHeader className="pb-4">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <MapPin className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">AI-Powered Routing</CardTitle>
                    <CardDescription className="text-lg">
                      Our advanced AI analyzes traffic patterns, weather, and events to find the fastest route every
                      time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      40% faster routes on average
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
                  <CardHeader className="pb-4">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Smartphone className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Predictive Arrivals</CardTitle>
                    <CardDescription className="text-lg">
                      Know exactly when your bus will arrive with machine learning predictions accurate to the minute.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Target className="mr-2 h-4 w-4" />
                      95% accuracy rate
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
                  <CardHeader className="pb-4">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Rocket className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Smart Notifications</CardTitle>
                    <CardDescription className="text-lg">
                      Get personalized alerts about delays, route changes, and better alternatives before you even
                      leave.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Zap className="mr-2 h-4 w-4" />
                      Real-time updates
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="safety" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg">
                  <CardHeader>
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-ghana-gold to-yellow-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Shield className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Emergency SOS</CardTitle>
                    <CardDescription className="text-lg">
                      One-tap emergency assistance with automatic location sharing to emergency contacts and
                      authorities.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg">
                  <CardHeader>
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-ghana-red to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Driver Verification</CardTitle>
                    <CardDescription className="text-lg">
                      All drivers undergo thorough background checks and regular safety training for your peace of mind.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="social" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-3">
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg">
                  <CardHeader>
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Share2 className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Trip Sharing</CardTitle>
                    <CardDescription>
                      Share your journey with friends and family for added safety and coordination.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg">
                  <CardHeader>
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Heart className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Community Reviews</CardTitle>
                    <CardDescription>
                      Rate and review routes, drivers, and services to help improve the experience for everyone.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg">
                  <CardHeader>
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold">Travel Groups</CardTitle>
                    <CardDescription>
                      Join or create travel groups for regular commutes and make new connections.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                  <CardHeader>
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Crown className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">GhanaTransit Points</CardTitle>
                    <CardDescription className="text-lg">
                      Earn points with every trip and redeem them for free rides, discounts, and exclusive perks.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-gold-50 to-yellow-50 dark:from-yellow-950/20 dark:to-orange-950/20">
                  <CardHeader>
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-ghana-gold to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Gift className="h-10 w-10 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">VIP Membership</CardTitle>
                    <CardDescription className="text-lg">
                      Unlock premium features, priority booking, and exclusive access to luxury routes.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-gradient-to-br from-ghana-green/5 to-ghana-gold/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-ghana-green/10 text-ghana-green border-ghana-green/20 px-6 py-3 text-lg">
              <Star className="mr-2 h-5 w-5" />
              What People Say
            </Badge>
            <h2 className="text-5xl md:text-6xl font-black mb-8">Loved by Thousands</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real stories from real travelers across Ghana
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Akosua Mensah",
                role: "Daily Commuter",
                location: "Accra",
                content:
                  "GhanaTransit has completely transformed my daily commute. I never have to guess when my bus will arrive anymore!",
                rating: 5,
                avatar: "/placeholder.svg?height=60&width=60",
              },
              {
                name: "Kwame Asante",
                role: "Business Traveler",
                location: "Kumasi",
                content:
                  "The reliability and comfort of this service is unmatched. I can focus on my work while traveling across the country.",
                rating: 5,
                avatar: "/placeholder.svg?height=60&width=60",
              },
              {
                name: "Ama Osei",
                role: "Student",
                location: "Cape Coast",
                content:
                  "As a student, the affordable pricing and student discounts make this the perfect transport solution for me.",
                rating: 5,
                avatar: "/placeholder.svg?height=60&width=60",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16 ring-4 ring-ghana-green/20">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-ghana-green text-white text-lg font-bold">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-ghana-green font-medium">{testimonial.location}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-ghana-gold text-ghana-gold" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Quote className="h-8 w-8 text-muted-foreground/30 mb-4" />
                  <p className="text-lg leading-relaxed">{testimonial.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-32 bg-gradient-to-r from-ghana-green via-ghana-gold to-ghana-red text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-8">Powering Ghana's Movement</h2>
            <p className="text-2xl text-white/90 max-w-4xl mx-auto">
              Every number tells a story of connection, progress, and shared journeys across our beautiful nation
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "2M+", label: "Daily Travelers", icon: <Users className="h-12 w-12" />, trend: "+25%" },
              { value: "500+", label: "Active Routes", icon: <MapPin className="h-12 w-12" />, trend: "+15%" },
              { value: "16", label: "Regions Covered", icon: <Globe className="h-12 w-12" />, trend: "100%" },
              { value: "4.9★", label: "User Rating", icon: <Star className="h-12 w-12" />, trend: "+0.2" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="mb-6 flex justify-center">
                  <div className="p-6 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-6xl md:text-7xl font-black mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-2xl text-white/90 font-medium mb-2">{stat.label}</div>
                <div className="text-white/70 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.trend} growth
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background"></div>
        <div className="container mx-auto px-4 relative">
          <Card className="mx-auto max-w-6xl hover:shadow-3xl transition-all duration-500 border-0 shadow-2xl bg-gradient-to-br from-background to-muted/30">
            <CardHeader className="text-center pb-12 pt-16">
              <Badge className="mb-8 bg-gradient-to-r from-ghana-green to-ghana-gold text-white border-0 px-8 py-4 text-xl font-bold mx-auto shadow-lg">
                <Rocket className="mr-3 h-6 w-6" />
                Ready to Transform Your Journey?
              </Badge>
              <CardTitle className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Your Adventure Awaits
              </CardTitle>
              <CardDescription className="text-2xl mt-6 max-w-4xl mx-auto leading-relaxed">
                Join the revolution that's transforming transportation across Ghana. Every journey is a new beginning.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-12 pb-16">
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  className="text-xl px-12 py-8 bg-gradient-to-r from-ghana-green to-emerald-600 hover:from-ghana-green/90 hover:to-emerald-600/90 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group rounded-2xl"
                  asChild
                >
                  <Link href="/auth/register">
                    <Download className="mr-3 h-7 w-7 group-hover:animate-bounce" />
                    Start Your Journey Free
                    <ArrowRight className="ml-3 h-7 w-7 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-xl px-12 py-8 border-2 hover:bg-foreground hover:text-background shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl"
                  asChild
                >
                  <Link href="/auth/login">
                    <Play className="mr-3 h-7 w-7" />
                    Watch Demo
                  </Link>
                </Button>
              </div>

              <div className="text-center space-y-6">
                <div className="flex justify-center items-center space-x-8 text-lg text-muted-foreground">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-ghana-green" />
                    Free to join
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-ghana-green" />
                    No hidden fees
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-ghana-green" />
                    Instant access
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                  {[
                    { icon: <Shield className="h-8 w-8" />, label: "Bank-level Security" },
                    { icon: <Clock className="h-8 w-8" />, label: "24/7 Support" },
                    { icon: <Star className="h-8 w-8" />, label: "5-Star Rated" },
                    { icon: <Award className="h-8 w-8" />, label: "Award Winning" },
                  ].map((feature, index) => (
                    <div key={index} className="text-center group">
                      <div className="mb-3 flex justify-center">
                        <div className="p-3 rounded-xl bg-muted group-hover:bg-ghana-green group-hover:text-white transition-all duration-300">
                          {feature.icon}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {feature.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-muted to-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-ghana-green to-ghana-gold mr-4 shadow-lg">
                <Bus className="h-12 w-12 text-white" />
              </div>
              <span className="text-4xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                GhanaTransit
              </span>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connecting Ghana, One Journey at a Time. Building the future of transportation with innovation, safety,
              and community at heart.
            </p>
            <div className="flex justify-center space-x-8 text-lg">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-ghana-green transition-colors font-medium"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-ghana-green transition-colors font-medium"
              >
                Contact
              </Link>
              <Link href="/help" className="text-muted-foreground hover:text-ghana-green transition-colors font-medium">
                Help
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-ghana-green transition-colors font-medium"
              >
                Privacy
              </Link>
            </div>
            <div className="mt-12 pt-8 border-t border-muted-foreground/20">
              <p className="text-muted-foreground">
                © 2024 GhanaTransit. Made with <Heart className="inline h-4 w-4 text-ghana-red" /> in Ghana.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


