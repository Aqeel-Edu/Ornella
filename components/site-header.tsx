"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ShoppingCart, User, Search, Leaf, LogOut, User2, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href
  
  return (
    <Link
      href={href}
      className={cn(
        "hover:text-foreground transition-colors",
        isActive && "text-foreground font-medium"
      )}
    >
      {children}
    </Link>
  )
}

export function SiteHeader() {
  const [q, setQ] = useState("")
  const cartCount = 2

  // optional: read a display name from localStorage to feel more 'real'
  const [name, setName] = useState("Ornella Guest")
  const [email, setEmail] = useState("guest@example.com")
  useEffect(() => {
    const n = window.localStorage.getItem("name")
    const e = window.localStorage.getItem("email")
    if (n) setName(n)
    if (e) setEmail(e)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Leaf className="h-5 w-5 text-primary" aria-hidden />
          <span className="tracking-tight">Ornella</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/shop">Shop</NavLink>
          <NavLink href="/about">About</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden lg:flex items-center rounded-full border bg-card pl-3 pr-2 h-9">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="ml-2 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              placeholder="Search"
              aria-label="Search"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full border hover:bg-muted")}
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="text-sm font-medium">{name}</div>
                <div className="text-xs text-muted-foreground">{email}</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <User2 className="h-4 w-4" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  My Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  window.localStorage.removeItem("auth")
                  window.location.href = "/"
                }}
                className="text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border hover:bg-muted"
            aria-label="Cart"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 rounded-full bg-primary text-primary-foreground text-[10px] leading-none px-1.5 py-1">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
