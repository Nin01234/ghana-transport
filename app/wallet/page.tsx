"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Smartphone,
  QrCode,
  History,
  TrendingUp,
  Shield,
} from "lucide-react"

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  date: string
  status: "completed" | "pending" | "failed"
}

const sampleTransactions: Transaction[] = [
  {
    id: "1",
    type: "debit",
    amount: 45.0,
    description: "Bus ticket - Accra to Kumasi",
    date: "2024-01-15T10:30:00Z",
    status: "completed",
  },
  {
    id: "2",
    type: "credit",
    amount: 100.0,
    description: "Wallet top-up via Mobile Money",
    date: "2024-01-14T14:20:00Z",
    status: "completed",
  },
  {
    id: "3",
    type: "debit",
    amount: 35.0,
    description: "Bus ticket - Accra to Cape Coast",
    date: "2024-01-12T08:15:00Z",
    status: "completed",
  },
  {
    id: "4",
    type: "credit",
    amount: 50.0,
    description: "Referral bonus",
    date: "2024-01-10T16:45:00Z",
    status: "completed",
  },
]

export default function WalletPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [balance, setBalance] = useState(156.5)
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)
  const [topUpAmount, setTopUpAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("momo")
  const [loading, setLoading] = useState(false)
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [qrAmount, setQrAmount] = useState("")
  const [qrCodeData, setQrCodeData] = useState("")

  const handleTopUp = async () => {
    if (!topUpAmount || Number.parseFloat(topUpAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to top up.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const amount = Number.parseFloat(topUpAmount)
      setBalance((prev) => prev + amount)

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "credit",
        amount,
        description: `Wallet top-up via ${paymentMethod === "momo" ? "Mobile Money" : "Card"}`,
        date: new Date().toISOString(),
        status: "completed",
      }

      setTransactions((prev) => [newTransaction, ...prev])
      setTopUpAmount("")

      toast({
        title: "Top-up successful!",
        description: `₵${amount} has been added to your wallet.`,
      })
    } catch (error) {
      toast({
        title: "Top-up failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddPaymentMethod = async () => {
    if (!newPaymentMethod) {
      toast({
        title: "Select payment method",
        description: "Please select a payment method to add.",
        variant: "destructive",
      })
      return
    }

    if (newPaymentMethod === "card") {
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        toast({
          title: "Missing information",
          description: "Please fill in all card details.",
          variant: "destructive",
        })
        return
      }
    } else if (newPaymentMethod === "momo") {
      if (!phoneNumber) {
        toast({
          title: "Missing phone number",
          description: "Please enter your mobile money phone number.",
          variant: "destructive",
        })
        return
      }
    }

    setLoading(true)

    try {
      // Simulate adding payment method
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Payment method added!",
        description: `${newPaymentMethod === "card" ? "Card" : "Mobile Money"} has been added successfully.`,
      })

      // Reset form
      setShowAddPaymentDialog(false)
      setNewPaymentMethod("")
      setCardNumber("")
      setExpiryDate("")
      setCvv("")
      setCardholderName("")
      setPhoneNumber("")
    } catch (error) {
      toast({
        title: "Failed to add payment method",
        description: "Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTransactionIcon = (type: string) => {
    return type === "credit" ? (
      <ArrowDownLeft className="h-4 w-4 text-green-600" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-red-600" />
    )
  }

  const handleQRPay = async () => {
    if (!qrAmount || Number.parseFloat(qrAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount for QR payment.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate QR code generation
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const amount = Number.parseFloat(qrAmount)
      const qrData = `ghana-transport://pay?amount=${amount}&wallet=${user?.id}&timestamp=${Date.now()}`
      setQrCodeData(qrData)
      setShowQRDialog(true)

      toast({
        title: "QR Code Generated!",
        description: "Scan the QR code to complete payment.",
      })
    } catch (error) {
      toast({
        title: "QR Generation Failed",
        description: "Please try again or use another payment method.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveTransaction = (transactionId: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== transactionId))
    toast({
      title: "Transaction Removed",
      description: "The transaction has been removed from your history.",
    })
  }

  const handleClearAllTransactions = () => {
    setTransactions([])
    toast({
      title: "All Transactions Cleared",
      description: "Your transaction history has been cleared.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Wallet</h1>
          <p className="text-muted-foreground">Manage your transport wallet and payment methods</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Wallet Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 ghana-gradient opacity-10" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Wallet Balance</CardTitle>
                    <CardDescription>Available for bookings</CardDescription>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-ghana-green/10 flex items-center justify-center">
                    <Wallet className="h-6 w-6 text-ghana-green" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-4xl font-bold text-ghana-green mb-4">₵{balance.toFixed(2)}</div>
                <div className="flex items-center space-x-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Top Up
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Top Up Wallet</DialogTitle>
                        <DialogDescription>Add money to your wallet for seamless bookings</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (₵)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            min="1"
                            step="0.01"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Payment Method</Label>
                          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="momo">
                                <div className="flex items-center">
                                  <Smartphone className="mr-2 h-4 w-4" />
                                  Mobile Money
                                </div>
                              </SelectItem>
                              <SelectItem value="card">
                                <div className="flex items-center">
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Credit/Debit Card
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Shield className="h-4 w-4" />
                          <span>Your payment is secured with 256-bit encryption</span>
                        </div>

                        <Button onClick={handleTopUp} disabled={loading || !topUpAmount} className="w-full">
                          {loading ? "Processing..." : `Top Up ₵${topUpAmount || "0.00"}`}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={handleQRPay}>
                        <QrCode className="mr-2 h-4 w-4" />
                        QR Pay
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]">
                      <DialogHeader>
                        <DialogTitle>QR Payment</DialogTitle>
                        <DialogDescription>
                          Generate a QR code for quick payment
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="qr-amount">Amount (₵)</Label>
                          <Input
                            id="qr-amount"
                            type="number"
                            placeholder="Enter amount"
                            value={qrAmount}
                            onChange={(e) => setQrAmount(e.target.value)}
                            min="1"
                            step="0.01"
                          />
                        </div>

                        {qrCodeData && (
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <div className="p-4 border-2 border-dashed border-muted-foreground rounded-lg">
                                <div className="text-center text-sm text-muted-foreground">
                                  QR Code Generated
                                </div>
                                <div className="text-xs text-muted-foreground mt-2 break-all">
                                  {qrCodeData}
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-center text-muted-foreground">
                              Scan this QR code with your mobile money app to complete payment
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Shield className="h-4 w-4" />
                          <span>Secure QR payment with encryption</span>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowQRDialog(false)}
                            className="flex-1"
                          >
                            Close
                          </Button>
                          <Button
                            onClick={handleQRPay}
                            disabled={loading || !qrAmount}
                            className="flex-1"
                          >
                            {loading ? "Generating..." : "Generate QR"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">This Month</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₵180.00</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
                  <History className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">Lifetime bookings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Trip Cost</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₵42.50</div>
                  <p className="text-xs text-muted-foreground">Per booking</p>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your recent wallet activity</CardDescription>
                  </div>
                  {transactions.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAllTransactions}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No transactions yet</p>
                    <p className="text-sm text-muted-foreground">Your transaction history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between group">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div
                              className={`text-sm font-medium ${
                                transaction.type === "credit" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {transaction.type === "credit" ? "+" : "-"}₵{transaction.amount.toFixed(2)}
                            </div>
                            <Badge
                              variant={transaction.status === "completed" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTransaction(transaction.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage your saved payment options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Mobile Money</p>
                      <p className="text-xs text-muted-foreground">**** **** 1234</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Primary</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Visa Card</p>
                      <p className="text-xs text-muted-foreground">**** **** **** 5678</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>

                <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription>
                        Add a new payment method to your wallet for faster checkouts.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Payment Method Type</Label>
                        <Select value={newPaymentMethod} onValueChange={setNewPaymentMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="momo">
                              <div className="flex items-center">
                                <Smartphone className="mr-2 h-4 w-4" />
                                Mobile Money
                              </div>
                            </SelectItem>
                            <SelectItem value="card">
                              <div className="flex items-center">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Credit/Debit Card
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {newPaymentMethod === "card" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardholder">Cardholder Name</Label>
                            <Input
                              id="cardholder"
                              placeholder="John Doe"
                              value={cardholderName}
                              onChange={(e) => setCardholderName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardnumber">Card Number</Label>
                            <Input
                              id="cardnumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              maxLength={19}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                maxLength={5}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                maxLength={4}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {newPaymentMethod === "momo" && (
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="+233 XX XXX XXXX"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter the phone number registered with your mobile money account
                          </p>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>Your payment information is secured with 256-bit encryption</span>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowAddPaymentDialog(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddPaymentMethod}
                          disabled={loading || !newPaymentMethod}
                          className="flex-1"
                        >
                          {loading ? "Adding..." : "Add Payment Method"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Keep your wallet secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Two-factor authentication</span>
                  </div>
                  <Badge variant="secondary">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Transaction PIN</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Setup
                  </Button>
                </div>

                <Separator />

                <Button variant="outline" className="w-full">
                  View Security Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
