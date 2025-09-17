"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Navigation, Locate, Layers, Bus, Users } from "lucide-react"

interface MapLocation {
  id: string
  name: string
  coordinates: [number, number] // [longitude, latitude]
  type: "station" | "bus" | "user"
  status?: "active" | "delayed" | "arrived"
  region?: string
  population?: string
}

interface ModernMapProps {
  locations?: MapLocation[]
  center?: [number, number]
  zoom?: number
  showUserLocation?: boolean
  onLocationSelect?: (location: MapLocation) => void
  // Optional VIP tracking inputs
  buses?: Array<{
    id: string
    busNumber: string
    route: string
    coordinates: [number, number]
  }>
  stations?: Array<{
    id: string
    name: string
    city: string
    coordinates: [number, number]
  }>
}

// Real Ghana cities with accurate coordinates
const realGhanaLocations: MapLocation[] = [
  // Greater Accra Region
  {
    id: "accra",
    name: "Accra",
    coordinates: [-0.1969, 5.6037],
    type: "station",
    region: "Greater Accra",
    population: "2.3M",
  },
  {
    id: "tema",
    name: "Tema",
    coordinates: [-0.0167, 5.6698],
    type: "station",
    region: "Greater Accra",
    population: "402K",
  },
  {
    id: "kasoa",
    name: "Kasoa",
    coordinates: [-0.4167, 5.5333],
    type: "station",
    region: "Greater Accra",
    population: "180K",
  },

  // Ashanti Region
  {
    id: "kumasi",
    name: "Kumasi",
    coordinates: [-1.6244, 6.6885],
    type: "station",
    region: "Ashanti",
    population: "3.3M",
  },
  {
    id: "obuasi",
    name: "Obuasi",
    coordinates: [-1.6667, 6.2],
    type: "station",
    region: "Ashanti",
    population: "175K",
  },

  // Northern Region
  {
    id: "tamale",
    name: "Tamale",
    coordinates: [-0.8393, 9.4034],
    type: "station",
    region: "Northern",
    population: "950K",
  },
  {
    id: "yendi",
    name: "Yendi",
    coordinates: [-0.0167, 9.4333],
    type: "station",
    region: "Northern",
    population: "117K",
  },

  // Central Region
  {
    id: "cape-coast",
    name: "Cape Coast",
    coordinates: [-1.2466, 5.1053],
    type: "station",
    region: "Central",
    population: "169K",
  },
  {
    id: "winneba",
    name: "Winneba",
    coordinates: [-0.6333, 5.35],
    type: "station",
    region: "Central",
    population: "62K",
  },

  // Western Region
  {
    id: "takoradi",
    name: "Takoradi",
    coordinates: [-1.7533, 4.8974],
    type: "station",
    region: "Western",
    population: "445K",
  },
  {
    id: "tarkwa",
    name: "Tarkwa",
    coordinates: [-1.9833, 5.3],
    type: "station",
    region: "Western",
    population: "56K",
  },

  // Volta Region
  {
    id: "ho",
    name: "Ho",
    coordinates: [0.472, 6.611],
    type: "station",
    region: "Volta",
    population: "180K",
  },
  {
    id: "hohoe",
    name: "Hohoe",
    coordinates: [0.4667, 7.15],
    type: "station",
    region: "Volta",
    population: "56K",
  },

  // Eastern Region
  {
    id: "koforidua",
    name: "Koforidua",
    coordinates: [-0.25, 6.0833],
    type: "station",
    region: "Eastern",
    population: "183K",
  },
  {
    id: "nkawkaw",
    name: "Nkawkaw",
    coordinates: [-0.7667, 6.55],
    type: "station",
    region: "Eastern",
    population: "61K",
  },

  // Brong Ahafo Region
  {
    id: "sunyani",
    name: "Sunyani",
    coordinates: [-2.3265, 7.3386],
    type: "station",
    region: "Brong Ahafo",
    population: "248K",
  },
  {
    id: "techiman",
    name: "Techiman",
    coordinates: [-1.9333, 7.5833],
    type: "station",
    region: "Brong Ahafo",
    population: "104K",
  },

  // Upper East Region
  {
    id: "bolgatanga",
    name: "Bolgatanga",
    coordinates: [-0.85, 10.7833],
    type: "station",
    region: "Upper East",
    population: "131K",
  },

  // Upper West Region
  {
    id: "wa",
    name: "Wa",
    coordinates: [-2.5, 10.0667],
    type: "station",
    region: "Upper West",
    population: "124K",
  },
]

