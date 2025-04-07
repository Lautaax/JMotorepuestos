"use client"

import React from "react"

import { getProducts } from "@/lib/products-db"
import ProductCard from "@/components/product-card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
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

  const [products, setProducts] = React.useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts(filters)
      setProducts(products)
    }
    fetchProducts()
  }, [filters])

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink aria-current="page">Productos</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-4">Productos</h1>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <form action="/productos" className="relative w-full sm:max-w-md">
                <Input
                  type="search"
                  name="q"
                  placeholder="Buscar productos..."
                  className="pr-10"
                  defaultValue={(searchParams.q as string) || ""}
                />
                <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-10 w-10">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Buscar</span>
                </Button>
              </form>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{products.length} productos encontrados</span>
                <div className="ml-auto">
                  <select
                    name="sort"
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    defaultValue={(searchParams.sort as string) || "featured"}
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
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <ProductsFilters />
            </div>
            <div className="md:col-span-3">
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
    </>
  )
}

