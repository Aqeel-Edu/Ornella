import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  orderBy,
} from 'firebase/firestore'
import { ref, getDownloadURL } from 'firebase/storage'
import { firestore, storage } from './firebaseConfig'

export type Product = {
  id: string
  title?: string
  price?: number
  image?: string | null
  imagePath?: string | null
  imageUrl?: string | null
  featured?: boolean
  description?: string
  [key: string]: any
}

async function resolveImageURL(image?: string | null) {
  if (!image) return null
  // If it's already an absolute URL (http, https, data) return it
  if (image.startsWith('http') || image.startsWith('data:')) return image

  try {
    // Treat value as storage path
    const storageRef = ref(storage, image)
    const url = await getDownloadURL(storageRef)
    return url
  } catch (err) {
    // If resolution fails, return original value to avoid breaking the UI
    return image
  }
}

export async function getProducts(): Promise<Product[]> {
  const col = collection(firestore, 'products')
  // simple list, you can add orderBy if your admin panel keeps an ordering field
  const q = query(col)
  const snap = await getDocs(q)
  const results = await Promise.all(
    snap.docs.map(async (d) => {
      const data = d.data() as any
      const imageRaw = data.imageUrl ?? data.imagePath ?? data.image
      const image = await resolveImageURL(imageRaw)
      return { id: d.id, ...data, image }
    }),
  )
  return results
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const col = collection(firestore, 'products')
  const q = query(col, where('featured', '==', true))
  const snap = await getDocs(q)
  const results = await Promise.all(
    snap.docs.map(async (d) => {
      const data = d.data() as any
      const imageRaw = data.imageUrl ?? data.imagePath ?? data.image
      const image = await resolveImageURL(imageRaw)
      return { id: d.id, ...data, image }
    }),
  )
  return results
}

export type Category = {
  id: string
  title: string
  image?: string | null
  imageUrl?: string | null
  imagePath?: string | null
  [key: string]: any
}

export async function getCategories(): Promise<Category[]> {
  const col = collection(firestore, 'categories')
  const snap = await getDocs(col)
  const results = await Promise.all(
    snap.docs.map(async (d) => {
      const data = d.data() as any
      const imageRaw = data.imageUrl ?? data.imagePath ?? data.image
      const image = await resolveImageURL(imageRaw)
      return { id: d.id, ...data, image }
    })
  )
  return results
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null
  const docRef = doc(firestore, 'products', id)
  const snap = await getDoc(docRef)
  if (!snap.exists()) return null
  const data = snap.data() as any
  const imageRaw = data.imageUrl ?? data.imagePath ?? data.image
  const image = await resolveImageURL(imageRaw)
  
  // Serialize timestamps to prevent toJSON issues
  const serialized: any = { id: snap.id, ...data, image }
  if (serialized.createdAt?.toDate) {
    serialized.createdAt = serialized.createdAt.toDate().toISOString()
  } else if (serialized.createdAt?.seconds) {
    serialized.createdAt = new Date(serialized.createdAt.seconds * 1000).toISOString()
  }
  if (serialized.updatedAt?.toDate) {
    serialized.updatedAt = serialized.updatedAt.toDate().toISOString()
  } else if (serialized.updatedAt?.seconds) {
    serialized.updatedAt = new Date(serialized.updatedAt.seconds * 1000).toISOString()
  }
  
  return serialized
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null
  const col = collection(firestore, 'products')
  const q = query(col, where('slug', '==', slug))
  const snap = await getDocs(q)
  if (snap.empty) return null
  
  const docSnap = snap.docs[0]
  const data = docSnap.data() as any
  const imageRaw = data.imageUrl ?? data.imagePath ?? data.image
  const image = await resolveImageURL(imageRaw)
  
  // Serialize timestamps to prevent toJSON issues
  const serialized: any = { id: docSnap.id, ...data, image }
  if (serialized.createdAt?.toDate) {
    serialized.createdAt = serialized.createdAt.toDate().toISOString()
  } else if (serialized.createdAt?.seconds) {
    serialized.createdAt = new Date(serialized.createdAt.seconds * 1000).toISOString()
  }
  if (serialized.updatedAt?.toDate) {
    serialized.updatedAt = serialized.updatedAt.toDate().toISOString()
  } else if (serialized.updatedAt?.seconds) {
    serialized.updatedAt = new Date(serialized.updatedAt.seconds * 1000).toISOString()
  }
  
  return serialized
}
