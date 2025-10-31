"use client"

import Image from "next/image"
import { Trash2 } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { QuantityStepper } from "@/components/quantity-stepper"
import { useMemo, useState } from "react"

type CartItem = {
  id: string
  title: string
  subtitle?: string
  price: number
  image: string
  qty: number
}

const initialItems: CartItem[] = [
  {
    id: "1",
    title: "Ceramic Vase",
    subtitle: "Minimalist design",
    price: 45,
    image: "/ceramic-vase-minimalist.jpg",
    qty: 1,
  },
  {
    id: "2",
    title: "Knitted Throw Blanket",
    subtitle: "Soft, neutral color",
    price: 60,
    image: "/cozy-beige-blanket.jpg",
    qty: 1,
  },
]

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialItems)

  const { subtotal, shipping, total } = useMemo(() => {
    const sub = items.reduce((s, it) => s + it.price * it.qty, 0)
    const ship = sub > 0 ? 10 : 0
    return { subtotal: sub, shipping: ship, total: sub + ship }
  }, [items])

  const updateQty = (id: string, qty: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty } : it)))
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
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
                <div key={it.id} className="rounded-lg border bg-card p-4 flex items-center gap-4">
                  <div className="relative h-20 w-28 overflow-hidden rounded-md border">
                    <Image src={it.image || "/placeholder.svg"} alt="" fill className="object-cover" />
                  </div>
                  <div className="mr-auto">
                    <div className="font-medium">{it.title}</div>
                    {it.subtitle && <div className="text-sm text-muted-foreground">{it.subtitle}</div>}
                    <div className="mt-1 font-medium">${(it.price * it.qty).toFixed(2)}</div>
                  </div>
                  <QuantityStepper value={it.qty} onChange={(q) => updateQty(it.id, q)} />
                  <button
                    onClick={() => removeItem(it.id)}
                    className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-md border"
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
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between py-2 text-sm">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between py-3 font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="mt-4 h-10 w-full rounded-md bg-primary text-primary-foreground font-medium disabled:opacity-50"
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
