"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Filter, Search, X } from "lucide-react"
import { useState, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface ProductsFiltersProps {
  initialSearchParams: {
    category?: string
    sort?: string
    q?: string
  }
}

export default function ProductsFilters({ initialSearchParams }: ProductsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(initialSearchParams.q || "")

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [inStock, setInStock] = useState(false)

  // Create a new instance of URLSearchParams
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(name, value)
      } else {
        params.delete(name)
      }
      return params.toString()
    },
    [searchParams],
  )

  const handleSortChange = (value: string) => {
    router.push(`/products?${createQueryString("sort", value)}`)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    router.push(`/products?${createQueryString("q", searchQuery)}`)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    router.push(`/products?${createQueryString("q", "")}`)
  }

  const handleApplyFilters = () => {
    // In a real app, you would apply all filters here
    // For now, we'll just close the sheet
  }

  const handleClearFilters = () => {
    setSelectedBrands([])
    setPriceRange({ min: "", max: "" })
    setInStock(false)
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1 bg-secondary border-secondary hover:bg-primary hover:text-primary-foreground"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>Filtros</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>Refina tu búsqueda con los siguientes filtros</SheetDescription>
            </SheetHeader>

            <div className="py-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Marcas</h3>
                <div className="space-y-2">
                  {["MotorTech", "BrakeMaster", "RideSoft", "PowerCell", "FuelPro"].map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedBrands([...selectedBrands, brand])
                          } else {
                            setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                          }
                        }}
                      />
                      <Label htmlFor={`brand-${brand}`} className="text-sm">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Rango de precio</h3>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="h-9"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="h-9"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Disponibilidad</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox id="in-stock" checked={inStock} onCheckedChange={(checked) => setInStock(!!checked)} />
                  <Label htmlFor="in-stock" className="text-sm">
                    Solo productos en stock
                  </Label>
                </div>
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleClearFilters} className="w-full sm:w-auto">
                Limpiar filtros
              </Button>
              <SheetClose asChild>
                <Button onClick={handleApplyFilters} className="w-full sm:w-auto">
                  Aplicar filtros
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Select defaultValue={initialSearchParams.sort || "featured"} onValueChange={handleSortChange}>
          <SelectTrigger className="h-9 w-[180px] bg-secondary border-secondary">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Destacados</SelectItem>
            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="newest">Más Recientes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <form onSubmit={handleSearch} className="relative w-full md:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          placeholder="Buscar productos..."
          className="h-9 w-full pl-8 pr-10 bg-secondary border-secondary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </form>
    </div>
  )
}

