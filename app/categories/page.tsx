import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getCategories } from "@/lib/categories-db"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Categorías | MotoRepuestos",
  description: "Explora todas las categorías de repuestos para motocicletas",
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  // Agrupar categorías por tipo o slug
  const motorCategories = categories.filter(
    (cat) => (cat as any).type === "motor" || (cat as any).slug?.includes("motor"),
  )
  const frenosCategories = categories.filter(
    (cat) => (cat as any).type === "frenos" || (cat as any).slug?.includes("freno"),
  )
  const suspensionCategories = categories.filter(
    (cat) => (cat as any).type === "suspension" || (cat as any).slug?.includes("suspension"),
  )
  const electricoCategories = categories.filter(
    (cat) => (cat as any).type === "electrico" || (cat as any).slug?.includes("electrico"),
  )
  const accesoriosCategories = categories.filter(
    (cat) => (cat as any).type === "accesorios" || (cat as any).slug?.includes("accesorios"),
  )

  // Si no hay categorías en algún grupo, asegurarse de que haya al menos una para mostrar
  const allGroups = [
    { id: "todas", name: "Todas", categories: categories },
    { id: "motor", name: "Motor", categories: motorCategories.length ? motorCategories : categories.slice(0, 2) },
    { id: "frenos", name: "Frenos", categories: frenosCategories.length ? frenosCategories : categories.slice(1, 3) },
    {
      id: "suspension",
      name: "Suspensión",
      categories: suspensionCategories.length ? suspensionCategories : categories.slice(2, 4),
    },
    {
      id: "electrico",
      name: "Sistema Eléctrico",
      categories: electricoCategories.length ? electricoCategories : categories.slice(3, 5),
    },
    {
      id: "accesorios",
      name: "Accesorios",
      categories: accesoriosCategories.length ? accesoriosCategories : categories.slice(0, 3),
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <Home className="h-4 w-4 mr-1" />
                  Inicio
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="/categories">Categorías</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl font-bold mb-8 text-center">Categorías de Repuestos</h1>

          {/* Buscador de categorías */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Input type="search" placeholder="Buscar categorías..." className="pr-10" />
              <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Tabs para filtrar por tipo */}
          <Tabs defaultValue="todas" className="mb-8">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
              {allGroups.map((group) => (
                <TabsTrigger key={group.id} value={group.id}>
                  {group.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {allGroups.map((group) => (
              <TabsContent key={group.id} value={group.id} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.categories.map((category: any) => (
                    <Link
                      key={category.id || category._id?.toString()}
                      href={`/categories/${category.slug || ""}`}
                      className="block group"
                    >
                      <div className=" rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className="relative h-48 bg-gray-100">
                          <Image
                            src={category.image || "/placeholder.svg?height=400&width=400"}
                            alt={category.name || "Categoría"}
                            fill
                            className="object-contain p-4"
                          />
                        </div>
                        <div className="p-4">
                          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">
                            {category.name || "Categoría sin nombre"}
                          </h2>
                          <p className="text-gray-600 text-sm mb-3">{category.description || ""}</p>
                          <div className="flex flex-wrap gap-2">
                            {category.subcategories &&
                              category.subcategories.slice(0, 4).map((subcategory: string, index: number) => (
                                <span
                                  key={index}
                                  className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                                >
                                  {subcategory}
                                </span>
                              ))}
                            {category.subcategories && category.subcategories.length > 4 && (
                              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                +{category.subcategories.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

