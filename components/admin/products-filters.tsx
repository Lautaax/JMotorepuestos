"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface ProductsFiltersProps {
  filters: {
    query: string
    category: string
    brand: string
    minPrice: string
    maxPrice: string
    stock: string
  }
  onFilterChange: (filters: any) => void
}

export default function ProductsFilters({ filters, onFilterChange }: ProductsFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [brands, setBrands] = useState([
    "Todas las marcas",
    "Honda",
    "Yamaha",
    "Suzuki",
    "Kawasaki",
    "KTM",
    "Ducati",
    "BMW",
    "Harley-Davidson",
  ])

  // Actualizar el contador de filtros activos
  useEffect(() => {
    let count = 0
    if (localFilters.query) count++
    if (localFilters.category && localFilters.category !== "all") count++
    if (localFilters.brand && localFilters.brand !== "all") count++
    if (localFilters.minPrice) count++
    if (localFilters.maxPrice) count++
    if (localFilters.stock) count++
    setActiveFiltersCount(count)
  }, [localFilters])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLocalFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handlePriceChange = (values) => {
    setPriceRange(values)
    setLocalFilters((prev) => ({
      ...prev,
      minPrice: values[0].toString(),
      maxPrice: values[1].toString(),
    }))
  }

  const applyFilters = () => {
    onFilterChange(localFilters)
  }

  const resetFilters = () => {
    const resetValues = {
      query: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      stock: "",
    }
    setLocalFilters(resetValues)
    setPriceRange([0, 100000])
    onFilterChange(resetValues)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Búsqueda por texto */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="query"
            placeholder="Buscar por nombre, SKU o descripción..."
            className="pl-8"
            value={localFilters.query}
            onChange={handleInputChange}
          />
        </div>

        {/* Filtro por categoría */}
        <Select value={localFilters.category} onValueChange={(value) => handleSelectChange("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="motor">Motor</SelectItem>
            <SelectItem value="frenos">Frenos</SelectItem>
            <SelectItem value="suspension">Suspensión</SelectItem>
            <SelectItem value="electrico">Eléctrico</SelectItem>
            <SelectItem value="accesorios">Accesorios</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por marca */}
        <Select value={localFilters.brand} onValueChange={(value) => handleSelectChange("brand", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las marcas</SelectItem>
            {brands.map(
              (brand) =>
                brand !== "Todas las marcas" && (
                  <SelectItem key={brand} value={brand.toLowerCase()}>
                    {brand}
                  </SelectItem>
                ),
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Filtro por rango de precio */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Rango de precio</Label>
            <div className="text-sm text-muted-foreground">
              ${priceRange[0]} - ${priceRange[1]}
            </div>
          </div>
          <Slider
            defaultValue={[0, 100000]}
            value={priceRange}
            min={0}
            max={100000}
            step={1000}
            onValueChange={handlePriceChange}
            className="py-4"
          />
        </div>

        {/* Filtro por stock */}
        <div className="space-y-2">
          <Label>Estado de stock</Label>
          <Select value={localFilters.stock} onValueChange={(value) => handleSelectChange("stock", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Estado de stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="in-stock">En stock</SelectItem>
              <SelectItem value="low-stock">Stock bajo</SelectItem>
              <SelectItem value="out-of-stock">Sin stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="px-2 py-1">
              {activeFiltersCount} {activeFiltersCount === 1 ? "filtro activo" : "filtros activos"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetFilters} disabled={activeFiltersCount === 0}>
            <X className="mr-1 h-4 w-4" />
            Limpiar filtros
          </Button>
          <Button size="sm" onClick={applyFilters}>
            Aplicar filtros
          </Button>
        </div>
      </div>
    </div>
  )
}

