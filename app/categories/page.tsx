import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"

// Define our categories
const categories = [
  {
    id: "motor",
    name: "Motor",
    description: "Pistones, cilindros, juntas y todo lo necesario para el corazón de tu moto",
    image: "/placeholder.svg?height=400&width=400&text=Motor",
    subcategories: ["Pistones", "Cilindros", "Juntas", "Carburadores", "Filtros", "Aceites"],
  },
  {
    id: "frenos",
    name: "Frenos",
    description: "Sistemas de frenos de alta calidad para una conducción segura",
    image: "/placeholder.svg?height=400&width=400&text=Frenos",
    subcategories: ["Pastillas", "Discos", "Bombas", "Líquido de frenos", "Cables"],
  },
  {
    id: "suspension",
    name: "Suspensión",
    description: "Amortiguadores, horquillas y componentes para una conducción suave",
    image: "/placeholder.svg?height=400&width=400&text=Suspensión",
    subcategories: ["Amortiguadores", "Horquillas", "Bujes", "Resortes", "Barras"],
  },
  {
    id: "electrico",
    name: "Eléctrico",
    description: "Baterías, luces, arranques y todo el sistema eléctrico para tu moto",
    image: "/placeholder.svg?height=400&width=400&text=Eléctrico",
    subcategories: ["Baterías", "Luces", "Arranques", "CDI", "Bobinas", "Reguladores"],
  },
  {
    id: "accesorios",
    name: "Accesorios",
    description: "Complementos y accesorios para personalizar y mejorar tu motocicleta",
    image: "/placeholder.svg?height=400&width=400&text=Accesorios",
    subcategories: ["Espejos", "Manubrios", "Puños", "Asientos", "Baúles", "Protectores"],
  },
  {
    id: "neumaticos",
    name: "Neumáticos",
    description: "Neumáticos de alta calidad para todo tipo de terrenos y condiciones",
    image: "/placeholder.svg?height=400&width=400&text=Neumáticos",
    subcategories: ["Delanteros", "Traseros", "Cámaras", "Parches", "Válvulas"],
  },
  {
    id: "lubricantes",
    name: "Lubricantes",
    description: "Aceites y lubricantes para mantener tu moto en óptimas condiciones",
    image: "/placeholder.svg?height=400&width=400&text=Lubricantes",
    subcategories: ["Aceite de motor", "Aceite de transmisión", "Grasas", "Aditivos", "Limpiadores"],
  },
  {
    id: "transmision",
    name: "Transmisión",
    description: "Cadenas, piñones, embragues y todo el sistema de transmisión",
    image: "/placeholder.svg?height=400&width=400&text=Transmisión",
    subcategories: ["Cadenas", "Piñones", "Coronas", "Embragues", "Discos de embrague"],
  },
]

export default function CategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 bg-secondary">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight animate-fade-in">Categorías de Productos</h1>
              <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Explora nuestra amplia selección de repuestos y accesorios para motocicletas
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-animation">
              {categories.map((category, index) => (
                <Link key={category.id} href={`/categories/${category.id}`} className="group">
                  <div
                    className="bg-secondary rounded-lg overflow-hidden hover-scale animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-48">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 space-y-2">
                      <h2 className="text-xl font-bold group-hover:text-primary transition-colors">{category.name}</h2>
                      <p className="text-muted-foreground text-sm">{category.description}</p>
                      <div className="pt-4 flex justify-between items-center">
                        <div className="flex flex-wrap gap-2">
                          {category.subcategories.slice(0, 3).map((sub) => (
                            <span key={sub} className="text-xs bg-background px-2 py-1 rounded-full">
                              {sub}
                            </span>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              +{category.subcategories.length - 3} más
                            </span>
                          )}
                        </div>
                        <ChevronRight className="h-5 w-5 text-primary transform transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground">
                ¿No encuentras la categoría que buscas?
              </h2>
              <p className="text-primary-foreground/90">
                Contamos con una amplia variedad de repuestos para todas las marcas y modelos de motocicletas. Si no
                encuentras lo que necesitas, contáctanos y te ayudaremos.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button variant="secondary" size="lg">
                  Contactar ahora
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  Ver todos los productos
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

