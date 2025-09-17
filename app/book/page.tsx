"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useSupabase } from "@/hooks/use-supabase"
import { notificationService } from "@/lib/notifications"
import { localApi } from "@/lib/local-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  CalendarIcon,
  Users,
  Clock,
  CreditCard,
  Smartphone,
  Banknote,
  ArrowRight,
  Bus,
  Star,
  Wifi,
  Zap,
  Coffee,
  Shield,
  CheckCircle,
  User,
  Phone,
  Award,
} from "lucide-react"

// Custom date formatter
const formatDate = (date: Date, formatStr: string) => {
  const options: Intl.DateTimeFormatOptions = {}

  if (formatStr === "PPP") {
    options.year = "numeric"
    options.month = "long"
    options.day = "numeric"
  }

  return date.toLocaleDateString("en-US", options)
}

interface Driver {
  id: string
  name: string
  phone: string
  license: string
  rating: number
  experience: string
  photo: string
  languages: string[]
}

interface Route {
  id: string
  from: string
  to: string
  duration: string
  distance: string
  price: number
  vipPrice: number
  departures: string[]
  amenities: string[]
  rating: number
  busType: string
  driver: Driver
  busNumber: string
  availableSeats: number
  totalSeats: number
}

interface Booking {
  route: Route
  date: Date
  time: string
  passengers: number
  class: "standard" | "vip"
  totalPrice: number
}

// Real Ghana cities and routes
const ghanaRoutes: Route[] = [
  // Accra Routes
  {
    id: "1",
    from: "Accra",
    to: "Kumasi",
    duration: "4h 30m",
    distance: "250 km",
    price: 180,
    vipPrice: 300,
    departures: ["05:30", "06:30", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    amenities: ["WiFi", "AC", "Charging Port", "Refreshments", "TV", "Reclining Seats"],
    rating: 4.8,
    busType: "Luxury Coach",
    busNumber: "GT-001",
    availableSeats: 32,
    totalSeats: 45,
    driver: {
      id: "d1",
      name: "Kwame Asante",
      phone: "+233509921758",
      license: "GH-DL-2024-001234",
      rating: 4.9,
      experience: "8 years",
      photo: "/placeholder.svg?height=60&width=60",
      languages: ["English", "Twi", "Ga"],
    },
  },
  {
    id: "2",
    from: "Accra",
    to: "Tamale",
    duration: "8h 15m",
    distance: "600 km",
    price: 340,
    vipPrice: 480,
    departures: ["06:00", "09:00", "15:00", "20:00"],
    amenities: ["WiFi", "AC", "Meals", "Entertainment", "Reclining Seats", "Blankets"],
    rating: 4.6,
    busType: "Executive Coach",
    busNumber: "GT-002",
    availableSeats: 28,
    totalSeats: 50,
    driver: {
      id: "d2",
      name: "Ama Serwaa",
      phone: "+233509921759",
      license: "GH-DL-2024-005678",
      rating: 4.7,
      experience: "6 years",
      photo: "/placeholder.svg?height=60&width=60",
      languages: ["English", "Twi", "Dagbani"],
    },
  },
  {
    id: "3",
    from: "Accra",
    to: "Cape Coast",
    duration: "2h 45m",
    distance: "165 km",
    price: 100,
    vipPrice: 160,
    departures: ["06:00", "07:30", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00"],
    amenities: ["AC", "Charging Port", "Music System"],
    rating: 4.5,
    busType: "Standard Coach",
    busNumber: "GT-003",
    availableSeats: 35,
    totalSeats: 40,
    driver: {
      id: "d3",
      name: "Kofi Mensah",
      phone: "+233509921760",
      license: "GH-DL-2024-009876",
      rating: 4.8,
      experience: "10 years",
      photo: "/placeholder.svg?height=60&width=60",
      languages: ["English", "Fante", "Twi"],
    },
  },
  {
    id: "4",
    from: "Accra",
    to: "Ho",
    duration: "3h 20m",
    distance: "180 km",
    price: 140,
    vipPrice: 220,
    departures: ["07:00", "09:30", "12:00", "15:00", "17:30"],
    amenities: ["AC", "WiFi", "Charging Port", "Refreshments"],
    rating: 4.4,
    busType: "Luxury Coach",
    busNumber: "GT-004",
    availableSeats: 25,
    totalSeats: 42,
    driver: {
      id: "d4",
      name: "Edem Kpodo",
      phone: "+233509921761",
      license: "GH-DL-2024-012345",
      rating: 4.6,
      experience: "5 years",
      photo: "/placeholder.svg?height=60&width=60",
      languages: ["English", "Ewe", "Twi"],
    },
  },
  {
    id: "5",
    from: "Accra",
    to: "Takoradi",
    duration: "4h 10m",
    distance: "230 km",
    price: 200,
    vipPrice: 320,
    departures: ["06:30", "09:00", "12:30", "16:00", "19:00"],
    amenities: ["WiFi", "AC", "Refreshments", "TV", "Charging Port"],
    rating: 4.7,
    busType: "Executive Coach",
    busNumber: "GT-005",
    availableSeats: 30,
    totalSeats: 48,
    driver: {
      id: "d5",
      name: "Akosua Boateng",
      phone: "+233509921762",
      license: "GH-DL-067890",
      rating: 4.8,
      experience: "7 years",
      photo: "/placeholder.svg?height=60&width=60",
      languages: ["English", "Twi", "Fante"],
    },
  },
  // Kumasi Routes
  {
    id: "6",
    from: "Kumasi",
    to: "Tamale",
    duration: "5h 30m",
    distance: "350 km",
    price: 220,
    vipPrice: 340,
    departures: ["07:00", "11:00", "15:00", "19:00"],
    amenities: ["WiFi", "AC", "Refreshments", "Reclining Seats"],
    rating: 4.7,
    busType: "Luxury Coach",
    busNumber: "GT-006",
    availableSeats: 22,
    totalSeats: 40,
    driver: {
      id: "d6",
      name: "Yaw Osei",
      phone: "+233509921763",
      license: "GH-DL-098765",
      rating: 4.9,
      experience: "12 years",
      photo: "/placeholder.svg?height=60&width=60",
      languages: ["English", "Twi", "Dagbani"],
    },
  },
  {
    id: "7",
    from: "Kumasi",
    to: "Sunyani",
    duration: "2h 30m",
    distance: "120 km",
    price: 120,
    vipPrice: 180,
    departures: ["08:00", "10:30", "13:00", "16:00", "18:30"],
    amenities: ["AC", "Charging Port", "Music System"],
    rating: 4.3,
    busType: "Standard Coach",
    busNumber: "GT-007",
    availableSeats: 38,
    totalSeats: 40,
    driver: {
      id: "d7",
      name: "Abena Owusu",
      phone: "+233509921764",
      license: "GH-DL-054321",
      rating: 4.5,
      experience: "4 years",
      photo: "/placeholder.svg?height=60&width=60",
      languages: ["English", "Twi"],
    },
  },
  // Additional Routes
  {
    id: "8",
    from: "Cape Coast",
    to: "Takoradi",
    duration: "1h 45m",
    distance: "80 km",
    price: 80,
    vipPrice: 120,
    departures: ["07:30", "10:00", "13:30", "16:30", "19:00"],
    amenities: ["AC", "Music System"],
    rating: 4.2,
    busType: "Standard Coach",
    busNumber: "GT-008",
    availableSeats: 35,
    totalSeats: 38,
    driver: {
      id: "d8",
      name: "Kweku Antwi",
      phone: "+233509921765",
      license: "GH-DL-087654",
      rating: 4.4,
      experience: "6 years",
      photo: "/placeholder.svg?height=60&width=60",
      languages: ["English", "Fante"],
    },
  },
  {
    id: "9",
    from: "Tamale",
    to: "Bolgatanga",
    duration: "3h 15m",
    distance: "160 km",
    price: 160,
    vipPrice: 240,
    departures: ["08:00", "12:00", "16:00"],
    amenities: ["AC", "WiFi", "Charging Port"],
    rating: 4.1,
    busType: "Luxury Coach",
    busNumber: "GT-009",
    availableSeats: 20,
    totalSeats: 35,
    driver: {
      id: "d9",
      name: "Mohammed Alhassan",
      phone: "+233509921766",
      license: "GH-DL-076543",
      rating: 4.3,
      experience: "9 years",
      photo: "/placeholder.svg?height=60&width=60",
      languages: ["English", "Dagbani", "Hausa"],
    },
  },
  {
    id: "10",
    from: "Ho",
    to: "Hohoe",
    duration: "1h 30m",
    distance: "65 km",
    price: 18,
    vipPrice: 25,
    departures: ["09:00", "12:00", "15:00", "18:00"],
    amenities: ["AC", "Music System"],
    rating: 4.0,
    busType: "Standard Coach",
    busNumber: "GT-010",
    availableSeats: 30,
    totalSeats: 32,
    driver: {
      id: "d10",
      name: "Selorm Agbeko",
      phone: "+233509921767",
      license: "GH-DL-065432",
      rating: 4.2,
      experience: "3 years",
      photo: "/placeholder.svg?height=60&width=60",
      languages: ["English", "Ewe"],
    },
  },
]

// All major Ghana cities
const ghanaCities = [
  "Accra",
  "Kumasi",
  "Tamale",
  "Cape Coast",
  "Ho",
  "Takoradi",
  "Sunyani",
  "Koforidua",
  "Wa",
  "Bolgatanga",
  "Techiman",
  "Obuasi",
  "Tema",
  "Kasoa",
  "Nkawkaw",
  "Hohoe",
  "Dunkwa",
  "Tarkwa",
  "Axim",
  "Elmina",
  "Winneba",
  "Saltpond",
  "Agona Swedru",
  "Nsawam",
  "Suhum",
  "Akim Oda",
  "Begoro",
]

const paymentMethods = [
  {
    id: "momo",
    name: "Mobile Money",
    description: "MTN, Vodafone, AirtelTigo",
    icon: Smartphone,
    fee: 0,
  },
  {
    id: "card",
    name: "Credit/Debit Card",
    description: "Visa, Mastercard",
    icon: CreditCard,
    fee: 2.5,
  },
  {
    id: "cash",
    name: "Pay at Station",
    description: "Cash payment on arrival",
    icon: Banknote,
    fee: 0,
  },
]

export default function BookPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { supabase: sbClient, checkSupabase } = useSupabase()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: new Date(),
    passengers: 1,
  })
  const [availableRoutes, setAvailableRoutes] = useState<Route[]>([])
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedClass, setSelectedClass] = useState<"standard" | "vip">("vip")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentDetails, setPaymentDetails] = useState({
    momoNumber: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showDriverDialog, setShowDriverDialog] = useState(false)

  const searchRoutes = () => {
    if (!searchData.from || !searchData.to) {
      toast({
        title: "Please select departure and destination",
        variant: "destructive",
      })
      return
    }

    if (searchData.from === searchData.to) {
      toast({
        title: "Please select different departure and destination",
        variant: "destructive",
      })
      return
    }

    const filtered = ghanaRoutes.filter(
      (route) =>
        route.from.toLowerCase() === searchData.from.toLowerCase() &&
        route.to.toLowerCase() === searchData.to.toLowerCase(),
    )

    // Enforce VIP-only routes in booking flow (assume VIP routes are those with higher vipPrice and rich amenities)
    const vipOnly = filtered.filter((route) => route.vipPrice > route.price)

    setAvailableRoutes(vipOnly)
    setStep(2)

    if (filtered.length === 0) {
      toast({
        title: "No direct routes found",
        description: "Try searching for alternative routes or contact support for assistance.",
      })
    }
  }

  const selectRoute = (route: Route, time: string) => {
    setSelectedRoute(route)
    setSelectedTime(time)

    const totalPrice = (selectedClass === "vip" ? route.vipPrice : route.price) * searchData.passengers

    setBooking({
      route,
      date: searchData.date,
      time,
      passengers: searchData.passengers,
      class: selectedClass,
      totalPrice,
    })

    setStep(3)
  }

  const processPayment = async () => {
    if (!paymentMethod) {
      toast({
        title: "Please select a payment method",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Generate booking reference (demo)
      const bookingReference = `GH${Date.now().toString().slice(-8)}`

      // Build booking payload
      const bookingData = {
        user_id: user!.id,
        booking_reference: bookingReference,
        route_from: booking!.route.from,
        route_to: booking!.route.to,
        departure_date: booking!.date.toISOString(),
        departure_time: booking!.time,
        passengers: booking!.passengers,
        class: booking!.class,
        total_price: booking!.totalPrice,
        payment_method: paymentMethod,
        status: "confirmed" as const,
        bus_number: booking!.route.busNumber,
        driver_name: booking!.route.driver.name,
        driver_phone: booking!.route.driver.phone,
        seat_numbers: Array.from(
          { length: booking!.passengers },
          (_, i) => `${Math.floor(Math.random() * 40) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
        ),

        // Required legacy fields
        route_id: selectedRoute!.id,
        bus_id: selectedRoute!.id,
        seat_number: `${Math.floor(Math.random() * 40) + 1}A`,
        travel_date: booking!.date.toISOString(),
        fare_amount: booking!.totalPrice,
        payment_status: "completed" as const,
        booking_status: "confirmed" as const,
      }

      // Emit immediate local updates (instant UX)
      try {
        localApi.addBooking(user!.id, {
          booking_reference: bookingReference,
          route_from: booking!.route.from,
          route_to: booking!.route.to,
          departure_date: booking!.date.toISOString(),
          departure_time: booking!.time,
          passengers: booking!.passengers,
          class: booking!.class,
          total_price: booking!.totalPrice,
          status: "confirmed",
          payment_method: paymentMethod,
          bus_number: booking!.route.busNumber,
          driver_name: booking!.route.driver.name,
          driver_phone: booking!.route.driver.phone,
          seat_numbers: Array.from(
            { length: booking!.passengers },
            () => `${Math.floor(Math.random() * 40) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
          ),
        })
        localApi.addActivity(user!.id, {
          activity_type: "booking_created",
          description: `Booked ${booking!.route.from} to ${booking!.route.to}`,
        })
        localApi.addPoints(user!.id, Math.floor(booking!.totalPrice * 0.1))
      } catch (e) {
        // Non-fatal: local real-time convenience layer
        console.warn("Local update failed (non-fatal):", e)
      }

      // Close dialog and jump to confirmation immediately (demo mode)
      setShowPaymentDialog(false)
      setStep(4)
      // Navigate to My Bookings so the new booking is visible immediately
      router.push("/bookings")

      const points = Math.floor(booking!.totalPrice * 0.1)

      // Fire-and-forget DB writes in background (non-blocking)
      ;(async () => {
        try {
          if (checkSupabase() && sbClient) {
            const { error: bookingError } = await sbClient.from("bookings").insert(bookingData)
            if (bookingError) console.warn("Background booking insert failed (demo mode):", bookingError)
            const { error: pointsError } = await sbClient
              .from("profiles")
              .update({ loyalty_points: points })
              .eq("id", user!.id)
            if (pointsError) console.warn("Background points update failed:", pointsError)
            const { error: activityError } = await sbClient.from("user_activities").insert({
              user_id: user!.id,
              activity_type: "booking_created",
              description: `Booked ${booking!.route.from} to ${booking!.route.to}`,
              metadata: {
                booking_reference: bookingReference,
                route_from: booking!.route.from,
                route_to: booking!.route.to,
                total_price: booking!.totalPrice,
              },
            })
            if (activityError) console.warn("Background activity insert failed:", activityError)
          }
        } catch (e) {
          console.warn("Background DB sync failed (non-fatal):", e)
        }
      })()

      // Send notification
      notificationService.bookingConfirmed({
        reference: bookingReference,
        from: booking!.route.from,
        to: booking!.route.to,
        date: booking!.date.toLocaleDateString(),
        time: booking!.time,
        passengers: booking!.passengers,
        totalPrice: booking!.totalPrice,
        isVIP: booking!.class === "vip"
      })

      toast({
        title: "Booking Confirmed!",
        description: `Your booking reference is ${bookingReference}. ${points > 0 ? `You earned ${points} loyalty points!` : ""}`,
      })
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setShowPaymentDialog(false)
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "WiFi":
        return <Wifi className="h-4 w-4" />
      case "AC":
        return <Zap className="h-4 w-4" />
      case "Charging Port":
        return <Zap className="h-4 w-4" />
      case "Refreshments":
        return <Coffee className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation />

        <div className="container py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step >= stepNumber ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                  </div>
                  {stepNumber < 4 && <ArrowRight className="h-5 w-5 mx-2 text-gray-400" />}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {step === 1 && "Search Routes"}
                  {step === 2 && "Select Route"}
                  {step === 3 && "Payment"}
                  {step === 4 && "Confirmation"}
                </p>
              </div>
            </div>
          </div>

          {/* Step 1: Search */}
          {step === 1 && (
            <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Book Your Journey
                </CardTitle>
                <CardDescription className="text-lg">
                  Find and book the perfect bus for your travel needs across Ghana
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="from" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      From
                    </Label>
                    <Select
                      value={searchData.from}
                      onValueChange={(value) => setSearchData({ ...searchData, from: value })}
                    >
                      <SelectTrigger className="bg-white/50">
                        <SelectValue placeholder="Select departure city" />
                      </SelectTrigger>
                      <SelectContent>
                        {ghanaCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      To
                    </Label>
                    <Select
                      value={searchData.to}
                      onValueChange={(value) => setSearchData({ ...searchData, to: value })}
                    >
                      <SelectTrigger className="bg-white/50">
                        <SelectValue placeholder="Select destination city" />
                      </SelectTrigger>
                      <SelectContent>
                        {ghanaCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start bg-white/50">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formatDate(searchData.date, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={searchData.date}
                          onSelect={(date) => date && setSearchData({ ...searchData, date })}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Passengers
                    </Label>
                    <Select
                      value={searchData.passengers.toString()}
                      onValueChange={(value) => setSearchData({ ...searchData, passengers: Number.parseInt(value) })}
                    >
                      <SelectTrigger className="bg-white/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Passenger" : "Passengers"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={searchRoutes}
                  className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                >
                  Search Routes
                </Button>

                {/* Popular Routes */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Popular Routes</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { from: "Accra", to: "Kumasi" },
                      { from: "Accra", to: "Tamale" },
                      { from: "Accra", to: "Cape Coast" },
                      { from: "Kumasi", to: "Tamale" },
                    ].map((route, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchData({ ...searchData, from: route.from, to: route.to })}
                        className="text-xs"
                      >
                        {route.from} → {route.to}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Route Selection */}
          {step === 2 && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Available Routes</h2>
                  <p className="text-muted-foreground">
                    {searchData.from} → {searchData.to} • {formatDate(searchData.date, "PPP")} • {searchData.passengers}{" "}
                    passenger{searchData.passengers > 1 ? "s" : ""}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Modify Search
                </Button>
              </div>

              {availableRoutes.length === 0 ? (
                <Card className="text-center p-12">
                  <CardContent>
                    <Bus className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No direct routes found</h3>
                    <p className="text-muted-foreground mb-4">
                      We don't have direct routes for this journey, but we can help you find alternatives.
                    </p>
                    <div className="space-y-2">
                      <Button onClick={() => setStep(1)}>Try Different Cities</Button>
                      <p className="text-sm text-muted-foreground">
                        Or contact support at +233509921758 for assistance
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Class Selection */}
                  <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Select Class</h3>
                      <RadioGroup value={selectedClass} onValueChange={() => setSelectedClass("vip")}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="vip" id="vip" />
                          <Label htmlFor="vip">VIP Class - Premium amenities with extra comfort</Label>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>

                  {availableRoutes.map((route) => (
                    <Card
                      key={route.id}
                      className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-4 mb-2">
                              <h3 className="text-xl font-semibold">
                                {route.from} → {route.to}
                              </h3>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {route.busType}
                              </Badge>
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                {route.busNumber}
                              </Badge>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                <span className="text-sm font-medium">{route.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {route.duration}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {route.distance}
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {route.availableSeats}/{route.totalSeats} seats available
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {route.amenities.map((amenity) => (
                                <Badge key={amenity} variant="outline" className="text-xs">
                                  {getAmenityIcon(amenity)}
                                  <span className="ml-1">{amenity}</span>
                                </Badge>
                              ))}
                            </div>
                            {/* Driver Info */}
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <img
                                src={route.driver.photo || "/placeholder.svg"}
                                alt={route.driver.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{route.driver.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    <Award className="h-3 w-3 mr-1" />
                                    {route.driver.experience}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span>License: {route.driver.license}</span>
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                    {route.driver.rating}
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedRoute(route)
                                  setShowDriverDialog(true)
                                }}
                              >
                                <User className="h-4 w-4 mr-1" />
                                View Driver
                              </Button>
                            </div>
                          </div>
                          <div className="text-right ml-6">
                            <div className="text-2xl font-bold text-blue-600">
                              ₵
                              {(
                                (selectedClass === "vip" ? route.vipPrice : route.price) * searchData.passengers
                              ).toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ₵{(selectedClass === "vip" ? route.vipPrice : route.price).toFixed(2)} per person
                            </div>
                            {selectedClass === "vip" && (
                              <div className="text-xs text-green-600 mt-1">
                                +₵{(route.vipPrice - route.price).toFixed(2)} for VIP upgrade
                              </div>
                            )}
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div>
                          <h4 className="font-medium mb-3">Available Departure Times</h4>
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {route.departures.map((time) => (
                              <Button
                                key={time}
                                variant="outline"
                                size="sm"
                                onClick={() => selectRoute(route, time)}
                                className="hover:bg-blue-50 hover:border-blue-300"
                                disabled={route.availableSeats < searchData.passengers}
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                          {route.availableSeats < searchData.passengers && (
                            <p className="text-sm text-red-600 mt-2">
                              Not enough seats available for {searchData.passengers} passengers
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && booking && (
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Booking Summary */}
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Route:</span>
                      <span className="font-medium">
                        {booking.route.from} → {booking.route.to}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span className="font-medium">{formatDate(booking.date, "PPP")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className="font-medium">{booking.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bus:</span>
                      <span className="font-medium">{booking.route.busNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Driver:</span>
                      <span className="font-medium">{booking.route.driver.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passengers:</span>
                      <span className="font-medium">{booking.passengers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Class:</span>
                      <span className="font-medium capitalize">{booking.class}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>₵{booking.totalPrice.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      {paymentMethods.map((method) => {
                        const Icon = method.icon
                        return (
                          <div
                            key={method.id}
                            className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50"
                          >
                            <RadioGroupItem value={method.id} id={method.id} />
                            <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                              <div className="flex items-center space-x-3">
                                <Icon className="h-6 w-6 text-blue-600" />
                                <div>
                                  <div className="font-medium">{method.name}</div>
                                  <div className="text-sm text-muted-foreground">{method.description}</div>
                                  {method.fee > 0 && (
                                    <div className="text-xs text-orange-600">+{method.fee}% processing fee</div>
                                  )}
                                </div>
                              </div>
                            </Label>
                          </div>
                        )
                      })}
                    </RadioGroup>

                    <Button
                      onClick={() => setShowPaymentDialog(true)}
                      disabled={!paymentMethod}
                      className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      Proceed to Payment
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <Card className="max-w-2xl mx-auto text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-12">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-green-600">Booking Confirmed!</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Your journey has been successfully booked. You'll receive a confirmation SMS and email shortly.
                </p>
                <div className="space-y-4 mb-8">
                  <Button className="w-full" onClick={() => router.push("/bookings")}>
                    View My Bookings
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => setStep(1)}>
                    Book Another Trip
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Driver Details Dialog */}
        <Dialog open={showDriverDialog} onOpenChange={setShowDriverDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Driver Information</DialogTitle>
              <DialogDescription>Professional driver details and credentials</DialogDescription>
            </DialogHeader>
            {selectedRoute && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedRoute.driver.photo || "/placeholder.svg"}
                    alt={selectedRoute.driver.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{selectedRoute.driver.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedRoute.driver.rating}</span>
                      <span className="text-muted-foreground">rating</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License Number:</span>
                    <span className="font-medium">{selectedRoute.driver.license}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="font-medium">{selectedRoute.driver.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">{selectedRoute.driver.phone}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Languages:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedRoute.driver.languages.map((lang) => (
                        <Badge key={lang} variant="outline" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`tel:${selectedRoute.driver.phone}`, "_self")}
                    className="flex-1"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call Driver
                  </Button>
                  <Button onClick={() => setShowDriverDialog(false)} className="flex-1">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
              <DialogDescription>Total: ₵{booking?.totalPrice.toFixed(2)}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {paymentMethod === "momo" && (
                <div className="space-y-2">
                  <Label htmlFor="momoNumber">Mobile Money Number</Label>
                  <Input
                    id="momoNumber"
                    placeholder="0XX XXX XXXX"
                    value={paymentDetails.momoNumber}
                    onChange={(e) => setPaymentDetails({ ...paymentDetails, momoNumber: e.target.value })}
                  />
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentDetails.expiryDate}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "cash" && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    You can pay cash at the station. Please arrive 30 minutes before departure.
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowPaymentDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={processPayment} disabled={loading} className="flex-1">
                  {loading ? "Processing..." : "Pay Now"}
                </Button>
              </div>
              
              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Processing your payment...</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}
