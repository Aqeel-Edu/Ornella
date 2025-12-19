# Guest Cart Architecture Implementation

## Overview
This implementation provides a complete guest cart system with Firestore persistence, automatic cart merging on login, and cross-device synchronization.

## Features

### 1. Guest Cart with Firestore Persistence
- **Guest ID Generation**: Automatically generates a UUID for unauthenticated users
- **Cookie Storage**: Stores guest ID in HTTP-only cookies (60-day expiry)
- **Firestore Structure**:
  ```
  carts/{cartId}
    userId: string | null
    guestId: string | null
    items: [
      {
        productId: string
        quantity: number
        title: string (optional)
        price: number (optional)
        image: string (optional)
      }
    ]
    createdAt: timestamp
    updatedAt: timestamp
  ```

### 2. Cart Merging on Login
- Automatically merges guest cart into user cart upon authentication
- Handles duplicate products by summing quantities
- Cleans up guest cart and cookies after merge
- Emits `cartUpdated` event to refresh UI

### 3. Server Actions
Located in `/app/actions/cart-actions.ts`:

- **`getCart(userId)`**: Retrieves cart from Firestore
- **`addToCart(productId, quantity, userId, productDetails)`**: Adds item to cart
- **`updateQuantity(productId, quantity, userId)`**: Updates item quantity
- **`removeFromCart(productId, userId)`**: Removes item from cart
- **`clearCart(userId)`**: Clears entire cart
- **`mergeCartOnLogin(userId)`**: Merges guest cart into user cart

### 4. Client-Side Hook
Located in `/hooks/use-cart.ts`:

```typescript
const { 
  items,           // Cart items array
  loading,         // Loading state
  error,           // Error message
  addToCart,       // Add item function
  updateQuantity,  // Update quantity function
  removeFromCart,  // Remove item function
  clearCart,       // Clear cart function
  refreshCart      // Refresh cart function
} = useCart(userId)
```

### 5. Client-Side Utilities
Located in `/lib/cart-firestore.ts`:

- Browser-side cart operations
- Cookie management helpers
- Event dispatching for UI updates

## Usage Examples

### Adding to Cart (Client Component)
```typescript
'use client'

import { useCart } from '@/hooks/use-cart'

export function ProductCard({ product }) {
  const { addToCart } = useCart()
  
  const handleAdd = async () => {
    await addToCart(product.id, 1, {
      title: product.title,
      price: product.price,
      image: product.image
    })
  }
  
  return <button onClick={handleAdd}>Add to Cart</button>
}
```

### Displaying Cart (Client Component)
```typescript
'use client'

import { useCart } from '@/hooks/use-cart'

export function CartPage() {
  const { items, loading, updateQuantity, removeFromCart } = useCart()
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {items.map(item => (
        <div key={item.productId}>
          <span>{item.title}</span>
          <input 
            value={item.quantity} 
            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
          />
          <button onClick={() => removeFromCart(item.productId)}>Remove</button>
        </div>
      ))}
    </div>
  )
}
```

### Merging Cart on Login (Server Action)
```typescript
import { mergeCartOnLogin } from '@/app/actions/cart-actions'

// Call this after successful authentication
const result = await mergeCartOnLogin(userId)
if (result.success) {
  // Cart merged successfully
  // Redirect or refresh UI
}
```

## Security Features

1. **HTTP-Only Cookies**: Guest IDs are stored in HTTP-only cookies (server actions)
2. **SameSite Protection**: Cookies use `sameSite: 'lax'` for CSRF protection
3. **Secure in Production**: Cookies marked as `secure` in production environment
4. **Server-Side Validation**: All cart operations validated on server

## Cross-Device Persistence

- **Guest Users**: Cart persists on single device via cookies
- **Authenticated Users**: Cart syncs across all devices via Firestore
- **Login Merge**: Guest cart automatically merges with user cart on login

## Migration from LocalStorage

To migrate existing localStorage cart to this system:

1. On component mount, check for localStorage cart
2. If found, add all items to Firestore cart using `addToCart`
3. Clear localStorage after successful migration
4. Dispatch `cartUpdated` event to refresh UI

Example:
```typescript
useEffect(() => {
  const migrateCart = async () => {
    const localCart = localStorage.getItem('cart')
    if (localCart) {
      const items = JSON.parse(localCart)
      for (const item of items) {
        await addToCart(item.id, item.quantity, item)
      }
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cartUpdated'))
    }
  }
  migrateCart()
}, [])
```

## Event System

The implementation uses a custom event `cartUpdated` to notify components of cart changes:

```typescript
// Listen for cart updates
window.addEventListener('cartUpdated', () => {
  // Refresh cart display
})

// Dispatch cart update
window.dispatchEvent(new Event('cartUpdated'))
```

## Firestore Rules

Add these security rules to Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /carts/{cartId} {
      // Allow read if cart belongs to user or guest
      allow read: if cartId.matches('user_' + request.auth.uid) 
                  || cartId.matches('guest_.*');
      
      // Allow write if cart belongs to authenticated user
      allow write: if request.auth != null 
                   && cartId.matches('user_' + request.auth.uid);
      
      // Allow guest cart creation/update
      allow create, update: if cartId.matches('guest_.*');
    }
  }
}
```

## Dependencies

- `firebase` (v11.0.0+): Firestore database
- `uuid` (v11.0.3+): Guest ID generation
- `@types/uuid`: TypeScript types for uuid
- Next.js 15+: Server actions and cookies API

## Notes

- Cart items expire when guest cookie expires (60 days default)
- Authenticated user carts persist indefinitely
- Guest carts are automatically deleted after merge
- All operations are atomic and handle race conditions
