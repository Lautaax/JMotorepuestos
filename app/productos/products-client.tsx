"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import ProductCard from "@/components/product-card"
import { ProductsFilters } from "@/components/products/products-filters"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import { Badge } from "@/components/ui/badge"
import WhatsAppContactButton from "@/components/whatsapp-contact-button"
import type { Product } from "@/lib/types"

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null)

  useEffect(() => {
    // Get search params from URL
    if (typeof window !== "undefined") {
      setSearchParams(new URLSearchParams(window.location.search))
    }
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        // Build the API URL with search parameters
        let url = "/api/products"
        if (searchParams && searchParams.toString()) {
          url += `?${searchParams.toString()}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`)
        }

        const data = await response.json()
        console.log("Products data from API:", data)

        if (Array.isArray(data)) {
          setProducts(data)
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products)
        } else {
          console.error("Unexpected data format:", data)
          setProducts([])
        }
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  // Function to handle search form submission
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const searchQuery = formData.get("q") as string

    if (typeof window !== "undefined") {
      const newParams = new URLSearchParams(window.location.search)
      if (searchQuery) {
        newParams.set("q", searchQuery)
      } else {
        newParams.delete("q")
      }

      // Update URL without reloading the page
      window.history.pushState({}, "", `${window.location.pathname}?${newParams.toString()}`)
      setSearchParams(newParams)
    }
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
                <Link href="/productos?category=motor">
                  <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                    Motor
                  </Button>
                </Link>
                <Link href="/productos?category=frenos">
                  <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                    Frenos
                  </Button>
                </Link>
                <Link href="/productos?category=suspension">
                  <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                    Suspensión
                  </Button>
                </Link>
                <Link href="/productos?category=electrico">
                  <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                    Eléctrico
                  </Button>
                </Link>
                <Link href="/productos?category=accesorios">
                  <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                    Accesorios
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Active Filters Section */}
        {searchParams &&
          (searchParams.get("motoBrand") || searchParams.get("motoModel") || searchParams.get("motoYear")) && (
            <section className="py-4 bg-muted/30">
              <div className="container">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">Filtros activos:</span>
                  {searchParams.get("motoBrand") && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Marca: {searchParams.get("motoBrand")}
                    </Badge>
                  )}
                  {searchParams.get("motoModel") && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Modelo: {searchParams.get("motoModel")}
                    </Badge>
                  )}
                  {searchParams.get("motoYear") && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Año: {searchParams.get("motoYear")}
                    </Badge>
                  )}
                  <Link href="/productos">
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
              <form onSubmit={handleSearch} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    name="q"
                    placeholder="Buscar repuestos..."
                    className="pl-10 pr-4"
                    defaultValue={searchParams?.get("q") || ""}
                  />
                  <Button type="submit" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8">
                    Buscar
                  </Button>
                </div>
              </form>

              <div className="flex-shrink-0">
                <ProductsFilters />
              </div>
            </div>

            {/* Lista de productos */}
            <div className="w-full">
              {loading ? (
                <ProductsLoadingSkeleton />
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button variant="outline" asChild>
                    <Link href="/productos">Reintentar</Link>
                  </Button>
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <Filter className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-medium">No se encontraron productos</h2>
                  <p className="text-muted-foreground">
                    {searchParams?.get("motoBrand") || searchParams?.get("motoModel") || searchParams?.get("motoYear")
                      ? "No hay repuestos compatibles con la moto seleccionada"
                      : "Intenta con otros filtros o términos de búsqueda"}
                  </p>
                  <Button variant="outline" asChild className="mt-2">
                    <Link href="/productos">Ver todos los productos</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-animation">
                  {products.map((product, index) => (
                    <div
                      key={product._id || product.id || index}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppContactButton />
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
