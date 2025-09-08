"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { ShoppingCart, User, LogOut, Package, Sparkles } from "lucide-react"
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
      <nav className="glass-strong border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-xl font-black text-gradient-rainbow">
              <Package className="h-6 w-6 text-orange-400" />
              ASTRAPE
            </Link>
            <div className="w-24 h-8 bg-white/10 animate-pulse rounded-xl" />
          </div>
        </div>
      </nav>
    )
  }

  const cartCount = cart?.itemCount || 0

  return (
    <nav className="glass-strong border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-xl font-black group">
            <div className="relative">
              <Package className="h-7 w-7 text-orange-400 group-hover:text-orange-300 transition-colors" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <span className="text-gradient-rainbow tracking-tight">ASTRAPE</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className={`relative text-white/80 hover:text-white transition-all duration-300 font-semibold tracking-wide group ${
                pathname === "/products" ? "text-white" : ""
              }`}
            >
              Products
              {pathname === "/products" && (
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-cyan-400 rounded-full" />
              )}
              <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-orange-400 to-cyan-400 rounded-full transition-all duration-300" />
            </Link>
            {user && (
              <Link
                href="/cart"
                className={`relative flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 font-semibold tracking-wide group ${
                  pathname === "/cart" ? "text-white" : ""
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-black text-xs font-black rounded-full px-1.5 py-0.5 min-w-[18px] text-center glow-orange">
                      {cartCount}
                    </div>
                  )}
                </div>
                <span>Cart</span>
                {pathname === "/cart" && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-400 to-cyan-400 rounded-full" />
                )}
                <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-orange-400 to-cyan-400 rounded-full transition-all duration-300" />
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 glass rounded-full px-4 py-2">
                  <User className="h-4 w-4 text-cyan-400" />
                  <span className="text-white font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 glass hover:glass-strong rounded-full px-4 py-2 transition-all duration-300 hover:glow-white group"
                >
                  <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-300" />
                  <span className="hidden sm:inline text-white font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login">
                  <button className="glass hover:glass-strong rounded-full px-6 py-2 transition-all duration-300 hover:glow-white font-medium text-white">
                    Login
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-black font-bold rounded-full px-6 py-2 transition-all duration-300 transform hover:scale-105 glow-orange">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}