"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

import { type SerializedProduct } from "@/lib/utils"

export function ProductCard({ product, compact = false }: { product: SerializedProduct; compact?: boolean }) {
  const [adding, setAdding] = useState(false)
  const onAdd = () => {
    setAdding(true)
    setTimeout(() => setAdding(false), 600)
  }

  return (
    <div className={cn("rounded-lg border bg-card overflow-hidden group")}>
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image 
            src={product.image || "/placeholder.svg"} 
            alt={product.title || 'Product'} 
            fill 
            className="object-cover transition-transform group-hover:scale-105" 
          />
        </div>
        <div className="p-3">
          <div className="text-sm font-medium">{product.title || 'Untitled Product'}</div>
          <div className="mt-1 text-muted-foreground text-sm">${product.price?.toFixed(2) || '0.00'}</div>
        </div>
      </Link>
      <div className="px-3 pb-3 -mt-1">
        <button
          onClick={(e) => {
            e.preventDefault();
            onAdd();
          }}
          className="w-full inline-flex items-center justify-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus:outline-none"
          aria-label={`Add ${product.title}`}
        >
          <Plus className={cn("h-3 w-3", adding && "animate-ping")} />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
