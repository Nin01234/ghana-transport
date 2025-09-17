"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { useSupabase } from "@/hooks/use-supabase"
import { notificationService } from "@/lib/notifications"
import { eventBus, localApi } from "@/lib/local-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  Phone,
  Download,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bus,
  Ticket,
  CreditCard,
  User,
  Award,
} from "lucide-react"

// Custom date formatter
const formatDate = (date: Date | string, formatStr = "PPP") => {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const options: Intl.DateTimeFormatOptions = {}

  if (formatStr === "PPP") {
    options.year = "numeric"
    options.month = "long"
    options.day = "numeric"
  }

  return dateObj.toLocaleDateString("en-US", options)
}

interface Booking {
  id: string
  booking_reference: string
  route_from: string
  route_to: string
  departure_date: string
  departure_time: string
  passengers: number
  class: string
  total_price: number
  status: "confirmed" | "completed" | "cancelled" | "pending"
  payment_method: string
  created_at: string
  bus_number?: string
  driver_name?: string
  driver_phone?: string
  seat_numbers?: string[]
}

// Sample bookings data
const sampleBookings: Booking[] = [
  {
    id: "1",
    booking_reference: "GH12345678",
    route_from: "Accra",
    route_to: "Kumasi",
    departure_date: new Date(Date.now() + 86400000).toISOString(),
    departure_time: "08:00",
    passengers: 2,
    class: "vip",
    total_price: 600,
    status: "confirmed",
    payment_method: "momo",
    created_at: new Date().toISOString(),
    bus_number: "GT-001",
    driver_name: "Kwame Asante",
    driver_phone: "+233509921758",
    seat_numbers: ["12A", "12B"],
  },
  {
    id: "2",
    booking_reference: "GH87654321",
    route_from: "Accra",
    route_to: "Cape Coast",
    departure_date: new Date(Date.now() - 86400000).toISOString(),
    departure_time: "10:00",
    passengers: 1,
    class: "standard",
    total_price: 100,
    status: "completed",
    payment_method: "card",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    bus_number: "GT-003",
    driver_name: "Kofi Mensah",
    driver_phone: "+233509921760",
    seat_numbers: ["8A"],
  },
  {
    id: "3",
    booking_reference: "GH11223344",
    route_from: "Kumasi",
    route_to: "Tamale",
    departure_date: new Date(Date.now() + 172800000).toISOString(),
    departure_time: "15:00",
    passengers: 1,
    class: "vip",
    total_price: 340,
    status: "confirmed",
    payment_method: "cash",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    bus_number: "GT-006",
    driver_name: "Yaw Osei",
    driver_phone: "+233509921763",
    seat_numbers: ["5A"],
  },
  {
    id: "4",
    booking_reference: "GH55667788",
    route_from: "Accra",
    route_to: "Ho",
    departure_date: new Date(Date.now() - 259200000).toISOString(),
    departure_time: "12:00",
    passengers: 3,
    class: "standard",
    total_price: 420,
    status: "completed",
    payment_method: "momo",
    created_at: new Date(Date.now() - 345600000).toISOString(),
    bus_number: "GT-004",
    driver_name: "Edem Kpodo",
    driver_phone: "+233509921761",
    seat_numbers: ["15A", "15B", "15C"],
  },
  {
    id: "5",
    booking_reference: "GH99887766",
    route_from: "Accra",
    route_to: "Takoradi",
    departure_date: new Date(Date.now() + 259200000).toISOString(),
    departure_time: "09:00",
    passengers: 2,
    class: "vip",
    total_price: 640,
    status: "confirmed",
    payment_method: "card",
    created_at: new Date(Date.now() - 43200000).toISOString(),
    bus_number: "GT-005",
    driver_name: "Akosua Boateng",
    driver_phone: "+233509921762",
    seat_numbers: ["3A", "3B"],
  },
]

