import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Moving types to serializers.ts - kept here for backwards compatibility
import { type SerializedProduct, type SerializedCategory } from "./serializers"
export type { SerializedProduct, SerializedCategory }

// Original export for backwards compatibility
export interface DeprecatedSerializedProduct {
  id: string
  title?: string
  price?: number
  image?: string
  description?: string
  category?: string
  featured?: boolean
  stock?: number
  slug?: string
  status?: string
  altText?: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  material?: string
  dimensions?: string
  weight?: string
  color?: string
  careInstructions?: string
  createdAt?: string | null
  updatedAt?: string | null
}

export function serializeProduct(product: any): SerializedProduct {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    description: product.description,
    category: product.category,
    featured: product.featured,
    stock: product.stock,
    slug: product.slug,
    status: product.status,
    altText: product.altText,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    keywords: product.keywords,
    // Convert Firestore Timestamp to ISO string if it exists
    createdAt: product.createdAt?.toDate?.()?.toISOString() ?? null,
    updatedAt: product.updatedAt?.toDate?.()?.toISOString() ?? null,
  }
}
