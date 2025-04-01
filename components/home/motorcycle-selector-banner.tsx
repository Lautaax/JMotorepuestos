"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bike } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MotorcycleSelectorBanner() {
  const router = useRouter()
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")

  // Datos de ejemplo - en producción deberían venir de la API
  const brands = ["Honda", "Yamaha", "Suzuki", "Kawasaki", "Ducati", "BMW", "KTM"]

  const models = {
    Honda: ["CBR 600", "CBR 1000", "CRF 250", "CRF 450", "Africa Twin"],
    Yamaha: ["YZF R1", "YZF R6", "MT-07", "MT-09", "Ténéré 700"],
    Suzuki: ["GSX-R 600", "GSX-R 1000", "V-Strom 650", "V-Strom 1000"],
    Kawasaki: ["Ninja 400", "Ninja 650", "Ninja ZX-6R", "Ninja ZX-10R", "Z900"],
    Ducati: ["Panigale V4", "Monster", "Multistrada", "Scrambler"],
    BMW: ["S 1000 RR", "R 1250 GS", "F 850 GS", "G 310 R"],
    KTM: ["390 Duke", "790 Duke", "1290 Super Duke", "450 EXC"],
  }

  const years = Array.from({ length: 21 }, (_, i) => (2023 - i).toString())

  const handleSearch = () => {
    if (brand && model && year) {
      router.push(
        `/products?motoBrand=${encodeURIComponent(brand)}&motoModel=${encodeURIComponent(model)}&motoYear=${encodeURIComponent(year)}`,
      )
    }
  }

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bike className="h-6 w-6 text-primary" />
          Encuentra repuestos para tu moto
        </CardTitle>
        <CardDescription>Selecciona tu marca, modelo y año para ver repuestos compatibles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Marca</label>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona marca" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Modelo</label>
            <Select value={model} onValueChange={setModel} disabled={!brand}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona modelo" />
              </SelectTrigger>
              <SelectContent>
                {brand &&
                  models[brand as keyof typeof models]?.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Año</label>
            <Select value={year} onValueChange={setYear} disabled={!model}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona año" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSearch} disabled={!brand || !model || !year} className="w-full md:w-auto">
          Buscar repuestos compatibles
        </Button>
      </CardFooter>
    </Card>
  )
}

