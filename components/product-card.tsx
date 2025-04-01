"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import type { Product } from "@/lib/types"
import OptimizedImage from "@/components/optimized-image"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsAdding(true)
    addToCart(product, 1)
    setTimeout(() => setIsAdding(false), 800)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-all hover:shadow-md hover-scale">
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleToggleWishlist}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isWishlisted ? "fill-primary text-primary" : "text-muted-foreground",
              )}
            />
          </Button>
        </div>

        <div className="aspect-square overflow-hidden">
          <OptimizedImage
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{product.brand || "Generic"}</span>
            {product.stock > 0 ? (
              <span className="text-xs text-green-500">En stock</span>
            ) : (
              <span className="text-xs text-red-500">Sin stock</span>
            )}
          </div>

          <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>

          <p className="line-clamp-2 text-sm text-muted-foreground h-10">{product.description}</p>

          <div className="mt-4 flex items-center justify-between">
            <div className="font-bold text-lg">${product.price.toFixed(2)}</div>
            <Button
              onClick={handleAddToCart}
              size="sm"
              disabled={product.stock <= 0 || isAdding}
              variant={product.stock <= 0 ? "outline" : "default"}
              className={cn("transition-all", isAdding && "bg-green-600")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.stock <= 0 ? "Sin stock" : isAdding ? "Agregado" : "Agregar"}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}

