"use client"

import { useState } from "react"

import { getProducts } from "@/lib/products-db"
import ProductCard from "@/components/product-card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { ProductsFilters } from "@/components/products/products-filters"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useEffect } from "react"

interface ProductsPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default function ProductsPageClient({ searchParams }: ProductsPageProps) {
  // Convertir searchParams a filtros
  const filters = {
    category: searchParams.category as string,
    brand: searchParams.brand as string,
    minPrice: searchParams.minPrice ? Number.parseFloat(searchParams.minPrice as string) : undefined,
    maxPrice: searchParams.maxPrice ? Number.parseFloat(searchParams.maxPrice as string) : undefined,
    sort: searchParams.sort as string,
    query: searchParams.q as string,
    motoMarca: searchParams.motoMarca as string,
    motoModelo: searchParams.motoModelo as string,
    motoAno: searchParams.motoAno as string,
  }

  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts(filters)
      setProducts(fetchedProducts)
    }

    fetchProducts()
  }, [filters])

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink aria-current="page">Productos</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Título y barra de búsqueda */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold">Productos</h1>
            <form action="/productos" className="w-full md:w-auto flex gap-2">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="q"
                  placeholder="Buscar productos..."
                  className="pl-8"
                  defaultValue={searchParams.q || ""}
                />
              </div>
              <Button type="submit">Buscar</Button>
            </form>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <ProductsFilters />
            </div>
            <div className="md:col-span-3">
              {/* Resultados y ordenamiento */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  {products.length} {products.length === 1 ? "producto encontrado" : "productos encontrados"}
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm">
                    Ordenar por:
                  </label>
                  <select
                    id="sort"
                    name="sort"
                    className="text-sm border rounded p-1"
                    defaultValue={searchParams.sort || "featured"}
                    onChange={(e) => {
                      const url = new URL(window.location.href)
                      url.searchParams.set("sort", e.target.value)
                      window.location.href = url.toString()
                    }}
                  >
                    <option value="featured">Destacados</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="newest">Más recientes</option>
                  </select>
                </div>
              </div>

              {products.length === 0 ? (
                <div className="rounded-lg border p-8 text-center">
                  <h2 className="text-xl font-semibold">No se encontraron productos</h2>
                  <p className="mt-2 text-muted-foreground">Intenta con otros filtros o términos de búsqueda.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

