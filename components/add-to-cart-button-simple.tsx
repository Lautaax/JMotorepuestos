"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/types"

interface AddToCartButtonSimpleProps {
  product: Product
}

export default function AddToCartButtonSimple({ product }: AddToCartButtonSimpleProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)

    // Simular un pequeño retraso para mostrar el estado de carga
    setTimeout(() => {
      addItem(product, 1)
      setIsAdding(false)
    }, 500)
  }

  return (
    <Button onClick={handleAddToCart} disabled={isAdding || product.stock <= 0} size="sm">
      <ShoppingCart className="h-4 w-4" />
    </Button>
  )
}

// Exportar también como objeto nombrado para compatibilidad
export { AddToCartButtonSimple }
