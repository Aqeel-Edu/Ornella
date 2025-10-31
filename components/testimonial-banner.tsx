export function TestimonialBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h3 className="text-center text-lg font-semibold mb-6">What Our Customers Say</h3>
      <div className="rounded-lg overflow-hidden">
        <div
          className="h-60 w-full bg-[url('/cozy-green-living-room-with-plants-and-sofa.jpg')] bg-cover bg-center"
          role="img"
          aria-label="Customer living room"
        />
        <div className="p-4 md:p-8 -mt-24">
          <blockquote className="mx-auto max-w-3xl rounded-lg bg-black/70 text-white p-4 md:p-6">
            <p className="text-sm md:text-base">
              “I love the minimalist design and high-quality products. My home feels so much more inviting now.”
            </p>
            <footer className="mt-2 text-xs text-white/80">— Sarah M.</footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
