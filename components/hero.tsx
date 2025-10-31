import Link from "next/link"

export function Hero() {
  return (
    <section className="relative">
      <div
        className="h-[420px] w-full bg-[url('/minimalist-interior-living-room-with-wood-console-.jpg')] bg-cover bg-center"
        role="img"
        aria-label="Minimalist living room"
      />
      <div className="absolute inset-0">
        <div className="mx-auto max-w-6xl px-4 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg text-balance">
            Transform Your Space with Timeless Décor
          </h1>
          <p className="mt-3 text-white/90 max-w-xl text-pretty">
            Discover our curated collection of modern and elegant home essentials.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm text-primary-foreground shadow hover:opacity-90"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  )
}
