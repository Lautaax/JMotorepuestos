"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    stock: number
    category: string
    brand: string
    sku: string
    image: string
  }
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

    setIsAdding(true)
    addToCart(product, 1)
    setTimeout(() => setIsAdding(false), 800)
  }

  return (
    <div className="group rounded-lg border bg-background shadow-sm transition-all hover:shadow-md">
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden rounded-t-lg">
        <Image
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
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
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