export function ModernMap({
  locations = realGhanaLocations,
  center = [-1.0232, 7.9465], // Center of Ghana
  zoom = 7,
  showUserLocation = true,
  onLocationSelect,
  buses,
  stations,
}: ModernMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [mapStyle, setMapStyle] = useState<"streets" | "satellite">("streets")

  // Build computed locations from buses/stations if provided
  const computedLocations: MapLocation[] =
    (stations && stations.length) || (buses && buses.length)
      ? [
          ...(stations?.map((s) => ({
            id: s.id,
            name: `${s.name}`,
            coordinates: s.coordinates,
            type: "station" as const,
            region: undefined,
            population: undefined,
          })) || []),
          ...(buses?.map((b) => ({
            id: b.id,
            name: `${b.busNumber} • ${b.route}`,
            coordinates: b.coordinates,
            type: "bus" as const,
          })) || []),
        ]
      : locations

  useEffect(() => {
    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude])
        },
        (error) => {
          console.log("Geolocation error:", error)
        },
      )
    }
  }, [showUserLocation])

  useEffect(() => {
    if (mapRef.current) {
      const mapContainer = mapRef.current

      // Create a more detailed Ghana map representation
      mapContainer.innerHTML = `
        <div class="relative w-full h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg overflow-hidden">
          <!-- Ghana Map Background -->
          <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23000000" fillOpacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-10"></div>
          
          <!-- Detailed Ghana Map Outline -->
          <svg class="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
            <!-- Ghana country outline -->
            <path d="M80 120 Q90 80 120 85 Q150 75 180 80 Q220 85 250 95 Q280 100 310 110 Q330 120 340 140 Q345 160 340 180 Q335 200 320 215 Q300 230 280 235 Q250 240 220 235 Q190 230 160 225 Q130 220 100 210 Q85 200 80 180 Q75 160 80 140 Z" 
                  fill="rgba(34, 197, 94, 0.15)" 
                  stroke="rgba(34, 197, 94, 0.4)" 
                  strokeWidth="2"/>
            
            <!-- Regional boundaries -->
            <path d="M120 85 Q150 90 180 95 Q200 100 220 105" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="1" fill="none"/>
            <path d="M180 80 Q200 120 220 140 Q240 160 260 180" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="1" fill="none"/>
            <path d="M250 95 Q270 130 280 160 Q290 180 300 200" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="1" fill="none"/>
          </svg>
          
          <!-- Location markers -->
          ${computedLocations
            .map((location, index) => {
              // Calculate position based on coordinates relative to Ghana's bounds
              const lonRange = [-3.5, 1.5] // Ghana's longitude range
              const latRange = [4.5, 11.5] // Ghana's latitude range

              const x = ((location.coordinates[0] - lonRange[0]) / (lonRange[1] - lonRange[0])) * 80 + 10
              const y = ((latRange[1] - location.coordinates[1]) / (latRange[1] - latRange[0])) * 70 + 15

              return `
                <div class="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group" 
                     style="left: ${x}%; top: ${y}%"
                     data-location-id="${location.id}">
                  <div class="relative">
                    <div class="w-4 h-4 ${location.type === "bus" ? "bg-blue-500" : "bg-ghana-green"} rounded-full border-2 border-white shadow-lg group-hover:scale-125 transition-transform ${location.type === "bus" ? "animate-pulse" : ""}">
                      ${location.type === "bus" ? '<div class="absolute inset-0 flex items-center justify-center"><svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/></svg></div>' : ""}
                    </div>
                    <div class="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      <div class="font-medium">${location.name}</div>
                      ${location.region ? `<div class="text-xs opacity-75">${location.region} Region</div>` : ""}
                      ${location.population ? `<div class="text-xs opacity-75">${location.population}</div>` : ""}
                    </div>
                  </div>
                </div>
              `
            })
            .join("")}
          
          ${
            userLocation
              ? `
            <div class="absolute transform -translate-x-1/2 -translate-y-1/2" 
                 style="left: 60%; top: 45%">
              <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Your Location
              </div>
            </div>
          `
              : ""
          }
          
          <!-- Map Legend -->
          <div class="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div class="space-y-2 text-xs">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-ghana-green rounded-full"></div>
                <span>Bus Stations</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Live Buses</span>
              </div>
              ${
                userLocation
                  ? `
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Your Location</span>
                </div>
              `
                  : ""
              }
            </div>
          </div>
          
          <!-- Regional Labels -->
          <div class="absolute top-6 left-6 text-xs font-medium text-ghana-green opacity-60">Greater Accra</div>
          <div class="absolute top-16 left-1/3 text-xs font-medium text-ghana-green opacity-60">Ashanti</div>
          <div class="absolute top-8 right-1/4 text-xs font-medium text-ghana-green opacity-60">Northern</div>
          <div class="absolute bottom-1/3 left-8 text-xs font-medium text-ghana-green opacity-60">Western</div>
          <div class="absolute top-1/3 right-8 text-xs font-medium text-ghana-green opacity-60">Volta</div>
        </div>
      `

      // Add click handlers
      const locationElements = mapContainer.querySelectorAll("[data-location-id]")
      locationElements.forEach((element) => {
        element.addEventListener("click", (e) => {
          const locationId = (e.currentTarget as HTMLElement).dataset.locationId
          const location = computedLocations.find((l) => l.id === locationId)
          if (location) {
            setSelectedLocation(location)
            onLocationSelect?.(location)
          }
        })
      })
    }
  }, [computedLocations, userLocation, onLocationSelect])

  const centerOnUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude])
        },
        (error) => {
          console.log("Geolocation error:", error)
        },
      )
    }
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-lg" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 backdrop-blur-sm shadow-lg"
          onClick={() => setMapStyle(mapStyle === "streets" ? "satellite" : "streets")}
        >
          <Layers className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/90 backdrop-blur-sm shadow-lg"
          onClick={centerOnUser}
        >
          <Locate className="h-4 w-4" />
        </Button>
      </div>

      {/* Location Info Card */}
      {selectedLocation && (
        <Card className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-ghana-green/10 flex items-center justify-center">
                  {selectedLocation.type === "bus" ? (
                    <Bus className="h-5 w-5 text-blue-500" />
                  ) : (
                    <MapPin className="h-5 w-5 text-ghana-green" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedLocation.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {selectedLocation.region && `${selectedLocation.region} Region`}
                    {selectedLocation.population && ` • ${selectedLocation.population}`}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedLocation.type === "station" ? "Bus Station" : "Live Bus"}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  const [lon, lat] = selectedLocation.coordinates
                  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
                  window.open(url, "_blank")
                }}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Navigate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-ghana-green" />
            <span>{locations.filter((l) => l.type === "station").length} Stations</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bus className="h-4 w-4 text-blue-500" />
            <span>{locations.filter((l) => l.type === "bus").length} Live Buses</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span>16 Regions Covered</span>
          </div>
        </div>
      </div>
    </div>
  )
}
