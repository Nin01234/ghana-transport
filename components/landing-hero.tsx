"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  Clock,
  Users,
  Star,
  Shield,
  Zap,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Search,
  Navigation,
  Smartphone,
  CreditCard,
  Globe,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowDown,
  Sparkles,
  Heart,
  Share2,
  Download,
} from "lucide-react"

interface HeroSlide {
  id: number
  image: string
  title: string
  subtitle: string
  description: string
  badge: string
  color: string
  gradient: string
  stats?: {
    label: string
    value: string
    icon: React.ReactNode
    trend?: string
  }[]
  features?: string[]
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "/images/accra-transport.jpg",
    title: "Transportation in Accra",
    subtitle: "Ghana's Bustling Capital",
    description:
      "Experience the vibrant transport culture of Accra. From trotros to buses, we connect every corner of Ghana's capital city with reliable and affordable transport solutions.",
    badge: "Capital Connect",
    color: "from-blue-600 to-purple-700",
    gradient: "bg-gradient-to-br from-blue-500/20 to-purple-600/20",
    stats: [
      { label: "Daily Commuters", value: "2M+", icon: <Users className="h-4 w-4" />, trend: "+12%" },
      { label: "Routes in Accra", value: "150+", icon: <MapPin className="h-4 w-4" />, trend: "+8%" },
      { label: "Satisfaction Rate", value: "98%", icon: <Star className="h-4 w-4" />, trend: "+5%" },
    ],
    features: ["Real-time GPS", "Mobile Payments", "24/7 Support"],
  },
  {
    id: 2,
    image: "/images/ghana-road-network.jpg",
    title: "Ghana's Modern Road Network",
    subtitle: "World-Class Infrastructure",
    description:
      "Travel on Ghana's modern highways and road networks. Our state-of-the-art infrastructure ensures smooth, safe, and comfortable journeys across the country.",
    badge: "Modern Ghana",
    color: "from-emerald-600 to-teal-700",
    gradient: "bg-gradient-to-br from-emerald-500/20 to-teal-600/20",
    stats: [
      { label: "Highway Network", value: "15,000km", icon: <MapPin className="h-4 w-4" />, trend: "+15%" },
      { label: "Safety Rating", value: "4.9★", icon: <Shield className="h-4 w-4" />, trend: "+0.2" },
      { label: "Coverage", value: "16 Regions", icon: <Globe className="h-4 w-4" />, trend: "100%" },
    ],
    features: ["Smart Traffic", "Emergency Response", "Weather Updates"],
  },
  {
    id: 3,
    image: "/images/tema-motorway.jpg",
    title: "Tema Motorway",
    subtitle: "Gateway to Progress",
    description:
      "The iconic Tema Motorway connects Accra to Ghana's main port city. Experience seamless travel on one of West Africa's most important transport corridors.",
    badge: "Economic Gateway",
    color: "from-orange-600 to-red-700",
    gradient: "bg-gradient-to-br from-orange-500/20 to-red-600/20",
    stats: [
      { label: "Daily Traffic", value: "50K+", icon: <Users className="h-4 w-4" />, trend: "+18%" },
      { label: "Time Saved", value: "60%", icon: <Clock className="h-4 w-4" />, trend: "+10%" },
      { label: "Efficiency", value: "95%", icon: <TrendingUp className="h-4 w-4" />, trend: "+7%" },
    ],
    features: ["Express Lanes", "Port Connection", "Cargo Tracking"],
  },
  {
    id: 4,
    image: "/images/independence-arch.jpg",
    title: "Independence Arch",
    subtitle: "Symbol of Freedom",
    description:
      "Journey through Ghana's historic landmarks. From Independence Square to every corner of the nation, we honor our heritage while building the future of transport.",
    badge: "Heritage Routes",
    color: "from-purple-600 to-pink-700",
    gradient: "bg-gradient-to-br from-purple-500/20 to-pink-600/20",
    stats: [
      { label: "Historic Sites", value: "25+", icon: <Star className="h-4 w-4" />, trend: "+3" },
      { label: "Cultural Routes", value: "40+", icon: <MapPin className="h-4 w-4" />, trend: "+12%" },
      { label: "Tourist Rating", value: "4.8★", icon: <Award className="h-4 w-4" />, trend: "+0.3" },
    ],
    features: ["Cultural Tours", "Audio Guide", "Photo Spots"],
  },
  {
    id: 5,
    image: "/images/ghana-traveler.jpg",
    title: "Every Journey Matters",
    subtitle: "Your Story, Our Mission",
    description:
      "Behind every smile is a destination, a dream, a purpose. Join thousands of Ghanaians who trust us with their daily journeys across our beautiful nation.",
    badge: "People First",
    color: "from-cyan-600 to-blue-700",
    gradient: "bg-gradient-to-br from-cyan-500/20 to-blue-600/20",
    stats: [
      { label: "Happy Travelers", value: "100K+", icon: <Users className="h-4 w-4" />, trend: "+25%" },
      { label: "Customer Satisfaction", value: "96%", icon: <Star className="h-4 w-4" />, trend: "+4%" },
      { label: "Repeat Users", value: "89%", icon: <Heart className="h-4 w-4" />, trend: "+8%" },
    ],
    features: ["Personal Assistant", "Trip Planning", "Social Features"],
  },
  {
    id: 6,
    image: "/images/highway-interchange.jpg",
    title: "Advanced Infrastructure",
    subtitle: "Engineering Excellence",
    description:
      "Navigate Ghana's sophisticated highway interchanges and modern transport hubs. Our advanced infrastructure supports efficient movement across the nation.",
    badge: "Smart Transport",
    color: "from-indigo-600 to-purple-700",
    gradient: "bg-gradient-to-br from-indigo-500/20 to-purple-600/20",
    stats: [
      { label: "Major Interchanges", value: "12+", icon: <MapPin className="h-4 w-4" />, trend: "+2" },
      { label: "Traffic Efficiency", value: "85%", icon: <Zap className="h-4 w-4" />, trend: "+12%" },
      { label: "Smart Signals", value: "200+", icon: <Navigation className="h-4 w-4" />, trend: "+30%" },
    ],
    features: ["AI Traffic Control", "Smart Routing", "Predictive Analytics"],
  },
  {
    id: 7,
    image: "/images/night-traffic.jpg",
    title: "24/7 Connectivity",
    subtitle: "Never Stop Moving",
    description:
      "Day or night, rain or shine, we keep Ghana moving. Our round-the-clock services ensure you can travel whenever you need to, wherever you need to go.",
    badge: "Always Available",
    color: "from-slate-600 to-gray-800",
    gradient: "bg-gradient-to-br from-slate-500/20 to-gray-700/20",
    stats: [
      { label: "Night Services", value: "24/7", icon: <Clock className="h-4 w-4" />, trend: "Always" },
      { label: "Night Routes", value: "50+", icon: <MapPin className="h-4 w-4" />, trend: "+15%" },
      { label: "Safety Score", value: "99%", icon: <Shield className="h-4 w-4" />, trend: "+2%" },
    ],
    features: ["Night Vision", "Emergency SOS", "Live Support"],
  },
]

