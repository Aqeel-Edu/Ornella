import { type Timestamp } from 'firebase/firestore'

export interface SerializedCategory {
  id: string
  title: string
  slug?: string
  order?: number
  description?: string
  active?: boolean
  image?: string | null
  createdAt?: string | null
  updatedAt?: string | null
}

export interface SerializedProduct {
  id: string
  title?: string
  price?: number
  image?: string | null
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

export function serializeTimestamp(timestamp: Timestamp | { seconds: number; nanoseconds: number } | null | undefined): string | null {
  if (!timestamp) return null
  
  // Handle both Firestore Timestamp objects and plain timestamp-like objects
  if ('toDate' in timestamp) {
    return timestamp.toDate().toISOString()
  } else if ('seconds' in timestamp && 'nanoseconds' in timestamp) {
    // Convert seconds and nanoseconds to milliseconds
    const milliseconds = (timestamp.seconds * 1000) + (timestamp.nanoseconds / 1000000)
    return new Date(milliseconds).toISOString()
  }
  
  return null
}

export function serializeCategory(category: any): SerializedCategory {
  return {
    id: category.id,
    title: category.title || category.name || '', // support both title and name fields
    slug: category.slug,
    order: category.order,
    description: category.description,
    active: category.active,
    image: category.image || category.imageUrl || category.imagePath || category.externalImageUrl,
    // Convert timestamps to ISO strings
    createdAt: serializeTimestamp(category.createdAt),
    updatedAt: serializeTimestamp(category.updatedAt),
  }
}

export function serializeProduct(product: any): SerializedProduct {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image || product.imageUrl || product.imagePath,
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
    material: product.material,
    dimensions: product.dimensions,
    weight: product.weight,
    color: product.color,
    careInstructions: product.careInstructions,
    // Convert timestamps to ISO strings
    createdAt: serializeTimestamp(product.createdAt),
    updatedAt: serializeTimestamp(product.updatedAt),
  }
}