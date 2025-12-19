"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/hooks/use-cart"

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
  const [adding, setAdding] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    setAdding(true)
    try {
      await addToCart(product.id, 1, {
        title: product.title,
        price: product.price,
        image: product.image
      })
      setTimeout(() => setAdding(false), 800)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      setAdding(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden group">
      <Link href={`/products/${product.slug || product.id}`} className="block">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={String(product.title ?? '')}
            fill
            className="object-cover transition-transform group-hover:scale-[1.02]"
          />
        </div>
        <div className="p-3">
          <div className="text-sm font-medium">{product.title}</div>
          <div className="text-muted-foreground text-sm mt-0.5">Rs {Math.round(product.price || 0)}</div>
        </div>
      </Link>
      <div className="px-3 pb-3 -mt-2 flex justify-end">
        <button
          className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-lg hover:scale-105 transition-all focus-visible:ring-2 focus-visible:ring-ring/50 focus:outline-none disabled:opacity-70"
          aria-label={`Add ${product.title}`}
          onClick={handleAddToCart}
          disabled={adding}
        >
          <span aria-hidden>+</span> {adding ? 'Added to Cart!' : 'Add'}
        </button>
      </div>
    </div>
  )
}