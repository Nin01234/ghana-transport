// Simple in-memory data store and event bus to replace Supabase on the client
// Not persisted across reloads; suitable for demo and instant UI updates

export type Booking = {
  id: string
  user_id: string
  route_from: string
  route_to: string
  departure_date: string
  departure_time: string
  status: string
  total_price: number
  booking_reference: string
  passengers: number
  class: string
  created_at: string
  payment_method?: string
  bus_number?: string
  driver_name?: string
  driver_phone?: string
  seat_numbers?: string[]
}

export type Activity = {
  id: string
  user_id: string
  activity_type: string
  description: string
  created_at: string
  points_earned?: number
}

export type Profile = {
  id: string
  loyalty_points: number
}

export type Transaction = {
  id: string
  user_id: string
  transaction_type: "debit" | "credit"
  amount: number
  created_at: string
}

type Listener<T> = (payload: T) => void

class EventBus {
  private listeners: Record<string, Listener<any>[]> = {}

  on<T>(event: string, listener: Listener<T>) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(listener as Listener<any>)
    return () => this.off(event, listener)
  }

  off<T>(event: string, listener: Listener<T>) {
    this.listeners[event] = (this.listeners[event] || []).filter((l) => l !== listener)
  }

  emit<T>(event: string, payload: T) {
    ;(this.listeners[event] || []).forEach((l) => l(payload))
  }
}

export const eventBus = new EventBus()

// In-memory data keyed by user
const profiles = new Map<string, Profile>()
const bookings = new Map<string, Booking[]>()
const activities = new Map<string, Activity[]>()
const transactions = new Map<string, Transaction[]>()

function nowIso() {
  return new Date().toISOString()
}

export function ensureSeedData(userId: string) {
  if (!profiles.has(userId)) {
    profiles.set(userId, { id: userId, loyalty_points: 320 })
  }
  if (!bookings.has(userId)) {
    bookings.set(userId, [])
  }
  if (!activities.has(userId)) {
    activities.set(userId, [])
  }
  if (!transactions.has(userId)) {
    transactions.set(userId, [])
  }
}

export const localApi = {
  getProfile(userId: string): Profile | null {
    ensureSeedData(userId)
    return profiles.get(userId) || null
  },

  getBookings(userId: string, limit = 5): Booking[] {
    ensureSeedData(userId)
    return [...(bookings.get(userId) || [])]
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .slice(0, limit)
  },

  getTransactions(userId: string, limit = 50): Transaction[] {
    ensureSeedData(userId)
    return [...(transactions.get(userId) || [])]
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .slice(0, limit)
  },

  getActivities(userId: string, limit = 10): Activity[] {
    ensureSeedData(userId)
    return [...(activities.get(userId) || [])]
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
      .slice(0, limit)
  },

  // Mutations that also emit events for realtime updates
  addBooking(userId: string, booking: Omit<Booking, "id" | "user_id" | "created_at">) {
    ensureSeedData(userId)
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      user_id: userId,
      created_at: nowIso(),
      ...booking,
    }
    const list = bookings.get(userId) || []
    list.push(newBooking)
    bookings.set(userId, list)
    eventBus.emit(`bookings:${userId}`, { type: "INSERT", new: newBooking })
    return newBooking
  },

  updateBooking(userId: string, id: string, changes: Partial<Booking>) {
    ensureSeedData(userId)
    const list = bookings.get(userId) || []
    const idx = list.findIndex((b) => b.id === id)
    if (idx >= 0) {
      const updated = { ...list[idx], ...changes }
      list[idx] = updated
      bookings.set(userId, list)
      eventBus.emit(`bookings:${userId}`, { type: "UPDATE", new: updated })
      return updated
    }
    return null
  },

  removeBooking(userId: string, id: string) {
    ensureSeedData(userId)
    const list = bookings.get(userId) || []
    const idx = list.findIndex((b) => b.id === id)
    if (idx >= 0) {
      const removed = list.splice(idx, 1)[0]
      bookings.set(userId, list)
      eventBus.emit(`bookings:${userId}`, { type: "DELETE", old: removed })
      return true
    }
    return false
  },

  addActivity(userId: string, activity: Omit<Activity, "id" | "user_id" | "created_at">) {
    ensureSeedData(userId)
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      user_id: userId,
      created_at: nowIso(),
      ...activity,
    }
    const list = activities.get(userId) || []
    list.unshift(newActivity)
    activities.set(userId, list)
    eventBus.emit(`activities:${userId}`, { type: "INSERT", new: newActivity })
    return newActivity
  },

  addTransaction(userId: string, txn: Omit<Transaction, "id" | "user_id" | "created_at">) {
    ensureSeedData(userId)
    const newTxn: Transaction = {
      id: crypto.randomUUID(),
      user_id: userId,
      created_at: nowIso(),
      ...txn,
    }
    const list = transactions.get(userId) || []
    list.unshift(newTxn)
    transactions.set(userId, list)
    eventBus.emit(`transactions:${userId}`, { type: "INSERT", new: newTxn })
    return newTxn
  },

  addPoints(userId: string, points: number) {
    ensureSeedData(userId)
    const profile = profiles.get(userId)!
    profile.loyalty_points = Math.max(0, (profile.loyalty_points || 0) + points)
    profiles.set(userId, profile)
    eventBus.emit(`profile:${userId}`, { type: "UPDATE", new: profile })
    return profile
  },
}

export type LocalApi = typeof localApi

