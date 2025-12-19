"use client"

import Image from "next/image"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { QuantityStepper } from "@/components/quantity-stepper"
import { useMemo } from "react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/AuthContext"

export default function CartPage() {
  const { items, loading, updateQuantity: updateQty, removeFromCart: removeItem } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const { subtotal, deliveryFee, total } = useMemo(() => {
    const sub = items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0)
    const fee = sub >= 5000 ? 0 : 200
    return { subtotal: sub, deliveryFee: fee, total: sub + fee }
  }, [items])

  const handleUpdateQty = async (productId: string, qty: number) => {
    await updateQty(productId, qty)
  }

  const handleRemove = async (productId: string) => {
    await removeItem(productId)
  }

  const handleCheckout = () => {
    if (items.length === 0) return
    
    // Check if user is logged in
    if (!user) {
      router.push('/auth/login?returnUrl=/checkout')
      return
    }
    
    router.push('/checkout')
  }

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
          <div className="rounded-lg border bg-card p-6 text-center">
            <p className="text-muted-foreground">Loading your cart...</p>
          </div>
        </main>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            {items.length === 0 ? (
              <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">Your cart is empty.</div>
            ) : (
              items.map((it) => (
                <div key={it.productId} className="rounded-lg border bg-card p-4 flex items-center gap-4">
                  <div className="relative h-20 w-28 overflow-hidden rounded-md border">
                    <Image src={it.image || "/placeholder.svg"} alt="" fill className="object-cover" />
                  </div>
                  <div className="mr-auto">
                    <div className="font-medium">{it.title || 'Product'}</div>
                    <div className="mt-1 font-medium">Rs {Math.round((it.price || 0) * it.quantity)}</div>
                  </div>
                  <QuantityStepper value={it.quantity} onChange={(q) => handleUpdateQty(it.productId, q)} />
                  <button
                    onClick={() => handleRemove(it.productId)}
                    className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-destructive/10 transition-colors"
                    aria-label={`Remove ${it.title}`}
                    title="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <aside className="rounded-lg border bg-card p-4 h-max">
            <h2 className="font-semibold mb-3">Order Summary</h2>
            <div className="divide-y">
              <div className="flex items-center justify-between py-2 text-sm">
                <span>Subtotal</span>
                <span>Rs {Math.round(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between py-2 text-sm">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>Rs {deliveryFee}</span>
                )}
              </div>
              <div className="flex items-center justify-between py-3 font-semibold">
                <span>Total</span>
                <span>Rs {Math.round(total)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="mt-4 h-10 w-full rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-50 hover:shadow-lg hover:scale-105 transition-all"
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
