"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { ModernMap } from "@/components/modern-map"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MapPin,
  Users,
  NavigationIcon,
  AlertTriangle,
  CheckCircle,
  Bus,
  Search,
  RefreshCw,
  Phone,
  MessageSquare,
  Clock,
  Zap,
  User,
  Star,
  Wifi,
  Shield,
  Map,
  ExternalLink,
} from "lucide-react"

interface LiveBus {
  id: string
  busNumber: string
  route: string
  currentLocation: string
  nextStop: string
  eta: string
  occupancy: number
  maxCapacity: number
  status: "on-time" | "delayed" | "arrived" | "boarding"
  speed: number
  progress: number
  driver: {
    name: string
    phone: string
    rating: number
    avatar: string
  }
  coordinates: [number, number]
  lastUpdate: Date
  amenities: string[]
  temperature: number
  wifiStrength: number
  isVIP: boolean
}

interface VIPStation {
  id: string
  name: string
  city: string
  coordinates: [number, number]
  address: string
  phone: string
  amenities: string[]
  rating: number
  isOperational: boolean
}

// Ghana VIP Bus Stations
const ghanaVIPStations: VIPStation[] = [
  {
    id: "1",
    name: "VIP Bus Terminal - Accra",
    city: "Accra",
    coordinates: [-0.1969, 5.6037],
    address: "Ring Road Central, Accra, Ghana",
    phone: "+233302123456",
    amenities: ["WiFi", "AC", "Restaurant", "ATM", "Security", "VIP Lounge"],
    rating: 4.8,
    isOperational: true,
  },
  {
    id: "2",
    name: "VIP Bus Terminal - Kumasi",
    city: "Kumasi",
    coordinates: [-1.6244, 6.6885],
    address: "Kejetia Market, Kumasi, Ghana",
    phone: "+233512345678",
    amenities: ["WiFi", "AC", "Restaurant", "ATM", "Security", "VIP Lounge"],
    rating: 4.7,
    isOperational: true,
  },
  {
    id: "3",
    name: "VIP Bus Terminal - Tamale",
    city: "Tamale",
    coordinates: [-0.8433, 9.4035],
    address: "Central Market, Tamale, Ghana",
    phone: "+233712345678",
    amenities: ["WiFi", "AC", "Restaurant", "ATM", "Security"],
    rating: 4.6,
    isOperational: true,
  },
  {
    id: "4",
    name: "VIP Bus Terminal - Cape Coast",
    city: "Cape Coast",
    coordinates: [-1.2466, 5.1053],
    address: "Victoria Road, Cape Coast, Ghana",
    phone: "+233422345678",
    amenities: ["WiFi", "AC", "Restaurant", "ATM", "Security"],
    rating: 4.5,
    isOperational: true,
  },
  {
    id: "5",
    name: "VIP Bus Terminal - Ho",
    city: "Ho",
    coordinates: [0.472, 6.611],
    address: "Central Market, Ho, Ghana",
    phone: "+233362345678",
    amenities: ["WiFi", "AC", "Restaurant", "ATM", "Security"],
    rating: 4.4,
    isOperational: true,
  },
  {
    id: "6",
    name: "VIP Bus Terminal - Takoradi",
    city: "Takoradi",
    coordinates: [-1.7533, 4.8974],
    address: "Market Circle, Takoradi, Ghana",
    phone: "+233312345678",
    amenities: ["WiFi", "AC", "Restaurant", "ATM", "Security"],
    rating: 4.3,
    isOperational: true,
  },
  {
    id: "7",
    name: "VIP Bus Terminal - Sunyani",
    city: "Sunyani",
    coordinates: [-2.3265, 7.3386],
    address: "Central Market, Sunyani, Ghana",
    phone: "+233352345678",
    amenities: ["WiFi", "AC", "Restaurant", "ATM", "Security"],
    rating: 4.2,
    isOperational: true,
  },
  {
    id: "8",
    name: "VIP Bus Terminal - Bolgatanga",
    city: "Bolgatanga",
    coordinates: [-0.8513, 10.7856],
    address: "Central Market, Bolgatanga, Ghana",
    phone: "+233722345678",
    amenities: ["WiFi", "AC", "Restaurant", "ATM", "Security"],
    rating: 4.1,
    isOperational: true,
  },
]

