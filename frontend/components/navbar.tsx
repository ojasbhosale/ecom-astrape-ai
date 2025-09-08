"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ShoppingCart, User, LogOut, Package, Menu, X, Sparkles } from "lucide-react"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      <nav className="glass border-b border-white/10 sticky top-0 z-50 shadow-premium">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse rounded-xl" />
              <div className="w-32 h-7 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse rounded-lg" />
            </div>
            <div className="w-40 h-10 bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse rounded-xl" />
          </div>
        </div>
      </nav>
    )
  }

  const cartCount = cart?.itemCount || 0

  return (
    <nav className="glass border-b border-white/10 sticky top-0 z-50 shadow-premium animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            href="/"
            className="flex items-center gap-3 text-2xl font-heading font-black text-gradient hover:scale-105 transition-all duration-300 group"
          >
            <div className="relative">
              <Package className="h-8 w-8 text-primary group-hover:rotate-12 transition-transform duration-300" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-secondary animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              LuxeShop
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            <Link
              href="/products"
              className={`relative text-lg font-heading font-semibold transition-all duration-300 group ${
                pathname === "/products" ? "text-gradient" : "text-foreground hover:text-gradient"
              }`}
            >
              Products
              <div
                className={`absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ${
                  pathname === "/products"
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100"
                }`}
              />
            </Link>

            <Link
              href={user ? "/cart" : "/login"}
              className={`relative flex items-center gap-3 text-lg font-heading font-semibold transition-all duration-300 group ${
                pathname === "/cart" ? "text-gradient" : "text-foreground hover:text-gradient"
              }`}
            >
              <div className="relative">
                <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-secondary to-accent text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-scale-in shadow-premium">
                    {cartCount}
                  </span>
                )}
              </div>
              Cart
              <div
                className={`absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300 ${
                  pathname === "/cart"
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100"
                }`}
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3 text-sm card-premium px-4 py-2 rounded-2xl border border-white/10">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-foreground font-heading font-semibold">{user.name}</span>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLogout}
                  className="btn-premium bg-gradient-to-r from-destructive to-destructive/80 border-0 hover:shadow-destructive/25"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline font-heading font-semibold">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="glass border-white/20 hover:bg-white/10 transition-all duration-300 font-heading font-semibold bg-transparent"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="lg" asChild className="btn-secondary-premium shadow-premium">
                  <Link href="/signup" className="font-heading font-semibold">
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="lg"
              className="md:hidden glass border-white/20 hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 glass-dark animate-slide-up">
            <div className="px-6 py-6 space-y-4">
              <Link
                href="/products"
                className={`block px-4 py-3 rounded-2xl font-heading font-semibold text-lg transition-all duration-300 ${
                  pathname === "/products"
                    ? "card-premium text-gradient"
                    : "text-foreground hover:bg-white/5 hover:text-gradient"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href={user ? "/cart" : "/login"}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-heading font-semibold text-lg transition-all duration-300 ${
                  pathname === "/cart"
                    ? "card-premium text-gradient"
                    : "text-foreground hover:bg-white/5 hover:text-gradient"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-secondary to-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
