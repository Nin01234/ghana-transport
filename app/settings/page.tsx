"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { NotificationSettings } from "@/components/notification-settings"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/auth-provider"
import { useSupabase } from "@/hooks/use-supabase"
import { useToast } from "@/components/ui/use-toast"
import { 
  Bell, 
  User, 
  Shield, 
  Smartphone, 
  Globe, 
  Palette, 
  Bus, 
  Star, 
  MapPin, 
  CreditCard, 
  Settings, 
  Zap,
  Crown,
  Wifi,
  Coffee,
  Shield as ShieldIcon,
  Smartphone as SmartphoneIcon,
  Globe as GlobeIcon,
  Palette as PaletteIcon,
  Bus as BusIcon,
  Star as StarIcon,
  MapPin as MapPinIcon,
  CreditCard as CreditCardIcon,
  Settings as SettingsIcon,
  Zap as ZapIcon,
  Crown as CrownIcon,
  Wifi as WifiIcon,
  Coffee as CoffeeIcon,
} from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { supabase, checkSupabase } = useSupabase()
  const { toast } = useToast()
  const [initializing, setInitializing] = useState(true)
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("en")
  const [currency, setCurrency] = useState("GHS")
  const [timezone, setTimezone] = useState("Africa/Accra")
  const [vipPreferences, setVipPreferences] = useState({
    autoUpgrade: true,
    priorityBooking: true,
    exclusiveNotifications: true,
    vipLoungeAccess: true,
    premiumSupport: true,
  })
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [saving, setSaving] = useState(false)

  // Load persisted simple preferences from localStorage
  useEffect(() => {
    try {
      const p = localStorage.getItem("app:prefs")
      if (p) {
        const parsed = JSON.parse(p)
        if (parsed.theme) setTheme(parsed.theme)
        if (parsed.language) setLanguage(parsed.language)
        if (parsed.currency) setCurrency(parsed.currency)
        if (parsed.timezone) setTimezone(parsed.timezone)
      }
      const v = localStorage.getItem("app:vip-prefs")
      if (v) setVipPreferences({ ...vipPreferences, ...JSON.parse(v) })
    } catch {}
  }, [])

  useEffect(() => {
    const prefs = { theme, language, currency, timezone }
    try { localStorage.setItem("app:prefs", JSON.stringify(prefs)) } catch {}
  }, [theme, language, currency, timezone])

  useEffect(() => {
    try { localStorage.setItem("app:vip-prefs", JSON.stringify(vipPreferences)) } catch {}
  }, [vipPreferences])

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setInitializing(false)
        return
      }

      // Defaults from auth metadata/email
      setEmail(user.email || "")
      setFullName(
        (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          (user.email?.split("@")[0] as string) ||
          "",
      )
      setPhone((user.user_metadata?.phone as string) || "")

      // Prefer profiles table if available
      try {
        if (checkSupabase() && supabase) {
          const { data, error } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", user.id)
            .maybeSingle()
          if (!error && data) {
            if (data.full_name) setFullName(data.full_name as string)
            if (data.phone) setPhone(data.phone as string)
          }
        }
      } catch (e) {
        console.warn("Profile fetch failed:", e)
      } finally {
        setInitializing(false)
      }
    }

    loadProfile()
  }, [user, supabase, checkSupabase])

  const saveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      // Update auth user metadata for immediate reflection across app
      if (checkSupabase() && supabase) {
        await supabase.auth.updateUser({ data: { full_name: fullName, phone } })
        const { error } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            email: user.email!,
            full_name: fullName,
            phone,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" },
        )
        if (error) throw error
      }
      toast({ title: "Profile updated", description: "Your changes have been saved." })
    } catch (e: any) {
      console.error(e)
      toast({ title: "Update failed", description: e?.message || "Could not save profile.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navigation />

        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <Badge variant="secondary" className="mb-4 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-200">
                <Star className="mr-2 h-4 w-4" />
                VIP Settings
              </Badge>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Settings & Preferences
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Customize your Ghana VIP Transport experience with premium features and exclusive settings
              </p>
            </div>
          </div>

          <Tabs defaultValue="vip" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8 gap-2 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <TabsTrigger value="vip" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white">
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">VIP</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-orange-600 data-[state=active]:text-white">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="devices" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">Devices</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-rose-600 data-[state=active]:text-white">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
            </TabsList>

            {/* VIP Settings */}
            <TabsContent value="vip">
              <div className="grid gap-6">
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-800">
                      <Crown className="mr-2 h-5 w-5" />
                      VIP Bus Preferences
                    </CardTitle>
                    <CardDescription className="text-purple-700">
                      Customize your premium travel experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base font-medium">Auto VIP Upgrade</Label>
                            <p className="text-sm text-muted-foreground">Automatically upgrade to VIP when available</p>
                          </div>
                          <Switch
                            checked={vipPreferences.autoUpgrade}
                            onCheckedChange={(checked) => setVipPreferences({ ...vipPreferences, autoUpgrade: checked })}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base font-medium">Priority Booking</Label>
                            <p className="text-sm text-muted-foreground">Get priority access to new routes</p>
                          </div>
                          <Switch
                            checked={vipPreferences.priorityBooking}
                            onCheckedChange={(checked) => setVipPreferences({ ...vipPreferences, priorityBooking: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base font-medium">VIP Lounge Access</Label>
                            <p className="text-sm text-muted-foreground">Access exclusive VIP lounges at stations</p>
                          </div>
                          <Switch
                            checked={vipPreferences.vipLoungeAccess}
                            onCheckedChange={(checked) => setVipPreferences({ ...vipPreferences, vipLoungeAccess: checked })}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base font-medium">Exclusive Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive VIP-only offers and updates</p>
                          </div>
                          <Switch
                            checked={vipPreferences.exclusiveNotifications}
                            onCheckedChange={(checked) => setVipPreferences({ ...vipPreferences, exclusiveNotifications: checked })}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base font-medium">Premium Support</Label>
                            <p className="text-sm text-muted-foreground">24/7 dedicated VIP customer support</p>
                          </div>
                          <Switch
                            checked={vipPreferences.premiumSupport}
                            onCheckedChange={(checked) => setVipPreferences({ ...vipPreferences, premiumSupport: checked })}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-purple-200" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white/60 rounded-lg border border-purple-200">
                        <Bus className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-purple-800">VIP Routes</h3>
                        <p className="text-sm text-purple-600">Premium routes with luxury amenities</p>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-lg border border-purple-200">
                        <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-purple-800">VIP Status</h3>
                        <p className="text-sm text-purple-600">Exclusive benefits and rewards</p>
                      </div>
                      <div className="text-center p-4 bg-white/60 rounded-lg border border-purple-200">
                        <Crown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-purple-800">VIP Experience</h3>
                        <p className="text-sm text-purple-600">Luxury travel experience</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>

            {/* Profile Settings */}
            <TabsContent value="profile">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <User className="mr-2 h-5 w-5" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Manage your personal information and VIP profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        className="bg-white/60"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={initializing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="bg-white/60"
                        value={email}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        className="bg-white/60"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={initializing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vipLevel">VIP Level</Label>
                      <Select value="gold" disabled>
                        <SelectTrigger className="bg-white/60">
                          <SelectValue placeholder="Select VIP level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bronze">Bronze VIP</SelectItem>
                          <SelectItem value="silver">Silver VIP</SelectItem>
                          <SelectItem value="gold">Gold VIP</SelectItem>
                          <SelectItem value="platinum">Platinum VIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={saveProfile}
                    disabled={saving || initializing}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {saving ? "Saving..." : "Update Profile"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy & Security */}
            <TabsContent value="privacy">
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-red-800">
                    <Shield className="mr-2 h-5 w-5" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription className="text-red-700">
                    Control your privacy and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base font-medium">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base font-medium">Location Sharing</Label>
                        <p className="text-sm text-muted-foreground">Share location for better tracking</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base font-medium">Data Analytics</Label>
                        <p className="text-sm text-muted-foreground">Help improve our services</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    Export My Data
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences">
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-indigo-800">
                    <Settings className="mr-2 h-5 w-5" />
                    Travel Preferences
                  </CardTitle>
                  <CardDescription className="text-indigo-700">
                    Customize your travel experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="bg-white/60">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="tw">Twi</SelectItem>
                          <SelectItem value="ga">Ga</SelectItem>
                          <SelectItem value="ew">Ewe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="bg-white/60">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GHS">Ghana Cedi (₵)</SelectItem>
                          <SelectItem value="USD">US Dollar ($)</SelectItem>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger className="bg-white/60">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Africa/Accra">Accra (GMT+0)</SelectItem>
                          <SelectItem value="Africa/Lagos">Lagos (GMT+1)</SelectItem>
                          <SelectItem value="Europe/London">London (GMT+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="bg-white/60">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Connected Devices */}
            <TabsContent value="devices">
              <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-cyan-800">
                    <Smartphone className="mr-2 h-5 w-5" />
                    Connected Devices
                  </CardTitle>
                  <CardDescription className="text-cyan-700">
                    Manage devices connected to your VIP account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/60 rounded-lg border border-cyan-200">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-cyan-600" />
                        <div>
                          <p className="font-medium">iPhone 15 Pro</p>
                          <p className="text-sm text-muted-foreground">Last active: 2 minutes ago</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Current</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/60 rounded-lg border border-cyan-200">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-cyan-600" />
                        <div>
                          <p className="font-medium">Samsung Galaxy S24</p>
                          <p className="text-sm text-muted-foreground">Last active: 1 hour ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                        Remove
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="border-cyan-200 text-cyan-600 hover:bg-cyan-50">
                    Add New Device
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance */}
            <TabsContent value="appearance">
              <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-pink-800">
                    <Palette className="mr-2 h-5 w-5" />
                    Appearance & Theme
                  </CardTitle>
                  <CardDescription className="text-pink-700">
                    Customize the look and feel of your app
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white/60 rounded-lg border border-pink-200 cursor-pointer hover:border-pink-400 transition-colors">
                      <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-lg mx-auto mb-2"></div>
                      <h3 className="font-medium text-pink-800">Light</h3>
                    </div>
                    <div className="text-center p-4 bg-white/60 rounded-lg border-2 border-pink-400 rounded-lg cursor-pointer">
                      <div className="w-16 h-16 bg-gray-900 border-2 border-gray-600 rounded-lg mx-auto mb-2"></div>
                      <h3 className="font-medium text-pink-800">Dark</h3>
                    </div>
                    <div className="text-center p-4 bg-white/60 rounded-lg border border-pink-200 cursor-pointer hover:border-pink-400 transition-colors">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 border-2 border-gray-300 rounded-lg mx-auto mb-2"></div>
                      <h3 className="font-medium text-pink-800">Auto</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base font-medium">Reduced Motion</Label>
                        <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base font-medium">High Contrast</Label>
                        <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  )
}
