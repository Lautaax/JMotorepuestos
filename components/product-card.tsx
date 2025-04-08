import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import AddToCartButtonSimple from "@/components/add-to-cart-button-simple"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  if (!product) return null

  // Asegurarse de que el producto tenga un slug, si no, usar el ID
  const productUrl = product.slug ? `/producto/${product.slug}` : `/products/${product._id || product.id}`

  return (
    <Link href={productUrl as any} className="group block">
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative h-48 bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg?height=400&width=400"}
            alt={product.name || "Producto"}
            fill
            className="object-contain p-4"
          />
          {product.discount && product.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary line-clamp-2">
            {product.name || "Producto sin nombre"}
          </h2>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description || ""}</p>

          {/* Categorías o etiquetas */}
          <div className="flex flex-wrap gap-2 mb-3">
            {product.category && (
              <Badge variant="outline" className="text-xs">
                {typeof product.category === "string" ? product.category : product.category.name}
              </Badge>
            )}
            {product.brand && (
              <Badge variant="outline" className="text-xs">
                {product.brand}
              </Badge>
            )}
            {product.compatibleModels && product.compatibleModels.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {product.compatibleModels.length} modelos compatibles
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div>
              {product.discount && product.discount > 0 ? (
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price * (1 - product.discount / 100))}
                  </span>
                  <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
              )}
            </div>
            <AddToCartButtonSimple product={product} />
          </div>
        </div>
      </div>
    </Link>
  )
}

export { ProductCard }
