"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ProductsFilters } from "@/components/products/products-filters"
import ProductCard from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import type { Product } from "@/lib/types"

export default function ProductsClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "")

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        // Construir la URL con los parámetros actuales
        const queryParams = new URLSearchParams()
        for (const [key, value] of Array.from(searchParams.entries())) {
          queryParams.append(key, value)
        }

        const response = await fetch(`/api/products/search?${queryParams.toString()}`)
        const data = await response.json()

        if (data.products) {
          setProducts(data.products)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Construir nuevos parámetros de búsqueda
    const params = new URLSearchParams(searchParams.toString())

    if (searchTerm) {
      params.set("q", searchTerm)
    } else {
      params.delete("q")
    }

    // Navegar a la nueva URL
    router.push(`/productos?${params.toString()}`)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSortOption(value)

    // Construir nuevos parámetros de búsqueda
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }

    // Navegar a la nueva URL
    router.push(`/productos?${params.toString()}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center space-x-2">
              <img src="/images/logo/logo.svg" alt="MotoRepuestos Del Sur" className="h-8 w-auto" />
              <span className="font-bold">MotoRepuestos</span>
            </a>
            <nav className="hidden gap-6 md:flex">
              <a href="/" className="text-sm font-medium transition-colors hover:text-primary">
                Inicio
              </a>
              <a href="/productos" className="text-sm font-medium text-primary transition-colors">
                Productos
              </a>
              <a href="/categories" className="text-sm font-medium transition-colors hover:text-primary">
                Categorías
              </a>
              <a href="/contact" className="text-sm font-medium transition-colors hover:text-primary">
                Contacto
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a href="/cart" className="flex items-center gap-1">
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
                className="h-5 w-5"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span className="text-sm">Carrito</span>
            </a>
            <a href="/profile" className="flex items-center gap-1">
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
                className="h-5 w-5"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="text-sm">Mi cuenta</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="container py-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  className="pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" className="shrink-0">
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </form>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <ProductsFilters />
            </div>

            <div className="md:col-span-3">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="text-3xl font-bold">Productos</h1>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{products.length} productos encontrados</span>

                  <select
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="">Ordenar por</option>
                    <option value="featured">Destacados</option>
                    <option value="price-asc">Precio: menor a mayor</option>
                    <option value="price-desc">Precio: mayor a menor</option>
                    <option value="newest">Más recientes</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 animate-pulse rounded-lg bg-gray-200"></div>
                  ))}
                </div>
              ) : products.length === 0 ? (
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

      <footer className="border-t bg-background">
        <div className="container py-8 md:py-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2">
                <img src="/images/logo/logo.svg" alt="MotoRepuestos Del Sur" className="h-8 w-auto" />
                <span className="font-bold">MotoRepuestos</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Tu tienda de confianza para repuestos de motocicletas de alta calidad.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Enlaces rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="text-muted-foreground hover:text-foreground">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="/productos" className="text-muted-foreground hover:text-foreground">
                    Productos
                  </a>
                </li>
                <li>
                  <a href="/categories" className="text-muted-foreground hover:text-foreground">
                    Categorías
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
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
                    className="mr-2 h-5 w-5 text-muted-foreground"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="text-muted-foreground">+54 11 1234-5678</span>
                </li>
                <li className="flex items-start">
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
                    className="mr-2 h-5 w-5 text-muted-foreground"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span className="text-muted-foreground">info@motorepuestos.com</span>
                </li>
                <li className="flex items-start">
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
                    className="mr-2 h-5 w-5 text-muted-foreground"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-muted-foreground">Av. Siempreviva 742, Buenos Aires</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Suscríbete</h3>
              <p className="mb-4 text-sm text-muted-foreground">Recibe nuestras últimas ofertas y novedades.</p>
              <form className="flex gap-2">
                <Input type="email" placeholder="Tu email" className="max-w-[180px]" />
                <Button type="submit" variant="outline" size="sm">
                  Suscribirse
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 MotoRepuestos Del Sur. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

