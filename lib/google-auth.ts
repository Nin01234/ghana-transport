import { supabase } from "./supabase"
import { authConfig } from "./auth-config"

export class GoogleAuthHandler {
  private static instance: GoogleAuthHandler
  private accessToken: string | null = null
  private refreshToken: string | null = null

  static getInstance(): GoogleAuthHandler {
    if (!GoogleAuthHandler.instance) {
      GoogleAuthHandler.instance = new GoogleAuthHandler()
    }
    return GoogleAuthHandler.instance
  }

  // Initialize Google OAuth flow
  async initiateAuth(): Promise<void> {
    try {
      // Use Supabase's built-in Google OAuth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: authConfig.redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Google OAuth error:', error)
        throw new Error('Failed to initiate Google authentication')
      }
    } catch (error) {
      console.error('Google auth initiation error:', error)
      throw error
    }
  }

  // Handle the OAuth callback
  async handleCallback(code: string): Promise<any> {
    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Code exchange error:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Google callback handling error:', error)
      throw error
    }
  }

  // Get user profile from Google
  async getGoogleProfile(accessToken: string): Promise<any> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch Google profile')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching Google profile:', error)
      throw error
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        throw error
      }
    } catch (error) {
      console.error('Google sign out error:', error)
      throw error
    }
  }
}

export const googleAuth = GoogleAuthHandler.getInstance()
