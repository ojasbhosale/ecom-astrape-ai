"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "@/lib/api"
import { AuthService } from "@/lib/auth"
import type { Cart, Item } from "@/lib/types"

interface CartContextType {
  cart: Cart | null
  isLoading: boolean
  error: string | null
  addToCart: (item: Item, quantity?: number) => Promise<void>
  removeFromCart: (itemId: number, removeAll?: boolean) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  getItemQuantity: (itemId: number) => number
  refreshCart: () => Promise<void>
  clearError: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      refreshCart()
    }
  }, [])

  const refreshCart = async () => {
    if (!AuthService.isAuthenticated()) {
      setCart(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const cartData = await apiClient.get<Cart>("/cart")
      setCart(cartData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch cart")
      setCart(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getItemQuantity = (itemId: number): number => {
    if (!cart?.items) return 0
    const cartItem = cart.items.find((item) => item.item.id === itemId)
    return cartItem?.quantity || 0
  }

  const addToCart = async (item: Item, quantity = 1) => {
    if (!AuthService.isAuthenticated()) {
      throw new Error("Please log in to add items to cart")
    }

    try {
      setError(null)
      await apiClient.post("/cart/add", { itemId: item.id, quantity })
      await refreshCart()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add item to cart"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (!AuthService.isAuthenticated()) {
      throw new Error("Please log in to modify cart")
    }

    try {
      setError(null)
      if (quantity <= 0) {
        await removeFromCart(itemId, true)
      } else {
        await apiClient.post("/cart/update", { itemId, quantity })
        await refreshCart()
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update quantity"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const removeFromCart = async (itemId: number, removeAll = false) => {
    if (!AuthService.isAuthenticated()) {
      throw new Error("Please log in to modify cart")
    }

    try {
      setError(null)
      await apiClient.post("/cart/remove", { itemId, removeAll })
      await refreshCart()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove item from cart"
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        refreshCart,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
