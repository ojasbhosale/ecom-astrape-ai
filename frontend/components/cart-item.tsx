"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2 } from "lucide-react"
import type { CartItem } from "@/lib/types"

interface CartItemProps {
  cartItem: CartItem
  onUpdateQuantity: (itemId: number, change: number) => Promise<void>
  onRemove: (itemId: number) => Promise<void>
  isUpdating: boolean
}

export function CartItemComponent({ cartItem, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) {
  const [isLocalUpdating, setIsLocalUpdating] = useState(false)
  const { item, quantity } = cartItem

  const handleQuantityChange = async (change: number) => {
    if (isUpdating || isLocalUpdating) return

    setIsLocalUpdating(true)
    try {
      await onUpdateQuantity(item.id, change)
    } finally {
      setIsLocalUpdating(false)
    }
  }

  const handleRemove = async () => {
    if (isUpdating || isLocalUpdating) return

    setIsLocalUpdating(true)
    try {
      await onRemove(item.id)
    } finally {
      setIsLocalUpdating(false)
    }
  }

  const itemPrice = Number.parseFloat(item.price.toString())
  const itemTotal = itemPrice * quantity
  const isDisabled = isUpdating || isLocalUpdating

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
            <img
              src={`/abstract-geometric-shapes.png?height=80&width=80&query=${encodeURIComponent(item.name)}`}
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
                <Badge variant="secondary" className="mt-1">
                  {item.category}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={isDisabled}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {item.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>}

            {/* Quantity and Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={isDisabled || quantity <= 1}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="font-medium min-w-[2rem] text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={isDisabled}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="text-right">
                <div className="text-sm text-muted-foreground">${itemPrice.toFixed(2)} each</div>
                <div className="font-bold text-primary">${itemTotal.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
