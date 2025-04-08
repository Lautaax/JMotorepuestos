import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getCategoryBySlug, getCategoryById } from "@/lib/categories-db"
import { getProductsByCategory } from "@/lib/products-db"
import ProductCard from "@/components/product-card"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import type { Category } from "@/lib/types"

interface CategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const category = await getCategoryBySlug(resolvedParams.id)

  if (!category) {
    return {
      title: "Categoría no encontrada",
      description: "La categoría que estás buscando no existe",
    }
  }

  return {
    title: category.name,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const categorySlug = resolvedParams.id

  console.log(`Buscando categoría con slug: ${categorySlug}`)
  const category = await getCategoryBySlug(categorySlug)

  if (!category) {
    console.log(`Categoría con slug ${categorySlug} no encontrada`)
    notFound()
  }

  console.log(`Buscando categoría con slug: ${categorySlug}, Encontrada: Sí`)
  console.log(`Buscando productos en la categoría: ${category.name}`)

  const products = await getProductsByCategory(category.id)

  console.log(`Encontrados ${products.length} productos en la categoría ${category.name}`)

  // Obtener categorías relacionadas (simuladas)
  const getRelatedCategories = async (): Promise<Category[]> => {
    try {
      // Aquí deberías implementar la lógica para obtener categorías relacionadas
      // Por ahora, simplemente devolvemos algunas categorías de ejemplo
      const allCategories = await Promise.all([
        getCategoryById("1"),
        getCategoryById("2"),
        getCategoryById("3"),
        getCategoryById("4"),
      ])

      return allCategories.filter((cat): cat is Category => cat !== null && cat.id !== category.id).slice(0, 4)
    } catch (error) {
      console.error("Error al obtener categorías relacionadas:", error)
      return []
    }
  }

  const relatedCategories = await getRelatedCategories()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <Breadcrumb className="mb-4">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/categories">Categorías</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink aria-current="page">{category.name}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                {category.image && (
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="mt-4 text-gray-600">{category.description}</p>
              <div className="mt-8">
                <h2 className="text-xl font-semibold">Productos en esta categoría</h2>
                <p className="mt-2 text-gray-600">
                  {products.length > 0
                    ? `Encontramos ${products.length} productos en esta categoría.`
                    : "No hay productos disponibles en esta categoría actualmente."}
                </p>
              </div>
            </div>
          </div>

          {products.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold">Productos</h2>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Categorías relacionadas</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {relatedCategories.map((relatedCategory) => (
                <Link
                  key={relatedCategory.id}
                  href={`/categories/${relatedCategory.slug}` as any}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    {relatedCategory.image && (
                      <Image
                        src={relatedCategory.image || "/placeholder.svg"}
                        alt={relatedCategory.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <h3 className="mt-3 text-lg font-medium">{relatedCategory.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
