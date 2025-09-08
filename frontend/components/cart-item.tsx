"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, Heart, Star, Shield } from "lucide-react"
import type { CartItem } from "@/lib/types"

interface CartItemProps {
  cartItem: CartItem
  onUpdateQuantity: (itemId: number, change: number) => Promise<void>
  onRemove: (itemId: number) => Promise<void>
  isUpdating: boolean
}

export function CartItemComponent({ cartItem, onUpdateQuantity, onRemove, isUpdating }: CartItemProps) {
  const [isLocalUpdating, setIsLocalUpdating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
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
    <Card 
      className="glass-card rounded-3xl border-0 transition-all duration-300 hover:glow-white group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Premium Product Image */}
          <div className="relative">
            <div className="w-24 h-24 glass rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden group-hover:glow-orange transition-all duration-300">
              <img
                src={`/abstract-geometric-shapes.png?height=96&width=96&query=${encodeURIComponent(item.name)}`}
                alt={item.name}
                className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            
            {/* Premium Badge */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Star className="w-3 h-3 text-black" />
            </div>
            
            {/* Authenticated Badge */}
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-black" />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gradient-orange line-clamp-1 group-hover:text-gradient-rainbow transition-all duration-300">
                  {item.name}
                </h3>
                <Badge 
                  variant="secondary" 
                  className="mt-2 glass rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
                >
                  {item.category}
                </Badge>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`w-10 h-10 rounded-full transition-all duration-300 ${
                    isHovered ? 'glass-strong hover:glow-pink' : 'glass'
                  }`}
                  disabled={isDisabled}
                >
                  <Heart className="h-4 w-4 text-pink-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isDisabled}
                  className={`w-10 h-10 rounded-full text-red-400 hover:text-red-300 transition-all duration-300 ${
                    isHovered ? 'glass-strong hover:glow-pink' : 'glass'
                  }`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {item.description && (
              <p className="text-sm text-white/60 line-clamp-2 mb-4 leading-relaxed">
                {item.description}
              </p>
            )}

            {/* Quantity and Price Section */}
            <div className="flex items-center justify-between">
              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <div className="glass rounded-2xl p-2 flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={isDisabled || quantity <= 1}
                    className="h-8 w-8 p-0 rounded-xl hover:bg-red-500/20 transition-all duration-300"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <div className="relative">
                    <span className="font-bold text-lg min-w-[2rem] text-center block text-gradient-cyan">
                      {quantity}
                    </span>
                    {isLocalUpdating && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                    disabled={isDisabled}
                    className="h-8 w-8 p-0 rounded-xl hover:bg-green-500/20 transition-all duration-300"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Price Information */}
              <div className="text-right space-y-1">
                <div className="text-sm text-white/60 font-medium">
                  ${itemPrice.toFixed(2)} each
                </div>
                <div className="font-black text-xl text-gradient-rainbow">
                  ${itemTotal.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Premium Features Bar */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-xs text-green-400">
                  <Shield className="w-3 h-3" />
                  <span>Authenticated</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-orange-400">
                  <Star className="w-3 h-3 fill-current" />
                  <span>Premium</span>
                </div>
              </div>
              
              {isHovered && (
                <div className="text-xs text-white/40 animate-fade-in">
                  Free premium delivery
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}