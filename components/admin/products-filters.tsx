"use client"

import type React from "react"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

export interface ProductFilters {
  search: string
  category: string
  brand: string
  minPrice: number
  maxPrice: number
  stockStatus: string
  compatibleModel: string
}

interface ProductFiltersProps {
  filters: ProductFilters
  onFilterChange: (filters: ProductFilters) => void
  onResetFilters: () => void
  categories: string[]
  brands: string[]
  maxPriceValue: number
}

export default function ProductFilters({
  filters,
  onFilterChange,
  onResetFilters,
  categories,
  brands,
  maxPriceValue = 100000,
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters)
  const [isOpen, setIsOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLocalFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handlePriceChange = (value: number[]) => {
    setLocalFilters((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }))
  }

  const applyFilters = () => {
    onFilterChange(localFilters)
    setIsOpen(false)
  }

  const resetFilters = () => {
    const resetValues = {
      search: "",
      category: "",
      brand: "",
      minPrice: 0,
      maxPrice: maxPriceValue,
      stockStatus: "",
      compatibleModel: "",
    }
    setLocalFilters(resetValues)
    onResetFilters()
  }

  // Count active filters (excluding search which has its own UI)
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "search") return false
    if (key === "minPrice" && value === 0) return false
    if (key === "maxPrice" && value === maxPriceValue) return false
    return value !== ""
  }).length

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            className="pl-8"
            name="search"
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          />
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 h-5">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filtros de Productos</SheetTitle>
              <SheetDescription>Filtra los productos por categoría, marca, precio y disponibilidad.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={localFilters.category} onValueChange={(value) => handleSelectChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brand">Marca</Label>
                <Select value={localFilters.brand} onValueChange={(value) => handleSelectChange("brand", value)}>
                  <SelectTrigger id="brand">
                    <SelectValue placeholder="Todas las marcas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Rango de Precio</Label>
                <div className="pt-4 px-2">
                  <Slider
                    defaultValue={[localFilters.minPrice, localFilters.maxPrice]}
                    max={maxPriceValue}
                    step={100}
                    onValueChange={handlePriceChange}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                  <span>${localFilters.minPrice.toLocaleString()}</span>
                  <span>${localFilters.maxPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stockStatus">Estado de Stock</Label>
                <Select
                  value={localFilters.stockStatus}
                  onValueChange={(value) => handleSelectChange("stockStatus", value)}
                >
                  <SelectTrigger id="stockStatus">
                    <SelectValue placeholder="Todos los productos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los productos</SelectItem>
                    <SelectItem value="in-stock">En stock</SelectItem>
                    <SelectItem value="out-of-stock">Agotado</SelectItem>
                    <SelectItem value="low-stock">Stock bajo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="compatibleModel">Modelo Compatible</Label>
                <Input
                  id="compatibleModel"
                  name="compatibleModel"
                  value={localFilters.compatibleModel}
                  onChange={handleInputChange}
                  placeholder="Ej: Honda CBR 250"
                />
              </div>
            </div>
            <SheetFooter>
              <div className="flex justify-between w-full">
                <Button variant="outline" onClick={resetFilters} type="button">
                  <X className="mr-2 h-4 w-4" />
                  Limpiar
                </Button>
                <SheetClose asChild>
                  <Button onClick={applyFilters}>Aplicar Filtros</Button>
                </SheetClose>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9">
            <X className="mr-2 h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>
      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary" className="px-2 py-1">
              Categoría: {filters.category}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => onFilterChange({ ...filters, category: "" })}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar filtro de categoría</span>
              </Button>
            </Badge>
          )}
          {filters.brand && (
            <Badge variant="secondary" className="px-2 py-1">
              Marca: {filters.brand}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => onFilterChange({ ...filters, brand: "" })}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar filtro de marca</span>
              </Button>
            </Badge>
          )}
          {(filters.minPrice > 0 || filters.maxPrice < maxPriceValue) && (
            <Badge variant="secondary" className="px-2 py-1">
              Precio: ${filters.minPrice.toLocaleString()} - ${filters.maxPrice.toLocaleString()}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => onFilterChange({ ...filters, minPrice: 0, maxPrice: maxPriceValue })}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar filtro de precio</span>
              </Button>
            </Badge>
          )}
          {filters.stockStatus && (
            <Badge variant="secondary" className="px-2 py-1">
              Stock:{" "}
              {filters.stockStatus === "in-stock"
                ? "En stock"
                : filters.stockStatus === "out-of-stock"
                  ? "Agotado"
                  : "Stock bajo"}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => onFilterChange({ ...filters, stockStatus: "" })}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar filtro de stock</span>
              </Button>
            </Badge>
          )}
          {filters.compatibleModel && (
            <Badge variant="secondary" className="px-2 py-1">
              Modelo: {filters.compatibleModel}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 p-0"
                onClick={() => onFilterChange({ ...filters, compatibleModel: "" })}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar filtro de modelo</span>
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
