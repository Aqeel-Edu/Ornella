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
  return { id: snap.id, ...data, image }
}
