"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CartItemComponent } from "@/components/cart-item"
import { useCart } from "@/contexts/cart-context"
import { AuthGuard } from "@/components/auth-guard"
import { ShoppingBag, ArrowLeft, CreditCard } from "lucide-react"

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😞</div>
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => refreshCart()}>Try Again</Button>
            <Button variant="outline" onClick={clearError}>
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
            {!isLoading && cart && (
              <p className="text-muted-foreground">
                {cart.itemCount} item{cart.itemCount !== 1 ? "s" : ""} in your cart
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Skeleton className="w-20 h-20 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !cart || cart.cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="space-y-4">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
              <h3 className="text-xl font-semibold">Your cart is empty</h3>
              <p className="text-muted-foreground">Add some products to get started!</p>
              <Button asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.cartItems.map((cartItem) => (
                <CartItemComponent
                  key={cartItem.id}
                  cartItem={cartItem}
                  onUpdateQuantity={handleQuantityChange}
                  onRemove={handleRemoveItem}
                  isUpdating={isUpdating}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cart.itemCount} items)</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className="text-primary">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">${cart.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" disabled={isUpdating}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    Secure checkout powered by industry-leading encryption
                  </div>
                </CardContent>
              </Card>
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
