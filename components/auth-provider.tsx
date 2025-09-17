"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
  isConfigured: false,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const isConfigured = !!supabase
  const router = useRouter()

  const refreshUser = async () => {
    if (!supabase) return
    
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) {
        console.error("Error refreshing user:", error)
        return
      }
      setUser(user)
    } catch (error) {
      console.error("Error refreshing user:", error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }
      
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()
        if (error) {
          console.error("Error getting session:", error)
          toast({
            title: "Authentication Error",
            description: "Failed to load your session. Please try logging in again.",
            variant: "destructive",
          })
        } else {
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error("Error getting session:", error)
        toast({
          title: "Connection Error",
          description: "Failed to connect to authentication service.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    if (!supabase) return
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      setUser(session?.user ?? null)
      setLoading(false)

      // Handle different auth events
      switch (event) {
        case "SIGNED_IN":
          if (session?.user) {
            const displayName =
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "Traveler"
            toast({
              title: `Welcome back, ${displayName}!`,
              description: "You're now signed in.",
            })

            // Create or update user profile
            await createOrUpdateProfile(session.user)
          }
          break
        case "SIGNED_OUT":
          toast({
            title: "Signed out",
            description: "You have been successfully signed out.",
          })
          break
        case "TOKEN_REFRESHED":
          console.log("Token refreshed successfully")
          break
        case "USER_UPDATED":
          console.log("User updated:", session?.user?.email)
          break
      }
    })

    return () => subscription.unsubscribe()
  }, [toast])

  const createOrUpdateProfile = async (user: User) => {
    try {
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          phone: user.user_metadata?.phone || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
        },
      )

      if (error) {
        console.error("Error creating/updating profile:", error)
      } else {
        console.log("Profile created/updated successfully")
      }
    } catch (error) {
      console.error("Error in createOrUpdateProfile:", error)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive",
        })
      }
      // Clear local user state and redirect to hero screen
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signOut, refreshUser, isConfigured }}>{children}</AuthContext.Provider>
}
