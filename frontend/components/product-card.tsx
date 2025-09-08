"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Star, Shield, Zap, Eye, Crown } from "lucide-react"
import type { Item } from "@/lib/types"

interface ProductCardProps {
  item: Item
  onAddToCart?: (item: Item) => void
  isAuthenticated: boolean
  viewMode?: 'grid' | 'list'
}

export function ProductCard({ item, onAddToCart, isAuthenticated, viewMode = 'grid' }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  const price = typeof item.price === "string" ? Number.parseFloat(item.price) : item.price

  const handleAddToCart = async () => {
    if (!onAddToCart) return
    
    setIsAddingToCart(true)
    try {
      await onAddToCart(item)
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (viewMode === 'list') {
    return (
      <Card 
        className="glass-card rounded-3xl border-0 transition-all duration-300 hover:glow-white group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Product Image */}
            <div className="relative">
              <div className="w-32 h-32 glass rounded-2xl overflow-hidden group-hover:glow-orange transition-all duration-300">
                <img
                  src={`/abstract-geometric-shapes.png?height=128&width=128&query=${encodeURIComponent(item.name)}`}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              {/* Premium Badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-black" />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gradient-orange group-hover:text-gradient-rainbow transition-all duration-300 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge className="glass rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                        {item.category}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`w-10 h-10 rounded-full transition-all duration-300 ${
                      isLiked ? 'text-pink-400 glow-pink' : 'text-white/50'
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                {item.description && (
                  <p className="text-white/70 line-clamp-3 leading-relaxed mb-4">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-3xl font-black text-gradient-rainbow">
                    ${price.toFixed(2)}
                  </div>
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1 text-green-400">
                      <Shield className="w-3 h-3" />
                      <span>Authenticated</span>
                    </div>
                    <div className="flex items-center space-x-1 text-orange-400">
                      <Zap className="w-3 h-3" />
                      <span>Express Delivery</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-glass"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  
                  {isAuthenticated && onAddToCart && (
                    <Button 
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="btn-primary min-w-[120px]"
                    >
                      {isAddingToCart ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <ShoppingCart className="h-4 w-4 mr-2" />
                      )}
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      className="glass-card rounded-3xl border-0 transition-all duration-300 hover:glow-white group hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        {/* Product Image */}
        <div className="relative mb-6">
          <div className="aspect-square glass rounded-2xl overflow-hidden group-hover:glow-orange transition-all duration-300">
            <img
              src={`/abstract-geometric-shapes.png?height=300&width=300&query=${encodeURIComponent(item.name)}`}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          
          {/* Floating Action Buttons */}
          <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`w-10 h-10 rounded-full glass-strong transition-all duration-300 ${
                isLiked ? 'text-pink-400 glow-pink' : 'text-white hover:text-pink-400'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 rounded-full glass-strong text-white hover:text-cyan-400 hover:glow-cyan transition-all duration-300"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Premium Badge */}
          <div className="absolute -top-2 -left-2 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center glow-orange">
            <Crown className="w-5 h-5 text-black" />
          </div>
          
          {/* Authentication Badge */}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <Shield className="w-4 h-4 text-black" />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg text-gradient-orange group-hover:text-gradient-rainbow transition-all duration-300 line-clamp-2 flex-1">
                {item.name}
              </h3>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge className="glass rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                {item.category}
              </Badge>
              <div className="flex items-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
                ))}
              </div>
            </div>
          </div>

          {item.description && (
            <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <div className="text-2xl font-black text-gradient-rainbow">
                ${price.toFixed(2)}
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1 text-green-400">
                  <Shield className="w-3 h-3" />
                  <span>Auth</span>
                </div>
                <div className="flex items-center space-x-1 text-orange-400">
                  <Zap className="w-3 h-3" />
                  <span>Express</span>
                </div>
              </div>
            </div>
            
            {isAuthenticated && onAddToCart && (
              <Button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="btn-secondary"
                size="sm"
              >
                {isAddingToCart ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}