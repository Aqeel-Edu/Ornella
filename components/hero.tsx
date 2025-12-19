"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    id: 1,
    image: "/minimalist-interior-living-room-with-wood-console-.jpg",
    title: "Transform Your Space with Timeless Décor",
    description: "Discover our curated collection of modern and elegant home essentials.",
  },
  {
    id: 2,
    image: "/images/collections/bedroom.jpg",
    title: "Elevate Your Living Experience",
    description: "Handpicked furniture and décor for the discerning homeowner.",
  },
  {
    id: 3,
    image: "/images/collections/kitchen.jpg",
    title: "Design That Speaks Volumes",
    description: "Create the perfect ambiance with our exclusive collection.",
  },
  {
    id: 4,
    image: "/images/collections/living-room.jpg",
    title: "Where Style Meets Comfort",
    description: "Premium quality pieces for every corner of your home.",
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
            role="img"
            aria-label={slide.title}
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0">
            <div className="mx-auto max-w-7xl px-6 h-full flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-2xl text-balance">
                {slide.title}
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/95 max-w-2xl text-pretty">
                {slide.description}
              </p>
              <Link
                href="/shop"
                className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg hover:bg-primary/90 hover:scale-105 transition-all duration-300"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-all duration-200 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
