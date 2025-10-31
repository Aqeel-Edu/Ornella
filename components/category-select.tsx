"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { type Category } from "@/lib/firebase-utils"

export function CategorySelect({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <select 
      id="category" 
      className="h-10 rounded-md border bg-background px-3 text-sm"
      value={searchParams.get("category") || ""}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString())
        if (e.target.value) {
          params.set("category", e.target.value.toLowerCase())
        } else {
          params.delete("category")
        }
        router.push(`/shop?${params.toString()}`)
      }}
    >
      <option value="">All Categories</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id.toLowerCase()}>
          {category.title}
        </option>
      ))}
    </select>
  )
}