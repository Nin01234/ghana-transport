"use client"

import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: number
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 24, className = "", text }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <Loader2 className="animate-spin" size={size} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export function FullPageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-r from-ghana-green to-ghana-gold flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Loading GhanaTransit</h2>
          <p className="text-muted-foreground">Please wait while we prepare your experience...</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner
