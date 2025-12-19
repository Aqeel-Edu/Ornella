"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { ShoppingCart, User, Search, Leaf, LogOut, Package, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/hooks/use-cart"
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
        "px-4 py-1.5 rounded-md transition-all duration-200",
        isActive 
          ? "bg-primary/90 text-white font-medium shadow-sm" 
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      {children}
    </Link>
  )
}

export function SiteHeader() {
  const [q, setQ] = useState("")
  const { user, logout } = useAuth()
  const { items } = useCart()
  
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSearch = () => {
    if (q.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(q.trim())}`
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto max-w-[1400px] px-3 md:px-4 py-3 flex items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold pl-2">
          <Leaf className="h-5 w-5 text-primary" aria-hidden />
          <span className="tracking-tight text-lg">Ornella</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2 ml-8 text-sm">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/shop">Shop</NavLink>
          <NavLink href="/blogs">Blogs</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden lg:flex items-center rounded-full border bg-card pl-3 pr-1 h-9">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={handleKeyDown}
              className="ml-2 w-40 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              placeholder="Search products..."
              aria-label="Search"
            />
            {q && (
              <button
                onClick={handleSearch}
                className="ml-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
              >
                Go
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full border hover:bg-muted")}
              aria-label="Account"
            >
              <User className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuLabel>
                    <div className="text-sm font-medium">{user.displayName || "User"}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/auth/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </DropdownMenuItem>
              )}
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