export function LandingHero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const handleSearch = async () => {
    setIsLoading(true)
    // Simulate search
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.1)_50%,transparent_75%)] bg-[length:20px_20px] animate-pulse"></div>
      </div>

      {/* Background Images with Parallax */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            style={{
              transform:
                index === currentSlide
                  ? `translate(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px) scale(1.05)`
                  : "scale(1.05)",
            }}
          >
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              className="w-full h-full object-cover filter brightness-75"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 ${slide.gradient}`}
            />
          </div>
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <div className="space-y-8">
              {/* Animated Badge */}
              <div className="animate-fade-in-up">
                <Badge
                  variant="secondary"
                  className={`px-6 py-3 bg-gradient-to-r ${currentSlideData.color} text-white border-0 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                >
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  {currentSlideData.badge}
                </Badge>
              </div>

              {/* Main Headlines */}
              <div className="space-y-4 animate-fade-in-up animation-delay-200">
                <h2 className="text-xl md:text-2xl text-white/90 font-medium tracking-wide">
                  {currentSlideData.subtitle}
                </h2>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight">
                  <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {currentSlideData.title.split(" ").map((word, index) => (
                      <span
                        key={index}
                        className="inline-block animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {word}{" "}
                      </span>
                    ))}
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed animate-fade-in-up animation-delay-400">
                {currentSlideData.description}
              </p>

              {/* Features Pills */}
              <div className="flex flex-wrap gap-3 animate-fade-in-up animation-delay-500">
                {currentSlideData.features?.map((feature, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <CheckCircle className="inline-block w-4 h-4 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Search Bar */}
              <div className="animate-fade-in-up animation-delay-600">
                <Card className="p-2 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 flex items-center space-x-2">
                      <Search className="h-5 w-5 text-white/70 ml-3" />
                      <Input
                        placeholder="Where do you want to go today?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 bg-transparent text-white placeholder:text-white/60 focus:ring-0 text-lg"
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      disabled={isLoading}
                      className={`bg-gradient-to-r ${currentSlideData.color} hover:shadow-lg transition-all duration-300 hover:scale-105 px-8`}
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          <Navigation className="mr-2 h-5 w-5" />
                          Search
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-700">
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${currentSlideData.color} hover:shadow-2xl text-white text-lg px-10 py-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 group`}
                  asChild
                >
                  <Link href="/auth/register">
                    <Download className="mr-2 h-6 w-6 group-hover:animate-bounce" />
                    Get Started Free
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white hover:text-black text-lg px-10 py-6 rounded-2xl font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link href="/auth/login">
                    <Smartphone className="mr-2 h-6 w-6" />
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Stats & Features */}
            <div className="space-y-6 animate-fade-in-left animation-delay-800">
              {/* Stats Cards */}
              <div className="grid gap-4">
                {currentSlideData.stats?.map((stat, index) => (
                  <Card
                    key={index}
                    className="p-6 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-3 rounded-xl bg-gradient-to-r ${currentSlideData.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          >
                            {stat.icon}
                          </div>
                          <div>
                            <div className="text-3xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                              {stat.value}
                            </div>
                            <div className="text-white/70 font-medium">{stat.label}</div>
                          </div>
                        </div>
                        {stat.trend && (
                          <div className="text-right">
                            <div className="text-green-400 text-sm font-semibold flex items-center">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              {stat.trend}
                            </div>
                            <div className="text-white/50 text-xs">vs last month</div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-0">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <Zap className="mr-2 h-5 w-5" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="ghost" className="text-white hover:bg-white/20 justify-start">
                      <MapPin className="mr-2 h-4 w-4" />
                      Find Routes
                    </Button>
                    <Button variant="ghost" className="text-white hover:bg-white/20 justify-start">
                      <Clock className="mr-2 h-4 w-4" />
                      Live Times
                    </Button>
                    <Button variant="ghost" className="text-white hover:bg-white/20 justify-start">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Top Up Wallet
                    </Button>
                    <Button variant="ghost" className="text-white hover:bg-white/20 justify-start">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Trip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group"
        >
          <ChevronLeft className="h-8 w-8 group-hover:-translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-4 flex items-center z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group"
        >
          <ChevronRight className="h-8 w-8 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Enhanced Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {heroSlides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative transition-all duration-300 ${
              index === currentSlide
                ? "w-12 h-4 bg-white rounded-full shadow-lg"
                : "w-4 h-4 bg-white/50 hover:bg-white/75 rounded-full hover:scale-125"
            }`}
          >
            {index === currentSlide && (
              <div className="absolute inset-0 bg-gradient-to-r from-white to-white/80 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Control Panel */}
      <div className="absolute top-6 right-6 flex items-center space-x-3 z-20">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3"
        >
          {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMuted(!isMuted)}
          className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 rounded-full p-3"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div
          className={`h-full bg-gradient-to-r ${currentSlideData.color} transition-all duration-300`}
          style={{
            width: isAutoPlaying ? "100%" : "0%",
            animation: isAutoPlaying ? "progress 8s linear infinite" : "none",
          }}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 animate-bounce z-20">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm font-medium">Discover More</p>
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
            <ArrowDown className="w-4 h-4 mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </section>
  )
}
