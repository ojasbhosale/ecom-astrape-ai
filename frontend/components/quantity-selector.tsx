"use client"

import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { useState } from "react"

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
  disabled?: boolean
  size?: "sm" | "md" | "lg"
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 0,
  max = 99,
  disabled = false,
  size = "md",
}: QuantitySelectorProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < min || newQuantity > max || disabled) return

    setIsUpdating(true)
    onQuantityChange(newQuantity)

    // Small delay for smooth UX
    setTimeout(() => setIsUpdating(false), 200)
  }

  const sizeClasses = {
    sm: "h-7 w-7 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  }

  const containerClasses = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
  }

  return (
    <div className={`flex items-center ${containerClasses[size]} bg-card border rounded-lg p-1`}>
      <Button
        variant="ghost"
        size="sm"
        className={`${sizeClasses[size]} p-0 hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200`}
        onClick={() => handleQuantityChange(quantity - 1)}
        disabled={disabled || isUpdating || quantity <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>

      <span
        className={`min-w-[2rem] text-center font-medium ${size === "lg" ? "text-base" : "text-sm"} transition-all duration-200 ${isUpdating ? "scale-110" : ""}`}
      >
        {quantity}
      </span>

      <Button
        variant="ghost"
        size="sm"
        className={`${sizeClasses[size]} p-0 hover:bg-primary hover:text-primary-foreground transition-colors duration-200`}
        onClick={() => handleQuantityChange(quantity + 1)}
        disabled={disabled || isUpdating || quantity >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
