"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/providers/cart-provider"
import type { Product } from "@/lib/types"
import OptimizedImage from "./optimized-image"

interface ProductCardProps {
  product: Product
}

function formatPrice(price: number): string {
  return price.toFixed(2)
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.stock <= 0) return

    setIsAdding(true)
    addToCart(product, 1)
    setTimeout(() => setIsAdding(false), 800)
  }

  // Determinar el color del badge de stock
  const getStockBadgeVariant = () => {
    if (product.stock <= 0) return "destructive"
    if (product.stock < 5) return "warning" // Añadimos una variante "warning" para stock bajo
    return "secondary"
  }

  // Usar slug si está disponible, de lo contrario usar id
  const productUrl = product.slug ? `/producto/${product.slug}` : `/p/${product.id}`

  return (
    <div className="group rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
      <Link href={productUrl} className="relative block aspect-square overflow-hidden rounded-t-lg">
        <OptimizedImage
          src={product.image || "/placeholder.svg?height=400&width=400"}
          alt={product.name}
          width={400}
          height={400}
          className="object-cover transition-transform group-hover:scale-105"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-medium text-white">Sin stock</span>
          </div>
        )}
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <Link href={productUrl}>
            <h3 className="font-medium line-clamp-1">{product.name}</h3>
          </Link>
          <Badge variant={getStockBadgeVariant()} className="ml-2 whitespace-nowrap">
            <Package className="h-3 w-3 mr-1" />
            {product.stock <= 0 ? "Sin stock" : `Stock: ${product.stock}`}
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description || ""}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-medium text-lg">${formatPrice(product.price)}</span>
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
  )
}

