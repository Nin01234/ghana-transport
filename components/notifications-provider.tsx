"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./auth-provider"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  metadata?: any
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => void
  clearNotifications: () => void
  loading: boolean
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch notifications from database
  const fetchNotifications = async () => {
    if (!user) return

    setLoading(true)
    try {
      // For now, we'll create some sample notifications
      // In a real app, you'd fetch from the notifications table
      const sampleNotifications: Notification[] = [
        {
          id: "1",
          title: "Welcome to GhanaTransit!",
          message: "Thank you for joining our transport community. Start exploring routes and book your first trip!",
          type: "success",
          timestamp: new Date(),
          isRead: false,
          actionUrl: "/routes"
        },
        {
          id: "2",
          title: "Complete Your Profile",
          message: "Add your phone number and preferences to get personalized recommendations.",
          type: "info",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          isRead: false,
          actionUrl: "/profile"
        }
      ]

      setNotifications(sampleNotifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  // Add new notification
  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    }

    setNotifications(prev => [newNotification, ...prev])

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === "error" ? "destructive" : "default"
    })
  }

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([])
  }

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearNotifications,
    loading
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}