// Live VIP Buses with Real GPS Coordinates
const liveVIPBuses: LiveBus[] = [
  {
    id: "1",
    busNumber: "VIP-001",
    route: "Accra → Kumasi",
    currentLocation: "Nsawam",
    nextStop: "Suhum",
    eta: "15 mins",
    occupancy: 32,
    maxCapacity: 45,
    status: "on-time",
    speed: 65,
    progress: 35,
    driver: {
      name: "Kwame Asante",
      phone: "+233509921758",
      rating: 4.8,
      avatar: "/placeholder.svg?height=40&width=40",
      license: "GH-DL-2024-001234",
    },
    coordinates: [-0.3518, 5.8089], // Real GPS: Nsawam, Ghana
    lastUpdate: new Date(Date.now() - 1000 * 60 * 2),
    amenities: ["WiFi", "AC", "Charging Port", "Refreshments", "VIP Seating", "Entertainment"],
    temperature: 22,
    wifiStrength: 85,
    isVIP: true,
  },
  {
    id: "2",
    busNumber: "VIP-002",
    route: "Accra → Tamale",
    currentLocation: "Kumasi",
    nextStop: "Techiman",
    eta: "45 mins",
    occupancy: 38,
    maxCapacity: 50,
    status: "delayed",
    speed: 45,
    progress: 60,
    driver: {
      name: "Ama Serwaa",
      phone: "+233509921759",
      rating: 4.6,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    coordinates: [-1.6244, 6.6885], // Real GPS: Kumasi, Ghana
    lastUpdate: new Date(Date.now() - 1000 * 60 * 5),
    amenities: ["WiFi", "AC", "Meals", "Entertainment", "VIP Seating", "Blankets"],
    temperature: 24,
    wifiStrength: 92,
    isVIP: true,
  },
  {
    id: "3",
    busNumber: "VIP-003",
    route: "Accra → Cape Coast",
    currentLocation: "Cape Coast Station",
    nextStop: "Arrived",
    eta: "Arrived",
    occupancy: 0,
    maxCapacity: 40,
    status: "arrived",
    speed: 0,
    progress: 100,
    driver: {
      name: "Kofi Mensah",
      phone: "+233509921760",
      rating: 4.9,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    coordinates: [-1.2466, 5.1053], // Real GPS: Cape Coast, Ghana
    lastUpdate: new Date(Date.now() - 1000 * 60 * 10),
    amenities: ["AC", "Charging Port", "VIP Seating", "Refreshments"],
    temperature: 21,
    wifiStrength: 78,
    isVIP: true,
  },
  {
    id: "4",
    busNumber: "VIP-004",
    route: "Kumasi → Tamale",
    currentLocation: "Kumasi",
    nextStop: "Mampong",
    eta: "25 mins",
    occupancy: 25,
    maxCapacity: 45,
    status: "on-time",
    speed: 70,
    progress: 15,
    driver: {
      name: "Yaw Osei",
      phone: "+233509921761",
      rating: 4.7,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    coordinates: [-1.6244, 6.6885],
    lastUpdate: new Date(Date.now() - 1000 * 60 * 1),
    amenities: ["WiFi", "AC", "Charging Port", "VIP Seating", "Refreshments"],
    temperature: 23,
    wifiStrength: 88,
    isVIP: true,
  },
  {
    id: "5",
    busNumber: "VIP-005",
    route: "Accra → Ho",
    currentLocation: "Tema",
    nextStop: "Ashaiman",
    eta: "8 mins",
    occupancy: 18,
    maxCapacity: 42,
    status: "on-time",
    speed: 55,
    progress: 20,
    driver: {
      name: "Edem Kpodo",
      phone: "+233509921762",
      rating: 4.5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    coordinates: [0.0174, 5.6168],
    lastUpdate: new Date(Date.now() - 1000 * 60 * 3),
    amenities: ["WiFi", "AC", "Charging Port", "VIP Seating", "Refreshments"],
    temperature: 25,
    wifiStrength: 82,
    isVIP: true,
  },
  {
    id: "6",
    busNumber: "VIP-006",
    route: "Accra → Takoradi",
    currentLocation: "Accra",
    nextStop: "Kasoa",
    eta: "12 mins",
    occupancy: 22,
    maxCapacity: 48,
    status: "on-time",
    speed: 60,
    progress: 10,
    driver: {
      name: "Akosua Boateng",
      phone: "+233509921763",
      rating: 4.8,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    coordinates: [-0.1969, 5.6037],
    lastUpdate: new Date(Date.now() - 1000 * 60 * 2),
    amenities: ["WiFi", "AC", "Charging Port", "VIP Seating", "Entertainment", "Refreshments"],
    temperature: 26,
    wifiStrength: 90,
    isVIP: true,
  },
  {
    id: "7",
    busNumber: "VIP-007",
    route: "Kumasi → Sunyani",
    currentLocation: "Kumasi",
    nextStop: "Mampong",
    eta: "18 mins",
    occupancy: 30,
    maxCapacity: 40,
    status: "on-time",
    speed: 65,
    progress: 25,
    driver: {
      name: "Abena Owusu",
      phone: "+233509921764",
      rating: 4.6,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    coordinates: [-1.6244, 6.6885],
    lastUpdate: new Date(Date.now() - 1000 * 60 * 4),
    amenities: ["WiFi", "AC", "Charging Port", "VIP Seating", "Refreshments"],
    temperature: 22,
    wifiStrength: 85,
    isVIP: true,
  },
  {
    id: "8",
    busNumber: "VIP-008",
    route: "Tamale → Bolgatanga",
    currentLocation: "Tamale",
    nextStop: "Savelugu",
    eta: "22 mins",
    occupancy: 28,
    maxCapacity: 35,
    status: "on-time",
    speed: 58,
    progress: 30,
    driver: {
      name: "Kweku Antwi",
      phone: "+233509921765",
      rating: 4.4,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    coordinates: [-0.8433, 9.4035],
    lastUpdate: new Date(Date.now() - 1000 * 60 * 5),
    amenities: ["WiFi", "AC", "Charging Port", "VIP Seating", "Refreshments"],
    temperature: 20,
    wifiStrength: 75,
    isVIP: true,
  },
]

export default function TrackingPage() {
  const { toast } = useToast()
  const [buses, setBuses] = useState<LiveBus[]>(liveVIPBuses)
  const [selectedBus, setSelectedBus] = useState<LiveBus | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [callDialogOpen, setCallDialogOpen] = useState(false)
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [showStations, setShowStations] = useState(false)

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setLastUpdated(new Date())
      setBuses((prevBuses) =>
        prevBuses.map((bus) => ({
          ...bus,
          progress: Math.min(100, bus.progress + Math.random() * 2),
          speed: bus.status === "arrived" ? 0 : 45 + Math.random() * 30,
          lastUpdate: new Date(),
          occupancy: Math.max(0, bus.occupancy + Math.floor(Math.random() * 3 - 1)),
          wifiStrength: Math.max(60, Math.min(100, bus.wifiStrength + Math.floor(Math.random() * 10 - 5))),
        })),
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const filteredBuses = buses.filter((bus) => {
    const matchesSearch =
      bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bus.currentLocation.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || bus.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const handleCall = (bus: LiveBus) => {
    setSelectedBus(bus)
    setCallDialogOpen(true)
  }

  const makeCall = () => {
    if (selectedBus) {
      window.open(`tel:${selectedBus.driver.phone}`, "_self")
      toast({
        title: "Calling Driver",
        description: `Calling ${selectedBus.driver.name} at ${selectedBus.driver.phone}`,
      })
      setCallDialogOpen(false)
    }
  }

  const handleMessage = (bus: LiveBus) => {
    setSelectedBus(bus)
    setMessageDialogOpen(true)
  }

  const sendMessage = () => {
    if (selectedBus && message.trim()) {
      // In real implementation, this would send SMS via API
      toast({
        title: "Message Sent",
        description: `Message sent to ${selectedBus.driver.name}`,
      })
      setMessage("")
      setMessageDialogOpen(false)
    }
  }

  const openGoogleMaps = (station: VIPStation) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${station.coordinates[0]},${station.coordinates[1]}`
    window.open(url, "_blank")
    toast({
      title: "Opening Google Maps",
      description: `Opening ${station.name} in Google Maps`,
    })
  }

  const openGoogleMapsForBus = (bus: LiveBus) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${bus.coordinates[0]},${bus.coordinates[1]}&travelmode=driving`
    window.open(url, "_blank")
    toast({
      title: "Opening Google Maps Navigation",
      description: `Navigating to ${bus.busNumber} at ${bus.currentLocation}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "bg-green-100 text-green-800 border-green-200"
      case "delayed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "arrived":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "boarding":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-time":
        return <CheckCircle className="h-4 w-4" />
      case "delayed":
        return <AlertTriangle className="h-4 w-4" />
      case "arrived":
        return <CheckCircle className="h-4 w-4" />
      case "boarding":
        return <Users className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

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
                  Live VIP Bus Tracking
                </h1>
                <p className="text-lg text-muted-foreground">Real-time tracking of Ghana VIP buses and stations</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setShowStations(!showStations)}
                  variant={showStations ? "default" : "outline"}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Map className="mr-2 h-4 w-4" />
                  {showStations ? "Hide Stations" : "Show VIP Stations"}
                </Button>
                <Button onClick={() => setLastUpdated(new Date())} variant="outline" className="bg-white/80 backdrop-blur-sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by bus number, route, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/50"
                      />
                    </div>
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48 bg-white/50">
                      <NavigationIcon className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Buses</SelectItem>
                      <SelectItem value="on-time">On Time</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="arrived">Arrived</SelectItem>
                      <SelectItem value="boarding">Boarding</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* VIP Stations Section */}
          {showStations && (
            <div className="mb-8">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <MapPin className="mr-2 h-5 w-5" />
                    Ghana VIP Bus Stations
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Click on any station to open it in Google Maps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {ghanaVIPStations.map((station) => (
                      <Card
                        key={station.id}
                        className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => openGoogleMaps(station)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-green-800">{station.name}</h3>
                              <p className="text-sm text-green-600">{station.city}</p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              <span>{station.rating}/5.0</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                              <span className={station.isOperational ? "text-green-600" : "text-red-600"}>
                                {station.isOperational ? "Operational" : "Maintenance"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1 text-blue-500" />
                              <span className="text-blue-600">{station.phone}</span>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-1">
                            {station.amenities.slice(0, 3).map((amenity, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-700">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Live Map */}
          <div className="mb-8">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                  Live VIP Bus Locations
                </CardTitle>
                <CardDescription>Real-time tracking of all VIP buses across Ghana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden">
                  <ModernMap buses={buses} stations={showStations ? ghanaVIPStations : []} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Buses List */}
          <div className="space-y-6">
            {filteredBuses.map((bus) => (
              <Card
                key={bus.id}
                className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Bus Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                          <Bus className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{bus.route}</h3>
                          <p className="text-sm text-muted-foreground">VIP Bus #{bus.busNumber}</p>
                        </div>
                        <Badge className={`${getStatusColor(bus.status)} border`}>
                          {getStatusIcon(bus.status)}
                          <span className="ml-1 capitalize">{bus.status}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{bus.currentLocation}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <NavigationIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{bus.nextStop}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{bus.eta}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {bus.occupancy}/{bus.maxCapacity} passengers
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Route Progress</span>
                          <span>{Math.round(bus.progress)}%</span>
                        </div>
                        <Progress value={bus.progress} className="h-2" />
                      </div>

                      {/* VIP Amenities */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {bus.amenities.map((amenity, index) => (
                          <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Driver Info & Actions */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="text-center">
                        <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <h4 className="font-semibold">{bus.driver.name}</h4>
                        <div className="flex items-center justify-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-sm">{bus.driver.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{bus.driver.phone}</p>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleCall(bus)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleMessage(bus)}
                          size="sm"
                          variant="outline"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => openGoogleMapsForBus(bus)}
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <NavigationIcon className="h-4 w-4" />
                          Navigate
                        </Button>
                      </div>

                      <div className="text-center text-xs text-muted-foreground">
                        <p>Last updated: {formatTimeAgo(bus.lastUpdate)}</p>
                        <p>Speed: {bus.speed} km/h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call Driver Dialog */}
          <Dialog open={callDialogOpen} onOpenChange={setCallDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Call Driver</DialogTitle>
                <DialogDescription>
                  Are you sure you want to call {selectedBus?.driver.name}?
                </DialogDescription>
              </DialogHeader>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setCallDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={makeCall} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Message Driver Dialog */}
          <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Message Driver</DialogTitle>
                <DialogDescription>
                  Send a message to {selectedBus?.driver.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setMessageDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={sendMessage} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AuthGuard>
  )
}
