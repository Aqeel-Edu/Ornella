// Client-side cart management utilities
export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  const cart = localStorage.getItem('cart')
  return cart ? JSON.parse(cart) : []
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('cart', JSON.stringify(cart))
  // Dispatch custom event so components can update
  window.dispatchEvent(new CustomEvent('cartUpdated'))
}

export function addToCart(product: { id: string; title?: string; price?: number; image?: string }): void {
  const cart = getCart()
  const existingItem = cart.find(item => item.id === product.id)
  
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: product.id,
      title: product.title || 'Untitled Product',
      price: product.price || 0,
      image: product.image || '/placeholder.svg',
      quantity: 1
    })
  }
  
  saveCart(cart)
}

export function removeFromCart(productId: string): void {
  const cart = getCart()
  const filtered = cart.filter(item => item.id !== productId)
  saveCart(filtered)
}

export function updateQuantity(productId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(productId)
    return
  }
  
  const cart = getCart()
  const item = cart.find(item => item.id === productId)
  if (item) {
    item.quantity = quantity
    saveCart(cart)
  }
}

export function clearCart(): void {
  saveCart([])
}

export function getCartCount(): number {
  const cart = getCart()
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}

export function getCartTotal(): number {
  const cart = getCart()
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
}
