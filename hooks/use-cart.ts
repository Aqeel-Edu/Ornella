'use client'

import { useState, useEffect, useCallback } from 'react'
import { getCart, addToCart as addToCartAction, updateQuantity as updateQuantityAction, removeFromCart as removeFromCartAction, clearCart as clearCartAction } from '@/app/actions/cart-actions'

export interface CartItem {
  productId: string
  quantity: number
  title?: string
  price?: number
  image?: string
}

export interface UseCartReturn {
  items: CartItem[]
  loading: boolean
  error: string | null
  addToCart: (productId: string, quantity: number, productDetails?: { title?: string; price?: number; image?: string }) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

export function useCart(userId: string | null = null): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getCart(userId)
      
      if (result.success && result.cart) {
        setItems(result.cart.items || [])
      } else {
        setError(result.error || 'Failed to load cart')
      }
    } catch (err) {
      console.error('Error refreshing cart:', err)
      setError('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    refreshCart()
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      refreshCart()
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [refreshCart])

  const addToCart = async (
    productId: string,
    quantity: number,
    productDetails?: { title?: string; price?: number; image?: string }
  ) => {
    try {
      setError(null)
      const result = await addToCartAction(productId, quantity, userId, productDetails)
      
      if (result.success) {
        await refreshCart()
        window.dispatchEvent(new Event('cartUpdated'))
      } else {
        setError(result.error || 'Failed to add to cart')
      }
    } catch (err) {
      console.error('Error adding to cart:', err)
      setError('Failed to add to cart')
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setError(null)
      const result = await updateQuantityAction(productId, quantity, userId)
      
      if (result.success) {
        await refreshCart()
        window.dispatchEvent(new Event('cartUpdated'))
      } else {
        setError(result.error || 'Failed to update quantity')
      }
    } catch (err) {
      console.error('Error updating quantity:', err)
      setError('Failed to update quantity')
    }
  }

  const removeFromCart = async (productId: string) => {
    try {
      setError(null)
      const result = await removeFromCartAction(productId, userId)
      
      if (result.success) {
        await refreshCart()
        window.dispatchEvent(new Event('cartUpdated'))
      } else {
        setError(result.error || 'Failed to remove from cart')
      }
    } catch (err) {
      console.error('Error removing from cart:', err)
      setError('Failed to remove from cart')
    }
  }

  const clearCart = async () => {
    try {
      setError(null)
      const result = await clearCartAction(userId)
      
      if (result.success) {
        await refreshCart()
        window.dispatchEvent(new Event('cartUpdated'))
      } else {
        setError(result.error || 'Failed to clear cart')
      }
    } catch (err) {
      console.error('Error clearing cart:', err)
      setError('Failed to clear cart')
    }
  }

  return {
    items,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart
  }
}
