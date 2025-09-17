"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { NotificationCenter } from "@/components/notification-center"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Menu,
  Home,
  Map,
  Ticket,
  Wallet,
  User,
  Settings,
  LogOut,
  Bus,
  Star,
  MessageCircle,
  Info,
  Phone,
  Target,
  Calendar,
  BarChart3,
} from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Routes", href: "/routes", icon: Map },
  { name: "Book Trip", href: "/book", icon: Calendar },
  { name: "My Bookings", href: "/bookings", icon: Ticket },
  { name: "Live Tracking", href: "/tracking", icon: Target },
  { name: "Wallet", href: "/wallet", icon: Wallet },
  { name: "Rewards", href: "/rewards", icon: Star },
]

const moreLinks = [
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Phone },
  { name: "Help", href: "/help", icon: MessageCircle },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
              <Bus className="h-4 w-4 text-white" />
            </div>
            <span className="hidden font-bold sm:inline-block text-red-600">Ghana VIP Transport</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.slice(0, 6).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-foreground/60 hover:text-foreground/80">
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {navigation.slice(6).map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href}>
                        <Icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator />
                {moreLinks.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link href={item.href}>
                        <Icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav />
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
                <Bus className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-red-600">Ghana VIP Transport</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            <NotificationCenter />
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="User" />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

function MobileNav() {
  const pathname = usePathname()
  const allLinks = [...navigation, ...moreLinks]

  return (
            <div className="flex flex-col space-y-3">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center">
              <Bus className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-red-600">Ghana VIP Transport</span>
          </Link>
      <div className="flex flex-col space-y-3">
        {allLinks.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80 ${
                pathname === item.href ? "text-foreground" : "text-foreground/60"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