export default function BookingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { supabase, checkSupabase } = useSupabase()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

  useEffect(() => {
    if (user) {
      // Render instantly with local data; background fetch will refine
      const local = localApi.getBookings(user.id, 100)
      setBookings(local as any)
      fetchBookings()
    } else {
      setBookings([])
      setLoading(false)
    }
  }, [user])

  // Realtime: reflect new bookings immediately via local event bus
  useEffect(() => {
    if (!user) return
    const off = eventBus.on<{ type: string; new: any }>(`bookings:${user.id}`, (payload) => {
      if (payload?.type === "INSERT" && payload.new) {
        setBookings((prev) => [payload.new, ...prev])
      }
    })
    return () => off()
  }, [user])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchQuery, statusFilter])

  const fetchBookings = async () => {
    if (!user) return
    
    if (!checkSupabase()) {
      // If Supabase is not configured, keep local data already shown
      const local = localApi.getBookings(user.id, 100)
      setBookings(local as any)
      return
    }

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching bookings:", error)
        const local = localApi.getBookings(user.id, 100)
        setBookings(local as any)
      } else {
        // Prefer DB data; if empty, use local in-memory; otherwise empty
        const local = localApi.getBookings(user.id, 100)
        const list = data && data.length > 0 ? data : (local as any)
        setBookings(list)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
      // Use sample data as fallback
      setBookings(sampleBookings)
      toast({
        title: "Using sample data",
        description: "Showing sample bookings for demonstration.",
      })
    } finally {
      // Do not toggle loading to avoid any loading UI; page already rendered
    }
  }

  const filterBookings = () => {
    // Enforce VIP-only bookings in history
    let filtered = bookings.filter((b) => b.class === "vip")

    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.booking_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.route_from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.route_to.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.bus_number?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }

  const cancelBooking = async (booking: Booking) => {
    try {
      if (supabase) {
        const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", booking.id)

        if (error) {
          console.warn("Database update failed, updating locally:", error)
        }
      }

      // Update local state regardless of database success
      setBookings(bookings.map((b) => (b.id === booking.id ? { ...b, status: "cancelled" as const } : b)))

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      })

      setShowCancelDialog(false)
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Cancellation Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  const removeBooking = async (booking: Booking) => {
    try {
      if (supabase) {
        const { error } = await supabase.from("bookings").delete().eq("id", booking.id)

        if (error) {
          console.warn("Database delete failed, updating locally:", error)
        }
      }

      // Update local state regardless of database success
      setBookings(bookings.filter((b) => b.id !== booking.id))

      // Send notification
      notificationService.tripUpdate(booking.booking_reference, "Booking removed from your account")

      toast({
        title: "Booking Removed",
        description: "Your booking has been removed successfully.",
      })

      setShowRemoveDialog(false)
    } catch (error) {
      console.error("Error removing booking:", error)
      toast({
        title: "Error",
        description: "Failed to remove booking. Please try again.",
        variant: "destructive",
      })
    }
  }

  const downloadTicket = (booking: Booking) => {
    const ticketContent = `
GHANATRANSIT E-TICKET
=====================

Booking Reference: ${booking.booking_reference}
Route: ${booking.route_from} → ${booking.route_to}
Date: ${formatDate(booking.departure_date)}
Time: ${booking.departure_time}
Passengers: ${booking.passengers}
Class: ${booking.class.toUpperCase()}
Bus: ${booking.bus_number || "TBA"}
Driver: ${booking.driver_name || "TBA"}
Seats: ${booking.seat_numbers?.join(", ") || "TBA"}
Total: ₵${booking.total_price.toFixed(2)}

Status: ${booking.status.toUpperCase()}
Payment: ${booking.payment_method.toUpperCase()}

IMPORTANT INFORMATION:
- Please arrive 30 minutes before departure
- Bring a valid ID for verification
- Contact driver: ${booking.driver_phone || "+233509921758"}

For support: manuel.young84@gmail.com
Support Phone: +233509921758

Thank you for choosing GhanaTransit!
    `

    const blob = new Blob([ticketContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ticket-${booking.booking_reference}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Ticket Downloaded",
      description: "Your e-ticket has been downloaded successfully.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const canCancelBooking = (booking: Booking) => {
    const departureTime = new Date(`${booking.departure_date}T${booking.departure_time}`)
    const now = new Date()
    const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    return booking.status === "confirmed" && hoursUntilDeparture > 2
  }

  // Always render immediately; background fetch will update list when ready

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation />

        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  My Bookings
                </h1>
                <p className="text-lg text-muted-foreground">Manage your travel bookings and tickets</p>
              </div>
              <Button onClick={fetchBookings} variant="outline" className="bg-white/80 backdrop-blur-sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>

            {/* Search and Filter */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by reference, route, or bus number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/50"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48 bg-white/50">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bookings</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <Card className="text-center p-12 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent>
                <Ticket className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  {bookings.length === 0 ? "No bookings yet" : "No bookings match your search"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {bookings.length === 0
                    ? "Start your journey by booking your first trip!"
                    : "Try adjusting your search criteria or filters."}
                </p>
                {bookings.length === 0 && (
                  <Button
                    onClick={() => (window.location.href = "/book")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Book Your First Trip
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Booking Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Bus className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">
                              {booking.route_from} → {booking.route_to}
                            </h3>
                            <p className="text-sm text-muted-foreground">Booking #{booking.booking_reference}</p>
                          </div>
                          <Badge className={`${getStatusColor(booking.status)} border`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(booking.departure_date)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{booking.departure_time}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Ticket className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {booking.passengers} passenger{booking.passengers > 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize">{booking.class}</span>
                          </div>
                        </div>

                        {booking.bus_number && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              <Bus className="h-3 w-3 mr-1" />
                              {booking.bus_number}
                            </Badge>
                            {booking.driver_name && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                <User className="h-3 w-3 mr-1" />
                                {booking.driver_name}
                              </Badge>
                            )}
                            {booking.seat_numbers && booking.seat_numbers.length > 0 && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                Seats: {booking.seat_numbers.join(", ")}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Price and Actions */}
                      <div className="lg:text-right space-y-4">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">₵{booking.total_price.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground flex items-center lg:justify-end">
                            <CreditCard className="h-3 w-3 mr-1" />
                            {(booking.payment_method || "momo").toUpperCase()}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowDetailsDialog(true)
                            }}
                            className="bg-white/50"
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadTicket(booking)}
                            className="bg-white/50"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                          {booking.driver_phone && booking.status === "confirmed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`tel:${booking.driver_phone}`, "_self")}
                              className="bg-green-50 text-green-700 border-green-200"
                            >
                              <Phone className="mr-2 h-4 w-4" />
                              Call Driver
                            </Button>
                          )}
                          {canCancelBooking(booking) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedBooking(booking)
                                setShowCancelDialog(true)
                              }}
                              className="bg-red-50 text-red-700 border-red-200"
                            >
                              Cancel
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setShowRemoveDialog(true)
                            }}
                            className="bg-gray-50 text-gray-700 border-gray-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Summary Stats */}
          {bookings.length > 0 && (
            <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">{bookings.length}</div>
                    <div className="text-sm text-muted-foreground">Total Bookings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {bookings.filter((b) => b.status === "completed").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {bookings.filter((b) => b.status === "confirmed").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Upcoming</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      ₵{bookings.reduce((sum, b) => sum + b.total_price, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>Complete information about your booking</DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Trip Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Reference:</span>
                        <span className="font-medium">{selectedBooking.booking_reference}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Route:</span>
                        <span className="font-medium">
                          {selectedBooking.route_from} → {selectedBooking.route_to}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">{formatDate(selectedBooking.departure_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{selectedBooking.departure_time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passengers:</span>
                        <span className="font-medium">{selectedBooking.passengers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Class:</span>
                        <span className="font-medium capitalize">{selectedBooking.class}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Bus & Driver</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Bus Number:</span>
                        <span className="font-medium">{selectedBooking.bus_number || "TBA"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Driver:</span>
                        <span className="font-medium">{selectedBooking.driver_name || "TBA"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Driver Phone:</span>
                        <span className="font-medium">{selectedBooking.driver_phone || "TBA"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Seats:</span>
                        <span className="font-medium">{selectedBooking.seat_numbers?.join(", ") || "TBA"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-medium">₵{selectedBooking.total_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span className="font-medium capitalize">{selectedBooking.payment_method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={`${getStatusColor(selectedBooking.status)} border`}>
                        {getStatusIcon(selectedBooking.status)}
                        <span className="ml-1 capitalize">{selectedBooking.status}</span>
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Booked On:</span>
                      <span className="font-medium">{formatDate(selectedBooking.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={() => downloadTicket(selectedBooking)} className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download Ticket
                  </Button>
                  {selectedBooking.driver_phone && selectedBooking.status === "confirmed" && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(`tel:${selectedBooking.driver_phone}`, "_self")}
                      className="flex-1"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Driver
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Cancel Booking Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this booking? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="font-medium">
                    {selectedBooking.route_from} → {selectedBooking.route_to}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(selectedBooking.departure_date)} at {selectedBooking.departure_time}
                  </div>
                  <div className="text-sm text-muted-foreground">Reference: {selectedBooking.booking_reference}</div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="flex-1">
                    Keep Booking
                  </Button>
                  <Button variant="destructive" onClick={() => cancelBooking(selectedBooking)} className="flex-1">
                    Cancel Booking
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Remove Booking Dialog */}
        <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remove Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently remove this booking? This action cannot be undone and the booking will be completely deleted.
              </DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="font-medium text-red-800">
                    {selectedBooking.route_from} → {selectedBooking.route_to}
                  </div>
                  <div className="text-sm text-red-600">
                    {formatDate(selectedBooking.departure_date)} at {selectedBooking.departure_time}
                  </div>
                  <div className="text-sm text-red-600">Reference: {selectedBooking.booking_reference}</div>
                  <div className="text-sm text-red-600 mt-2 font-medium">
                    ⚠️ This will permanently delete your booking
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowRemoveDialog(false)} className="flex-1">
                    Keep Booking
                  </Button>
                  <Button variant="destructive" onClick={() => removeBooking(selectedBooking)} className="flex-1">
                    Remove Permanently
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}
