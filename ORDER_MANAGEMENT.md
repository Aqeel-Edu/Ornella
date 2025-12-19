# Order Management System Documentation

## Overview
Complete order management system integrated with Firebase Authentication and Firestore database.

## Features
- ✅ Order Creation and Storage in Firestore
- ✅ User-specific Order History
- ✅ Order Status Tracking (pending, processing, shipped, delivered, cancelled)
- ✅ Authentication Required for Checkout
- ✅ Automatic Cart Clearing After Order
- ✅ Detailed Order Information Display
- ✅ Order Filtering by Status
- ✅ Beautiful UI with Status Badges

## Database Structure

### Orders Collection (`orders`)
```typescript
{
  id: string                    // Auto-generated Firestore document ID
  userId: string                // Firebase Auth user ID
  userEmail: string             // User's email address
  customerName: string          // Customer's full name
  customerEmail: string         // Customer's email
  customerPhone: string         // Customer's phone number
  shippingAddress: {
    address: string             // Street address
    city: string                // City
    postalCode: string          // Postal code (defaults to "000" if not provided)
  }
  items: OrderItem[]            // Array of ordered items
  subtotal: number              // Subtotal amount
  shipping: number              // Shipping cost
  total: number                 // Total amount (subtotal + shipping)
  status: OrderStatus           // Order status
  notes: string                 // Optional customer notes
  createdAt: Timestamp          // Order creation timestamp
  updatedAt: Timestamp          // Last update timestamp
}
```

### OrderItem Structure
```typescript
{
  id: string                    // Product ID
  title: string                 // Product title
  price: number                 // Product price
  quantity: number              // Quantity ordered
  image?: string                // Product image URL (optional)
}
```

## Order Status Flow

```
pending → processing → shipped → delivered
                    ↓
                cancelled
```

### Status Definitions
1. **pending**: Order received, awaiting processing
2. **processing**: Order is being prepared
3. **shipped**: Order has been shipped to customer
4. **delivered**: Order successfully delivered
5. **cancelled**: Order was cancelled

## Server Actions

### `createOrder(orderData)`
Creates a new order in Firestore.

**Parameters:**
```typescript
{
  userId: string
  userEmail: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  city: string
  postalCode: string
  notes?: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
}
```

**Returns:**
```typescript
{
  success: boolean
  orderId?: string      // Firestore document ID if successful
  error?: string        // Error message if failed
}
```

**Usage:**
```typescript
const result = await createOrder({
  userId: user.uid,
  userEmail: user.email,
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "+92 300 1234567",
  address: "123 Main Street",
  city: "Lahore",
  postalCode: "54000",
  notes: "Please call before delivery",
  items: [
    { id: "prod1", title: "Sofa", price: 799, quantity: 1 }
  ],
  subtotal: 799,
  shipping: 10,
  total: 809
})

if (result.success) {
  console.log("Order created with ID:", result.orderId)
}
```

### `getUserOrders(userId)`
Retrieves all orders for a specific user, sorted by creation date (newest first).

**Parameters:**
- `userId: string` - Firebase Auth user ID

**Returns:**
- `Order[]` - Array of user's orders

**Usage:**
```typescript
const orders = await getUserOrders(user.uid)
console.log(`User has ${orders.length} orders`)
```

### `updateOrderStatus(orderId, status)`
Updates the status of an existing order.

**Parameters:**
- `orderId: string` - Firestore document ID
- `status: OrderStatus` - New status

**Returns:**
```typescript
{
  success: boolean
  error?: string
}
```

**Usage:**
```typescript
const result = await updateOrderStatus("abc123", "shipped")
if (result.success) {
  console.log("Order status updated successfully")
}
```

## Checkout Flow

1. **Cart Review**: User reviews cart items on checkout page
2. **Authentication Check**: System verifies user is logged in
   - If not logged in → redirect to `/auth/login?returnUrl=/checkout`
   - After login → cart merges and returns to checkout
3. **Form Completion**: User fills in shipping and contact information
4. **Order Creation**: On submit, order is saved to Firestore
5. **Cart Clearing**: Cart is automatically cleared after successful order
6. **Success Screen**: Shows order confirmation with navigation options

## Orders Page

### Features
- **Authentication Required**: Redirects to login if not authenticated
- **Real-time Loading**: Shows loading state while fetching orders
- **Status Filtering**: Filter orders by status (all, pending, processing, shipped, delivered, cancelled)
- **Detailed Display**: Shows all order information including:
  - Order ID and date
  - Status badge with icon
  - Item list with quantities and prices
  - Subtotal, shipping, and total
  - Shipping address
  - Customer contact information
  - Order notes (if any)
  - Payment method
- **Empty States**: Helpful messages when no orders exist or no orders match filter

### Status Badge Colors
- **Pending**: Amber (yellow/orange)
- **Processing**: Blue
- **Shipped**: Indigo
- **Delivered**: Green
- **Cancelled**: Red

## Integration with Cart System

The order system is fully integrated with the cart management:

1. **Cart Data**: Orders pull directly from the Firestore cart
2. **Item Details**: Product ID, title, price, quantity, and image
3. **Automatic Clearing**: Cart is cleared via `clearCart()` server action after order placement
4. **Cart Merging**: Guest cart items are preserved through authentication flow

## Security

### Firestore Security Rules
Add these rules to your Firestore to secure orders:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders collection
    match /orders/{orderId} {
      // Users can only read their own orders
      allow read: if request.auth != null 
                  && resource.data.userId == request.auth.uid;
      
      // Users can only create orders for themselves
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid;
      
      // Only admins can update orders (add admin claim check)
      allow update: if request.auth != null 
                    && request.auth.token.admin == true;
      
      // Only admins can delete orders
      allow delete: if request.auth != null 
                    && request.auth.token.admin == true;
    }
  }
}
```

## Payment Method

Currently supports:
- **Cash on Delivery (COD)**: Payment collected upon delivery

Future payment methods can be added by:
1. Adding payment gateway integration (Stripe, PayPal, etc.)
2. Storing payment method in order document
3. Updating order status based on payment confirmation

## Order Notifications (Future Enhancement)

Suggested notification flow:
1. **Order Placed**: Email to customer with order details
2. **Processing**: SMS notification when order preparation begins
3. **Shipped**: Email with tracking information
4. **Delivered**: Confirmation email and request for review
5. **Admin Notifications**: Real-time dashboard updates for new orders

## Admin Panel Integration (Future)

For admin order management:
1. Create admin dashboard at `/admin/orders`
2. List all orders with filters
3. Update order status
4. View customer details
5. Print invoices/packing slips
6. Analytics and reports

## Error Handling

All order operations include comprehensive error handling:

```typescript
try {
  const result = await createOrder(orderData)
  if (!result.success) {
    // Show error to user
    setError(result.error || 'Failed to create order')
  }
} catch (error) {
  // Handle unexpected errors
  console.error('Order creation failed:', error)
  setError('An unexpected error occurred')
}
```

## Testing

### Test Order Creation
1. Add items to cart as guest
2. Go to checkout
3. Login or signup
4. Fill in shipping information
5. Submit order
6. Verify order appears in `/orders`
7. Check Firestore console for order document

### Test Order Display
1. Login to account with existing orders
2. Navigate to `/orders`
3. Verify all orders are displayed
4. Test status filters
5. Verify order details are accurate

## Related Documentation

- [CART_ARCHITECTURE.md](./CART_ARCHITECTURE.md) - Cart system documentation
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Authentication system documentation
- Firebase Firestore: https://firebase.google.com/docs/firestore
- Next.js Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions
