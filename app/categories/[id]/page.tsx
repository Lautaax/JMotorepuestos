import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { getProducts } from "@/lib/products"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"

// Define our categories with more details
const categories = {
  motor: {
    name: "Motor",
    description: "Pistones, cilindros, juntas y todo lo necesario para el corazón de tu moto",
    image: "/placeholder.svg?height=1200&width=1600&text=Motor",
    subcategories: ["Pistones", "Cilindros", "Juntas", "Carburadores", "Filtros", "Aceites"],
  },
  frenos: {
    name: "Frenos",
    description: "Sistemas de frenos de alta calidad para una conducción segura",
    image: "/placeholder.svg?height=1200&width=1600&text=Frenos",
    subcategories: ["Pastillas", "Discos", "Bombas", "Líquido de frenos", "Cables"],
  },
  suspension: {
    name: "Suspensión",
    description: "Amortiguadores, horquillas y componentes para una conducción suave",
    image: "/placeholder.svg?height=1200&width=1600&text=Suspensión",
    subcategories: ["Amortiguadores", "Horquillas", "Bujes", "Resortes", "Barras"],
  },
  electrico: {
    name: "Eléctrico",
    description: "Baterías, luces, arranques y todo el sistema eléctrico para tu moto",
    image: "/placeholder.svg?height=1200&width=1600&text=Eléctrico",
    subcategories: ["Baterías", "Luces", "Arranques", "CDI", "Bobinas", "Reguladores"],
  },
  accesorios: {
    name: "Accesorios",
    description: "Complementos y accesorios para personalizar y mejorar tu motocicleta",
    image: "/placeholder.svg?height=1200&width=1600&text=Accesorios",
    subcategories: ["Espejos", "Manubrios", "Puños", "Asientos", "Baúles", "Protectores"],
  },
}

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = categories[params.id as keyof typeof categories]

  if (!category) {
    notFound()
  }

  // Get products for this category
  const products = await getProducts({ category: params.id })

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative">
          <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
            <Image
              src={`/images/categories/${params.id}.svg`}
              alt={category.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background to-background/40" />
          </div>

          <div className="container relative z-10 -mt-16 md:-mt-24">
            <div className="bg-background p-6 md:p-8 rounded-lg shadow-lg max-w-3xl animate-slide-in-up">
              <Link
                href="/categories"
                className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary mb-4"
              >
                <ChevronLeft className="h-4 w-4" />
                Todas las categorías
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{category.name}</h1>
              <p className="text-muted-foreground mt-2">{category.description}</p>

              <div className="flex flex-wrap gap-2 mt-6">
                {category.subcategories.map((sub) => (
                  <Link key={sub} href={`/categories/${params.id}?subcategory=${sub.toLowerCase()}`}>
                    <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                      {sub}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Productos de {category.name}</h2>
                <p className="text-muted-foreground mt-1">{products.length} productos encontrados</p>
              </div>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Button variant="outline" size="sm">
                  Filtrar
                </Button>
                <select className="bg-secondary border border-border rounded-md px-3 py-1 text-sm">
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="newest">Más Recientes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 stagger-animation">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-muted-foreground">No se encontraron productos en esta categoría.</p>
                  <Button variant="link" className="mt-2" asChild>
                    <Link href="/products">Ver todos los productos</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Categories */}
        <section className="py-16 bg-secondary">
          <div className="container">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Categorías relacionadas</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {Object.entries(categories)
                .filter(([id]) => id !== params.id)
                .slice(0, 4)
                .map(([id, cat], index) => (
                  <Link
                    key={id}
                    href={`/categories/${id}`}
                    className="group bg-background rounded-lg overflow-hidden hover-scale animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-40">
                      <Image
                        src={cat.image || "/placeholder.svg"}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold group-hover:text-primary transition-colors">{cat.name}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">{cat.description}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

