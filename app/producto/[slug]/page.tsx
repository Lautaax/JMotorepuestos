import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProductBySlug, getRelatedProducts } from "@/lib/products-db"
import ProductCard from "@/components/product-card"
import AddToCartButton from "@/components/add-to-cart-button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import OptimizedImage from "@/components/optimized-image"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import ProductDetailTabs from "@/components/product-detail-tabs"
import type { Category } from "@/lib/types"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    // Await params before accessing slug
    const resolvedParams = await params
    const product = await getProductBySlug(resolvedParams.slug)

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
    // Await params before accessing slug
    const resolvedParams = await params
    const product = await getProductBySlug(resolvedParams.slug)

    if (!product || !product.id) {
      console.error(`Producto con slug ${resolvedParams.slug} no encontrado`)
      return notFound()
    }

    // Obtener productos relacionados
    const relatedProducts = await getRelatedProducts(
      product.id,
      typeof product.category === "string" ? product.category : (product.category as Category)?._id || "",
      4,
    )

    // Calcular el descuento si hay un precio de comparación
    const discountPercentage =
      product.compareAtPrice && typeof product.compareAtPrice === "number" && product.compareAtPrice > 0
        ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
        : 0

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />

        <main className="flex-1">
          <div className="container py-8">
            <div className="flex flex-row items-center w-full mb-4">
              <Breadcrumb className="flex-1">
                <BreadcrumbList className="flex-row">
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/productos">Productos</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  {product.category && (
                    <>
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href={`/categories/${typeof product.category === "string" ? product.category : (product.category as Category)._id}`}
                        >
                          {typeof product.category === "string"
                            ? product.category
                            : (product.category as Category).name}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  )}
                  <BreadcrumbItem>
                    <span className="font-medium text-foreground">{product.name}</span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

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
                              className={`text-lg ${i < Math.round(product.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-muted-foreground">
                          {(product.rating || 0).toFixed(1)} ({product.reviewCount || 0} reseñas)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${product.price.toLocaleString()}</span>
                  {product.compareAtPrice &&
                    typeof product.compareAtPrice === "number" &&
                    product.compareAtPrice > product.price && (
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

                <AddToCartButton product={product} quantity={1} />
              </div>
            </div>

            <div className="mt-12">
              <ProductDetailTabs product={product as any} />
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
        </main>

        <SiteFooter />
      </div>
    )
  } catch (error) {
    console.error("Error en la página de producto:", error)
    return notFound()
  }
}
