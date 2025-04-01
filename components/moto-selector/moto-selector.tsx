"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bike, ChevronDown, X } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MotoSelectorProps {
  variant?: "default" | "outline" | "compact"
}

interface SelectedMoto {
  brand: string
  model: string
  year: string
}

export default function MotoSelector({ variant = "default" }: MotoSelectorProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMoto, setSelectedMoto] = useState<SelectedMoto | null>(null)

  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [selectedModel, setSelectedModel] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("")

  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [availableYears, setAvailableYears] = useState<string[]>([])

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
  ]

  // Cargar la moto seleccionada desde localStorage al iniciar
  useEffect(() => {
    const savedMoto = localStorage.getItem("selectedMoto")
    if (savedMoto) {
      try {
        const moto = JSON.parse(savedMoto)
        setSelectedMoto(moto)
        setSelectedBrand(moto.brand)
        setSelectedModel(moto.model)
        setSelectedYear(moto.year)
      } catch (e) {
        console.error("Error parsing saved moto", e)
      }
    }
  }, [])

  // Actualizar modelos disponibles cuando cambia la marca
  useEffect(() => {
    if (selectedBrand) {
      // En un caso real, esto vendría de una API
      const modelsByBrand: Record<string, string[]> = {
        Honda: ["CB 125", "CB 250", "XR 250", "Tornado", "Wave", "CG 150", "Titan", "XRE 300"],
        Yamaha: ["YBR 125", "FZ 16", "FZ 25", "MT 03", "MT 07", "R3", "R6", "XTZ 125"],
        Suzuki: ["GN 125", "EN 125", "Gixxer 150", "GSX 150", "V-Strom 650", "GSX-R600"],
        Kawasaki: ["Ninja 300", "Ninja 400", "Z400", "Z650", "Z900", "Versys 300"],
        KTM: ["Duke 200", "Duke 390", "RC 200", "RC 390", "Adventure 390", "Adventure 790"],
        Bajaj: ["Rouser 135", "Rouser 180", "Rouser 200", "Rouser 220", "Dominar 400"],
        Ducati: ["Monster 797", "Monster 821", "Panigale V2", "Panigale V4", "Scrambler"],
        BMW: ["G 310 R", "G 310 GS", "F 750 GS", "F 850 GS", "S 1000 RR", "R 1250 GS"],
        "Harley-Davidson": ["Iron 883", "Forty-Eight", "Street 750", "Fat Boy", "Road King"],
        Motomel: ["Skua 150", "Skua 250", "CG 150", "S2 150", "Sirius 150"],
        Zanella: ["RX 150", "ZB 110", "Styler 150", "Patagonian Eagle 150", "Patagonian Eagle 250"],
        Corven: ["Energy 110", "Triax 150", "Triax 250", "Hunter 150", "TXR 250"],
      }

      setAvailableModels(modelsByBrand[selectedBrand] || [])
      setSelectedModel("")
      setSelectedYear("")
    } else {
      setAvailableModels([])
      setSelectedModel("")
      setSelectedYear("")
    }
  }, [selectedBrand])

  // Actualizar años disponibles cuando cambia el modelo
  useEffect(() => {
    if (selectedModel) {
      // Generamos años desde 2010 hasta el actual
      const currentYear = new Date().getFullYear()
      const years = []
      for (let year = 2010; year <= currentYear; year++) {
        years.push(year.toString())
      }
      setAvailableYears(years)
    } else {
      setAvailableYears([])
      setSelectedYear("")
    }
  }, [selectedModel])

  const handleApply = () => {
    if (selectedBrand && selectedModel && selectedYear) {
      const moto = { brand: selectedBrand, model: selectedModel, year: selectedYear }
      setSelectedMoto(moto)

      // Guardar en localStorage
      localStorage.setItem("selectedMoto", JSON.stringify(moto))

      // Redirigir a productos filtrados
      router.push(
        `/products?motoBrand=${encodeURIComponent(selectedBrand)}&motoModel=${encodeURIComponent(selectedModel)}&motoYear=${encodeURIComponent(selectedYear)}`,
      )

      setIsOpen(false)
    }
  }

  const handleClear = () => {
    setSelectedMoto(null)
    setSelectedBrand("")
    setSelectedModel("")
    setSelectedYear("")
    localStorage.removeItem("selectedMoto")
    router.push("/products")
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant === "outline" ? "outline" : "secondary"}
          size={variant === "compact" ? "sm" : "default"}
          className={variant === "compact" ? "h-8 px-2 text-xs" : ""}
        >
          <Bike className={`${variant === "compact" ? "h-3.5 w-3.5" : "h-4 w-4"} mr-2`} />
          {selectedMoto ? (
            <span className="flex items-center">
              {variant === "compact" ? (
                <span>Mi Moto</span>
              ) : (
                <span>
                  {selectedMoto.brand} {selectedMoto.model} {selectedMoto.year}
                </span>
              )}
            </span>
          ) : (
            <span>Seleccionar mi moto</span>
          )}
          <ChevronDown className={`${variant === "compact" ? "h-3.5 w-3.5" : "h-4 w-4"} ml-2 opacity-50`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Mi moto</h4>
            <p className="text-sm text-muted-foreground">Selecciona tu moto para ver repuestos compatibles</p>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="brand">Marca</Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Seleccionar marca" />
                </SelectTrigger>
                <SelectContent>
                  {motoBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="model">Modelo</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel} disabled={!selectedBrand}>
                <SelectTrigger id="model">
                  <SelectValue placeholder={selectedBrand ? "Seleccionar modelo" : "Primero selecciona una marca"} />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="year">Año</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear} disabled={!selectedModel}>
                <SelectTrigger id="year">
                  <SelectValue placeholder={selectedModel ? "Seleccionar año" : "Primero selecciona un modelo"} />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleClear} disabled={!selectedMoto}>
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
            <Button size="sm" onClick={handleApply} disabled={!selectedBrand || !selectedModel || !selectedYear}>
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

