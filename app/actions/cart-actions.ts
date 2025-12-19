'use server'

import { cookies } from 'next/headers'
import { db } from '@/lib/firebaseConfig'
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

interface CartItem {
  productId: string
  quantity: number
  title?: string
  price?: number
  image?: string
}

interface Cart {
  userId: string | null
  guestId: string | null
  items: CartItem[]
  createdAt?: Date | null
  updatedAt?: Date | null
}

// Get or create guest ID from cookie
async function getGuestId(): Promise<string> {
  const cookieStore = await cookies()
  let guestId = cookieStore.get('guestId')?.value
  
  if (!guestId) {
    guestId = uuidv4()
    cookieStore.set('guestId', guestId, {
      maxAge: 60 * 60 * 24 * 60, // 60 days
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
  }
  
  return guestId
}

// Get cart ID based on user or guest
async function getCartId(userId: string | null): Promise<string> {
  if (userId) {
    return `user_${userId}`
  }
  const guestId = await getGuestId()
  return `guest_${guestId}`
}

export async function getCart(userId: string | null = null) {
  try {
    const cartId = await getCartId(userId)
    const cartRef = doc(db, 'carts', cartId)
    const cartSnap = await getDoc(cartRef)
    
    if (cartSnap.exists()) {
      const cart = cartSnap.data() as Cart
      return {
        success: true,
        cart: {
          userId: cart.userId,
          guestId: cart.guestId,
          items: cart.items || [],
          // Convert Firestore Timestamps to Date objects
          createdAt: cart.createdAt?.toDate?.() || null,
          updatedAt: cart.updatedAt?.toDate?.() || null
        }
      }
    }
    
    return {
      success: true,
      cart: {
        userId,
        guestId: userId ? null : await getGuestId(),
        items: [],
        createdAt: null,
        updatedAt: null
      }
    }
  } catch (error) {
    console.error('Error getting cart:', error)
    return {
      success: false,
      error: 'Failed to get cart'
    }
  }
}

export async function addToCart(
  productId: string,
  quantity: number,
  userId: string | null = null,
  productDetails?: { title?: string; price?: number; image?: string }
) {
  try {
    const cartId = await getCartId(userId)
    const cartRef = doc(db, 'carts', cartId)
    const cartSnap = await getDoc(cartRef)
    
    const newItem: CartItem = {
      productId,
      quantity,
      ...productDetails
    }
    
    if (cartSnap.exists()) {
      const cart = cartSnap.data() as Cart
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId)
      
      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity
      } else {
        cart.items.push(newItem)
      }
      
      await updateDoc(cartRef, {
        items: cart.items,
        updatedAt: serverTimestamp()
      })
    } else {
      const newCart: Cart = {
        userId: userId,
        guestId: userId ? null : await getGuestId(),
        items: [newItem],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await setDoc(cartRef, newCart)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error adding to cart:', error)
    return { success: false, error: 'Failed to add to cart' }
  }
}

export async function updateQuantity(
  productId: string,
  quantity: number,
  userId: string | null = null
) {
  try {
    const cartId = await getCartId(userId)
    const cartRef = doc(db, 'carts', cartId)
    const cartSnap = await getDoc(cartRef)
    
    if (cartSnap.exists()) {
      const cart = cartSnap.data() as Cart
      const itemIndex = cart.items.findIndex(item => item.productId === productId)
      
      if (itemIndex > -1) {
        if (quantity <= 0) {
          cart.items.splice(itemIndex, 1)
        } else {
          cart.items[itemIndex].quantity = quantity
        }
        
        await updateDoc(cartRef, {
          items: cart.items,
          updatedAt: serverTimestamp()
        })
      }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating quantity:', error)
    return { success: false, error: 'Failed to update quantity' }
  }
}

export async function removeFromCart(
  productId: string,
  userId: string | null = null
) {
  try {
    const cartId = await getCartId(userId)
    const cartRef = doc(db, 'carts', cartId)
    const cartSnap = await getDoc(cartRef)
    
    if (cartSnap.exists()) {
      const cart = cartSnap.data() as Cart
      cart.items = cart.items.filter(item => item.productId !== productId)
      
      await updateDoc(cartRef, {
        items: cart.items,
        updatedAt: serverTimestamp()
      })
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error removing from cart:', error)
    return { success: false, error: 'Failed to remove from cart' }
  }
}

export async function clearCart(userId: string | null = null) {
  try {
    const cartId = await getCartId(userId)
    const cartRef = doc(db, 'carts', cartId)
    await deleteDoc(cartRef)
    
    return { success: true }
  } catch (error) {
    console.error('Error clearing cart:', error)
    return { success: false, error: 'Failed to clear cart' }
  }
}

export async function mergeCartOnLogin(userId: string) {
  try {
    const cookieStore = await cookies()
    const guestId = cookieStore.get('guestId')?.value
    
    if (!guestId) {
      return { success: true, message: 'No guest cart to merge' }
    }
    
    const guestCartId = `guest_${guestId}`
    const userCartId = `user_${userId}`
    
    const guestCartRef = doc(db, 'carts', guestCartId)
    const userCartRef = doc(db, 'carts', userCartId)
    
    const [guestCartSnap, userCartSnap] = await Promise.all([
      getDoc(guestCartRef),
      getDoc(userCartRef)
    ])
    
    if (!guestCartSnap.exists()) {
      cookieStore.delete('guestId')
      return { success: true, message: 'No guest cart to merge' }
    }
    
    const guestCart = guestCartSnap.data() as Cart
    
    if (userCartSnap.exists()) {
      const userCart = userCartSnap.data() as Cart
      
      guestCart.items.forEach(guestItem => {
        const existingItemIndex = userCart.items.findIndex(
          item => item.productId === guestItem.productId
        )
        
        if (existingItemIndex > -1) {
          userCart.items[existingItemIndex].quantity += guestItem.quantity
        } else {
          userCart.items.push(guestItem)
        }
      })
      
      await updateDoc(userCartRef, {
        items: userCart.items,
        updatedAt: serverTimestamp()
      })
    } else {
      const newUserCart: Cart = {
        userId: userId,
        guestId: null,
        items: guestCart.items,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await setDoc(userCartRef, newUserCart)
    }
    
    await deleteDoc(guestCartRef)
    cookieStore.delete('guestId')
    
    return { success: true, message: 'Cart merged successfully' }
  } catch (error) {
    console.error('Error merging cart:', error)
    return { success: false, error: 'Failed to merge cart' }
  }
}
