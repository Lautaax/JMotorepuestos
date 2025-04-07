import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProductBySlug, getRelatedProducts } from "@/lib/products-db"
import ProductCard from "@/components/product-card"
import AddToCartButton from "@/components/add-to-cart-button"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import ProductReviews from "@/components/product-reviews"
import OptimizedImage from "@/components/optimized-image"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const product = await getProductBySlug(params.slug)

    if (!product) {
      return {
        title: "Producto no encontrado",
        description: "Lo sentimos, el producto que buscas no existe o ha sido eliminado.",
      }
    }

    return {
      title: product.name,
      description: product.description || `Compra ${product.name} en nuestra tienda online.`,
    }
  } catch (error) {
    console.error("Error generando metadata:", error)
    return {
      title: "Error",
      description: "Ha ocurrido un error al cargar el producto.",
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product = await getProductBySlug(params.slug)

    if (!product || !product.id) {
      console.error(`Producto con slug ${params.slug} no encontrado`)
      return notFound()
    }

    // Obtener productos relacionados
    const relatedProducts = await getRelatedProducts(product.id, product.category, 4)

    // Calcular el descuento si hay un precio de comparación
    const discountPercentage = product.compareAtPrice
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0

    return (
      <div className="container py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Productos</BreadcrumbLink>
          </BreadcrumbItem>
          {product.category && (
            <BreadcrumbItem>
              <BreadcrumbLink href={`/categories/${product.category}`}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem>
            <BreadcrumbLink aria-current="page">{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-lg border bg-background">
            <div className="aspect-square relative">
              <OptimizedImage
                src={product.image || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                width={600}
                height={600}
                className="object-contain"
                priority
              />

              {discountPercentage > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                  -{discountPercentage}%
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-2">
                {product.rating && (
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {product.rating.toFixed(1)} ({product.reviewCount || 0} reseñas)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.compareAtPrice.toLocaleString()}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="text-sm font-medium text-red-500">-{discountPercentage}%</span>
              )}
            </div>

            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Disponibilidad:</span>
                <span className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                  {product.stock > 0 ? `En stock (${product.stock} disponibles)` : "Agotado"}
                </span>
              </div>
              {product.sku && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SKU:</span>
                  <span className="text-sm text-muted-foreground">{product.sku}</span>
                </div>
              )}
              {product.brand && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Marca:</span>
                  <span className="text-sm text-muted-foreground">{product.brand}</span>
                </div>
              )}
            </div>

            <AddToCartButton product={product} variant="default" size="lg" className="w-full" />
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <div className="border-b">
            <div className="flex space-x-8">
              <button className="border-b-2 border-primary px-4 py-2 font-medium">Detalles</button>
              <button className="px-4 py-2 text-muted-foreground">Especificaciones</button>
              <button className="px-4 py-2 text-muted-foreground">Compatibilidad</button>
              <button className="px-4 py-2 text-muted-foreground">Reseñas</button>
            </div>
          </div>

          <div className="space-y-4">
            {product.specifications && product.specifications.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Especificaciones</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {product.specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.features && product.features.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Características</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.compatibleModels && product.compatibleModels.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Compatibilidad</h2>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  {product.compatibleModels.map((model, index) => (
                    <div key={index} className="rounded-lg border p-3">
                      <div className="font-medium">
                        {model.brand} {model.model}
                      </div>
                      <div className="text-sm text-muted-foreground">Año: {model.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sección de reseñas */}
        <div className="mt-12">
          <ProductReviews productId={product.id} />
        </div>

        {/* Productos relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Productos relacionados</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error en la página de producto:", error)
    return notFound()
  }
}

