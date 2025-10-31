import { Instagram, Paintbrush as Pinterest, Facebook } from "lucide-react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-foreground">
              Contact Us
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a aria-label="Instagram" href="#" className="hover:text-foreground">
              <Instagram className="h-4 w-4" />
            </a>
            <a aria-label="Pinterest" href="#" className="hover:text-foreground">
              <Pinterest className="h-4 w-4" />
            </a>
            <a aria-label="Facebook" href="#" className="hover:text-foreground">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">© 2025 Ornella. All rights reserved.</p>
      </div>
    </footer>
  )
}
