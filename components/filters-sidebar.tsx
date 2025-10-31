"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { CategorySelect } from "./category-select"
import { type Category } from "@/lib/firebase-utils"

export function FiltersSidebar({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  return (
    <aside className="rounded-lg border bg-card p-4 w-full md:w-64">
      <h4 className="font-semibold mb-3">Filter</h4>
      <div className="grid gap-4">
        {/* Category */}
        <div className="grid gap-1">
          <label htmlFor="category" className="text-sm text-muted-foreground">
            Category
          </label>
          <CategorySelect categories={categories} />
        </div>

        {/* Price */}
        <div className="grid gap-1">
          <label htmlFor="price" className="text-sm text-muted-foreground">
            Price
          </label>
          <select 
            id="price" 
            className="h-10 rounded-md border bg-background px-3 text-sm"
            value={searchParams.get("price") || ""}
            onChange={(e) => {
              const params = new URLSearchParams(searchParams.toString())
              if (e.target.value) {
                params.set("price", e.target.value)
              } else {
                params.delete("price")
              }
              router.push(`/shop?${params.toString()}`)
            }}
          >
            <option value="">All</option>
            <option value="0-50">Under $50</option>
            <option value="50-150">$50 – $150</option>
            <option value="150-300">$150 – $300</option>
            <option value="300+">$300+</option>
          </select>
        </div>
      </div>
    </aside>
  )
}
