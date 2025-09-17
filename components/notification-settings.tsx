"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useNotificationService } from "@/components/notification-service"
import { useToast } from "@/hooks/use-toast"
import {
  Bell,
  BellOff,
  Smartphone,
  Volume2,
  VolumeX,
  Clock,
  Bus,
  CreditCard,
  AlertTriangle,
  Settings,
  TestTube,
} from "lucide-react"

interface NotificationPreferences {
  busUpdates: boolean
  delayAlerts: boolean
  arrivalNotices: boolean
  bookingReminders: boolean
  paymentUpdates: boolean
  promotions: boolean
  sound: boolean
  vibration: boolean
  quietHours: boolean
  quietStart: string
  quietEnd: string
}

export function NotificationSettings() {
  const { toast } = useToast()
  const { isSupported, permission, isSubscribed, requestPermission, subscribe, unsubscribe, sendTestNotification } =
    useNotificationService()

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    busUpdates: true,
    delayAlerts: true,
    arrivalNotices: true,
    bookingReminders: true,
    paymentUpdates: true,
    promotions: false,
    sound: true,
    vibration: true,
    quietHours: false,
    quietStart: "22:00",
    quietEnd: "07:00",
  })

  const [loading, setLoading] = useState(false)

  const handlePermissionRequest = async () => {
    setLoading(true)
    const granted = await requestPermission()
    if (granted) {
      toast({
        title: "Notifications Enabled",
        description: "You'll now receive push notifications for bus updates.",
      })
    } else {
      toast({
        title: "Permission Denied",
        description: "Please enable notifications in your browser settings.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleSubscribe = async () => {
    setLoading(true)
    const success = await subscribe()
    if (success) {
      toast({
        title: "Subscribed Successfully",
        description: "You're now subscribed to push notifications.",
      })
    } else {
      toast({
        title: "Subscription Failed",
        description: "Failed to subscribe to push notifications.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleUnsubscribe = async () => {
    setLoading(true)
    const success = await unsubscribe()
    if (success) {
      toast({
        title: "Unsubscribed",
        description: "You've been unsubscribed from push notifications.",
      })
    } else {
      toast({
        title: "Unsubscribe Failed",
        description: "Failed to unsubscribe from push notifications.",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean | string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
    // In a real app, this would save to the server
    toast({
      title: "Preferences Updated",
      description: "Your notification preferences have been saved.",
    })
  }

  const getPermissionStatus = () => {
    switch (permission) {
      case "granted":
        return { color: "bg-green-100 text-green-800", text: "Enabled" }
      case "denied":
        return { color: "bg-red-100 text-red-800", text: "Blocked" }
      default:
        return { color: "bg-yellow-100 text-yellow-800", text: "Not Set" }
    }
  }

  const permissionStatus = getPermissionStatus()

  return (
    <div className="space-y-6">
      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notification Status
          </CardTitle>
          <CardDescription>Manage your push notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Browser Support</span>
                <Badge variant={isSupported ? "default" : "secondary"}>
                  {isSupported ? "Supported" : "Not Supported"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {isSupported
                  ? "Your browser supports push notifications"
                  : "Your browser doesn't support push notifications"}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Permission Status</span>
                <Badge className={permissionStatus.color}>{permissionStatus.text}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {permission === "granted"
                  ? "Notifications are allowed"
                  : permission === "denied"
                    ? "Notifications are blocked"
                    : "Permission not requested yet"}
              </p>
            </div>
            {permission !== "granted" && (
              <Button onClick={handlePermissionRequest} disabled={loading || !isSupported}>
                {loading ? "Requesting..." : "Enable Notifications"}
              </Button>
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Push Subscription</span>
                <Badge variant={isSubscribed ? "default" : "secondary"}>{isSubscribed ? "Active" : "Inactive"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {isSubscribed ? "You're subscribed to push notifications" : "Subscribe to receive push notifications"}
              </p>
            </div>
            <div className="space-x-2">
              {permission === "granted" && (
                <>
                  <Button variant="outline" size="sm" onClick={sendTestNotification} disabled={!isSubscribed}>
                    <TestTube className="mr-2 h-4 w-4" />
                    Test
                  </Button>
                  {isSubscribed ? (
                    <Button variant="outline" onClick={handleUnsubscribe} disabled={loading}>
                      {loading ? "Unsubscribing..." : "Unsubscribe"}
                    </Button>
                  ) : (
                    <Button onClick={handleSubscribe} disabled={loading}>
                      {loading ? "Subscribing..." : "Subscribe"}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Notification Types
          </CardTitle>
          <CardDescription>Choose which notifications you want to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bus className="h-5 w-5 text-ghana-green" />
              <div>
                <Label htmlFor="busUpdates" className="font-medium">
                  Bus Updates
                </Label>
                <p className="text-sm text-muted-foreground">Real-time bus location and status updates</p>
              </div>
            </div>
            <Switch
              id="busUpdates"
              checked={preferences.busUpdates}
              onCheckedChange={(checked) => handlePreferenceChange("busUpdates", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <Label htmlFor="delayAlerts" className="font-medium">
                  Delay Alerts
                </Label>
                <p className="text-sm text-muted-foreground">Notifications when your bus is delayed</p>
              </div>
            </div>
            <Switch
              id="delayAlerts"
              checked={preferences.delayAlerts}
              onCheckedChange={(checked) => handlePreferenceChange("delayAlerts", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <Label htmlFor="arrivalNotices" className="font-medium">
                  Arrival Notices
                </Label>
                <p className="text-sm text-muted-foreground">Alerts when your bus is approaching</p>
              </div>
            </div>
            <Switch
              id="arrivalNotices"
              checked={preferences.arrivalNotices}
              onCheckedChange={(checked) => handlePreferenceChange("arrivalNotices", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-purple-500" />
              <div>
                <Label htmlFor="bookingReminders" className="font-medium">
                  Booking Reminders
                </Label>
                <p className="text-sm text-muted-foreground">Reminders about upcoming trips</p>
              </div>
            </div>
            <Switch
              id="bookingReminders"
              checked={preferences.bookingReminders}
              onCheckedChange={(checked) => handlePreferenceChange("bookingReminders", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-green-500" />
              <div>
                <Label htmlFor="paymentUpdates" className="font-medium">
                  Payment Updates
                </Label>
                <p className="text-sm text-muted-foreground">Notifications about payment status</p>
              </div>
            </div>
            <Switch
              id="paymentUpdates"
              checked={preferences.paymentUpdates}
              onCheckedChange={(checked) => handlePreferenceChange("paymentUpdates", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-ghana-gold" />
              <div>
                <Label htmlFor="promotions" className="font-medium">
                  Promotions & Offers
                </Label>
                <p className="text-sm text-muted-foreground">Special deals and promotional offers</p>
              </div>
            </div>
            <Switch
              id="promotions"
              checked={preferences.promotions}
              onCheckedChange={(checked) => handlePreferenceChange("promotions", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sound & Vibration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Volume2 className="mr-2 h-5 w-5" />
            Sound & Vibration
          </CardTitle>
          <CardDescription>Configure notification sounds and vibration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {preferences.sound ? (
                <Volume2 className="h-5 w-5 text-ghana-green" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label htmlFor="sound" className="font-medium">
                  Sound
                </Label>
                <p className="text-sm text-muted-foreground">Play sound for notifications</p>
              </div>
            </div>
            <Switch
              id="sound"
              checked={preferences.sound}
              onCheckedChange={(checked) => handlePreferenceChange("sound", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-ghana-green" />
              <div>
                <Label htmlFor="vibration" className="font-medium">
                  Vibration
                </Label>
                <p className="text-sm text-muted-foreground">Vibrate device for notifications</p>
              </div>
            </div>
            <Switch
              id="vibration"
              checked={preferences.vibration}
              onCheckedChange={(checked) => handlePreferenceChange("vibration", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {preferences.quietHours ? <BellOff className="mr-2 h-5 w-5" /> : <Bell className="mr-2 h-5 w-5" />}
            Quiet Hours
          </CardTitle>
          <CardDescription>Set times when you don't want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="quietHours" className="font-medium">
                Enable Quiet Hours
              </Label>
              <p className="text-sm text-muted-foreground">Silence notifications during specified hours</p>
            </div>
            <Switch
              id="quietHours"
              checked={preferences.quietHours}
              onCheckedChange={(checked) => handlePreferenceChange("quietHours", checked)}
            />
          </div>

          {preferences.quietHours && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quietStart">Start Time</Label>
                  <input
                    id="quietStart"
                    type="time"
                    value={preferences.quietStart}
                    onChange={(e) => handlePreferenceChange("quietStart", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="quietEnd">End Time</Label>
                  <input
                    id="quietEnd"
                    type="time"
                    value={preferences.quietEnd}
                    onChange={(e) => handlePreferenceChange("quietEnd", e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
