import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, Truck, ShieldCheck, Award, Star, StarHalf } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getProductById, getRelatedProducts } from "@/lib/products"
import ProductCard from "@/components/product-card"
import AddToCartButton from "@/components/add-to-cart-button"
import WhatsAppCheckout from "@/components/whatsapp-checkout"
import ProductReviews from "@/components/product/product-reviews"
import LoyaltyCard from "@/components/loyalty/loyalty-card"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"

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

  const relatedProducts = await getRelatedProducts(product.category, product.id)

  // Function to render star rating
  const renderStarRating = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />)
    }

    return stars
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-sm font-medium mb-6 hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Product Images */}
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="relative aspect-square">
                  <Image
                    src={product.image || "/placeholder.svg?height=600&width=600"}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    priority
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-lg border border-border bg-background cursor-pointer hover:border-primary transition-colors"
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={product.image || `/placeholder.svg?height=150&width=150&text=Imagen ${i}`}
                        alt={`${product.name} - Vista ${i}`}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.brand && <Badge variant="outline">{product.brand}</Badge>}
                </div>

                <h1 className="text-3xl font-bold">{product.name}</h1>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">{renderStarRating(4.5)}</div>
                  <span className="text-sm text-muted-foreground">(24 reseñas)</span>
                </div>

                <div className="mt-4">
                  <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${product.stock > 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                    >
                      {product.stock > 0 ? "En stock" : "Sin stock"}
                    </span>
                    {product.stock > 0 && (
                      <span className="text-sm text-muted-foreground">{product.stock} disponibles</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>{product.description}</p>
              </div>

              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Código:</span> {product.sku || product.id}
                </p>
                <p>
                  <span className="font-medium">Categoría:</span> {product.category}
                </p>
                <p>
                  <span className="font-medium">Marca:</span> {product.brand}
                </p>
                <p>
                  <span className="font-medium">Modelo compatible:</span>{" "}
                  {product.compatibleModels?.join(", ") || "Universal"}
                </p>
              </div>

              <div className="space-y-4">
                <AddToCartButton product={product} />
                <WhatsAppCheckout product={product} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Envío gratis</p>
                    <p className="text-muted-foreground">En compras mayores a $100</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Garantía</p>
                    <p className="text-muted-foreground">30 días de garantía</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Calidad</p>
                    <p className="text-muted-foreground">Productos originales</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full grid grid-cols-3 md:w-auto md:inline-flex">
                <TabsTrigger value="description">Descripción</TabsTrigger>
                <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies
                    tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget
                    ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
                  </p>
                  <ul>
                    <li>Alta calidad y durabilidad</li>
                    <li>Compatible con múltiples modelos</li>
                    <li>Fácil instalación</li>
                    <li>Rendimiento óptimo</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="mt-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Especificaciones técnicas</h3>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 py-2 border-b border-border">
                        <span className="font-medium">Material</span>
                        <span>Aluminio de alta resistencia</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 py-2 border-b border-border">
                        <span className="font-medium">Peso</span>
                        <span>0.5 kg</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 py-2 border-b border-border">
                        <span className="font-medium">Dimensiones</span>
                        <span>10 x 5 x 3 cm</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 py-2 border-b border-border">
                        <span className="font-medium">País de origen</span>
                        <span>Japón</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 py-2 border-b border-border">
                        <span className="font-medium">Garantía</span>
                        <span>30 días</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Modelos compatibles</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Honda CB 150",
                        "Honda CG 150",
                        "Honda XR 150",
                        "Yamaha YBR 125",
                        "Yamaha FZ 16",
                        "Suzuki GN 125",
                        "Suzuki EN 125",
                        "Bajaj Rouser 200",
                      ].map((model) => (
                        <div key={model} className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <span>{model}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <ProductReviews productId={product.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div className="mt-16 grid gap-8 md:grid-cols-4">
            <div className="md:col-span-3">
              <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            <div>
              <LoyaltyCard />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

