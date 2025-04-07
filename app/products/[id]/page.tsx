import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Truck, ShieldCheck, RotateCcw, Star } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import AddToCartButton from "@/components/add-to-cart-button"
import { getProductById, getRelatedProducts } from "@/lib/products-db"
import { ProductReviews } from "@/components/product/product-reviews"

interface ProductPageProps {
  params: {
    id: string
  }
}

// Función para formatear moneda
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default async function ProductPage(props: ProductPageProps) {
  // Esperar a que params esté disponible completamente
  const params = await props.params
  const id = params.id

  try {
    console.log(`Buscando producto con ID: ${id}`)

    const product = await getProductById(id)

    if (!product) {
      console.log(`Producto con ID ${id} no encontrado`)
      return notFound()
    }

    console.log(`Producto encontrado: ${product.name}`)

    // Obtener productos relacionados
    let relatedProducts = []
    try {
      relatedProducts = await getRelatedProducts(product.category, id)
    } catch (error) {
      console.error("Error al obtener productos relacionados:", error)
    }

    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1">
          {/* Breadcrumb */}
          <div className="container py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Inicio
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/products" className="hover:text-primary">
                Productos
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-primary">
                {product.category}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="truncate max-w-[200px]">{product.name}</span>
            </div>
          </div>

          {/* Product Details */}
          <section className="container py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="bg-secondary rounded-lg p-6 flex items-center justify-center">
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  <Image
                    src={product.image || "/placeholder.svg?height=600&width=600"}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold">{product.name}</h1>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(product.rating || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">
                      {product.rating || 0} ({product.reviewCount || 0} reseñas)
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatCurrency(product.compareAtPrice)}
                    </span>
                  )}
                </div>

                <div className="prose prose-sm max-w-none">
                  <p>{product.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span>{product.stock > 0 ? `En stock (${product.stock} disponibles)` : "Fuera de stock"}</span>
                  </div>

                  {product.sku && <div className="text-sm text-muted-foreground">SKU: {product.sku}</div>}

                  {product.brand && (
                    <div className="text-sm">
                      Marca: <span className="font-medium">{product.brand}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <AddToCartButton product={product} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                  <div className="flex flex-col items-center text-center p-3 bg-secondary rounded-lg">
                    <Truck className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Envío Gratis</span>
                    <span className="text-xs text-muted-foreground">En pedidos +$50.000</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-secondary rounded-lg">
                    <ShieldCheck className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Garantía</span>
                    <span className="text-xs text-muted-foreground">30 días de garantía</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-secondary rounded-lg">
                    <RotateCcw className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">Devoluciones</span>
                    <span className="text-xs text-muted-foreground">Política de 14 días</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Product Tabs */}
          <section className="container py-12">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibilidad</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="p-6 bg-secondary rounded-lg mt-4">
                <div className="prose prose-sm max-w-none">
                  <h3>Especificaciones</h3>
                  <ul>
                    {product.specifications &&
                      Object.entries(product.specifications).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {value as string}
                        </li>
                      ))}
                  </ul>
                  <h3>Características</h3>
                  <p>{product.features || "Información no disponible"}</p>
                </div>
              </TabsContent>
              <TabsContent value="compatibility" className="p-6 bg-secondary rounded-lg mt-4">
                <div className="prose prose-sm max-w-none">
                  <h3>Modelos Compatibles</h3>
                  {product.compatibleModels && product.compatibleModels.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {product.compatibleModels.map((model, index) => (
                        <li key={index} className="bg-background p-2 rounded">
                          {typeof model === "object" ? (
                            <>
                              <strong>{model.brand}</strong> {model.model} ({model.year})
                            </>
                          ) : (
                            model
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay información de compatibilidad disponible para este producto.</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="p-6 bg-secondary rounded-lg mt-4">
                <ProductReviews productId={id} />
              </TabsContent>
            </Tabs>
          </section>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="container py-12">
              <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`} className="group">
                    <div className="bg-secondary rounded-lg overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={relatedProduct.image || "/placeholder.svg?height=400&width=400"}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">{relatedProduct.description}</p>
                        <p className="font-bold mt-2">{formatCurrency(relatedProduct.price)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>
        <SiteFooter />
      </div>
    )
  } catch (error) {
    console.error("Error en la página de producto:", error)
    return notFound()
  }
}

