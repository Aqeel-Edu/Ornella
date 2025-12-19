# Authentication System Documentation

## Overview
This project implements a complete authentication system using Firebase Authentication with automatic cart merging functionality.

## Features
- ✅ Email/Password Authentication
- ✅ User Registration with Display Name
- ✅ Login with Email/Password
- ✅ Password Reset via Email
- ✅ Protected Routes (Checkout requires authentication)
- ✅ Automatic Cart Merging on Login
- ✅ Return URL Preservation through Auth Flow
- ✅ Beautiful UI with Form Validation
- ✅ Loading and Error States

## Architecture

### AuthContext (`contexts/AuthContext.tsx`)
Central authentication state management using React Context API.

**State:**
- `user`: Current authenticated user (Firebase User object or null)
- `loading`: Authentication loading state (true during initial auth check)

**Functions:**
- `login(email, password)`: Sign in with email and password
- `signup(email, password, displayName)`: Create new account
- `logout()`: Sign out current user
- `resetPassword(email)`: Send password reset email

**Automatic Cart Merging:**
When user authentication state changes (login/logout), the context automatically calls `mergeCartOnLogin()` server action to merge guest cart with user cart.

### Authentication Pages

#### Login (`app/auth/login/page.tsx`)
- Email and password inputs with validation
- "Remember me" checkbox
- Link to forgot password
- Link to signup page
- Return URL support via query parameter: `/auth/login?returnUrl=/checkout`
- Error handling with user-friendly messages
- Loading state during authentication

#### Signup (`app/auth/signup/page.tsx`)
- First name and last name inputs
- Email and password with confirmation
- Password validation (min 8 characters)
- Terms and conditions checkbox
- Return URL support
- Name validation
- Password match validation

#### Forgot Password (`app/auth/forgot-password/page.tsx`)
- Email input for password reset
- Success message after sending reset email
- Error handling
- Back to login link
- Support information section

### Protected Checkout (`app/checkout/page.tsx`)
The checkout page now checks authentication before allowing order placement:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // Check if user is authenticated
  if (!user) {
    router.push('/auth/login?returnUrl=/checkout')
    return
  }
  
  // Process order with user ID
  const orderData = {
    ...formData,
    userId: user.uid,
    userEmail: user.email
  }
  // ... rest of order processing
}
```

## Usage

### Using Authentication in Components

```typescript
import { useAuth } from "@/contexts/AuthContext"

function MyComponent() {
  const { user, loading, login, logout } = useAuth()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return <div>Please log in</div>
  }
  
  return (
    <div>
      <p>Welcome, {user.displayName || user.email}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Protecting Routes

```typescript
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

function ProtectedPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?returnUrl=/protected-page')
    }
  }, [user, loading, router])
  
  if (loading) return <div>Loading...</div>
  if (!user) return null
  
  return <div>Protected content</div>
}
```

## Cart Merging Flow

1. **Guest Shopping:**
   - User browses and adds items to cart as a guest
   - Cart is stored in Firestore with a guest ID (UUID)
   - Guest ID is stored in HTTP-only cookie

2. **Authentication:**
   - User clicks "Place Order" on checkout
   - Not authenticated → redirected to `/auth/login?returnUrl=/checkout`
   - User logs in or signs up

3. **Automatic Merge:**
   - `AuthContext` detects auth state change
   - Calls `mergeCartOnLogin()` server action
   - Guest cart items are merged into user's cart
   - Guest cart is deleted
   - Guest ID cookie is removed

4. **Return to Checkout:**
   - User is redirected back to `/checkout`
   - Now sees merged cart with all items
   - Can complete order as authenticated user

## Security Features

1. **HTTP-only Cookies:**
   - Guest ID stored securely
   - Not accessible via JavaScript
   - Protected against XSS attacks

2. **Firebase Authentication:**
   - Industry-standard security
   - Password hashing handled by Firebase
   - Email verification support
   - Rate limiting and abuse prevention

3. **Protected Routes:**
   - Checkout requires authentication
   - Orders linked to user accounts
   - User data properly segregated

## Environment Variables

Required Firebase configuration in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Error Handling

All authentication functions handle errors gracefully:

```typescript
try {
  await login(email, password)
  // Success - user is now authenticated
} catch (error) {
  // Error handling
  if (error.code === 'auth/user-not-found') {
    setError('No account found with this email')
  } else if (error.code === 'auth/wrong-password') {
    setError('Incorrect password')
  } else {
    setError(error.message)
  }
}
```

Common Firebase Auth error codes:
- `auth/user-not-found`: Email not registered
- `auth/wrong-password`: Incorrect password
- `auth/email-already-in-use`: Email already registered
- `auth/weak-password`: Password too weak
- `auth/invalid-email`: Invalid email format
- `auth/too-many-requests`: Rate limited (too many failed attempts)

## Testing the Flow

1. **Test Guest Cart:**
   ```
   1. Browse shop without logging in
   2. Add items to cart
   3. Go to checkout
   4. Fill in details
   5. Click "Place Order"
   ```

2. **Test Authentication:**
   ```
   1. Should redirect to /auth/login?returnUrl=/checkout
   2. Click "Sign Up" and create account
   3. Should redirect back to /checkout
   4. Cart should still contain items
   5. Complete order as authenticated user
   ```

3. **Test Password Reset:**
   ```
   1. Go to /auth/login
   2. Click "Forgot?"
   3. Enter email
   4. Check email for reset link
   5. Follow link and reset password
   6. Login with new password
   ```

## Future Enhancements

- [ ] Email verification requirement
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Profile page with order history
- [ ] Address book management
- [ ] Session timeout handling
- [ ] Remember me functionality (persistent login)
- [ ] Account deletion
- [ ] Password strength indicator
- [ ] Username/display name editing

## Related Documentation

- [CART_ARCHITECTURE.md](./CART_ARCHITECTURE.md) - Complete cart system documentation
- Firebase Authentication: https://firebase.google.com/docs/auth
- Next.js 15 App Router: https://nextjs.org/docs
