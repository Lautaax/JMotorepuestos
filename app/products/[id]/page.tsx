import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Bike, Check } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProductById, getRelatedProducts } from "@/lib/products-db"
import AddToCartButton from "@/components/add-to-cart-button"
import ProductCard from "@/components/product-card"
import ProductReviews from "@/components/product/product-reviews"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import OptimizedImage from "@/components/optimized-image"
import CompatibilityChecker from "@/components/product/compatibility-checker"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <Link
            href="/products"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a productos
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Imagen del producto */}
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-background">
              <OptimizedImage
                src={product.image || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Información del producto */}
            <div className="flex flex-col">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{product.category}</Badge>
                  {product.brand && <Badge variant="secondary">{product.brand}</Badge>}
                </div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                  {product.stock > 0 ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Check className="mr-1 h-3 w-3" /> En stock
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      Sin stock
                    </Badge>
                  )}
                </div>
              </div>

              {/* Verificador de compatibilidad */}
              <div className="mb-6">
                <CompatibilityChecker product={product} />
              </div>

              <div className="prose prose-sm mb-6">
                <p>{product.description}</p>
              </div>

              {product.sku && (
                <div className="text-sm text-muted-foreground mb-6">
                  SKU: <span className="font-mono">{product.sku}</span>
                </div>
              )}

              <div className="mt-auto">
                <AddToCartButton product={product} />
              </div>
            </div>
          </div>

          {/* Tabs de información adicional */}
          <div className="mt-12">
            <Tabs defaultValue="details">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="specs">Especificaciones</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibilidad</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="py-4">
                <div className="prose prose-sm max-w-none">
                  <h3>Descripción del producto</h3>
                  <p>{product.description}</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam
                    ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="specs" className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Características</h3>
                    <ul className="space-y-1">
                      <li className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Marca</span>
                        <span className="font-medium">{product.brand || "Genérico"}</span>
                      </li>
                      <li className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Categoría</span>
                        <span className="font-medium">{product.category}</span>
                      </li>
                      <li className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">SKU</span>
                        <span className="font-medium">{product.sku || "N/A"}</span>
                      </li>
                      <li className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Stock</span>
                        <span className="font-medium">{product.stock}</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Especificaciones técnicas</h3>
                    <ul className="space-y-1">
                      <li className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Material</span>
                        <span className="font-medium">Aluminio</span>
                      </li>
                      <li className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Peso</span>
                        <span className="font-medium">0.5 kg</span>
                      </li>
                      <li className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Dimensiones</span>
                        <span className="font-medium">10 x 5 x 2 cm</span>
                      </li>
                      <li className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Garantía</span>
                        <span className="font-medium">6 meses</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="compatibility" className="py-4">
                {product.compatibleWith && product.compatibleWith.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Motos compatibles</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {product.compatibleWith.map((compat, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                          <Bike className="h-4 w-4 text-primary" />
                          <span>
                            {compat.brand} {compat.model} {compat.year}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No hay información de compatibilidad disponible para este producto.
                  </p>
                )}
              </TabsContent>
              <TabsContent value="reviews" className="py-4">
                <ProductReviews productId={product.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Productos relacionados */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
            <Suspense fallback={<RelatedProductsSkeleton />}>
              <RelatedProducts category={product.category} productId={product.id} />
            </Suspense>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

async function RelatedProducts({ category, productId }: { category: string; productId: string }) {
  const products = await getRelatedProducts(category, productId)

  if (products.length === 0) {
    return <p className="text-muted-foreground">No hay productos relacionados disponibles.</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-background shadow-sm">
          <Skeleton className="aspect-square w-full rounded-t-lg" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

