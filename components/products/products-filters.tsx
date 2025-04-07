"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, ChevronDown, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export function ProductsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Estado para los filtros
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [category, setCategory] = useState<string | null>(null)
  const [brand, setBrand] = useState<string | null>(null)
  const [motoMarca, setMotoMarca] = useState<string | null>(null)
  const [motoModelo, setMotoModelo] = useState<string | null>(null)
  const [motoAno, setMotoAno] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({
    price: false,
    category: false,
    brand: false,
    compatibility: false,
  })

  // Datos para los filtros
  const categories = [
    { id: "motor", name: "Motor y Transmisión" },
    { id: "frenos", name: "Frenos" },
    { id: "suspension", name: "Suspensión" },
    { id: "electrico", name: "Sistema Eléctrico" },
    { id: "accesorios", name: "Accesorios" },
  ]

  const brands = [
    { id: "original", name: "Original" },
    { id: "yamaha", name: "Yamaha" },
    { id: "honda", name: "Honda" },
    { id: "suzuki", name: "Suzuki" },
    { id: "kawasaki", name: "Kawasaki" },
  ]

  const nationalBrands = [
    { id: "zanella", name: "Zanella" },
    { id: "motomel", name: "Motomel" },
    { id: "corven", name: "Corven" },
    { id: "gilera", name: "Gilera" },
    { id: "guerrero", name: "Guerrero" },
    { id: "keller", name: "Keller" },
    { id: "jawa", name: "Jawa" },
    { id: "beta", name: "Beta" },
  ]

  const motoMarcas = [
    { id: "honda", name: "Honda" },
    { id: "yamaha", name: "Yamaha" },
    { id: "suzuki", name: "Suzuki" },
    { id: "kawasaki", name: "Kawasaki" },
    { id: "zanella", name: "Zanella" },
    { id: "motomel", name: "Motomel" },
    { id: "corven", name: "Corven" },
    { id: "gilera", name: "Gilera" },
    { id: "guerrero", name: "Guerrero" },
    { id: "keller", name: "Keller" },
    { id: "jawa", name: "Jawa" },
    { id: "beta", name: "Beta" },
  ]

  // Modelos basados en la marca seleccionada
  const getMotoModelos = () => {
    if (!motoMarca) return []

    switch (motoMarca) {
      case "honda":
        return [
          { id: "wave", name: "Wave" },
          { id: "cg", name: "CG Titan" },
          { id: "xr", name: "XR" },
          { id: "tornado", name: "Tornado" },
          { id: "twister", name: "Twister" },
        ]
      case "yamaha":
        return [
          { id: "ybr", name: "YBR" },
          { id: "fz", name: "FZ" },
          { id: "xtz", name: "XTZ" },
          { id: "r15", name: "R15" },
        ]
      case "suzuki":
        return [
          { id: "en", name: "EN" },
          { id: "gixxer", name: "Gixxer" },
          { id: "ax", name: "AX" },
        ]
      case "kawasaki":
        return [
          { id: "ninja", name: "Ninja" },
          { id: "z", name: "Z" },
          { id: "versys", name: "Versys" },
        ]
      case "zanella":
        return [
          { id: "rx", name: "RX" },
          { id: "zb", name: "ZB" },
          { id: "patagonian", name: "Patagonian Eagle" },
          { id: "styler", name: "Styler" },
        ]
      case "motomel":
        return [
          { id: "s2", name: "S2" },
          { id: "skua", name: "Skua" },
          { id: "blitz", name: "Blitz" },
          { id: "sirius", name: "Sirius" },
        ]
      case "corven":
        return [
          { id: "energy", name: "Energy" },
          { id: "triax", name: "Triax" },
          { id: "hunter", name: "Hunter" },
        ]
      case "gilera":
        return [
          { id: "smash", name: "Smash" },
          { id: "vc", name: "VC" },
          { id: "sahel", name: "Sahel" },
        ]
      case "guerrero":
        return [
          { id: "trip", name: "Trip" },
          { id: "day", name: "Day" },
          { id: "econo", name: "Econo" },
        ]
      case "keller":
        return [
          { id: "stratus", name: "Stratus" },
          { id: "classic", name: "Classic" },
          { id: "crono", name: "Crono" },
        ]
      case "jawa":
        return [
          { id: "rvm", name: "RVM" },
          { id: "daytona", name: "Daytona" },
        ]
      case "beta":
        return [
          { id: "motard", name: "Motard" },
          { id: "rr", name: "RR" },
          { id: "trueno", name: "Trueno" },
        ]
      default:
        return []
    }
  }

  // Años disponibles
  const motoAnos = [
    { id: "2023", name: "2023" },
    { id: "2022", name: "2022" },
    { id: "2021", name: "2021" },
    { id: "2020", name: "2020" },
    { id: "2019", name: "2019" },
    { id: "2018", name: "2018" },
    { id: "2017", name: "2017" },
    { id: "2016", name: "2016" },
    { id: "2015", name: "2015" },
    { id: "older", name: "2014 o anterior" },
  ]

  // Cargar filtros desde URL
  useEffect(() => {
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const categoryParam = searchParams.get("category")
    const brandParam = searchParams.get("brand")
    const motoMarcaParam = searchParams.get("motoMarca")
    const motoModeloParam = searchParams.get("motoModelo")
    const motoAnoParam = searchParams.get("motoAno")

    if (minPrice && maxPrice) {
      setPriceRange([Number.parseInt(minPrice), Number.parseInt(maxPrice)])
    }

    if (categoryParam) setCategory(categoryParam)
    if (brandParam) setBrand(brandParam)
    if (motoMarcaParam) setMotoMarca(motoMarcaParam)
    if (motoModeloParam) setMotoModelo(motoModeloParam)
    if (motoAnoParam) setMotoAno(motoAnoParam)
  }, [searchParams])

  // Aplicar filtros
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    else params.delete("minPrice")

    if (priceRange[1] < 1000000) params.set("maxPrice", priceRange[1].toString())
    else params.delete("maxPrice")

    if (category) params.set("category", category)
    else params.delete("category")

    if (brand) params.set("brand", brand)
    else params.delete("brand")

    if (motoMarca) params.set("motoMarca", motoMarca)
    else params.delete("motoMarca")

    if (motoModelo) params.set("motoModelo", motoModelo)
    else params.delete("motoModelo")

    if (motoAno) params.set("motoAno", motoAno)
    else params.delete("motoAno")

    router.push(`/productos?${params.toString()}`)
    setIsOpen(false) // Cerrar el panel de filtros después de aplicar
  }

  // Limpiar filtros
  const clearFilters = () => {
    setPriceRange([0, 1000000])
    setCategory(null)
    setBrand(null)
    setMotoMarca(null)
    setMotoModelo(null)
    setMotoAno(null)

    // Mantener solo el parámetro de búsqueda q si existe
    const q = searchParams.get("q")
    if (q) {
      router.push(`/productos?q=${q}`)
    } else {
      router.push("/productos")
    }

    setIsOpen(false) // Cerrar el panel de filtros después de limpiar
  }

  // Contar filtros activos
  const getActiveFiltersCount = () => {
    let count = 0
    if (priceRange[0] > 0 || priceRange[1] < 1000000) count++
    if (category) count++
    if (brand) count++
    if (motoMarca) count++
    if (motoModelo) count++
    if (motoAno) count++
    return count
  }

  // Toggle para secciones de filtros
  const toggleFilterSection = (section: string) => {
    setOpenFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full flex justify-between">
          <span className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar productos
          </span>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <div className="py-4 flex flex-col gap-5">
          {/* Precio */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFilterSection("price")}
            >
              <h3 className="font-medium">Precio</h3>
              {openFilters.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            {openFilters.price && (
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
                <Slider
                  defaultValue={[0, 1000000]}
                  value={priceRange}
                  min={0}
                  max={1000000}
                  step={10000}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="my-4"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Categoría */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFilterSection("category")}
            >
              <h3 className="font-medium">Categoría</h3>
              {openFilters.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            {openFilters.category && (
              <div className="mt-2 space-y-1">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center">
                    <Button
                      variant={category === cat.id ? "default" : "ghost"}
                      className="justify-start px-2 w-full text-left"
                      onClick={() => setCategory(category === cat.id ? null : cat.id)}
                    >
                      {cat.name}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Marca */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFilterSection("brand")}
            >
              <h3 className="font-medium">Marca</h3>
              {openFilters.brand ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            {openFilters.brand && (
              <div className="mt-2">
                <Tabs defaultValue="international">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="international">Internacionales</TabsTrigger>
                    <TabsTrigger value="national">Nacionales</TabsTrigger>
                  </TabsList>
                  <TabsContent value="international" className="mt-2 space-y-1">
                    {brands.map((b) => (
                      <div key={b.id} className="flex items-center">
                        <Button
                          variant={brand === b.id ? "default" : "ghost"}
                          className="justify-start px-2 w-full text-left"
                          onClick={() => setBrand(brand === b.id ? null : b.id)}
                        >
                          {b.name}
                        </Button>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="national" className="mt-2 space-y-1">
                    {nationalBrands.map((b) => (
                      <div key={b.id} className="flex items-center">
                        <Button
                          variant={brand === b.id ? "default" : "ghost"}
                          className="justify-start px-2 w-full text-left"
                          onClick={() => setBrand(brand === b.id ? null : b.id)}
                        >
                          {b.name}
                        </Button>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>

          <Separator />

          {/* Compatibilidad */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFilterSection("compatibility")}
            >
              <h3 className="font-medium">Compatibilidad</h3>
              {openFilters.compatibility ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            {openFilters.compatibility && (
              <div className="mt-2 space-y-3">
                {/* Marca de moto */}
                <div>
                  <label className="text-sm font-medium">Marca de moto</label>
                  <div className="mt-1 space-y-1">
                    {motoMarcas.map((m) => (
                      <div key={m.id} className="flex items-center">
                        <Button
                          variant={motoMarca === m.id ? "default" : "ghost"}
                          className="justify-start px-2 w-full text-left"
                          onClick={() => {
                            setMotoMarca(motoMarca === m.id ? null : m.id)
                            setMotoModelo(null) // Resetear modelo al cambiar marca
                          }}
                          size="sm"
                        >
                          {m.name}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modelo de moto (solo si hay marca seleccionada) */}
                {motoMarca && (
                  <div>
                    <label className="text-sm font-medium">Modelo</label>
                    <div className="mt-1 space-y-1">
                      {getMotoModelos().map((m) => (
                        <div key={m.id} className="flex items-center">
                          <Button
                            variant={motoModelo === m.id ? "default" : "ghost"}
                            className="justify-start px-2 w-full text-left"
                            onClick={() => setMotoModelo(motoModelo === m.id ? null : m.id)}
                            size="sm"
                          >
                            {m.name}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Año de moto (solo si hay modelo seleccionado) */}
                {motoModelo && (
                  <div>
                    <label className="text-sm font-medium">Año</label>
                    <div className="mt-1 space-y-1">
                      {motoAnos.map((a) => (
                        <div key={a.id} className="flex items-center">
                          <Button
                            variant={motoAno === a.id ? "default" : "ghost"}
                            className="justify-start px-2 w-full text-left"
                            onClick={() => setMotoAno(motoAno === a.id ? null : a.id)}
                            size="sm"
                          >
                            {a.name}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          <div className="flex gap-2 mt-4">
            <Button onClick={applyFilters} className="flex-1">
              Aplicar filtros
            </Button>
            <Button variant="outline" onClick={clearFilters} className="flex-1">
              Limpiar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

