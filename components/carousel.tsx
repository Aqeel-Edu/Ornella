"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselProps {
  items: React.ReactNode[]
  itemsPerView: {
    sm: number
    lg: number
  }
}

export function Carousel({ items, itemsPerView }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const itemsToShow = itemsPerView.lg
  const maxIndex = Math.max(0, items.length - itemsToShow)

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1))
  }

  const visibleItems = items.slice(currentIndex, currentIndex + itemsToShow)

  return (
    <div className="relative">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className="absolute -left-12 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary p-2 text-white transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed lg:flex hidden items-center justify-center"
        aria-label="Previous items"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Items Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {visibleItems.map((item, index) => (
          <div key={currentIndex + index}>{item}</div>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentIndex === maxIndex}
        className="absolute -right-12 top-1/2 z-10 -translate-y-1/2 rounded-full bg-primary p-2 text-white transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed lg:flex hidden items-center justify-center"
        aria-label="Next items"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
