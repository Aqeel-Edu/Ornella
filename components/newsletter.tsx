"use client"

import { useState } from "react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h3 className="text-center text-lg font-semibold">Stay Updated</h3>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Join our newsletter for exclusive offers and new arrivals.
      </p>
      <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-5 flex max-w-md items-center gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="h-10 flex-1 rounded-full border bg-background px-4"
          aria-label="Email"
        />
        <button className="h-10 rounded-full bg-primary px-4 text-primary-foreground hover:opacity-90">
          Subscribe
        </button>
      </form>
    </section>
  )
}
