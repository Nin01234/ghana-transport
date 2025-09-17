"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { sendEmail } from "@/lib/emailjs"

export default function TestEmailJSPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    from_name: "Test User",
    from_email: "test@example.com",
    message: "This is a test message from Ghana Transport app",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await sendEmail(formData)
      toast({
        title: "Email sent successfully!",
        description: `Message ID: ${result.messageId}`,
      })
    } catch (error: any) {
      console.error("Email sending error:", error)
      toast({
        title: "Failed to send email",
        description: error.message || "Please check the console for details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>EmailJS Test Page</CardTitle>
            <CardDescription>
              Test your EmailJS configuration with the following credentials:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Your EmailJS Configuration:</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Service ID:</strong> service_yrh023k</div>
                <div><strong>Template ID:</strong> template_ai626fd</div>
                <div><strong>Public Key:</strong> ZXrwCuxwrxS2AQqD8</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="from_name">Name</Label>
                <Input
                  id="from_name"
                  value={formData.from_name}
                  onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="from_email">Email</Label>
                <Input
                  id="from_email"
                  type="email"
                  value={formData.from_email}
                  onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send Test Email"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
