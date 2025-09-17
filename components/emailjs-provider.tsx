"use client"

import { useEffect } from "react"
import { initEmailJS } from "@/lib/emailjs"

export function EmailJSProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      initEmailJS()
    } catch (error) {
      console.warn("EmailJS initialization failed:", error)
      // Don't block the app if EmailJS fails to initialize
    }
  }, [])

  return <>{children}</>
}
