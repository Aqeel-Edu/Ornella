"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { getUserOrders, type Order, type OrderStatus } from "@/app/actions/order-actions"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle2, XCircle, Clock, MapPin, Phone, Mail, Calendar, CreditCard, ImageIcon } from "lucide-react"
import Image from "next/image"

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-800 border-amber-200",
    badgeColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0",
    iconColor: "text-amber-600",
  },
  processing: {
    label: "Processing",
    icon: Package,
    color: "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-800 border-blue-200",
    badgeColor: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0",
    iconColor: "text-blue-600",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "bg-gradient-to-br from-purple-50 to-pink-50 text-purple-800 border-purple-200",
    badgeColor: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0",
    iconColor: "text-purple-600",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "bg-gradient-to-br from-green-50 to-emerald-50 text-green-800 border-green-200",
    badgeColor: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0",
    iconColor: "text-green-600",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-gradient-to-br from-red-50 to-rose-50 text-red-800 border-red-200",
    badgeColor: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0",
    iconColor: "text-red-600",
  },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all")
  
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    async function loadOrders() {
      if (authLoading) return
      
      if (!user) {
        router.push('/auth/login?returnUrl=/orders')
        return
      }

      try {
        const userOrders = await getUserOrders(user.uid)
        setOrders(userOrders)
      } catch (error) {
        console.error('Error loading orders:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [user, authLoading, router])

  const filteredOrders =
    selectedStatus === "all" ? orders : orders.filter((order) => order.status === selectedStatus)

  if (authLoading || loading) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-4xl px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-balance">My Orders</h1>
          <p className="mt-2 text-muted-foreground">Track and manage your Ornella orders</p>
        </div>

        {/* Filter Buttons */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Button
            onClick={() => setSelectedStatus("all")}
            variant={selectedStatus === "all" ? "default" : "outline"}
            className="rounded-full"
          >
            All Orders
          </Button>
          <Button
            onClick={() => setSelectedStatus("pending")}
            variant={selectedStatus === "pending" ? "default" : "outline"}
            className="rounded-full"
          >
            <Clock className="h-4 w-4 mr-2" />
            Pending
          </Button>
          <Button
            onClick={() => setSelectedStatus("processing")}
            variant={selectedStatus === "processing" ? "default" : "outline"}
            className="rounded-full"
          >
            <Package className="h-4 w-4 mr-2" />
            Processing
          </Button>
          <Button
            onClick={() => setSelectedStatus("shipped")}
            variant={selectedStatus === "shipped" ? "default" : "outline"}
            className="rounded-full"
          >
            <Truck className="h-4 w-4 mr-2" />
            Shipped
          </Button>
          <Button
            onClick={() => setSelectedStatus("delivered")}
            variant={selectedStatus === "delivered" ? "default" : "outline"}
            className="rounded-full"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Delivered
          </Button>
          <Button
            onClick={() => setSelectedStatus("cancelled")}
            variant={selectedStatus === "cancelled" ? "default" : "outline"}
            className="rounded-full"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancelled
          </Button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => {
              const config = statusConfig[order.status] || statusConfig.pending
              const StatusIcon = config.icon
              const orderNumber = filteredOrders.length - index
              return (
                <Card key={order.id} className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300 hover:border-primary/20">
                  {/* Header */}
                  <div className={`p-6 ${config.color} border-b-2`}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-white/80 shadow-sm ${config.iconColor}`}>
                          <StatusIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="text-lg font-bold tracking-tight">
                            Order #{orderNumber}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm opacity-90">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                      <Badge className={`${config.badgeColor} px-4 py-2 text-sm font-semibold shadow-md`}>
                        {config.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Product Items with Images */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
                        Order Items
                      </h3>
                      <div className="space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                            <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-white shadow-sm">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-secondary">
                                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</div>
                              <div className="text-xs text-muted-foreground">
                                Quantity: <span className="font-medium text-foreground">{item.quantity}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                Unit Price: <span className="font-medium text-foreground">Rs {Math.round(item.price)}</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-lg font-bold">Rs {Math.round(item.price * item.quantity)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gradient-to-br from-secondary/30 to-secondary/10 rounded-xl p-5 mb-6 border border-secondary">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-muted-foreground">Subtotal</div>
                          <div className="font-semibold">Rs {Math.round(order.subtotal)}</div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-muted-foreground">Delivery Fee</div>
                          <div className="font-semibold text-green-600">
                            {(order.deliveryFee || order.shipping) === 0 ? "FREE DELIVERY" : `Rs ${Math.round(order.deliveryFee || order.shipping || 0)}`}
                          </div>
                        </div>
                        <div className="border-t pt-3 mt-3">
                          <div className="flex items-center justify-between">
                            <div className="text-base font-bold">Total Amount</div>
                            <div className="text-2xl font-bold text-primary">Rs {Math.round(order.totalAmount || order.total)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping & Contact Info */}
                    <div className="grid md:grid-cols-2 gap-5 mb-6">
                      {/* Shipping Address */}
                      <Card className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10 border-blue-200/50 dark:border-blue-900/30 shadow-sm">
                        <div className="p-5">
                          <div className="flex items-center gap-2.5 mb-4">
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h4 className="font-bold text-base">Shipping Address</h4>
                          </div>
                          <div className="ml-6 text-sm space-y-1.5 text-muted-foreground">
                            <div className="font-semibold text-foreground">{order.customerName}</div>
                            <div className="leading-relaxed">{order.shippingAddress.address}</div>
                            <div>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</div>
                          </div>
                        </div>
                      </Card>

                      {/* Contact Info */}
                      <Card className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/10 border-purple-200/50 dark:border-purple-900/30 shadow-sm">
                        <div className="p-5">
                          <div className="flex items-center gap-2.5 mb-4">
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                              <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h4 className="font-bold text-base">Contact Details</h4>
                          </div>
                          <div className="ml-6 text-sm space-y-2.5 text-muted-foreground">
                            <div className="flex items-center gap-2.5">
                              <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="font-medium text-foreground">{order.customerPhone}</span>
                            </div>
                            <div className="flex items-center gap-2.5">
                              <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="font-medium text-foreground">{order.customerEmail}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Order Notes */}
                    {order.notes && (
                      <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-5 border border-amber-200 dark:border-amber-900/30">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            <svg className="h-4 w-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-amber-900 dark:text-amber-100 mb-1">Order Notes</h4>
                            <p className="text-sm text-amber-800 dark:text-amber-200">{order.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gradient-to-r from-secondary/40 to-secondary/20 border-t-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Payment:</span>
                      <span className="font-semibold">Cash on Delivery</span>
                    </div>
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-medium mb-2">
                {orders.length === 0 ? "No orders yet" : "No orders found in this category"}
              </p>
              <p className="text-muted-foreground mb-4">
                {orders.length === 0 
                  ? "Start shopping to create your first order" 
                  : "Try selecting a different status filter"}
              </p>
              {orders.length === 0 && (
                <Button onClick={() => router.push('/shop')} className="mt-2">
                  Browse Products
                </Button>
              )}
            </Card>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
