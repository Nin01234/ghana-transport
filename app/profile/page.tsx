"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Calendar, MapPin, Edit, Save, X, Camera, Shield, Award, Trash2 } from "lucide-react"

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone: string
  date_of_birth: string
  address: string
  emergency_contact: string
  emergency_phone: string
  loyalty_points: number
  member_since: string
  avatar_url?: string
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    date_of_birth: "",
    address: "",
    emergency_contact: "",
    emergency_phone: "",
  })

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error && error.code !== "PGRST116") {
        throw error
      }

      const profileData = data || {
        id: user.id,
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        date_of_birth: "",
        address: "",
        emergency_contact: "",
        emergency_phone: "",
        loyalty_points: 0,
        member_since: user.created_at,
        avatar_url: user.user_metadata?.avatar_url,
      }

      setProfile(profileData)
      setFormData({
        full_name: profileData.full_name || "",
        phone: profileData.phone || "",
        date_of_birth: profileData.date_of_birth || "",
        address: profileData.address || "",
        emergency_contact: profileData.emergency_contact || "",
        emergency_phone: profileData.emergency_phone || "",
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error loading profile",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user || !profile) return

    try {
      setSaving(true)
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...formData,
        email: profile.email,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      setProfile({ ...profile, ...formData })
      setEditing(false)

      // Log activity
      await supabase.from("user_activities").insert({
        user_id: user.id,
        activity_type: "profile_updated",
        description: "Updated profile information",
        created_at: new Date().toISOString(),
      })

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      date_of_birth: profile?.date_of_birth || "",
      address: profile?.address || "",
      emergency_contact: profile?.emergency_contact || "",
      emergency_phone: profile?.emergency_phone || "",
    })
    setEditing(false)
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      // In a real app, you would call a server function to handle account deletion
      toast({
        title: "Account Deletion",
        description: "Please contact support to delete your account.",
      })
    } catch (error) {
      console.error("Error deleting account:", error)
      toast({
        title: "Deletion Failed",
        description: "Please contact support for assistance.",
        variant: "destructive",
      })
    }
  }

  const getLevelInfo = (points: number) => {
    if (points < 500) return { level: "Bronze", color: "text-amber-600", bgColor: "bg-amber-100" }
    if (points < 1000) return { level: "Silver", color: "text-gray-500", bgColor: "bg-gray-100" }
    if (points < 2000) return { level: "Gold", color: "text-yellow-500", bgColor: "bg-yellow-100" }
    return { level: "Platinum", color: "text-purple-500", bgColor: "bg-purple-100" }
  }

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <Navigation />
          <div className="container py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading your profile...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!profile) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <Navigation />
          <div className="container py-8">
            <div className="text-center">
              <p className="text-muted-foreground">Profile not found.</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const levelInfo = getLevelInfo(profile.loyalty_points)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation />

        <div className="container py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-lg text-muted-foreground">Manage your account information and preferences</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <Avatar className="h-24 w-24 mx-auto">
                      <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {profile.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || profile.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  </div>

                  <h2 className="text-xl font-bold mb-2">{profile.full_name || "User"}</h2>
                  <p className="text-muted-foreground mb-4">{profile.email}</p>

                  <Badge className={`${levelInfo.bgColor} ${levelInfo.color} px-4 py-2 mb-4`}>
                    <Award className="mr-2 h-4 w-4" />
                    {levelInfo.level} Member
                  </Badge>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Loyalty Points:</span>
                      <span className="font-medium">{profile.loyalty_points.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Member Since:</span>
                      <span className="font-medium">{new Date(profile.member_since).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <User className="mr-2 h-5 w-5 text-blue-600" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>Your basic account information</CardDescription>
                    </div>
                    {!editing ? (
                      <Button onClick={() => setEditing(true)} variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button onClick={handleSave} disabled={saving}>
                          <Save className="mr-2 h-4 w-4" />
                          {saving ? "Saving..." : "Save"}
                        </Button>
                        <Button onClick={handleCancel} variant="outline">
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      {editing ? (
                        <Input
                          id="full_name"
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="bg-white/50"
                        />
                      ) : (
                        <div className="p-3 bg-muted/30 rounded-md">{profile.full_name || "Not provided"}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="p-3 bg-muted/30 rounded-md flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                        {profile.email}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {editing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+233 XX XXX XXXX"
                          className="bg-white/50"
                        />
                      ) : (
                        <div className="p-3 bg-muted/30 rounded-md flex items-center">
                          <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                          {profile.phone || "Not provided"}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Date of Birth</Label>
                      {editing ? (
                        <Input
                          id="date_of_birth"
                          type="date"
                          value={formData.date_of_birth}
                          onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                          className="bg-white/50"
                        />
                      ) : (
                        <div className="p-3 bg-muted/30 rounded-md flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {profile.date_of_birth
                            ? new Date(profile.date_of_birth).toLocaleDateString()
                            : "Not provided"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    {editing ? (
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Your address"
                        className="bg-white/50"
                      />
                    ) : (
                      <div className="p-3 bg-muted/30 rounded-md flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {profile.address || "Not provided"}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-red-600" />
                    Emergency Contact
                  </CardTitle>
                  <CardDescription>Contact information for emergencies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergency_contact">Emergency Contact Name</Label>
                      {editing ? (
                        <Input
                          id="emergency_contact"
                          value={formData.emergency_contact}
                          onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                          placeholder="Contact person name"
                          className="bg-white/50"
                        />
                      ) : (
                        <div className="p-3 bg-muted/30 rounded-md">{profile.emergency_contact || "Not provided"}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergency_phone">Emergency Contact Phone</Label>
                      {editing ? (
                        <Input
                          id="emergency_phone"
                          value={formData.emergency_phone}
                          onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                          placeholder="+233 XX XXX XXXX"
                          className="bg-white/50"
                        />
                      ) : (
                        <div className="p-3 bg-muted/30 rounded-md">{profile.emergency_phone || "Not provided"}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-red-600">Account Actions</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Sign Out</h4>
                      <p className="text-sm text-muted-foreground">Sign out of your account on this device</p>
                    </div>
                    <Button variant="outline" onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-600">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
