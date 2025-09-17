"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { ChevronLeft, ChevronRight, Search, ArrowRight, Zap, MapPin, Clock, Users, Star, Shield } from "lucide-react"

interface HeroSlide {
  id: number
  image: string
  title: string
  subtitle: string
  description: string
  cta: string
  ctaLink: string
  badge: string
  stats?: {
    label: string
    value: string
    icon: React.ReactNode
  }[]
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: "/images/hero-1.jpg",
    title: "Your Journey, Your Comfort",
    subtitle: "Experience Premium Travel",
    description:
      "Travel in comfort with our modern fleet. Every seat is designed for your comfort, every journey crafted for your convenience.",
    cta: "Book Your Seat",
    ctaLink: "/routes",
    badge: "Comfort First",
    stats: [
      { label: "Happy Travelers", value: "50K+", icon: <Users className="h-4 w-4" /> },
      { label: "Routes Available", value: "200+", icon: <MapPin className="h-4 w-4" /> },
    ],
  },
  {
    id: 2,
    image: "/images/hero-2.jpg",
    title: "Modern Fleet, Premium Experience",
    subtitle: "State-of-the-Art Buses",
    description:
      "Step into our modern buses equipped with AC, WiFi, charging ports, and comfortable seating. Your comfort is our priority.",
    cta: "Explore Fleet",
    ctaLink: "/routes",
    badge: "Modern Comfort",
    stats: [
      { label: "Modern Buses", value: "150+", icon: <Zap className="h-4 w-4" /> },
      { label: "On-Time Rate", value: "95%", icon: <Clock className="h-4 w-4" /> },
    ],
  },
  {
    id: 3,
    image: "/images/hero-3.jpg",
    title: "Connecting Communities",
    subtitle: "Ghana's Transport Network",
    description:
      "We connect every corner of Ghana, bringing communities together through reliable and affordable transport solutions.",
    cta: "Find Routes",
    ctaLink: "/routes",
    badge: "Community First",
    stats: [
      { label: "Cities Connected", value: "50+", icon: <MapPin className="h-4 w-4" /> },
      { label: "Daily Trips", value: "500+", icon: <ArrowRight className="h-4 w-4" /> },
    ],
  },
  {
    id: 4,
    image: "/images/hero-4.jpg",
    title: "Where Every Journey Begins",
    subtitle: "Bustling Transport Hubs",
    description:
      "From busy terminals to quiet stops, we're there when you need us. Experience the vibrant energy of Ghana's transport culture.",
    cta: "Track Live",
    ctaLink: "/tracking",
    badge: "Always Ready",
    stats: [
      { label: "Active Stations", value: "100+", icon: <MapPin className="h-4 w-4" /> },
      { label: "Customer Rating", value: "4.8★", icon: <Star className="h-4 w-4" /> },
    ],
  },
  {
    id: 5,
    image: "/images/hero-5.jpg",
    title: "Every Story Matters",
    subtitle: "Your Journey, Our Mission",
    description:
      "Behind every window is a story, a dream, a destination. We're honored to be part of your journey across beautiful Ghana.",
    cta: "Start Journey",
    ctaLink: "/auth/register",
    badge: "Stories Matter",
    stats: [
      { label: "Safe Trips", value: "1M+", icon: <Shield className="h-4 w-4" /> },
      { label: "Years Experience", value: "15+", icon: <Clock className="h-4 w-4" /> },
    ],
  },
]

export function HeroSlider() {
  const { user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const currentSlideData = heroSlides[currentSlide]

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={slide.image || "/placeholder.svg"} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="mb-6 animate-fade-in">
              <Badge variant="secondary" className="px-4 py-2 bg-white/10 text-white border-white/20">
                <Zap className="mr-2 h-4 w-4" />
                {currentSlideData.badge}
              </Badge>
            </div>

            {/* Main Content */}
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg md:text-xl text-white/80 font-medium mb-2">{currentSlideData.subtitle}</h2>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  {user ? (
                    <>
                      Welcome back,{" "}
                      <span className="text-ghana-gold">
                        {user.user_metadata?.full_name?.split(" ")[0] || "Traveler"}
                      </span>
                    </>
                  ) : (
                    currentSlideData.title
                  )}
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed">
                {currentSlideData.description}
              </p>

              {/* Stats */}
              {currentSlideData.stats && (
                <div className="flex flex-wrap gap-6">
                  {currentSlideData.stats.map((stat, index) => (
                    <div key={index} className="flex items-center space-x-2 text-white">
                      <div className="p-2 rounded-full bg-white/10">{stat.icon}</div>
                      <div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-white/70">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Search Bar */}
              <div className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Where do you want to go?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-16 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 focus:ring-2 focus:ring-ghana-gold"
                  />
                  <Button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-ghana-green hover:bg-ghana-green/90"
                    size="sm"
                    asChild
                  >
                    <Link href={`/routes?search=${searchQuery}`}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-ghana-green hover:bg-ghana-green/90 text-white" asChild>
                  <Link href={currentSlideData.ctaLink}>
                    {currentSlideData.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                {!user && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-black"
                    asChild
                  >
                    <Link href="/auth/register">Join GhanaTransit</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute inset-y-0 right-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          {isAutoPlaying ? "⏸️" : "▶️"}
        </Button>
      </div>
    </section>
  )
}
