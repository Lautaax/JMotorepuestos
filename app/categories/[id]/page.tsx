import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import ProductCard from "@/components/product-card"
import { getProductsByCategory } from "@/lib/products-db"
import { getCategoryBySlug, type Category } from "@/lib/categories-db"

interface CategoryPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  // Esperar a que params se resuelva antes de acceder a id
  const resolvedParams = await Promise.resolve(params)
  const category = await getCategoryBySlug(resolvedParams.id)

  if (!category) {
    return {
      title: "Categoría no encontrada",
      description: "La categoría que buscas no existe",
    }
  }

  return {
    title: `${category.name} | Moto MotoRepuestos`,
    description: category.description || `Explora nuestra selección de ${category.name} para tu motocicleta`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Esperar a que params se resuelva antes de acceder a id
  const resolvedParams = await Promise.resolve(params)

  // Verifica que estás usando el slug correcto
  const category = await getCategoryBySlug(resolvedParams.id)

  // Añade un log para depuración
  console.log(`Buscando categoría con slug: ${resolvedParams.id}, Encontrada:`, category ? "Sí" : "No")

  if (!category) {
    notFound()
  }

  // Obtener los productos de esta categoría
  const productsFromDB = await getProductsByCategory(category.name)

  // Transformar los documentos de MongoDB al formato que espera ProductCard
  const products = productsFromDB.map((product) => ({
    id: product._id.toString(),
    name: product.name || "",
    description: product.description || "",
    price: product.price || 0,
    stock: product.stock || 0,
    category: product.category || "",
    brand: product.brand || "",
    sku: product.sku || "",
    image: product.image || "/placeholder.svg?height=400&width=400",
  }))

  // Obtener todas las categorías para mostrar categorías relacionadas
  const allCategories = await getCategories()
  const relatedCategories = allCategories.filter((cat) => cat.id !== category.id).slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 bg-secondary">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <Link href="/" className="hover:text-primary">
                  Inicio
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link href="/categories" className="hover:text-primary">
                  Categorías
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span>{category.name}</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight animate-fade-in">{category.name}</h1>
              <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
                {category.description}
              </p>
              {category.subcategories && category.subcategories.length > 0 && (
                <div
                  className="flex flex-wrap justify-center gap-2 pt-4 animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  {category.subcategories.map((subcategory: string) => (
                    <span key={subcategory} className="px-3 py-1 bg-background rounded-full text-sm">
                      {subcategory}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-2xl font-bold mb-8">Productos en {category.name}</h2>

            {products.length === 0 ? (
              <div className="text-center py-12 bg-secondary rounded-lg">
                <h3 className="text-xl font-medium mb-4">No hay productos disponibles en esta categoría</h3>
                <p className="text-muted-foreground mb-6">Estamos trabajando para añadir más productos pronto.</p>
                <Button asChild>
                  <Link href="/products">Ver todos los productos</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <section className="py-16 bg-secondary">
            <div className="container">
              <h2 className="text-2xl font-bold mb-8">Categorías relacionadas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedCategories.map((relatedCategory: Category) => (
                  <Link key={relatedCategory.id} href={`/categories/${relatedCategory.slug}`} className="group">
                    <div className="bg-background rounded-lg overflow-hidden hover-scale">
                      <div className="relative h-32">
                        <Image
                          src={relatedCategory.image || "/placeholder.svg"}
                          alt={relatedCategory.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium group-hover:text-primary transition-colors">
                          {relatedCategory.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">{relatedCategory.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}

