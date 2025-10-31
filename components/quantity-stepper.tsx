"use client"

import { Minus, Plus } from "lucide-react"
import { useState } from "react"

export function QuantityStepper({
  initial = 1,
  value,
  onChange,
}: {
  initial?: number
  value?: number
  onChange?: (qty: number) => void
}) {
  const [internal, setInternal] = useState(initial)
  const qty = value ?? internal
  const setQty = (n: number) => {
    if (onChange) onChange(n)
    else setInternal(n)
  }
  return (
    <div className="inline-flex items-center rounded-full border bg-card h-9">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => setQty(Math.max(1, qty - 1))}
        className="h-9 w-9 inline-flex items-center justify-center text-muted-foreground hover:bg-muted rounded-l-full"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="px-3 text-sm">{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => setQty(qty + 1)}
        className="h-9 w-9 inline-flex items-center justify-center text-muted-foreground hover:bg-muted rounded-r-full"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
