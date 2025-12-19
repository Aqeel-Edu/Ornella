"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/hooks/use-cart"
import { createOrder, type OrderItem } from "@/app/actions/order-actions"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Package, CreditCard, MapPin, User } from "lucide-react"

type CartItem = {
  id: string
  title?: string
  price?: number
  image?: string
  quantity: number
}

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderError, setOrderError] = useState("")
  const [placedOrderTotal, setPlacedOrderTotal] = useState(0)
  
  const { user, loading: authLoading } = useAuth()
  const { items, clearCart: clearCartAction } = useCart()
  const router = useRouter()

  const { subtotal, deliveryFee, total } = useMemo(() => {
    const sub = items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0)
    const fee = sub >= 5000 ? 0 : 200
    return { subtotal: sub, deliveryFee: fee, total: sub + fee }
  }, [items])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if user is authenticated
    if (!user) {
      router.push('/auth/login?returnUrl=/checkout')
      return
    }
    
    setIsSubmitting(true)
    setOrderError("")

    try {
      // Prepare order items
      const orderItems: OrderItem[] = items.map(item => ({
        id: item.productId,
        title: item.title || 'Unknown Product',
        price: item.price || 0,
        quantity: item.quantity,
        image: item.image
      }))

      // Create order in Firestore
      const result = await createOrder({
        userId: user.uid,
        userEmail: user.email || '',
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode.trim() || "000",
        notes: formData.notes,
        items: orderItems,
        subtotal,
        deliveryFee,
        totalAmount: total
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to create order')
      }

      // Save order total before clearing cart
      setPlacedOrderTotal(total)
      
      // Clear cart and show success
      await clearCartAction()
      setOrderPlaced(true)
    } catch (error: any) {
      console.error('Error placing order:', error)
      setOrderError(error.message || 'Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (orderPlaced) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="rounded-lg border bg-card p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Package className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. We'll contact you shortly to confirm delivery details.
            </p>
            <div className="space-y-2 text-sm text-left bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Total:</span>
                <span className="font-semibold">Rs {Math.round(placedOrderTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">Cash on Delivery</span>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push('/orders')}
                className="inline-flex h-10 items-center justify-center rounded-md border border-primary bg-transparent px-6 text-sm font-medium text-primary hover:bg-primary/10 transition-all"
              >
                View My Orders
              </button>
              <button
                onClick={() => router.push('/shop')}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:shadow-lg hover:scale-105 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <div className="rounded-lg border bg-card p-8">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <button
              onClick={() => window.location.href = '/shop'}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:shadow-lg hover:scale-105 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
        
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {orderError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                <p className="text-sm text-destructive font-medium">{orderError}</p>
              </div>
            )}
            
            {/* Contact Information */}
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Contact Information</h2>
              </div>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1.5">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Delivery Address</h2>
              </div>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium mb-1.5">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1.5">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Lahore"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium mb-1.5">Postal Code (Optional)</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="54000"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-1.5">Delivery Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="Any specific delivery instructions..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-lg border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Payment Method</h2>
              </div>
              <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Cash on Delivery</div>
                  <div className="text-xs text-muted-foreground">Pay when you receive your order</div>
                </div>
              </div>
            </div>
          </form>

          {/* Order Summary */}
          <aside className="h-max">
            <div className="rounded-lg border bg-card p-6 sticky top-4">
              <h2 className="font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 text-sm">
                    <div className="relative h-12 w-12 overflow-hidden rounded border flex-shrink-0">
                      <img src={item.image || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.title}</div>
                      <div className="text-xs text-muted-foreground">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium">Rs {Math.round((item.price || 0) * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs {Math.round(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-medium">FREE DELIVERY</span>
                  ) : (
                    <span>Rs {deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold text-base">
                  <span>Total</span>
                  <span>Rs {Math.round(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="mt-6 h-11 w-full rounded-md bg-primary text-primary-foreground font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>

              <p className="mt-3 text-xs text-center text-muted-foreground">
                By placing this order, you agree to our terms and conditions
              </p>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
