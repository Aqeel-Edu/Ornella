import { db } from './firebaseConfig'
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

export interface CartItem {
  productId: string
  quantity: number
  title?: string
  price?: number
  image?: string
}

export interface Cart {
  userId: string | null
  guestId: string | null
  items: CartItem[]
  createdAt?: any
  updatedAt?: any
}

// Get or create guest ID from cookie
export function getGuestId(): string {
  if (typeof window === 'undefined') return ''
  
  let guestId = getCookie('guestId')
  if (!guestId) {
    guestId = uuidv4()
    setCookie('guestId', guestId, 60) // 60 days expiry
  }
  return guestId
}

// Helper to set cookie
function setCookie(name: string, value: string, days: number) {
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`
}

// Helper to get cookie
function getCookie(name: string): string | null {
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

// Helper to delete cookie
function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// Get cart ID based on user or guest
export function getCartId(userId: string | null): string {
  if (userId) {
    return `user_${userId}`
  }
  return `guest_${getGuestId()}`
}

// Get cart from Firestore
export async function getCartFromFirestore(userId: string | null): Promise<Cart | null> {
  try {
    const cartId = getCartId(userId)
    const cartRef = doc(db, 'carts', cartId)
    const cartSnap = await getDoc(cartRef)
    
    if (cartSnap.exists()) {
      return cartSnap.data() as Cart
    }
    return null
  } catch (error) {
    console.error('Error getting cart:', error)
    return null
  }
}

// Add item to cart in Firestore
export async function addToCartFirestore(
  productId: string,
  quantity: number,
  userId: string | null,
  productDetails?: { title?: string; price?: number; image?: string }
): Promise<void> {
  try {
    const cartId = getCartId(userId)
    const cartRef = doc(db, 'carts', cartId)
    const cartSnap = await getDoc(cartRef)
    
    const newItem: CartItem = {
      productId,
      quantity,
      ...productDetails
    }
    
    if (cartSnap.exists()) {
      // Update existing cart
      const cart = cartSnap.data() as Cart
      const existingItemIndex = cart.items.findIndex(item => item.productId === productId)
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        cart.items[existingItemIndex].quantity += quantity
      } else {
        // Add new item
        cart.items.push(newItem)
      }
      
      await updateDoc(cartRef, {
        items: cart.items,
        updatedAt: serverTimestamp()
      })
    } else {
      // Create new cart
      const newCart: Cart = {
        userId: userId,
        guestId: userId ? null : getGuestId(),
        items: [newItem],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await setDoc(cartRef, newCart)
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    throw error
  }
}

// Update item quantity in cart
export async function updateCartItemQuantity(
  productId: string,
  quantity: number,
  userId: string | null
): Promise<void> {
  try {
    const cartId = getCartId(userId)
    const cartRef = doc(db, 'carts', cartId)
    const cartSnap = await getDoc(cartRef)
    
    if (cartSnap.exists()) {
      const cart = cartSnap.data() as Cart
      const itemIndex = cart.items.findIndex(item => item.productId === productId)
      
      if (itemIndex > -1) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or less
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
  } catch (error) {
    console.error('Error updating cart item:', error)
    throw error
  }
}

// Remove item from cart
export async function removeFromCartFirestore(
  productId: string,
  userId: string | null
): Promise<void> {
  try {
    const cartId = getCartId(userId)
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
  } catch (error) {
    console.error('Error removing from cart:', error)
    throw error
  }
}

// Clear entire cart
export async function clearCartFirestore(userId: string | null): Promise<void> {
  try {
    const cartId = getCartId(userId)
    const cartRef = doc(db, 'carts', cartId)
    
    await deleteDoc(cartRef)
  } catch (error) {
    console.error('Error clearing cart:', error)
    throw error
  }
}

// Merge guest cart into user cart on login
export async function mergeCartsOnLogin(userId: string): Promise<void> {
  try {
    const guestId = getGuestId()
    if (!guestId) return
    
    const guestCartId = `guest_${guestId}`
    const userCartId = `user_${userId}`
    
    const guestCartRef = doc(db, 'carts', guestCartId)
    const userCartRef = doc(db, 'carts', userCartId)
    
    const [guestCartSnap, userCartSnap] = await Promise.all([
      getDoc(guestCartRef),
      getDoc(userCartRef)
    ])
    
    if (!guestCartSnap.exists()) {
      // No guest cart to merge
      deleteCookie('guestId')
      return
    }
    
    const guestCart = guestCartSnap.data() as Cart
    
    if (userCartSnap.exists()) {
      // Merge guest cart into existing user cart
      const userCart = userCartSnap.data() as Cart
      
      // Merge items
      guestCart.items.forEach(guestItem => {
        const existingItemIndex = userCart.items.findIndex(
          item => item.productId === guestItem.productId
        )
        
        if (existingItemIndex > -1) {
          // Add quantities together
          userCart.items[existingItemIndex].quantity += guestItem.quantity
        } else {
          // Add new item
          userCart.items.push(guestItem)
        }
      })
      
      await updateDoc(userCartRef, {
        items: userCart.items,
        updatedAt: serverTimestamp()
      })
    } else {
      // Create new user cart from guest cart
      const newUserCart: Cart = {
        userId: userId,
        guestId: null,
        items: guestCart.items,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      await setDoc(userCartRef, newUserCart)
    }
    
    // Delete guest cart and cookie
    await deleteDoc(guestCartRef)
    deleteCookie('guestId')
    
    // Dispatch event to update UI
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cartUpdated'))
    }
  } catch (error) {
    console.error('Error merging carts:', error)
    throw error
  }
}
