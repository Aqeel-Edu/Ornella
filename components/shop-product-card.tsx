"use client"

import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  title?: string
  price?: number
  image?: string
  description?: string
  category?: string
  featured?: boolean
  stock?: number
  slug?: string
  createdAt?: string | null
  updatedAt?: string | null
}

interface ShopProductCardProps {
  product: Product
}

export function ShopProductCard({ product }: ShopProductCardProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden group">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3]">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={String(product.title ?? '')}
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
          />
        </div>
        <div className="p-3">
          <div className="text-sm">{product.title}</div>
          <div className="text-muted-foreground text-sm">${product.price}</div>
        </div>
      </Link>
      <div className="px-3 pb-3 -mt-2 flex justify-end">
        <button
          className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus:outline-none"
          aria-label={`Add ${product.title}`}
          onClick={(e) => {
            e.preventDefault()
            ;(e.currentTarget as HTMLButtonElement).blur()
          }}
        >
          <span aria-hidden>+</span> Add
        </button>
      </div>
    </div>
  )
}