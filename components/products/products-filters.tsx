"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Filter, Search, X } from "lucide-react"
import { useState, useCallback, useEffect } from "react"

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
import { Badge } from "@/components/ui/badge"

interface ProductsFiltersProps {
  initialSearchParams: {
    category?: string
    sort?: string
    q?: string
    motoBrand?: string
    motoModel?: string
    motoYear?: string
  }
}

export default function ProductsFilters({ initialSearchParams }: ProductsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(initialSearchParams.q || "")

  // Moto filter states
  const [selectedMotoBrand, setSelectedMotoBrand] = useState(initialSearchParams.motoBrand || "")
  const [selectedMotoModel, setSelectedMotoModel] = useState(initialSearchParams.motoModel || "")
  const [selectedMotoYear, setSelectedMotoYear] = useState(initialSearchParams.motoYear || "")

  // Available options
  const [motoModels, setMotoModels] = useState<string[]>([])
  const [motoYears, setMotoYears] = useState<string[]>([])

  const motoBrands = [
    "Honda",
    "Yamaha",
    "Suzuki",
    "Kawasaki",
    "KTM",
    "Bajaj",
    "Ducati",
    "BMW",
    "Harley-Davidson",
    "Motomel",
    "Zanella",
    "Corven",
    "Gilera",
    "Kymco",
    "Benelli",
  ]

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [inStock, setInStock] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Update models based on selected brand
  useEffect(() => {
    if (selectedMotoBrand) {
      // En un caso real, esto vendría de una API
      const modelsByBrand: Record<string, string[]> = {
        Honda: ["CB 125", "CB 250", "XR 250", "Tornado", "Wave", "CG 150", "Titan", "XRE 300", "CBR 600"],
        Yamaha: ["YBR 125", "FZ 16", "FZ 25", "MT 03", "MT 07", "R3", "R6", "XTZ 125", "XTZ 250"],
        Suzuki: ["GN 125", "EN 125", "Gixxer 150", "GSX 150", "V-Strom 650", "GSX-R600", "GSX-R750"],
        Kawasaki: ["Ninja 300", "Ninja 400", "Z400", "Z650", "Z900", "Versys 300", "Versys 650"],
        KTM: ["Duke 200", "Duke 390", "RC 200", "RC 390", "Adventure 390", "Adventure 790"],
        Bajaj: ["Rouser 135", "Rouser 180", "Rouser 200", "Rouser 220", "Dominar 400"],
        Ducati: ["Monster 797", "Monster 821", "Panigale V2", "Panigale V4", "Scrambler", "Multistrada"],
        BMW: ["G 310 R", "G 310 GS", "F 750 GS", "F 850 GS", "S 1000 RR", "R 1250 GS"],
        "Harley-Davidson": ["Iron 883", "Forty-Eight", "Street 750", "Fat Boy", "Road King", "Street Glide"],
        Motomel: ["Skua 150", "Skua 250", "CG 150", "S2 150", "Sirius 150", "Strato Euro 150"],
        Zanella: ["RX 150", "ZB 110", "Styler 150", "Patagonian Eagle 150", "Patagonian Eagle 250"],
        Corven: ["Energy 110", "Triax 150", "Triax 250", "Hunter 150", "TXR 250"],
        Gilera: ["Smash 110", "VC 150", "VC 200", "SMX 400"],
        Kymco: ["Agility 125", "Like 125", "People 150", "Downtown 300"],
        Benelli: ["TNT 15", "TNT 25", "TNT 300", "TNT 600", "TRK 502"],
      }

      setMotoModels(modelsByBrand[selectedMotoBrand] || [])
      setSelectedMotoModel("")
      setSelectedMotoYear("")
    } else {
      setMotoModels([])
      setSelectedMotoModel("")
      setSelectedMotoYear("")
    }
  }, [selectedMotoBrand])

  // Update years based on selected model
  useEffect(() => {
    if (selectedMotoModel) {
      // En un caso real, esto vendría de una API
      // Generamos años desde 2010 hasta el actual
      const currentYear = new Date().getFullYear()
      const years = []
      for (let year = 2010; year <= currentYear; year++) {
        years.push(year.toString())
      }
      setMotoYears(years)
    } else {
      setMotoYears([])
      setSelectedMotoYear("")
    }
  }, [selectedMotoModel])

  // Count active filters
  useEffect(() => {
    let count = 0
    if (searchQuery) count++
    if (initialSearchParams.category && initialSearchParams.category !== "all") count++
    if (selectedMotoBrand) count++
    if (selectedMotoModel) count++
    if (selectedMotoYear) count++
    if (selectedBrands.length > 0) count++
    if (priceRange.min || priceRange.max) count++
    if (inStock) count++

    setActiveFiltersCount(count)
  }, [
    searchQuery,
    initialSearchParams.category,
    selectedMotoBrand,
    selectedMotoModel,
    selectedMotoYear,
    selectedBrands,
    priceRange,
    inStock,
  ])

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

  const handleMotoBrandChange = (value: string) => {
    setSelectedMotoBrand(value)

    // Construir la URL con los parámetros actualizados
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("motoBrand", value)
    } else {
      params.delete("motoBrand")
    }

    // Eliminar modelo y año si se cambia la marca
    params.delete("motoModel")
    params.delete("motoYear")

    router.push(`/products?${params.toString()}`)
  }

  const handleMotoModelChange = (value: string) => {
    setSelectedMotoModel(value)

    // Construir la URL con los parámetros actualizados
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("motoModel", value)
    } else {
      params.delete("motoModel")
    }

    // Eliminar año si se cambia el modelo
    params.delete("motoYear")

    router.push(`/products?${params.toString()}`)
  }

  const handleMotoYearChange = (value: string) => {
    setSelectedMotoYear(value)

    // Construir la URL con los parámetros actualizados
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set("motoYear", value)
    } else {
      params.delete("motoYear")
    }

    router.push(`/products?${params.toString()}`)
  }

  const handleApplyFilters = () => {
    // En un caso real, aquí aplicaríamos todos los filtros
    // Para ahora, solo cerramos el sheet
  }

  const handleClearFilters = () => {
    setSelectedBrands([])
    setPriceRange({ min: "", max: "" })
    setInStock(false)

    // Limpiar filtros de moto
    setSelectedMotoBrand("")
    setSelectedMotoModel("")
    setSelectedMotoYear("")

    // Limpiar URL
    router.push("/products")
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
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
              <SheetDescription>Refina tu búsqueda con los siguientes filtros</SheetDescription>
            </SheetHeader>

            <div className="py-6 space-y-6">
              {/* Filtros de compatibilidad con motos */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Compatibilidad con tu moto</h3>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="motoBrand">Marca</Label>
                    <Select value={selectedMotoBrand} onValueChange={handleMotoBrandChange}>
                      <SelectTrigger id="motoBrand">
                        <SelectValue placeholder="Seleccionar marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las marcas</SelectItem>
                        {motoBrands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="motoModel">Modelo</Label>
                    <Select
                      value={selectedMotoModel}
                      onValueChange={handleMotoModelChange}
                      disabled={!selectedMotoBrand}
                    >
                      <SelectTrigger id="motoModel">
                        <SelectValue
                          placeholder={selectedMotoBrand ? "Seleccionar modelo" : "Primero selecciona una marca"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los modelos</SelectItem>
                        {motoModels.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="motoYear">Año</Label>
                    <Select value={selectedMotoYear} onValueChange={handleMotoYearChange} disabled={!selectedMotoModel}>
                      <SelectTrigger id="motoYear">
                        <SelectValue
                          placeholder={selectedMotoModel ? "Seleccionar año" : "Primero selecciona un modelo"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los años</SelectItem>
                        {motoYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

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

