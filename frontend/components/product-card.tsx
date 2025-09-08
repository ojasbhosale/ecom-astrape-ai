"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus, Heart } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Item } from "@/lib/types"

interface ProductCardProps {
  item: Item
  onAddToCart?: (item: Item) => void
  onUpdateQuantity?: (itemId: number, quantity: number) => void
  isAuthenticated: boolean
  cartQuantity?: number
}

export function ProductCard({
  item,
  onAddToCart,
  onUpdateQuantity,
  isAuthenticated,
  cartQuantity = 0,
}: ProductCardProps) {
  const router = useRouter()
  const price = typeof item.price === "string" ? Number.parseFloat(item.price) : item.price
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (onAddToCart) {
      setIsLoading(true)
      await onAddToCart(item)
      setIsLoading(false)
    }
  }

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return

    if (onUpdateQuantity) {
      setIsLoading(true)
      await onUpdateQuantity(item.id, newQuantity)
      setIsLoading(false)
    }
  }

  return (
    <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20 overflow-hidden">
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
          <img
            src={`/abstract-geometric-shapes.png?height=300&width=300&query=${encodeURIComponent(item.name)}`}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>

          {/* Category Badge */}
          <Badge
            variant="secondary"
            className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm border-0 text-xs font-medium"
          >
            {item.category}
          </Badge>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 text-lg">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
            )}
          </div>

          {/* Price and Actions */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ${price.toFixed(2)}
              </span>
              <div className="text-xs text-muted-foreground">Free shipping</div>
            </div>

            <div className="flex items-center gap-2">
              {cartQuantity > 0 && isAuthenticated ? (
                <div className="flex items-center gap-2 bg-card border rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleQuantityChange(cartQuantity - 1)}
                    disabled={isLoading}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <span className="min-w-[2rem] text-center font-medium text-sm">{cartQuantity}</span>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleQuantityChange(cartQuantity + 1)}
                    disabled={isLoading}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {!isAuthenticated ? "Add to Cart" : "Add to Cart"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
