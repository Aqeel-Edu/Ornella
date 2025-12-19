import { Instagram, Paintbrush as Pinterest, Facebook } from "lucide-react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t mt-auto bg-secondary/5">
      <div className="mx-auto max-w-[1400px] px-3 md:px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-sm text-muted-foreground">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-foreground transition-colors font-medium">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors font-medium">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors font-medium">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a aria-label="Instagram" href="#" className="hover:text-foreground transition-colors hover:scale-110 transition-transform">
              <Instagram className="h-5 w-5" />
            </a>
            <a aria-label="Pinterest" href="#" className="hover:text-foreground transition-colors hover:scale-110 transition-transform">
              <Pinterest className="h-5 w-5" />
            </a>
            <a aria-label="Facebook" href="#" className="hover:text-foreground transition-colors hover:scale-110 transition-transform">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Ornella. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Crafted with care for your home</p>
        </div>
      </div>
    </footer>
  )
}
