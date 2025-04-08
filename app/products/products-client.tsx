"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ProductsFilters } from "@/components/products/products-filters"
import ProductCard from "@/components/product-card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import type { Product } from "@/lib/types"

export default function ProductsClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        for (const [key, value] of searchParams.entries()) {
          params.append(key, value)
        }

        const response = await fetch(`/api/products/search?${params.toString()}`)
        if (!response.ok) throw new Error("Error fetching products")

        const data = await response.json()
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching products:", error)
        // Initialize with empty array on error
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())

    if (searchTerm) {
      params.set("q", searchTerm)
    } else {
      params.delete("q")
    }

    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container py-6">
          {/* Header with breadcrumb and search in the same line */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <Breadcrumb className="flex-shrink-0">
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink aria-current="page">Products</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <div className="flex items-center gap-2">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-64 pr-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" variant="ghost" size="icon" className="absolute right-0">
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </form>

              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="sr-only">Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <Button variant="ghost" size="icon" onClick={() => setIsFiltersOpen(false)}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>
                  <ProductsFilters />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="hidden md:block md:col-span-1">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <ProductsFilters />
            </div>

            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <p className="text-sm text-muted-foreground">{products.length} products found</p>
              </div>

              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="rounded-lg border p-4 space-y-4">
                      <div className="h-40 bg-muted rounded-md animate-pulse" />
                      <div className="h-4 bg-muted rounded-md animate-pulse w-3/4" />
                      <div className="h-4 bg-muted rounded-md animate-pulse w-1/2" />
                      <div className="h-8 bg-muted rounded-md animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-lg border p-8 text-center">
                  <h2 className="text-xl font-semibold">No products found</h2>
                  <p className="mt-2 text-muted-foreground">Try different filters or search terms.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.isArray(products) &&
                    products.map((product) => <ProductCard key={product._id || product.id} product={product} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
