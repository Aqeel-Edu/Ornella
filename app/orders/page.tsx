"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle2, XCircle } from "lucide-react"

type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled"

interface Order {
  id: string
  orderNumber: string
  date: string
  total: number
  status: OrderStatus
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORN-2025-001",
    date: "2025-01-15",
    total: 249.99,
    status: "delivered",
    items: [
      { name: "Minimalist Sofa", quantity: 1, price: 799 },
      { name: "Cozy Throw Pillow", quantity: 2, price: 49 },
    ],
  },
  {
    id: "2",
    orderNumber: "ORN-2025-002",
    date: "2025-01-20",
    total: 189.99,
    status: "shipped",
    items: [
      { name: "Modern Coffee Table", quantity: 1, price: 349 },
      { name: "Elegant Floor Lamp", quantity: 1, price: 199 },
    ],
  },
  {
    id: "3",
    orderNumber: "ORN-2025-003",
    date: "2025-01-25",
    total: 134.99,
    status: "pending",
    items: [
      { name: "Ceramic Vase Set", quantity: 1, price: 89 },
      { name: "Abstract Wall Art", quantity: 1, price: 129 },
    ],
  },
  {
    id: "4",
    orderNumber: "ORN-2025-004",
    date: "2025-01-10",
    total: 89.99,
    status: "delivered",
    items: [{ name: "Minimalist Vase", quantity: 3, price: 25 }],
  },
  {
    id: "5",
    orderNumber: "ORN-2025-005",
    date: "2025-01-22",
    total: 199.99,
    status: "shipped",
    items: [{ name: "Cozy Throw Blanket", quantity: 2, price: 45 }],
  },
  {
    id: "6",
    orderNumber: "ORN-2025-006",
    date: "2025-01-18",
    total: 159.99,
    status: "cancelled",
    items: [{ name: "Decorative Mirror", quantity: 1, price: 159.99 }],
  },
]

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Package,
    color: "bg-amber-50 text-amber-700 border-amber-200",
    badgeColor: "bg-amber-100 text-amber-800",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "bg-blue-50 text-blue-700 border-blue-200",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-700 border-green-200",
    badgeColor: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-50 text-red-700 border-red-200",
    badgeColor: "bg-red-100 text-red-800",
  },
}

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all")

  const filteredOrders =
    selectedStatus === "all" ? mockOrders : mockOrders.filter((order) => order.status === selectedStatus)

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
            <Package className="h-4 w-4 mr-2" />
            Pending
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
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const config = statusConfig[order.status]
              const StatusIcon = config.icon
              return (
                <Card key={order.id} className="overflow-hidden border hover:shadow-md transition-shadow">
                  <div className={`p-6 ${config.color} border-b`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <StatusIcon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">Order {order.orderNumber}</div>
                          <div className="text-sm opacity-75">
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                      <Badge className={config.badgeColor}>{config.label}</Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-muted-foreground">Qty: {item.quantity}</div>
                          </div>
                          <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="text-lg font-semibold">${order.total.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-secondary/30 border-t flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent">
                      View Details
                    </Button>
                    {order.status === "delivered" && (
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Reorder
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })
          ) : (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No orders found in this category</p>
            </Card>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
