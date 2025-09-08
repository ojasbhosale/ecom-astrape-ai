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
import { Search, AlertCircle } from "lucide-react"

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
    // Refetch items with new filters
    fetchItems()
  }

  const handleAddToCart = async (item: Item) => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    try {
      await addToCart(item, 1)
      // Success feedback could be added here
    } catch (err) {
      console.error("Failed to add item to cart:", err)
      // Error feedback could be added here
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => fetchItems()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Products</h1>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Results Count */}
            {!isLoading && (
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} product{filteredItems.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} categories={categories} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="space-y-4">
                  <div className="text-6xl">🔍</div>
                  <h3 className="text-xl font-semibold">No products found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || Object.keys(filters).length > 0
                      ? "Try adjusting your search or filters"
                      : "No products available at the moment"}
                  </p>
                  {(searchQuery || Object.keys(filters).length > 0) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("")
                        setFilters({})
                      }}
                    >
                      Clear all filters
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
