import { Suspense } from "react"
import Link from "next/link"
import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import ProductCard from "@/components/product-card"
import { getProducts } from "@/lib/products"
import ProductsFilters from "@/components/products/products-filters"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"

interface ProductsPageProps {
  searchParams: {
    category?: string
    sort?: string
    q?: string
    motoBrand?: string
    motoModel?: string
    motoYear?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Asegurarse de que searchParams sea resuelto
  const resolvedSearchParams = await Promise.resolve(searchParams)

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-secondary py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight animate-fade-in">Catálogo de Productos</h1>
              <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
                Encuentra los mejores repuestos para tu motocicleta
              </p>

              <div
                className="flex flex-wrap justify-center gap-3 pt-4 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <Link href="/products?category=motor">
                  <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                    Motor
                  </Button>
                </Link>
                <Link href="/products?category=frenos">
                  <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                    Frenos
                  </Button>
                </Link>
                <Link href="/products?category=suspension">
                  <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                    Suspensión
                  </Button>
                </Link>
                <Link href="/products?category=electrico">
                  <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                    Eléctrico
                  </Button>
                </Link>
                <Link href="/products?category=accesorios">
                  <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                    Accesorios
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12">
          <div className="container">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <Suspense fallback={<div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>}>
                  <ProductsFilters initialSearchParams={resolvedSearchParams} />
                </Suspense>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Suspense fallback={<ProductsLoadingSkeleton />}>
                  <ProductsList searchParams={resolvedSearchParams} />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

async function ProductsList({ searchParams }: ProductsPageProps) {
  // Convertir searchParams a un objeto con valores definidos para evitar el error
  const resolvedSearchParams = await Promise.resolve(searchParams)

  const params = {
    category: resolvedSearchParams.category || undefined,
    sort: resolvedSearchParams.sort || undefined,
    query: resolvedSearchParams.q || undefined,
    motoBrand: resolvedSearchParams.motoBrand || undefined,
    motoModel: resolvedSearchParams.motoModel || undefined,
    motoYear: resolvedSearchParams.motoYear || undefined,
  }

  const products = await getProducts(params)

  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <Filter className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-medium">No se encontraron productos</h2>
        <p className="text-muted-foreground">Intenta con otros filtros o términos de búsqueda</p>
        <Button variant="outline" asChild className="mt-2">
          <Link href="/products">Ver todos los productos</Link>
        </Button>
      </div>
    )
  }

  return products.map((product, index) => (
    <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
      <ProductCard product={product} />
    </div>
  ))
}

function ProductsLoadingSkeleton() {
  return Array.from({ length: 8 }).map((_, i) => (
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
  ))
}

