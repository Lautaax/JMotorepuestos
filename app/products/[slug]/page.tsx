import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { getProductBySlug, getRelatedProducts } from "@/lib/products-db"
import { formatCurrency } from "@/lib/utils"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import AddToCartButton from "@/components/add-to-cart-button"
import ProductReviews from "@/components/product-reviews"
import ProductCard from "@/components/product-card"
import type { CompatibleModel } from "@/lib/types"

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Producto no encontrado",
      description: "El producto que buscas no existe o ha sido eliminado.",
    }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [{ url: product.image || "/placeholder.svg" }],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(
    typeof product.category === "string" ? product.category : (product.category as { id: string; name: string }).id,
    product._id.toString(),
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/products">Productos</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`/categories/${
              typeof product.category === "string"
                ? product.category
                : (product.category as { id: string; name: string }).id
            }`}
          >
            {typeof product.category === "string"
              ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
              : product.category.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/products/${product.slug}`} aria-current="page">
            {product.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="relative aspect-square">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reseñas)
            </span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-3xl font-bold text-primary">{formatCurrency(product.price)}</span>
            {product.stock > 0 ? (
              <Badge className="ml-4 bg-green-500">En Stock</Badge>
            ) : (
              <Badge className="ml-4 bg-red-500">Agotado</Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* SKU & Brand */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-gray-500 block">SKU:</span>
              <span className="font-medium">{product.sku}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Marca:</span>
              <span className="font-medium">{product.brand}</span>
            </div>
          </div>

          {/* Add to Cart */}
          {product.stock > 0 && <AddToCartButton product={product} />}
        </div>
      </div>

      {/* Product Tabs */}
      <Tabs defaultValue="details" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="compatibility">Compatibilidad</TabsTrigger>
          <TabsTrigger value="reviews">Reseñas</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="p-6 bg-white rounded-lg shadow-md">
          {/* Specifications */}
          {product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">Especificaciones</h3>
              <ul className="space-y-2">
                {product.specifications.map((spec: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2">•</span> {spec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Features */}
          {product.features && Array.isArray(product.features) && product.features.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Características</h3>
              <ul className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>
        <TabsContent value="compatibility" className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Modelos Compatibles</h3>
          {product.compatibleModels && product.compatibleModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.compatibleModels.map((model, index) => {
                // Check if model is a string or an object
                const isModelObject = typeof model !== "string"
                return (
                  <div key={index} className="border p-3 rounded-lg">
                    {isModelObject ? (
                      <>
                        <p className="font-medium">
                          {(model as CompatibleModel).brand} {(model as CompatibleModel).model}
                        </p>
                        <p className="text-gray-600">Año: {(model as CompatibleModel).year}</p>
                      </>
                    ) : (
                      <p className="font-medium">{model}</p>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-600">No hay información de compatibilidad disponible.</p>
          )}
        </TabsContent>
        <TabsContent value="reviews" className="p-6 bg-white rounded-lg shadow-md">
          <ProductReviews productId={product._id.toString()} />
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id.toString()} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
