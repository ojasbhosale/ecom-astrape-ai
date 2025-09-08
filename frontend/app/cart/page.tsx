"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CartItemComponent } from "@/components/cart-item"
import { useCart } from "@/contexts/cart-context"
import { AuthGuard } from "@/components/auth-guard"
import { ShoppingBag, ArrowLeft, CreditCard, Shield, Zap, Crown, Sparkles, Lock } from "lucide-react"

function CartPageContent() {
  const { cart, isLoading, error, removeFromCart, addToCart, refreshCart, clearError } = useCart()
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (itemId: number, change: number) => {
    if (!cart) return

    const cartItem = cart.cartItems.find((item) => item.item.id === itemId)
    if (!cartItem) return

    setIsUpdating(true)
    try {
      if (change > 0) {
        await addToCart(cartItem.item, 1)
      } else {
        await removeFromCart(itemId, false)
      }
    } catch (err) {
      console.error("Failed to update quantity:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    setIsUpdating(true)
    try {
      await removeFromCart(itemId, true)
    } catch (err) {
      console.error("Failed to remove item:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-grid">
        {/* Background Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 orb-orange animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 orb-cyan animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="glass-strong rounded-3xl p-8 text-center space-y-6 max-w-md animate-scale-in glow-white">
            <div className="text-6xl animate-bounce-slow">⚠️</div>
            <h2 className="text-2xl font-bold text-gradient-orange">Oops! Something went wrong</h2>
            <p className="text-white/70">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => refreshCart()} className="btn-primary">
                <Zap className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={clearError} className="btn-glass">
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-grid">
      {/* Background Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/6 w-72 h-72 orb-pink animate-float" />
        <div className="absolute bottom-1/3 right-1/6 w-64 h-64 orb-cyan animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 left-2/3 w-48 h-48 orb-purple animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Header */}
        <div className="glass-strong rounded-3xl p-6 mb-8 glow-white animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" asChild className="btn-glass">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gradient-rainbow">Shopping Cart</h1>
                  {!isLoading && cart && (
                    <p className="text-white/70 font-medium">
                      {cart.itemCount} premium item{cart.itemCount !== 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Premium Badge */}
            <div className="hidden sm:flex items-center space-x-2 glass rounded-full px-4 py-2">
              <Crown className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold uppercase tracking-wider text-gradient-orange">VIP Cart</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6 animate-fade-in">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-card rounded-3xl p-6">
                <div className="flex gap-6">
                  <Skeleton className="w-24 h-24 rounded-2xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between items-center pt-4">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !cart || cart.cartItems.length === 0 ? (
          <div className="glass-strong rounded-3xl p-12 text-center animate-scale-in glow-white">
            <div className="space-y-6">
              <div className="relative">
                <ShoppingBag className="h-20 w-20 text-white/30 mx-auto animate-float" />
                <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-cyan-400 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gradient-cyan">Your luxury cart awaits</h3>
              <p className="text-white/70 max-w-md mx-auto">
                Start building your premium collection with authenticated designer pieces
              </p>
              <Button asChild className="btn-primary">
                <Link href="/products">
                  <Crown className="mr-2 h-4 w-4" />
                  Explore Collection
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6 animate-slide-in-left">
              {cart.cartItems.map((cartItem, index) => (
                <div 
                  key={cartItem.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CartItemComponent
                    cartItem={cartItem}
                    onUpdateQuantity={handleQuantityChange}
                    onRemove={handleRemoveItem}
                    isUpdating={isUpdating}
                  />
                </div>
              ))}
            </div>

            {/* Premium Order Summary */}
            <div className="lg:col-span-1 animate-slide-in-right">
              <div className="sticky top-8">
                <Card className="glass-strong rounded-3xl border-0 glow-cyan">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-black" />
                      </div>
                      <span className="text-gradient-cyan">Order Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Subtotal ({cart.itemCount} items)</span>
                        <span className="font-bold">${cart.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Premium Shipping</span>
                        <span className="text-gradient-green font-bold">Complimentary</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Tax</span>
                        <span className="text-white/70">Calculated at checkout</span>
                      </div>
                    </div>

                    <div className="glass rounded-2xl p-4">
                      <div className="flex justify-between font-black text-xl">
                        <span>Total</span>
                        <span className="text-gradient-rainbow">${cart.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button className="w-full btn-primary" size="lg" disabled={isUpdating}>
                      <Lock className="mr-2 h-4 w-4" />
                      Secure Checkout
                    </Button>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-3 gap-2 pt-4">
                      <div className="text-center">
                        <Shield className="h-6 w-6 text-green-400 mx-auto mb-1" />
                        <div className="text-xs text-white/60">Secure</div>
                      </div>
                      <div className="text-center">
                        <Zap className="h-6 w-6 text-orange-400 mx-auto mb-1" />
                        <div className="text-xs text-white/60">Express</div>
                      </div>
                      <div className="text-center">
                        <Crown className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                        <div className="text-xs text-white/60">Premium</div>
                      </div>
                    </div>

                    <div className="glass rounded-xl p-3 text-xs text-white/60 text-center">
                      <Lock className="w-3 h-3 inline mr-1" />
                      Protected by 256-bit SSL encryption
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <AuthGuard requireAuth={true}>
      <CartPageContent />
    </AuthGuard>
  )
}