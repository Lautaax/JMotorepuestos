import { Suspense } from "react"
import Link from "next/link"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import ProductCard from "@/components/product-card"
import { getProducts } from "@/lib/products-db"
import { ProductsFilters } from "@/components/products/products-filters"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import { Badge } from "@/components/ui/badge"

interface ProductsPageProps {
  searchParams: {
    category?: string
    sort?: string
    q?: string
    motoBrand?: string
    motoModel?: string
    motoYear?: string
    minPrice?: string
    maxPrice?: string
    brand?: string
    motoMarca?: string
    motoModelo?: string
    motoAno?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Asegurarse de que searchParams sea tratado como una promesa
  const resolvedSearchParams = await Promise.resolve(searchParams)

  // Convertir searchParams a un formato más manejable para la función getProducts
  const params = {
    category: resolvedSearchParams.category,
    brand: resolvedSearchParams.brand,
    minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
    maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
    motoMarca: resolvedSearchParams.motoMarca,
    motoModelo: resolvedSearchParams.motoModelo,
    motoAno: resolvedSearchParams.motoAno,
    sort: resolvedSearchParams.sort,
    query: resolvedSearchParams.q,
    motoBrand: resolvedSearchParams.motoBrand,
    motoModel: resolvedSearchParams.motoModel,
    motoYear: resolvedSearchParams.motoYear,
  }

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

        {/* Active Filters Section */}
        {(resolvedSearchParams.motoBrand || resolvedSearchParams.motoModel || resolvedSearchParams.motoYear) && (
          <section className="py-4 bg-muted/30">
            <div className="container">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">Filtros activos:</span>
                {resolvedSearchParams.motoBrand && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Marca: {resolvedSearchParams.motoBrand}
                  </Badge>
                )}
                {resolvedSearchParams.motoModel && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Modelo: {resolvedSearchParams.motoModel}
                  </Badge>
                )}
                {resolvedSearchParams.motoYear && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Año: {resolvedSearchParams.motoYear}
                  </Badge>
                )}
                <Link href="/products">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    Limpiar filtros
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Products Section */}
        <section className="py-12">
          <div className="container">
            {/* Barra de búsqueda y botón de filtros */}
            <div className="mb-6 flex items-center gap-3">
              <form action="/products" method="get" className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    name="q"
                    placeholder="Buscar repuestos..."
                    className="pl-10 pr-4"
                    defaultValue={resolvedSearchParams.q || ""}
                  />
                  <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8">
                    Buscar
                  </Button>
                </div>
              </form>

              <div className="flex-shrink-0">
                <Suspense fallback={<div className="h-10 w-32 bg-muted animate-pulse rounded-md"></div>}>
                  <ProductsFilters />
                </Suspense>
              </div>
            </div>

            {/* Lista de productos */}
            <div className="w-full">
              <Suspense fallback={<ProductsLoadingSkeleton />}>
                <ProductsList searchParams={params} />
              </Suspense>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

async function ProductsList({ searchParams }: { searchParams: any }) {
  const products = await getProducts(searchParams)

  // Serializar los productos para evitar el error de toJSON
  const serializedProducts = products.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    brand: product.brand,
    sku: product.sku,
    image: product.image,
    createdAt: product.createdAt ? product.createdAt.toISOString() : null,
    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
    // Añadir cualquier otro campo necesario
  }))

  if (serializedProducts.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="rounded-full bg-muted p-3">
          <Filter className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-medium">No se encontraron productos</h2>
        <p className="text-muted-foreground">
          {searchParams.motoBrand || searchParams.motoModel || searchParams.motoYear
            ? "No hay repuestos compatibles con la moto seleccionada"
            : "Intenta con otros filtros o términos de búsqueda"}
        </p>
        <Button variant="outline" asChild className="mt-2">
          <Link href="/products">Ver todos los productos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {serializedProducts.map((product, index) => (
        <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

function ProductsLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
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

