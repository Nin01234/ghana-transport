"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { sendContactFormEmail } from "@/lib/emailjs"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  HeadphonesIcon,
  Building,
} from "lucide-react"

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak with our customer service team",
    details: ["+233509921758", "+233 30 123 4567"],
    action: "Call Now",
    available: "24/7 Available",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us your questions or feedback",
    details: ["manuel.young84@gmail.com", "support@ghanatransit.com"],
    action: "Send Email",
    available: "Response within 2 hours",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our support agents",
    details: ["Available on website", "Mobile app support"],
    action: "Start Chat",
    available: "Mon-Sun 6AM-10PM",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come to our main office",
    details: ["123 Liberation Road", "Accra, Ghana"],
    action: "Get Directions",
    available: "Mon-Fri 8AM-5PM",
  },
]

const offices = [
  {
    city: "Accra",
    address: "123 Liberation Road, Accra Central",
    phone: "+233509921758",
    email: "manuel.young84@gmail.com",
    hours: "Mon-Sun: 5:00 AM - 11:00 PM",
  },
  {
    city: "Kumasi",
    address: "45 Kejetia Market Road, Kumasi",
    phone: "+233509921758",
    email: "kumasi@ghanatransit.com",
    hours: "Mon-Sun: 5:30 AM - 10:30 PM",
  },
  {
    city: "Tamale",
    address: "78 Central Market Street, Tamale",
    phone: "+233509921758",
    email: "tamale@ghanatransit.com",
    hours: "Mon-Sun: 6:00 AM - 10:00 PM",
  },
]

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "general",
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Send email using EmailJS
      await sendContactFormEmail({
        ...formData,
        recipientEmail: "manuel.young84@gmail.com"
      })

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        category: "general",
      })
    } catch (error: any) {
      console.error("Email sending error:", error)
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleContactMethod = (method: (typeof contactMethods)[0]) => {
    switch (method.title) {
      case "Call Us":
        window.open("tel:+233509921758", "_self")
        break
      case "Email Us":
        window.open("mailto:manuel.young84@gmail.com", "_blank")
        break
      case "Live Chat":
        toast({
          title: "Live Chat",
          description: "Live chat feature coming soon! Please call or email us.",
        })
        break
      case "Visit Us":
        window.open("https://maps.google.com/?q=123+Liberation+Road,+Accra,+Ghana", "_blank")
        break
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Navigation />

        <div className="container py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-2 bg-blue-100 text-blue-800">
              <HeadphonesIcon className="mr-2 h-4 w-4" />
              Contact Support
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              We're Here to Help
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions, feedback, or need assistance? Our dedicated support team is ready to help you 24/7.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all hover:scale-105 cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg"
                  onClick={() => handleContactMethod(method)}
                >
                  <CardHeader className="text-center">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-2 mb-4">
                      {method.details.map((detail, idx) => (
                        <p key={idx} className="text-sm font-medium">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800">
                      {method.available}
                    </Badge>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      size="sm"
                    >
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-white/50"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input bg-white/50 rounded-md"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="booking">Booking Support</option>
                        <option value="technical">Technical Issue</option>
                        <option value="complaint">Complaint</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="bg-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="bg-white/50"
                      placeholder="Please describe your inquiry in detail..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5 text-blue-600" />
                    Our Offices
                  </CardTitle>
                  <CardDescription>Visit us at any of our locations across Ghana</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {offices.map((office, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-2">{office.city}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                          <span>{office.address}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a href={`tel:${office.phone}`} className="hover:text-blue-600">
                            {office.phone}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a href={`mailto:${office.email}`} className="hover:text-blue-600">
                            {office.email}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{office.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-blue-700">Follow Us</CardTitle>
                  <CardDescription>Stay connected on social media</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="icon" className="hover:bg-blue-100">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="hover:bg-blue-100">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="hover:bg-blue-100">
                      <Instagram className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="hover:bg-blue-100">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-red-700 flex items-center">
                    <Phone className="mr-2 h-5 w-5" />
                    Emergency Support
                  </CardTitle>
                  <CardDescription>For urgent travel assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">24/7 Hotline:</span>
                      <a href="tel:+233509921758" className="text-red-600 font-bold hover:text-red-700">
                        +233509921758
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Emergency Email:</span>
                                              <a href="mailto:manuel.young84@gmail.com" className="text-red-600 font-bold hover:text-red-700">
                        Emergency Support
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">How can I track my bus?</h3>
                    <p className="text-sm text-muted-foreground">
                      Use our live tracking feature in the app or website to see real-time bus locations and ETAs.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                    <p className="text-sm text-muted-foreground">
                      We accept mobile money, credit/debit cards, and cash payments at our stations.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Can I cancel my booking?</h3>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can cancel up to 2 hours before departure for a full refund.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">How do I earn reward points?</h3>
                    <p className="text-sm text-muted-foreground">
                      Earn points with every trip, referrals, and by leaving reviews. Check our rewards page for
                      details.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Is there WiFi on the buses?</h3>
                    <p className="text-sm text-muted-foreground">
                      Most of our buses offer free WiFi, air conditioning, and charging ports for your convenience.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">What if my bus is delayed?</h3>
                    <p className="text-sm text-muted-foreground">
                      You'll receive real-time notifications about delays, and we offer compensation for significant
                      delays.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
