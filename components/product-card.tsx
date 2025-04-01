"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Heart, Bike } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import type { Product } from "@/lib/types"
import OptimizedImage from "@/components/optimized-image"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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

  // Mostrar hasta 2 compatibilidades en la tarjeta
  const compatibilityPreview = product.compatibleWith?.slice(0, 2) || []
  const hasMoreCompatibilities = product.compatibleWith && product.compatibleWith.length > 2

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

          {/* Compatibilidad con motos */}
          {compatibilityPreview.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Bike className="h-3 w-3" />
                <span>Compatible con:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {compatibilityPreview.map((compat, index) => (
                  <Badge key={index} variant="outline" className="text-xs py-0">
                    {compat.brand} {compat.model} {compat.year}
                  </Badge>
                ))}
                {hasMoreCompatibilities && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="outline" className="text-xs py-0 cursor-help">
                          +{product.compatibleWith!.length - 2} más
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs p-1">
                          {product.compatibleWith!.slice(2, 5).map((compat, index) => (
                            <div key={index}>
                              {compat.brand} {compat.model} {compat.year}
                            </div>
                          ))}
                          {product.compatibleWith!.length > 5 && (
                            <div className="text-muted-foreground">Y {product.compatibleWith!.length - 5} más...</div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          )}

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

