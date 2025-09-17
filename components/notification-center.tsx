"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, X, Bus, Wallet, Star, AlertTriangle, Info, Gift, MapPin, Crown, Zap } from "lucide-react"
import { notificationService, NotificationData } from "@/lib/notifications"

interface Notification {
  id: string
  type: "booking" | "payment" | "system" | "promotion" | "alert" | "tracking" | "reward" | "vip"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  priority: "low" | "medium" | "high" | "urgent"
}

const generateDynamicNotifications = (): Notification[] => {
  const now = new Date()
  const notifications: Notification[] = []

  // Recent booking confirmation
  notifications.push({
    id: `booking-${Date.now()}`,
    type: "booking",
    title: "Booking Confirmed",
    message: "Your trip from Accra to Kumasi has been confirmed for tomorrow at 8:30 AM",
    timestamp: new Date(now.getTime() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    actionUrl: "/bookings",
    priority: "high",
  })

  // Live tracking update
  notifications.push({
    id: `tracking-${Date.now() + 1}`,
    type: "tracking",
    title: "Bus Location Update",
    message: "GT-001 is approaching Nsawam. ETA: 15 minutes",
    timestamp: new Date(now.getTime() - 1000 * 60 * 45), // 45 minutes ago
    read: false,
    actionUrl: "/tracking",
    priority: "medium",
  })

  // Payment success
  notifications.push({
    id: `payment-${Date.now() + 2}`,
    type: "payment",
    title: "Payment Successful",
    message: "₵75.00 has been charged to your Mobile Money account",
    timestamp: new Date(now.getTime() - 1000 * 60 * 60), // 1 hour ago
    read: true,
    actionUrl: "/wallet",
    priority: "medium",
  })

  // Reward earned
  notifications.push({
    id: `reward-${Date.now() + 3}`,
    type: "reward",
    title: "Loyalty Points Earned!",
    message: "You earned 8 points from your recent booking. Total: 156 points",
    timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    actionUrl: "/rewards",
    priority: "low",
  })

  // Traffic alert
  notifications.push({
    id: `alert-${Date.now() + 4}`,
    type: "alert",
    title: "Traffic Alert",
    message: "Heavy traffic on Accra-Kumasi highway. Expect 30-minute delay",
    timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false,
    actionUrl: "/tracking",
    priority: "high",
  })

  // Promotional offer
  notifications.push({
    id: `promo-${Date.now() + 5}`,
    type: "promotion",
    title: "Weekend Special!",
    message: "Get 20% off on all weekend trips. Use code WEEKEND20",
    timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
    read: false,
    priority: "medium",
  })

  // System update
  notifications.push({
    id: `system-${Date.now() + 6}`,
    type: "system",
    title: "App Update Available",
    message: "New features including offline maps and voice navigation are now available!",
    timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
    priority: "low",
  })

  return notifications
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Subscribe to notification service
    const unsubscribe = notificationService.subscribe((serviceNotifications) => {
      const mappedNotifications: Notification[] = serviceNotifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        timestamp: n.timestamp,
        read: n.read,
        actionUrl: n.action?.url,
        priority: n.priority,
      }))
      
      setNotifications(mappedNotifications)
      setUnreadCount(notificationService.getUnreadCount())
    })

    // Load initial notifications
    const initialNotifications = notificationService.getAll()
    const mappedNotifications: Notification[] = initialNotifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      timestamp: n.timestamp,
      read: n.read,
      actionUrl: n.action?.url,
      priority: n.priority,
    }))
    
    setNotifications(mappedNotifications)
    setUnreadCount(notificationService.getUnreadCount())

    return unsubscribe
  }, [])



  const markAsRead = (id: string) => {
    notificationService.markAsRead(id)
  }

  const markAllAsRead = () => {
    notificationService.markAllAsRead()
  }

  const removeNotification = (id: string) => {
    notificationService.remove(id)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Bus className="h-4 w-4 text-red-600" />
      case "payment":
        return <Wallet className="h-4 w-4 text-ghana-gold" />
      case "promotion":
        return <Gift className="h-4 w-4 text-purple-500" />
      case "alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "system":
        return <Info className="h-4 w-4 text-blue-500" />
      case "tracking":
        return <MapPin className="h-4 w-4 text-green-500" />
      case "reward":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "vip":
        return <Crown className="h-4 w-4 text-red-600" />
      case "reminder":
        return <Zap className="h-4 w-4 text-orange-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-4 border-l-red-600 bg-red-50"
      case "high":
        return "border-l-4 border-l-red-500"
      case "medium":
        return "border-l-4 border-l-yellow-500"
      case "low":
        return "border-l-4 border-l-green-500"
      default:
        return ""
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                    !notification.read ? "bg-muted/30" : ""
                  } ${getPriorityColor(notification.priority)}`}
                  onClick={() => {
                    markAsRead(notification.id)
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{notification.title}</p>
                        <div className="flex items-center space-x-1">
                          {!notification.read && <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">{formatTime(notification.timestamp)}</p>
                        {notification.priority === "high" && (
                          <Badge variant="destructive" className="text-xs px-1 py-0">
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
