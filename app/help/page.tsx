"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Send, Phone, Mail, Clock, HelpCircle, Search, Bot, User, Mic, MicOff } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "quick-reply" | "card"
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "How do I book a bus ticket?",
    answer:
      "You can book a bus ticket by going to the Routes page, selecting your origin and destination, choosing your preferred bus, and completing the payment process.",
    category: "Booking",
  },
  {
    id: "2",
    question: "What payment methods are accepted?",
    answer:
      "We accept Mobile Money (MTN, Vodafone, AirtelTigo), Visa/Mastercard, and wallet payments. You can also pay with cash at selected stations.",
    category: "Payment",
  },
  {
    id: "3",
    question: "Can I cancel or modify my booking?",
    answer:
      "Yes, you can cancel or modify your booking up to 2 hours before departure. Cancellation fees may apply depending on the timing.",
    category: "Booking",
  },
  {
    id: "4",
    question: "How do I track my bus in real-time?",
    answer:
      "Go to the Live Tracking page and search for your bus number or route. You can see the current location, ETA, and occupancy status.",
    category: "Tracking",
  },
  {
    id: "5",
    question: "What if my bus is delayed?",
    answer:
      "You will receive automatic notifications about delays. You can also contact the driver directly or our support team for updates.",
    category: "Support",
  },
]

const quickReplies = ["Book a ticket", "Track my bus", "Payment issues", "Cancel booking", "Contact support"]

export default function HelpPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello${user ? ` ${user.user_metadata?.full_name?.split(" ")[0] || "there"}` : ""}! 👋 I'm your GhanaTransit assistant. How can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognition = useRef<any>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize speech recognition if available
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognition.current = new SpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = "en-US"

      recognition.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognition.current.onerror = () => {
        setIsListening(false)
      }

      recognition.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (message: string = inputMessage) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(
      () => {
        const botResponse = generateBotResponse(message)
        setMessages((prev) => [...prev, botResponse])
        setIsTyping(false)
      },
      1000 + Math.random() * 2000,
    )
  }

  const generateBotResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()

    // Simple keyword-based responses
    if (lowerMessage.includes("book") || lowerMessage.includes("ticket")) {
      return {
        id: Date.now().toString(),
        content:
          "To book a ticket, go to the Routes page, select your origin and destination, choose your preferred bus and time, then complete the payment. Would you like me to guide you through the process?",
        sender: "bot",
        timestamp: new Date(),
      }
    }

    if (lowerMessage.includes("track") || lowerMessage.includes("location")) {
      return {
        id: Date.now().toString(),
        content:
          "You can track your bus in real-time on the Live Tracking page. Just enter your bus number or route, and you'll see the current location, ETA, and occupancy status. Do you have a specific bus you'd like to track?",
        sender: "bot",
        timestamp: new Date(),
      }
    }

    if (lowerMessage.includes("payment") || lowerMessage.includes("pay")) {
      return {
        id: Date.now().toString(),
        content:
          "We accept several payment methods: Mobile Money (MTN, Vodafone, AirtelTigo), Visa/Mastercard, and our secure wallet system. You can also top up your wallet for faster bookings. What payment issue are you experiencing?",
        sender: "bot",
        timestamp: new Date(),
      }
    }

    if (lowerMessage.includes("cancel") || lowerMessage.includes("refund")) {
      return {
        id: Date.now().toString(),
        content:
          "You can cancel your booking up to 2 hours before departure through the My Bookings page. Refunds are processed within 3-5 business days. Would you like help canceling a specific booking?",
        sender: "bot",
        timestamp: new Date(),
      }
    }

    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return {
        id: Date.now().toString(),
        content:
          "Hello! I'm here to help you with any questions about GhanaTransit. You can ask me about booking tickets, tracking buses, payments, or anything else. What would you like to know?",
        sender: "bot",
        timestamp: new Date(),
      }
    }

    // Default response
    return {
      id: Date.now().toString(),
      content:
        "I understand you're asking about that. Let me connect you with our support team for personalized assistance. In the meantime, you can check our FAQ section below or call our hotline at +233 30 123 4567.",
      sender: "bot",
      timestamp: new Date(),
    }
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true)
      recognition.current.start()
    }
  }

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop()
      setIsListening(false)
    }
  }

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
          <p className="text-muted-foreground">Get instant help with our AI assistant or browse our knowledge base</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-ghana-green/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-ghana-green" />
                  </div>
                  <div>
                    <CardTitle>GhanaTransit Assistant</CardTitle>
                    <CardDescription>AI-powered support • Available 24/7</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[80%] ${
                          message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <Avatar className="h-8 w-8">
                          {message.sender === "user" ? (
                            <>
                              <AvatarImage src="/placeholder-user.jpg" />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </>
                          ) : (
                            <AvatarFallback className="bg-ghana-green/10">
                              <Bot className="h-4 w-4 text-ghana-green" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div
                          className={`rounded-lg p-3 ${
                            message.sender === "user" ? "bg-ghana-green text-white" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === "user" ? "text-white/70" : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-ghana-green/10">
                            <Bot className="h-4 w-4 text-ghana-green" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                {messages.length === 1 && (
                  <div className="p-4 border-t">
                    <p className="text-sm text-muted-foreground mb-3">Quick actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickReplies.map((reply) => (
                        <Button key={reply} variant="outline" size="sm" onClick={() => handleQuickReply(reply)}>
                          {reply}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      {recognition.current && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 ${
                            isListening ? "text-red-500" : "text-muted-foreground"
                          }`}
                          onClick={isListening ? stopListening : startListening}
                        >
                          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    <Button onClick={() => handleSendMessage()} disabled={!inputMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Need immediate assistance?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Phone className="h-5 w-5 text-ghana-green" />
                  <div>
                    <p className="text-sm font-medium">Call Us</p>
                    <p className="text-xs text-muted-foreground">+233 30 123 4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-ghana-green" />
                  <div>
                    <p className="text-sm font-medium">Email Us</p>
                    <p className="text-xs text-muted-foreground">support@ghanatransit.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Clock className="h-5 w-5 text-ghana-green" />
                  <div>
                    <p className="text-sm font-medium">Support Hours</p>
                    <p className="text-xs text-muted-foreground">24/7 Available</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Search */}
            <Card>
              <CardHeader>
                <CardTitle>Search FAQ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search frequently asked questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Booking System</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment Gateway</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Live Tracking</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mobile App</span>
                  <Badge className="bg-green-100 text-green-800">Operational</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {["Booking", "Payment", "Tracking", "Support"].map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5" />
                    <span>{category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {filteredFAQs
                      .filter((faq) => faq.category === category)
                      .map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                          <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
