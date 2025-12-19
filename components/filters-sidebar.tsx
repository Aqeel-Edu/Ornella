"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { CategorySelect } from "./category-select"
import { type Category } from "@/lib/firebase-utils"
import { useState, useEffect } from "react"

export function FiltersSidebar({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  
  useEffect(() => {
    const priceParam = searchParams.get("price")
    if (priceParam) {
      const [min, max] = priceParam.split("-")
      setMinPrice(min || "")
      setMaxPrice(max?.replace("+", "") || "")
    } else {
      setMinPrice("")
      setMaxPrice("")
    }
  }, [searchParams])

  const handlePriceChange = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (minPrice || maxPrice) {
      const min = minPrice || "0"
      const max = maxPrice || ""
      const priceValue = max ? `${min}-${max}` : `${min}+`
      params.set("price", priceValue)
    } else {
      params.delete("price")
    }
    
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <aside className="rounded-lg border bg-card p-4 w-full md:w-64 md:ml-0">
      <h4 className="font-semibold mb-3">Filter</h4>
      <div className="grid gap-4">
        {/* Category */}
        <div className="grid gap-1">
          <label htmlFor="category" className="text-sm text-muted-foreground">
            Category
          </label>
          <CategorySelect categories={categories} />
        </div>

        {/* Price Range */}
        <div className="grid gap-2">
          <label className="text-sm text-muted-foreground">
            Price Range (Rs)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="number"
                placeholder="Min"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={handlePriceChange}
                onKeyDown={(e) => e.key === "Enter" && handlePriceChange()}
                className="h-9 w-full rounded-md border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Max"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={handlePriceChange}
                onKeyDown={(e) => e.key === "Enter" && handlePriceChange()}
                className="h-9 w-full rounded-md border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          {/* Quick Select Buttons */}
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            <button
              onClick={() => {
                setMinPrice("0")
                setMaxPrice("1000")
                const params = new URLSearchParams(searchParams.toString())
                params.set("price", "0-1000")
                router.push(`/shop?${params.toString()}`)
              }}
              className="text-xs py-1.5 px-2 rounded border hover:bg-secondary/50 transition-colors"
            >
              Under 1k
            </button>
            <button
              onClick={() => {
                setMinPrice("1000")
                setMaxPrice("5000")
                const params = new URLSearchParams(searchParams.toString())
                params.set("price", "1000-5000")
                router.push(`/shop?${params.toString()}`)
              }}
              className="text-xs py-1.5 px-2 rounded border hover:bg-secondary/50 transition-colors"
            >
              1k - 5k
            </button>
            <button
              onClick={() => {
                setMinPrice("5000")
                setMaxPrice("10000")
                const params = new URLSearchParams(searchParams.toString())
                params.set("price", "5000-10000")
                router.push(`/shop?${params.toString()}`)
              }}
              className="text-xs py-1.5 px-2 rounded border hover:bg-secondary/50 transition-colors"
            >
              5k - 10k
            </button>
            <button
              onClick={() => {
                setMinPrice("10000")
                setMaxPrice("")
                const params = new URLSearchParams(searchParams.toString())
                params.set("price", "10000+")
                router.push(`/shop?${params.toString()}`)
              }}
              className="text-xs py-1.5 px-2 rounded border hover:bg-secondary/50 transition-colors"
            >
              10k+
            </button>
          </div>
          
          {(minPrice || maxPrice) && (
            <button
              onClick={() => {
                setMinPrice("")
                setMaxPrice("")
                const params = new URLSearchParams(searchParams.toString())
                params.delete("price")
                router.push(`/shop?${params.toString()}`)
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline mt-1"
            >
              Clear price filter
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
