"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ShoppingCart, User, LogOut, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AuthService } from "@/lib/auth"
import { useCart } from "@/contexts/cart-context"
import { useEffect, useState } from "react"
import type { User as UserType } from "@/lib/types"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { cart, refreshCart } = useCart()
  const [user, setUser] = useState<UserType | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkAuth = () => {
      const currentUser = AuthService.getUser()
      setUser(currentUser)

      // Refresh cart when user changes
      if (currentUser && !cart) {
        refreshCart()
      }
    }

    checkAuth()
  }, [pathname, cart, refreshCart])

  const handleLogout = () => {
    AuthService.logout()
    setUser(null)
    router.push("/")
    window.location.reload()
  }

  if (!mounted) {
    return (
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Package className="h-6 w-6" />
              Astrape Store
            </Link>
            <div className="w-24 h-8 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </nav>
    )
  }

  const cartCount = cart?.itemCount || 0

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Package className="h-6 w-6" />
            Astrape Store
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className={`text-foreground hover:text-primary transition-colors font-medium ${
                pathname === "/products" ? "text-primary" : ""
              }`}
            >
              Products
            </Link>
            {user && (
              <Link
                href="/cart"
                className={`flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium ${
                  pathname === "/cart" ? "text-primary" : ""
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
                {cartCount > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="text-foreground">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
