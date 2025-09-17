"use client"

import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Bus,
  Users,
  MapPin,
  Star,
  Shield,
  Clock,
  Globe,
  Heart,
  Award,
  Target,
  Eye,
  Zap,
  ArrowRight,
} from "lucide-react"

const stats = [
  { label: "Happy Customers", value: "50,000+", icon: Users },
  { label: "Routes Covered", value: "200+", icon: MapPin },
  { label: "Cities Connected", value: "50+", icon: Globe },
  { label: "Years of Service", value: "15+", icon: Clock },
  { label: "Fleet Size", value: "150+", icon: Bus },
  { label: "Customer Rating", value: "4.8/5", icon: Star },
]

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Your safety is our top priority. All our buses undergo regular maintenance and safety checks.",
  },
  {
    icon: Heart,
    title: "Customer Care",
    description: "We treat every passenger like family, ensuring comfort and satisfaction on every journey.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Leveraging technology to provide smart, efficient, and modern transport solutions.",
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Making transport accessible to all Ghanaians with multilingual support and fair pricing.",
  },
]

const team = [
  {
    name: "Kwame Asante",
    role: "Chief Executive Officer",
    bio: "15+ years in transport industry, passionate about connecting Ghana through smart mobility.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Ama Serwaa",
    role: "Chief Technology Officer",
    bio: "Tech innovator focused on building world-class transport technology for Africa.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Kofi Mensah",
    role: "Head of Operations",
    bio: "Operations expert ensuring smooth and efficient transport services across Ghana.",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function AboutPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2">
              <Heart className="mr-2 h-4 w-4" />
              About GhanaTransit
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-ghana-green to-ghana-gold bg-clip-text text-transparent">
              Connecting Ghana, One Journey at a Time
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're more than just a transport company. We're the bridge that connects communities, families, and dreams
              across the beautiful nation of Ghana.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-full bg-ghana-green/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-ghana-green" />
                    </div>
                    <div className="text-2xl font-bold text-ghana-green mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2009, GhanaTransit began with a simple vision: to revolutionize public transportation in
                  Ghana by making it safer, more reliable, and accessible to everyone.
                </p>
                <p>
                  What started as a small fleet of 5 buses serving the Accra-Kumasi route has grown into Ghana's leading
                  smart transport platform, connecting over 50 cities and serving more than 50,000 satisfied customers.
                </p>
                <p>
                  Today, we're proud to be at the forefront of transport innovation in West Africa, combining
                  traditional Ghanaian hospitality with cutting-edge technology to create exceptional travel
                  experiences.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-ghana-green/20 to-ghana-gold/20 flex items-center justify-center">
                <div className="text-center">
                  <Bus className="h-16 w-16 text-ghana-green mx-auto mb-4" />
                  <p className="text-lg font-medium">15 Years of Excellence</p>
                  <p className="text-muted-foreground">Serving Ghana with Pride</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-ghana-green/10 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-ghana-green" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To provide safe, reliable, and affordable transportation services that connect communities across
                  Ghana while promoting economic growth and social development through innovative mobility solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-ghana-gold/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-ghana-gold" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To be West Africa's leading smart transport platform, setting the standard for excellence in public
                  transportation and contributing to a more connected, prosperous Ghana.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-ghana-green/10 to-ghana-gold/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-8 w-8 text-ghana-green" />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Leadership</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="hover:shadow-lg transition-all hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-ghana-green/20 to-ghana-gold/20 mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-12 w-12 text-ghana-green" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-ghana-green font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Awards & Recognition */}
          <Card className="mb-16 bg-gradient-to-r from-ghana-green/5 to-ghana-gold/5">
            <CardHeader className="text-center">
              <div className="h-16 w-16 rounded-full bg-ghana-gold/10 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-ghana-gold" />
              </div>
              <CardTitle className="text-2xl">Awards & Recognition</CardTitle>
              <CardDescription>Celebrating our achievements and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">Best Transport Service 2023</div>
                  <p className="text-sm text-muted-foreground">Ghana Transport Awards</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">Innovation in Mobility 2022</div>
                  <p className="text-sm text-muted-foreground">West Africa Tech Summit</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold mb-2">Customer Choice Award 2021</div>
                  <p className="text-sm text-muted-foreground">Ghana Business Excellence</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="text-center bg-gradient-to-r from-ghana-green to-ghana-gold text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-xl mb-8 opacity-90">
                Be part of Ghana's transport revolution. Experience the difference with GhanaTransit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/routes">
                    Book Your Trip
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-ghana-green"
                  asChild
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
