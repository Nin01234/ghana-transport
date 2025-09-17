"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface PushNotification {
  id: string
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  data?: any
  timestamp: Date
  type: "bus_update" | "booking_reminder" | "delay_alert" | "arrival_notice" | "payment_update"
  priority: "low" | "normal" | "high" | "urgent"
  actions?: NotificationAction[]
}

interface NotificationAction {
  action: string
  title: string
  icon?: string
}

interface NotificationServiceContextType {
  isSupported: boolean
  permission: NotificationPermission
  isSubscribed: boolean
  notifications: PushNotification[]
  requestPermission: () => Promise<boolean>
  subscribe: () => Promise<boolean>
  unsubscribe: () => Promise<boolean>
  sendTestNotification: () => void
  markAsRead: (id: string) => void
  clearAll: () => void
}

const NotificationServiceContext = createContext<NotificationServiceContextType | null>(null)

export function useNotificationService() {
  const context = useContext(NotificationServiceContext)
  if (!context) {
    throw new Error("useNotificationService must be used within NotificationServiceProvider")
  }
  return context
}

export function NotificationServiceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [notifications, setNotifications] = useState<PushNotification[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    // Check if notifications are supported
    if (typeof window !== "undefined") {
      setIsSupported("Notification" in window && "serviceWorker" in navigator && "PushManager" in window)
      setPermission(Notification.permission)
    }
  }, [])

  useEffect(() => {
    if (isSupported) {
      initializeServiceWorker()
      initializeWebSocket()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [isSupported, user])

  const initializeServiceWorker = async () => {
    try {
      // Check if service worker file exists and is accessible
      const swResponse = await fetch("/sw.js", { method: "HEAD" }).catch(() => null)

      if (!swResponse || !swResponse.ok) {
        console.warn("Service Worker file not accessible, using fallback notification system")
        // Set up fallback notification system without service worker
        setIsSupported(false)
        return
      }

      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })

      swRegistrationRef.current = registration

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", handleServiceWorkerMessage)

      // Check if already subscribed
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)

      console.log("Service Worker registered successfully")
    } catch (error) {
      console.warn("Service Worker registration failed, falling back to basic notifications:", error)
      // Fallback to basic browser notifications without service worker
      setIsSupported("Notification" in window)
      setIsSubscribed(false)
    }
  }

  const initializeWebSocket = () => {
    if (!user) return

    // For demo purposes, we'll simulate WebSocket with setTimeout
    // In production, you would connect to a real WebSocket server
    console.log("Simulating WebSocket connection for user:", user.id)
  }

  const handleServiceWorkerMessage = (event: MessageEvent) => {
    const { type, data } = event.data

    switch (type) {
      case "NOTIFICATION_CLICKED":
        handleNotificationClick(data)
        break
      case "NOTIFICATION_CLOSED":
        handleNotificationClose(data)
        break
      default:
        break
    }
  }

  const handleRealtimeNotification = (data: any) => {
    const notification: PushNotification = {
      id: data.id || Date.now().toString(),
      title: data.title,
      body: data.body,
      icon: data.icon || "/icons/bus-icon-192.png",
      badge: data.badge || "/icons/badge-icon.png",
      tag: data.tag,
      data: data.data,
      timestamp: new Date(),
      type: data.type || "bus_update",
      priority: data.priority || "normal",
      actions: data.actions,
    }

    // Add to local notifications
    setNotifications((prev) => [notification, ...prev.slice(0, 49)]) // Keep last 50

    // Show browser notification if permission granted
    if (permission === "granted") {
      showBrowserNotification(notification)
    }

    // Show toast notification
    showToastNotification(notification)
  }

  const showBrowserNotification = (notification: PushNotification) => {
    if (!isSupported || permission !== "granted") return

    const options: NotificationOptions = {
      body: notification.body,
      icon: notification.icon,
      badge: notification.badge,
      tag: notification.tag,
      data: notification.data,
      requireInteraction: notification.priority === "urgent",
      silent: notification.priority === "low",
    }

    // Try to use service worker first, fallback to regular notification
    if (swRegistrationRef.current) {
      swRegistrationRef.current.showNotification(notification.title, options)
    } else {
      // Fallback to regular notification API
      try {
        const browserNotification = new Notification(notification.title, options)

        // Handle click events for regular notifications
        browserNotification.onclick = () => {
          handleNotificationClick(notification.data)
          browserNotification.close()
        }

        // Auto-close after some time based on priority
        const autoCloseTime = notification.priority === "urgent" ? 10000 : 5000
        setTimeout(() => {
          browserNotification.close()
        }, autoCloseTime)
      } catch (error) {
        console.warn("Failed to show browser notification:", error)
      }
    }
  }

  const showToastNotification = (notification: PushNotification) => {
    const variant = notification.priority === "urgent" ? "destructive" : "default"

    toast({
      title: notification.title,
      description: notification.body,
      variant,
      duration: notification.priority === "urgent" ? 10000 : 5000,
    })
  }

  const handleNotificationClick = (data: any) => {
    // Handle notification click actions
    if (data.action) {
      switch (data.action) {
        case "view_bus":
          window.open(`/tracking?bus=${data.busId}`, "_blank")
          break
        case "view_booking":
          window.open(`/bookings/${data.bookingId}`, "_blank")
          break
        case "call_driver":
          window.open(`tel:${data.driverPhone}`)
          break
        default:
          break
      }
    }
  }

  const handleNotificationClose = (data: any) => {
    // Handle notification close
    console.log("Notification closed:", data)
  }

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === "granted"
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }

  const subscribe = async (): Promise<boolean> => {
    if (!isSupported || permission !== "granted") return false

    // If no service worker, we can still track subscription status locally
    if (!swRegistrationRef.current) {
      console.warn("Push notifications require service worker support")
      setIsSubscribed(true) // Set as subscribed for basic notifications
      return true
    }

    try {
      // Check if VAPID key is available
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey || vapidKey.length === 0) {
        console.warn("VAPID public key not configured, using basic notifications")
        setIsSubscribed(true)
        return true
      }

      const subscription = await swRegistrationRef.current.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })

      // Send subscription to server
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          userId: user?.id,
        }),
      })

      setIsSubscribed(true)
      return true
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
      // Fallback to basic notification tracking
      setIsSubscribed(true)
      return true
    }
  }

  const unsubscribe = async (): Promise<boolean> => {
    if (!swRegistrationRef.current) {
      setIsSubscribed(false)
      return true
    }

    try {
      const subscription = await swRegistrationRef.current.pushManager.getSubscription()
      if (subscription) {
        await subscription.unsubscribe()

        // Remove subscription from server
        await fetch("/api/notifications/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
          }),
        })
      }

      setIsSubscribed(false)
      return true
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error)
      setIsSubscribed(false)
      return true
    }
  }

  const sendTestNotification = () => {
    const testNotification = {
      id: Date.now().toString(),
      title: "Test Notification",
      body: "This is a test notification from GhanaTransit",
      type: "bus_update",
      priority: "normal",
      data: { test: true },
    }

    handleRealtimeNotification(testNotification)
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  // Simulate real-time bus updates
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      // Simulate random bus updates
      const updates = [
        {
          id: Date.now().toString(),
          title: "Bus Update",
          body: "GT-001 is now 5 minutes away from Nsawam station",
          type: "bus_update",
          priority: "normal",
          data: { busId: "GT-001", station: "Nsawam" },
          actions: [
            { action: "view_bus", title: "Track Bus", icon: "/icons/track.png" },
            { action: "call_driver", title: "Call Driver", icon: "/icons/phone.png" },
          ],
        },
        {
          id: (Date.now() + 1).toString(),
          title: "Delay Alert",
          body: "GT-002 is delayed by 15 minutes due to traffic",
          type: "delay_alert",
          priority: "high",
          data: { busId: "GT-002", delay: 15 },
        },
        {
          id: (Date.now() + 2).toString(),
          title: "Booking Reminder",
          body: "Your trip to Kumasi is tomorrow at 8:30 AM",
          type: "booking_reminder",
          priority: "normal",
          data: { bookingId: "BK-123", destination: "Kumasi" },
        },
      ]

      // Randomly send one of these updates
      if (Math.random() > 0.7) {
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)]
        handleRealtimeNotification(randomUpdate)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [user])

  const value: NotificationServiceContextType = {
    isSupported,
    permission,
    isSubscribed,
    notifications,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
    markAsRead,
    clearAll,
  }

  return <NotificationServiceContext.Provider value={value}>{children}</NotificationServiceContext.Provider>
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}
