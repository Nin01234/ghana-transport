import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { NotificationServiceProvider } from "@/components/notification-service"
import { EmailJSProvider } from "@/components/emailjs-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GhanaTransit - Smart Public Transport",
  description: "Modern public transport booking system for Ghana",
  manifest: "/manifest.json",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <EmailJSProvider>
            <AuthProvider>
              <NotificationServiceProvider>
                {children}
                <Toaster />
              </NotificationServiceProvider>
            </AuthProvider>
          </EmailJSProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
