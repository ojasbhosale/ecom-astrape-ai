"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, X, Sliders, Crown, Star, Zap, ChevronDown, ChevronUp } from "lucide-react"
import type { ItemFilters } from "@/lib/types"

interface ProductFiltersProps {
  filters: ItemFilters
  onFiltersChange: (filters: ItemFilters) => void
  categories: string[]
}

export function ProductFilters({ filters, onFiltersChange, categories }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<ItemFilters>(filters)
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    premium: true,
  })

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    setIsOpen(false)
  }

  const handleClearFilters = () => {
    const clearedFilters = {}
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = Object.keys(filters).length > 0
  const activeFilterCount = Object.keys(filters).filter(key => filters[key as keyof ItemFilters]).length

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full btn-glass h-12 text-base font-bold"
        >
          <Filter className="h-5 w-5 mr-3" />
          Premium Filters
          {hasActiveFilters && (
            <div className="ml-3 w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-black text-xs font-black">
              {activeFilterCount}
            </div>
          )}
          {isOpen ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {/* Filter Panel */}
      <Card className={`${isOpen ? "block" : "hidden"} lg:block glass-strong rounded-3xl border-0 sticky top-8`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Sliders className="w-4 h-4 text-black" />
              </div>
              <span className="text-gradient-purple">Luxury Filters</span>
            </CardTitle>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearFilters}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-full"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          
          {hasActiveFilters && (
            <div className="flex items-center space-x-2 mt-2">
              <Star className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-white/70">{activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active</span>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto text-left"
              onClick={() => toggleSection('category')}
            >
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-orange-400" />
                <Label className="text-base font-bold text-gradient-orange cursor-pointer">
                  Collection Category
                </Label>
              </div>
              {expandedSections.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {expandedSections.category && (
              <div className="animate-slide-up">
                <Select
                  value={localFilters.category || "all"}
                  onValueChange={(value) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      category: value === "all" ? undefined : value,
                    }))
                  }
                >
                  <SelectTrigger className="input-premium h-12 text-white rounded-2xl">
                    <SelectValue placeholder="All collections" />
                  </SelectTrigger>
                  <SelectContent className="glass-strong rounded-2xl border-0">
                    <SelectItem value="all" className="rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-orange-400" />
                        <span>All Collections</span>
                      </div>
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="rounded-xl">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
                          <span>{category}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto text-left"
              onClick={() => toggleSection('price')}
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <Label className="text-base font-bold text-gradient-cyan cursor-pointer">
                  Price Range
                </Label>
              </div>
              {expandedSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {expandedSections.price && (
              <div className="space-y-4 animate-slide-up">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="minPrice" className="text-xs text-white/70 font-medium uppercase tracking-wide">
                      Minimum
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                      <Input
                        id="minPrice"
                        type="number"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        value={localFilters.minPrice || ""}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            minPrice: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                          }))
                        }
                        className="input-premium h-12 pl-8 rounded-2xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxPrice" className="text-xs text-white/70 font-medium uppercase tracking-wide">
                      Maximum
                    </Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50">$</span>
                      <Input
                        id="maxPrice"
                        type="number"
                        placeholder="∞"
                        min="0"
                        step="0.01"
                        value={localFilters.maxPrice || ""}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            maxPrice: e.target.value ? Number.parseFloat(e.target.value) : undefined,
                          }))
                        }
                        className="input-premium h-12 pl-8 rounded-2xl"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Quick Price Filters */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocalFilters(prev => ({ ...prev, minPrice: undefined, maxPrice: 50 }))}
                    className="btn-glass text-xs"
                  >
                    Under $50
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocalFilters(prev => ({ ...prev, minPrice: 50, maxPrice: 200 }))}
                    className="btn-glass text-xs"
                  >
                    $50 - $200
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocalFilters(prev => ({ ...prev, minPrice: 200, maxPrice: 500 }))}
                    className="btn-glass text-xs"
                  >
                    $200 - $500
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocalFilters(prev => ({ ...prev, minPrice: 500, maxPrice: undefined }))}
                    className="btn-glass text-xs"
                  >
                    $500+
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Premium Features */}
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto text-left"
              onClick={() => toggleSection('premium')}
            >
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-pink-400" />
                <Label className="text-base font-bold text-gradient-pink cursor-pointer">
                  Premium Features
                </Label>
              </div>
              {expandedSections.premium ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {expandedSections.premium && (
              <div className="space-y-3 animate-slide-up">
                <div className="glass rounded-2xl p-4 space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-white/80">Authenticated Luxury</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                    <span className="text-sm text-white/80">Express Delivery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span className="text-sm text-white/80">VIP Concierge</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Apply Button (Mobile) */}
          <div className="lg:hidden pt-6 border-t border-white/10">
            <Button onClick={handleApplyFilters} className="w-full btn-primary h-12 text-base font-bold">
              <Filter className="mr-2 h-4 w-4" />
              Apply Luxury Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}