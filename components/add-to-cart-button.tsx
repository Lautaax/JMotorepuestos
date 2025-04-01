"use client"

import type React from "react"

import { useState } from "react"
import { Minus, Plus, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/providers/cart-provider"
import type { Product } from "@/lib/types"

interface AddToCartButtonProps {
  product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    if (product.stock <= 0 || quantity <= 0) return

    setIsAdding(true)
    addToCart(product, quantity)
    setTimeout(() => setIsAdding(false), 500)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value >= 1 && value <= product.stock) {
      setQuantity(value)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1 || product.stock <= 0}>
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={handleQuantityChange}
          className="h-9 w-16 text-center"
          disabled={product.stock <= 0}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={increaseQuantity}
          disabled={quantity >= product.stock || product.stock <= 0}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button
        onClick={handleAddToCart}
        className="w-full"
        disabled={product.stock <= 0 || isAdding}
        variant={product.stock <= 0 ? "outline" : "default"}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {product.stock <= 0 ? "Sin stock" : isAdding ? "Agregado al carrito" : "Agregar al carrito"}
      </Button>
    </div>
  )
}

