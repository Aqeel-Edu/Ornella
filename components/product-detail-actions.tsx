"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { QuantityStepper } from "@/components/quantity-stepper"
import { useCart } from "@/hooks/use-cart"

interface Product {
  id: string
  title?: string
  price?: number
  image?: string
  description?: string
  category?: string
  [key: string]: any
}

export function ProductDetailActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = async () => {
    setAdding(true)
    try {
      await addToCart(product.id, quantity, {
        title: product.title,
        price: product.price,
        image: product.image
      })
      setTimeout(() => {
        setAdding(false)
        setQuantity(1)
      }, 2000)
    } catch (error) {
      console.error('Failed to add to cart:', error)
      setAdding(false)
    }
  }

  return (
    <div className="mt-6 flex items-center gap-3">
      <QuantityStepper value={quantity} onChange={setQuantity} />
      <button 
        onClick={handleAddToCart}
        disabled={adding}
        className="h-10 flex-1 rounded-md bg-primary text-primary-foreground font-medium hover:shadow-md transition-shadow disabled:opacity-70"
      >
        {adding ? '✓ Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  )
}
