'use server'

import { cookies } from 'next/headers'
import { db } from '@/lib/firebaseConfig'
import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore'

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export type OrderItem = {
  id: string
  title: string
  price: number
  quantity: number
  image?: string
}

export type Order = {
  id: string
  userId: string
  userEmail: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    address: string
    city: string
    postalCode: string
  }
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  totalAmount: number
  status: OrderStatus
  paymentMethod?: string
  paymentStatus?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Create a new order in Firestore
 */
export async function createOrder(orderData: {
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
  deliveryFee: number
  totalAmount: number
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const ordersRef = collection(db, 'orders')
    
    const order = {
      userId: orderData.userId,
      userEmail: orderData.userEmail,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: {
        address: orderData.address,
        city: orderData.city,
        postalCode: orderData.postalCode || '000'
      },
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      totalAmount: orderData.totalAmount,
      status: 'pending' as OrderStatus,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      notes: orderData.notes || '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }

    const docRef = await addDoc(ordersRef, order)
    
    return { success: true, orderId: docRef.id }
  } catch (error: any) {
    console.error('Error creating order:', error)
    return { success: false, error: error.message || 'Failed to create order' }
  }
}

/**
 * Get all orders for a specific user
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders')
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    
    const snapshot = await getDocs(q)
    
    const orders: Order[] = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        userEmail: data.userEmail,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        items: data.items,
        subtotal: data.subtotal,
        deliveryFee: data.deliveryFee || data.shipping || 0,
        totalAmount: data.totalAmount || data.total || 0,
        status: data.status,
        notes: data.notes || '',
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      }
    })
    
    return orders
  } catch (error: any) {
    console.error('Error getting user orders:', error)
    return []
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now()
    })
    
    return { success: true }
  } catch (error: any) {
    console.error('Error updating order status:', error)
    return { success: false, error: error.message || 'Failed to update order status' }
  }
}
