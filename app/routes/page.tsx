"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { ModernMap } from "@/components/modern-map"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, MapPin, Clock, Users, Star, ArrowRight, Calendar, SortAsc, Zap, Wifi, Car } from "lucide-react"

interface Route {
  id: string
  name: string
  origin: string
  destination: string
  duration: string
  distance: string
  price: number
  rating: number
  nextDeparture: string
  availableSeats: number
  totalSeats: number
  amenities: string[]
  operator: string
  busType: "standard" | "luxury" | "vip"
  coordinates: {
    origin: [number, number]
    destination: [number, number]
  }
}

const ghanaRoutes: Route[] = [
  {
    id: "1",
    name: "Accra Express",
    origin: "Accra",
    destination: "Kumasi",
    duration: "4h 30m",
    distance: "250 km",
    price: 180,
    rating: 4.8,
    nextDeparture: "08:30 AM",
    availableSeats: 12,
    totalSeats: 45,
    amenities: ["WiFi", "AC", "Charging Port", "Refreshments"],
    operator: "VIP Transport",
    busType: "luxury",
    coordinates: {
      origin: [-0.1969, 5.6037],
      destination: [-1.6244, 6.6885],
    },
  },
  {
    id: "2",
    name: "Northern Link",
    origin: "Accra",
    destination: "Tamale",
    duration: "8h 15m",
    distance: "600 km",
    price: 340,
    rating: 4.6,
    nextDeparture: "06:00 AM",
    availableSeats: 8,
    totalSeats: 50,
    amenities: ["WiFi", "AC", "Meals", "Entertainment"],
    operator: "Metro Mass",
    busType: "vip",
    coordinates: {
      origin: [-0.1969, 5.6037],
      destination: [-0.8393, 9.4034],
    },
  },
  {
    id: "3",
    name: "Coastal Cruiser",
    origin: "Accra",
    destination: "Cape Coast",
    duration: "2h 45m",
    distance: "165 km",
    price: 140,
    rating: 4.7,
    nextDeparture: "10:15 AM",
    availableSeats: 18,
    totalSeats: 40,
    amenities: ["AC", "Charging Port"],
    operator: "STC Coaches",
    busType: "standard",
    coordinates: {
      origin: [-0.1969, 5.6037],
      destination: [-1.2466, 5.1053],
    },
  },
  {
    id: "4",
    name: "Eastern Express",
    origin: "Accra",
    destination: "Ho",
    duration: "3h 20m",
    distance: "180 km",
    price: 160,
    rating: 4.5,
    nextDeparture: "09:00 AM",
    availableSeats: 15,
    totalSeats: 42,
    amenities: ["AC", "WiFi", "Charging Port"],
    operator: "Eastern Transport",
    busType: "luxury",
    coordinates: {
      origin: [-0.1969, 5.6037],
      destination: [0.472, 6.611],
    },
  },
  {
    id: "5",
    name: "Western Route",
    origin: "Accra",
    destination: "Takoradi",
    duration: "4h 10m",
    distance: "230 km",
    price: 200,
    rating: 4.4,
    nextDeparture: "07:30 AM",
    availableSeats: 20,
    totalSeats: 48,
    amenities: ["AC", "WiFi", "Refreshments"],
    operator: "Western Express",
    busType: "luxury",
    coordinates: {
      origin: [-0.1969, 5.6037],
      destination: [-1.7533, 4.8974],
    },
  },
  {
    id: "6",
    name: "Brong Ahafo Express",
    origin: "Kumasi",
    destination: "Sunyani",
    duration: "2h 30m",
    distance: "120 km",
    price: 120,
    rating: 4.3,
    nextDeparture: "11:00 AM",
    availableSeats: 25,
    totalSeats: 40,
    amenities: ["AC", "Charging Port"],
    operator: "Brong Transport",
    busType: "standard",
    coordinates: {
      origin: [-1.6244, 6.6885],
      destination: [-2.3265, 7.3386],
    },
  },
]

export default function RoutesPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [routes, setRoutes] = useState<Route[]>(ghanaRoutes)
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>(ghanaRoutes)
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("search") || "")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [travelDate, setTravelDate] = useState("")
  const [sortBy, setSortBy] = useState("price")
  const [busType, setBusType] = useState("vip")
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    filterAndSortRoutes()
  }, [searchQuery, origin, destination, sortBy, busType])

  // Dynamic route updates every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateRoutesDynamically()
    }, 60000) // 60 seconds

    return () => clearInterval(interval)
  }, [])

  const updateRoutesDynamically = () => {
    setRoutes(prevRoutes => 
      prevRoutes.map(route => ({
        ...route,
        availableSeats: Math.max(0, Math.min(route.totalSeats, 
          route.availableSeats + Math.floor(Math.random() * 6) - 3)), // Random seat changes
        nextDeparture: generateNextDeparture(route.nextDeparture),
        price: Math.max(route.price * 0.8, Math.min(route.price * 1.2, 
          route.price + Math.floor(Math.random() * 20) - 10)), // Price fluctuations
        rating: Math.max(4.0, Math.min(5.0, 
          route.rating + (Math.random() * 0.2) - 0.1)), // Rating changes
      }))
    )
    setLastUpdate(new Date())
    
    toast({
      title: "Routes Updated",
      description: "Route availability and pricing have been updated.",
    })
  }

  const generateNextDeparture = (currentDeparture: string) => {
    const [time, period] = currentDeparture.split(" ")
    const [hours, minutes] = time.split(":")
    let hour = parseInt(hours)
    let minute = parseInt(minutes)
    let newPeriod = period
    
    // Add random time between 15-45 minutes
    const randomMinutes = Math.floor(Math.random() * 30) + 15
    minute += randomMinutes
    
    if (minute >= 60) {
      hour += Math.floor(minute / 60)
      minute = minute % 60
    }
    
    if (hour >= 12) {
      hour = hour % 12 || 12
      newPeriod = hour >= 12 ? "PM" : "AM"
    }
    
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${newPeriod}`
  }

  const filterAndSortRoutes = () => {
    let filtered = routes

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (route) =>
          route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
          route.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by origin
    if (origin) {
      filtered = filtered.filter((route) => route.origin.toLowerCase().includes(origin.toLowerCase()))
    }

    // Filter by destination
    if (destination) {
      filtered = filtered.filter((route) => route.destination.toLowerCase().includes(destination.toLowerCase()))
    }

    // Enforce VIP-only routes
    filtered = filtered.filter((route) => route.busType === "vip")

    // Sort routes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price
        case "duration":
          return Number.parseInt(a.duration) - Number.parseInt(b.duration)
        case "rating":
          return b.rating - a.rating
        case "departure":
          return a.nextDeparture.localeCompare(b.nextDeparture)
        default:
          return 0
      }
    })

    setFilteredRoutes(filtered)
  }

  const handleSearch = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      filterAndSortRoutes()
      setLoading(false)
      toast({
        title: "Routes Updated",
        description: `Found ${filteredRoutes.length} routes matching your criteria.`,
      })
    }, 1000)
  }

  const handleBookNow = (route: Route) => {
    toast({
      title: "Booking Initiated",
      description: `Starting booking process for ${route.name}`,
    })
    // In a real app, this would navigate to booking page
    console.log("Booking route:", route)
  }

  const getBusTypeColor = (type: string) => {
    switch (type) {
      case "vip":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "luxury":
        return "bg-gold-100 text-gold-800 border-gold-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-3 w-3" />
      case "ac":
        return <Zap className="h-3 w-3" />
      case "charging port":
        return <Car className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container py-6">
          {/* Enhanced Search Header */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-ghana-green to-ghana-gold bg-clip-text text-transparent">
                Find Your Perfect Route
              </h1>
              <p className="text-lg text-muted-foreground">Discover comfortable and reliable transport across Ghana</p>
            </div>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                  <div className="space-y-2">
                    <Label htmlFor="origin">From</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="origin"
                        placeholder="Origin city"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">To</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="destination"
                        placeholder="Destination city"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Travel Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="date"
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="busType">Bus Type</Label>
                    <Select value={busType} onValueChange={setBusType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vip">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sort">Sort By</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Price (Low to High)</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="departure">Departure Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button onClick={handleSearch} className="w-full" disabled={loading}>
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Search className="mr-2 h-4 w-4" />
                      )}
                      {loading ? "Searching..." : "Search"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Enhanced Routes List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {filteredRoutes.length} route{filteredRoutes.length !== 1 ? "s" : ""} found
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <SortAsc className="mr-2 h-4 w-4" />
                  Sort & Filter
                </Button>
              </div>

              {filteredRoutes.map((route) => (
                <Card key={route.id} className="hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-xl">{route.name}</h3>
                          <Badge className={getBusTypeColor(route.busType)}>{route.busType.toUpperCase()}</Badge>
                        </div>
                        <p className="text-muted-foreground">{route.operator}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600">₵{route.price}</div>
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {route.rating}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {route.origin} → {route.destination}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{route.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{route.availableSeats} seats available</span>
                      </div>
                      <div className="text-sm">
                        Next: <span className="font-medium">{route.nextDeparture}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {route.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary" className="text-xs flex items-center space-x-1">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {route.distance} • {route.availableSeats}/{route.totalSeats} seats
                      </div>
                      <div className="space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{route.name}</DialogTitle>
                              <DialogDescription>
                                {route.origin} to {route.destination}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-medium mb-3">Route Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>Duration: {route.duration}</div>
                                    <div>Distance: {route.distance}</div>
                                    <div>Operator: {route.operator}</div>
                                    <div>Rating: {route.rating}/5</div>
                                    <div>Bus Type: {route.busType}</div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-3">Amenities</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {route.amenities.map((amenity) => (
                                      <Badge
                                        key={amenity}
                                        variant="outline"
                                        className="text-xs flex items-center space-x-1"
                                      >
                                        {getAmenityIcon(amenity)}
                                        <span>{amenity}</span>
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Separator />
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-3xl font-bold text-ghana-green">₵{route.price}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {route.availableSeats} seats available
                                  </div>
                                </div>
                                <Button size="lg" onClick={() => handleBookNow(route)}>
                                  Book Now
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" onClick={() => handleBookNow(route)}>
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredRoutes.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No routes found</h3>
                    <p className="text-muted-foreground mb-6">
                      Try adjusting your search criteria or check back later for new routes.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("")
                        setOrigin("")
                        setDestination("")
                        setBusType("all")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Enhanced Map Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Route Map</CardTitle>
                  <CardDescription>Interactive map showing available routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ModernMap
                    locations={filteredRoutes.map((route) => ({
                      id: route.id,
                      name: route.origin,
                      coordinates: route.coordinates.origin,
                      type: "station" as const,
                    }))}
                    onLocationSelect={(location) => {
                      const route = filteredRoutes.find((r) => r.id === location.id)
                      if (route) setSelectedRoute(route)
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Destinations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {["Kumasi", "Tamale", "Cape Coast", "Ho", "Sunyani", "Takoradi"].map((city) => (
                    <Button
                      key={city}
                      variant="ghost"
                      className="w-full justify-start hover:bg-ghana-green/10"
                      onClick={() => setDestination(city)}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {city}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Routes</span>
                    <span className="font-medium">{routes.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Price</span>
                    <span className="font-medium">
                      ₵{Math.round(routes.reduce((sum, r) => sum + r.price, 0) / routes.length)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Available Seats</span>
                    <span className="font-medium">{routes.reduce((sum, r) => sum + r.availableSeats, 0)}</span>
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
