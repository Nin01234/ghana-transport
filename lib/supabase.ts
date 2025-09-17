import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Only create client if we have real environment variables
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    })
  : null

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          preferred_language: string
          date_of_birth: string | null
          gender: string | null
          profile_image_url: string | null
          is_verified: boolean
          loyalty_points: number
          wallet_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          preferred_language?: string
          date_of_birth?: string | null
          gender?: string | null
          profile_image_url?: string | null
          is_verified?: boolean
          loyalty_points?: number
          wallet_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          preferred_language?: string
          date_of_birth?: string | null
          gender?: string | null
          profile_image_url?: string | null
          is_verified?: boolean
          loyalty_points?: number
          wallet_balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      routes: {
        Row: {
          id: string
          name: string
          origin: string
          destination: string
          distance_km: number
          duration_minutes: number
          base_fare: number
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          origin: string
          destination: string
          distance_km: number
          duration_minutes: number
          base_fare: number
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          origin?: string
          destination?: string
          distance_km?: number
          duration_minutes?: number
          base_fare?: number
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bus_operators: {
        Row: {
          id: string
          name: string
          contact_email: string | null
          contact_phone: string | null
          license_number: string | null
          is_verified: boolean
          rating: number
          total_ratings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_email?: string | null
          contact_phone?: string | null
          license_number?: string | null
          is_verified?: boolean
          rating?: number
          total_ratings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_email?: string | null
          contact_phone?: string | null
          license_number?: string | null
          is_verified?: boolean
          rating?: number
          total_ratings?: number
          created_at?: string
          updated_at?: string
        }
      }
      buses: {
        Row: {
          id: string
          operator_id: string
          route_id: string
          bus_number: string
          license_plate: string
          capacity: number
          bus_type: string
          amenities: string[]
          current_location: any
          status: "active" | "maintenance" | "inactive"
          last_maintenance_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          operator_id: string
          route_id: string
          bus_number: string
          license_plate: string
          capacity: number
          bus_type: string
          amenities?: string[]
          current_location?: any
          status?: "active" | "maintenance" | "inactive"
          last_maintenance_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          operator_id?: string
          route_id?: string
          bus_number?: string
          license_plate?: string
          capacity?: number
          bus_type?: string
          amenities?: string[]
          current_location?: any
          status?: "active" | "maintenance" | "inactive"
          last_maintenance_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          route_id: string
          bus_id: string
          seat_number: string
          booking_date: string
          travel_date: string
          fare_amount: number
          payment_status: "pending" | "completed" | "failed"
          booking_status: "confirmed" | "cancelled" | "completed"
          payment_method: string | null
          transaction_id: string | null
          booking_reference: string | null
          route_from: string | null
          route_to: string | null
          departure_date: string | null
          departure_time: string | null
          passengers: number | null
          class: "standard" | "vip" | null
          total_price: number | null
          status: "confirmed" | "cancelled" | "completed" | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          route_id?: string
          bus_id?: string
          seat_number?: string
          booking_date?: string
          travel_date?: string
          fare_amount?: number
          payment_status?: "pending" | "completed" | "failed"
          booking_status?: "confirmed" | "cancelled" | "completed"
          payment_method?: string | null
          transaction_id?: string | null
          booking_reference?: string | null
          route_from?: string | null
          route_to?: string | null
          departure_date?: string | null
          departure_time?: string | null
          passengers?: number | null
          class?: "standard" | "vip" | null
          total_price?: number | null
          status?: "confirmed" | "cancelled" | "completed" | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          route_id?: string
          bus_id?: string
          seat_number?: string
          booking_date?: string
          travel_date?: string
          fare_amount?: number
          payment_status?: "pending" | "completed" | "failed"
          booking_status?: "confirmed" | "cancelled" | "completed"
          payment_method?: string | null
          transaction_id?: string | null
          booking_reference?: string | null
          route_from?: string | null
          route_to?: string | null
          departure_date?: string | null
          departure_time?: string | null
          passengers?: number | null
          class?: "standard" | "vip" | null
          total_price?: number | null
          status?: "confirmed" | "cancelled" | "completed" | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          booking_id: string | null
          transaction_type: "credit" | "debit"
          amount: number
          description: string
          payment_method: string | null
          status: "pending" | "completed" | "failed"
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          booking_id?: string | null
          transaction_type: "credit" | "debit"
          amount: number
          description: string
          payment_method?: string | null
          status?: "pending" | "completed" | "failed"
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          booking_id?: string | null
          transaction_type?: "credit" | "debit"
          amount?: number
          description?: string
          payment_method?: string | null
          status?: "pending" | "completed" | "failed"
          created_at?: string
        }
      }
      push_subscriptions: {
        Row: {
          id: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          endpoint: string
          p256dh: string
          auth: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          endpoint?: string
          p256dh?: string
          auth?: string
          created_at?: string
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          description: string
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          description: string
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          description?: string
          metadata?: any
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
