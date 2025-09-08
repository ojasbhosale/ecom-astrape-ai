"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { ProductFilters } from "@/components/product-filters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { apiClient } from "@/lib/api"
import { AuthService } from "@/lib/auth"
import { useCart } from "@/contexts/cart-context"
import type { Item, ItemFilters, ItemsResponse } from "@/lib/types"
import { Search, AlertCircle, Crown, Sparkles, Filter, Grid, List, Star } from "lucide-react"

export default function ProductsPage() {
  const router = useRouter()
  const { addToCart } = useCart()
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [filters, setFilters] = useState<ItemFilters>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated())
    fetchItems()
  }, [])

  useEffect(() => {
    applyFiltersAndSearch()
  }, [items, filters, searchQuery])

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      setError("")

      // Build query parameters
      const params = new URLSearchParams()
      if (filters.category) params.append("category", filters.category)
      if (filters.minPrice) params.append("minPrice", filters.minPrice.toString())
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice.toString())

      const queryString = params.toString()
      const endpoint = `/items${queryString ? `?${queryString}` : ""}`

      const response = await apiClient.get<ItemsResponse>(endpoint)
      setItems(response.items)

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(response.items.map((item) => item.category)))
      setCategories(uniqueCategories)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }

  const applyFiltersAndSearch = () => {
    let filtered = [...items]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query),
      )
    }

    setFilteredItems(filtered)
  }

  const handleFiltersChange = (newFilters: ItemFilters) => {
    setFilters(newFilters)
    fetchItems()
  }

  const handleAddToCart = async (item: Item) => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    try {
      await addToCart(item, 1)
    } catch (err) {
      console.error("Failed to add item to cart:", err)
    }
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-grid">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 orb-orange animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 orb-cyan animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
          <div className="glass-strong rounded-3xl p-8 text-center space-y-6 max-w-md animate-scale-in glow-white">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto animate-pulse" />
            <h2 className="text-2xl font-bold text-gradient-orange">Connection Lost</h2>
            <p className="text-white/70">{error}</p>
            <Button onClick={() => fetchItems()} className="btn-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              Reconnect
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-grid">
      {/* Dynamic Background Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-80 h-80 orb-purple animate-float" />
        <div className="absolute bottom-1/3 right-1/6 w-72 h-72 orb-green animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-2/3 left-2/3 w-64 h-64 orb-pink animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] orb-white animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Premium Header */}
        <div className="glass-strong rounded-3xl p-6 mb-8 glow-white animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Crown className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-gradient-rainbow">Premium Collection</h1>
                <p className="text-white/70 font-medium">Curated luxury for the discerning</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md lg:max-w-lg flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <Input
                placeholder="Search luxury items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-premium pl-12 h-12 text-lg rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Stats and Controls Bar */}
        <div className="glass rounded-2xl p-4 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-6">
              {!isLoading && (
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-orange-400" />
                  <span className="text-white/80 font-medium">
                    {filteredItems.length} premium item{filteredItems.length !== 1 ? "s" : ""} available
                  </span>
                </div>
              )}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 glass rounded-xl p-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-orange-500 text-black' : 'text-white/70'}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-orange-500 text-black' : 'text-white/70'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:col-span-1 animate-slide-in-left">
            <ProductFilters 
              filters={filters} 
              onFiltersChange={handleFiltersChange} 
              categories={categories} 
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 animate-slide-in-right">
            {isLoading ? (
              <div className={viewMode === 'grid' 
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={viewMode === 'grid' ? "space-y-4" : "flex gap-4 glass-card rounded-2xl p-4"}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <Skeleton className={viewMode === 'grid' ? "aspect-square rounded-2xl" : "w-24 h-24 rounded-2xl"} />
                    <div className={viewMode === 'grid' ? "space-y-2" : "flex-1 space-y-2"}>
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "space-y-4"
              }>
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard
                      item={item}
                      onAddToCart={handleAddToCart}
                      isAuthenticated={isAuthenticated}
                      viewMode={viewMode}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-strong rounded-3xl p-12 text-center animate-scale-in glow-cyan">
                <div className="space-y-6">
                  <div className="relative">
                    <div className="text-8xl animate-float">🔍</div>
                    <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-cyan-400 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-bold text-gradient-cyan">No matches found</h3>
                  <p className="text-white/70 max-w-md mx-auto">
                    {searchQuery || Object.keys(filters).length > 0
                      ? "Refine your search criteria or explore our full collection"
                      : "Our curated collection is being refreshed"}
                  </p>
                  {(searchQuery || Object.keys(filters).length > 0) && (
                    <Button
                      onClick={() => {
                        setSearchQuery("")
                        setFilters({})
                      }}
                      className="btn-secondary"
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      View All Items
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}