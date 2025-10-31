import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-2">
          <section>
            <h1 className="text-2xl font-semibold">Our Story</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              At Ornella, we believe your home should be a reflection of your personal style and a sanctuary of comfort.
              We curate high‑quality, stylish home décor to inspire creativity and elevate everyday living.
            </p>
            <div className="mt-4 rounded-lg overflow-hidden border">
              <Image
                src="/minimal-living-room-sofa-and-art.jpg"
                alt="Our studio"
                width={1120}
                height={560}
                className="w-full h-auto"
              />
            </div>

            <h2 className="mt-8 text-lg font-semibold">Our Journey</h2>
            <ol className="mt-4 grid gap-5">
              {[
                ["2018 - The Dream Begins", "Started as a small online blog sharing passion for minimalist design."],
                [
                  "2020 - First Collection",
                  "Launched curated textiles focusing on natural materials and soft palettes.",
                ],
                ["2022 - Expanding Horizons", "Introduced furniture pieces and our first pop‑up store."],
                [
                  "Today - A Thriving Community",
                  "Bringing beauty and comfort to homes with a focus on sustainability.",
                ],
              ].map(([title, desc]) => (
                <li key={title}>
                  <div className="border-l-2 pl-3">
                    <div className="font-medium">{title}</div>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              We'd love to hear from you. Whether you have a question or just want to say hello, we're ready to connect.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="flex items-start gap-3 text-sm">
                <Mail className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-muted-foreground">support@ornella.com</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Phone className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Phone</div>
                  <div className="text-muted-foreground">(555) 123‑4567</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <div className="font-medium">Address</div>
                  <div className="text-muted-foreground">123 Main Street, Anytown, USA</div>
                </div>
              </div>
              <Image src="/map-grid-light.jpg" alt="Map" width={720} height={280} className="rounded-lg border" />
            </div>

            <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Your Name" className="h-10 rounded-md border bg-background px-3 text-sm" />
              <input placeholder="Your Email" className="h-10 rounded-md border bg-background px-3 text-sm" />
              <textarea
                placeholder="How can we help?"
                className="md:col-span-2 h-28 rounded-md border bg-background p-3 text-sm"
              />
              <button className="md:col-span-2 h-10 rounded-md bg-primary text-primary-foreground">Send Message</button>
            </form>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
