import { toast } from "@/hooks/use-toast"

export interface NotificationData {
  id: string
  type: "booking" | "reminder" | "update" | "alert" | "vip"
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    url: string
  }
  sound?: string
  priority: "low" | "medium" | "high" | "urgent"
}

class NotificationService {
  private audioContext: AudioContext | null = null
  private notifications: NotificationData[] = []
  private listeners: ((notifications: NotificationData[]) => void)[] = []

  constructor() {
    if (typeof window === "undefined") {
      return
    }
    this.initializeAudio()
    this.loadNotifications()
    this.startRandomNotifications()
  }

  private initializeAudio() {
    if (typeof window === "undefined") return
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.warn("Audio context not supported")
    }
  }

  private async loadNotifications() {
    if (typeof window === "undefined") return
    const stored = window.localStorage?.getItem("ghana-vip-notifications")
    if (stored) {
      this.notifications = JSON.parse(stored).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }))
    }
  }

  private saveNotifications() {
    if (typeof window === "undefined") return
    window.localStorage?.setItem("ghana-vip-notifications", JSON.stringify(this.notifications))
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]))
  }

  // Subscribe to notification changes
  subscribe(listener: (notifications: NotificationData[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // Add new notification
  add(notification: Omit<NotificationData, "id" | "timestamp" | "read">) {
    const newNotification: NotificationData = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }

    this.notifications.unshift(newNotification)
    this.saveNotifications()
    this.notifyListeners()

    // Show toast
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === "vip" ? "default" : "secondary",
      className: notification.type === "vip" ? "bg-gradient-to-r from-red-600 to-pink-600 text-white border-red-500" : "",
    })

    // Play sound
    this.playSound(notification.sound || "default", notification.priority)

    // Show browser notification if permitted
    this.showBrowserNotification(newNotification)

    return newNotification
  }

  // Mark notification as read
  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
      this.saveNotifications()
      this.notifyListeners()
    }
  }

  // Mark all as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true)
    this.saveNotifications()
    this.notifyListeners()
  }

  // Remove notification
  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id)
    this.saveNotifications()
    this.notifyListeners()
  }

  // Get all notifications
  getAll() {
    return [...this.notifications]
  }

  // Get unread count
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length
  }

  // Clear all notifications
  clear() {
    this.notifications = []
    this.saveNotifications()
    this.notifyListeners()
  }

  // Play notification sound
  private async playSound(soundType: string, priority: string) {
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)

      // Different sounds for different priorities
      switch (priority) {
        case "urgent":
          oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
          oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1)
          oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime + 0.2)
          break
        case "high":
          oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime)
          oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime + 0.1)
          break
        case "medium":
          oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime)
          break
        default:
          oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime)
      }

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn("Failed to play notification sound:", error)
    }
  }

  // Show browser notification
  private async showBrowserNotification(notification: NotificationData) {
    if (typeof window === "undefined" || !("Notification" in window)) return

    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: notification.id,
        requireInteraction: notification.priority === "urgent",
        silent: false
      })
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        this.showBrowserNotification(notification)
      }
    }
  }

  // Booking confirmation notification
  bookingConfirmed(bookingData: {
    reference: string
    from: string
    to: string
    date: string
    time: string
    passengers: number
    totalPrice: number
    isVIP: boolean
  }) {
    this.add({
      type: "booking",
      title: "🎫 Booking Confirmed!",
      message: `Your ${bookingData.isVIP ? "VIP" : "standard"} trip from ${bookingData.from} to ${bookingData.to} on ${bookingData.date} at ${bookingData.time} has been confirmed. Reference: ${bookingData.reference}`,
      priority: "high",
      sound: "success",
      action: {
        label: "View Booking",
        url: `/bookings`
      }
    })
  }

  // Trip reminder notification
  tripReminder(bookingData: {
    reference: string
    from: string
    to: string
    date: string
    time: string
    departureIn: string
  }) {
    this.add({
      type: "reminder",
      title: "⏰ Trip Reminder!",
      message: `Your trip from ${bookingData.from} to ${bookingData.to} departs in ${bookingData.departureIn}. Reference: ${bookingData.reference}`,
      priority: "urgent",
      sound: "reminder",
      action: {
        label: "View Details",
        url: `/bookings`
      }
    })
  }

  // VIP upgrade notification
  vipUpgrade(route: string, newPrice: number) {
    this.add({
      type: "vip",
      title: "👑 VIP Upgrade Available!",
      message: `Upgrade to VIP for your ${route} trip for only ₵${newPrice}. Enjoy premium amenities and priority service!`,
      priority: "medium",
      sound: "vip",
      action: {
        label: "Upgrade Now",
        url: `/book`
      }
    })
  }

  // Trip update notification
  tripUpdate(bookingRef: string, update: string) {
    this.add({
      type: "update",
      title: "📢 Trip Update",
      message: `Update for booking ${bookingRef}: ${update}`,
      priority: "medium",
      sound: "update",
      action: {
        label: "View Details",
        url: `/bookings`
      }
    })
  }

  // Check for upcoming trips and send reminders
  checkUpcomingTrips(bookings: any[]) {
    const now = new Date()
    
    bookings.forEach(booking => {
      const departureTime = new Date(`${booking.departure_date}T${booking.departure_time}`)
      const timeDiff = departureTime.getTime() - now.getTime()
      const hoursDiff = timeDiff / (1000 * 60 * 60)

      // Send reminder 2 hours before departure
      if (hoursDiff > 0 && hoursDiff <= 2 && hoursDiff > 1.9) {
        this.tripReminder({
          reference: booking.booking_reference,
          from: booking.route_from,
          to: booking.route_to,
          date: booking.departure_date,
          time: booking.departure_time,
          departureIn: "2 hours"
        })
      }

      // Send urgent reminder 30 minutes before departure
      if (hoursDiff > 0 && hoursDiff <= 0.5 && hoursDiff > 0.49) {
        this.tripReminder({
          reference: booking.booking_reference,
          from: booking.route_from,
          to: booking.route_to,
          date: booking.departure_date,
          time: booking.departure_time,
          departureIn: "30 minutes"
        })
      }
    })
  }

  // Generate random VIP notifications
  generateRandomVIPNotifications() {
    const notifications = [
      {
        type: "vip" as const,
        title: "👑 VIP Lounge Access",
        message: "Exclusive VIP lounge now available at Accra Terminal. Enjoy complimentary refreshments and premium seating!",
        priority: "medium" as const,
        sound: "vip",
        action: {
          label: "Learn More",
          url: "/settings"
        }
      },
      {
        type: "vip" as const,
        title: "🚀 Priority Boarding",
        message: "VIP passengers now get priority boarding on all routes. Skip the queue and board first!",
        priority: "high" as const,
        sound: "vip",
        action: {
          label: "View Benefits",
          url: "/settings"
        }
      },
      {
        type: "vip" as const,
        title: "💎 Exclusive VIP Routes",
        message: "New VIP-only routes available: Accra to Sunyani and Accra to Bolgatanga with luxury amenities!",
        priority: "medium" as const,
        sound: "vip",
        action: {
          label: "Book Now",
          url: "/book"
        }
      },
      {
        type: "vip" as const,
        title: "🎁 VIP Loyalty Bonus",
        message: "VIP members earn 3x loyalty points this month! Book your next trip to unlock exclusive rewards.",
        priority: "high" as const,
        sound: "vip",
        action: {
          label: "Check Points",
          url: "/rewards"
        }
      }
    ]

    // Randomly select and send notifications
    const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
    this.add(randomNotification)
  }

  // Start random notification generation
  startRandomNotifications() {
    if (typeof window === "undefined") return
    // Send random VIP notifications every 2-5 minutes
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance
        this.generateRandomVIPNotifications()
      }
    }, Math.random() * 180000 + 120000) // 2-5 minutes
  }
}

// Create singleton instance
export const notificationService = new NotificationService()

// Export for use in components
export default notificationService
