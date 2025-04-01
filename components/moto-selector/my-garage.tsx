"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bike, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import MotoSelector from "./moto-selector"

interface MotoInfo {
  id: string
  brand: string
  model: string
  year: string
}

export default function MyGarage() {
  const router = useRouter()
  const [motos, setMotos] = useState<MotoInfo[]>([])
  const [isAddingMoto, setIsAddingMoto] = useState(false)

  // Cargar motos guardadas al iniciar
  useEffect(() => {
    const savedMotos = localStorage.getItem("myGarage")
    if (savedMotos) {
      try {
        setMotos(JSON.parse(savedMotos))
      } catch (e) {
        console.error("Error parsing saved motos", e)
      }
    }
  }, [])

  // Guardar motos cuando cambian
  useEffect(() => {
    localStorage.setItem("myGarage", JSON.stringify(motos))
  }, [motos])

  const handleAddMoto = () => {
    const selectedMoto = localStorage.getItem("selectedMoto")
    if (selectedMoto) {
      try {
        const moto = JSON.parse(selectedMoto)
        // Añadir un ID único
        const newMoto = {
          ...moto,
          id: Date.now().toString(),
        }

        // Verificar si ya existe una moto igual
        const exists = motos.some((m) => m.brand === moto.brand && m.model === moto.model && m.year === moto.year)

        if (!exists) {
          setMotos([...motos, newMoto])
        }

        setIsAddingMoto(false)
      } catch (e) {
        console.error("Error adding moto", e)
      }
    }
  }

  const handleRemoveMoto = (id: string) => {
    setMotos(motos.filter((moto) => moto.id !== id))
  }

  const handleSelectMoto = (moto: MotoInfo) => {
    localStorage.setItem(
      "selectedMoto",
      JSON.stringify({
        brand: moto.brand,
        model: moto.model,
        year: moto.year,
      }),
    )

    router.push(
      `/products?motoBrand=${encodeURIComponent(moto.brand)}&motoModel=${encodeURIComponent(moto.model)}&motoYear=${encodeURIComponent(moto.year)}`,
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bike className="h-5 w-5" />
          Mi Garaje
        </CardTitle>
        <CardDescription>Guarda tus motos para encontrar repuestos compatibles rápidamente</CardDescription>
      </CardHeader>
      <CardContent>
        {motos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bike className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No tienes motos guardadas en tu garaje</p>
            <p className="text-sm">Añade tu primera moto para encontrar repuestos compatibles</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {motos.map((moto) => (
                <div
                  key={moto.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Bike className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">
                        {moto.brand} {moto.model}
                      </p>
                      <p className="text-sm text-muted-foreground">Año: {moto.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleSelectMoto(moto)}>
                      Ver repuestos
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveMoto(moto.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isAddingMoto ? (
          <div className="w-full space-y-4">
            <MotoSelector />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddingMoto(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddMoto}>Guardar moto</Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setIsAddingMoto(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Añadir moto
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

