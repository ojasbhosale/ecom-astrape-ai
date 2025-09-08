"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import type { Item } from "@/lib/types"

interface ProductCardProps {
  item: Item
  onAddToCart?: (item: Item) => void
  isAuthenticated: boolean
}

export function ProductCard({ item, onAddToCart, isAuthenticated }: ProductCardProps) {
  const price = typeof item.price === "string" ? Number.parseFloat(item.price) : item.price

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        {/* Product Image Placeholder */}
        <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
          <img
            src={`/abstract-geometric-shapes.png?height=200&width=200&query=${encodeURIComponent(item.name)}`}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {item.name}
            </h3>
            <Badge variant="secondary" className="shrink-0">
              {item.category}
            </Badge>
          </div>

          {item.description && <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>}

          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-primary">${price.toFixed(2)}</span>
            {isAuthenticated && onAddToCart && (
              <Button size="sm" onClick={() => onAddToCart(item)} className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
