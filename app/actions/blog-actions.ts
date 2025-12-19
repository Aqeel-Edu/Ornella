"use server"

import { db } from "@/lib/firebaseConfig"
import { collection, getDocs, query, where } from "firebase/firestore"

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl: string
  category: string
  tags: string[]
  readTime: number
  publishedDate: Date
}

export async function getAllBlogs(): Promise<Blog[]> {
  const blogsRef = collection(db, "blogs")
  const snapshot = await getDocs(blogsRef)
  const blogs = snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      imageUrl: data.imageUrl,
      category: data.category,
      tags: data.tags || [],
      readTime: data.readTime,
      publishedDate: data.publishedDate?.toDate ? data.publishedDate.toDate() : new Date(data.publishedDate)
    }
  }) as Blog[]
  // Sort by publishedDate in JavaScript instead of Firestore
  return blogs.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const blogsRef = collection(db, "blogs")
  const q = query(blogsRef, where("slug", "==", slug))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const doc = snapshot.docs[0]
  const data = doc.data()
  return {
    id: doc.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    imageUrl: data.imageUrl,
    category: data.category,
    tags: data.tags || [],
    readTime: data.readTime,
    publishedDate: data.publishedDate?.toDate ? data.publishedDate.toDate() : new Date(data.publishedDate)
  } as Blog
}

export async function getBlogsByCategory(category: string): Promise<Blog[]> {
  const blogsRef = collection(db, "blogs")
  const q = query(blogsRef, where("category", "==", category))
  const snapshot = await getDocs(q)
  const blogs = snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      imageUrl: data.imageUrl,
      category: data.category,
      tags: data.tags || [],
      readTime: data.readTime,
      publishedDate: data.publishedDate?.toDate ? data.publishedDate.toDate() : new Date(data.publishedDate)
    }
  }) as Blog[]
  // Sort by publishedDate in JavaScript instead of Firestore
  return blogs.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())
}
