"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bike, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SelectedMoto {
  brand: string
  model: string
  year: string
}

export default function MotoRecommendationsBanner() {
  const [selectedMoto, setSelectedMoto] = useState<SelectedMoto | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  // Cargar la moto seleccionada desde localStorage al iniciar
  useEffect(() => {
    const savedMoto = localStorage.getItem("selectedMoto")
    if (savedMoto) {
      try {
        setSelectedMoto(JSON.parse(savedMoto))
      } catch (e) {
        console.error("Error parsing saved moto", e)
      }
    }
  }, [])

  if (!selectedMoto || !isVisible) {
    return null
  }

  return (
    <Alert className="bg-primary/10 border-primary/20 mb-6">
      <Bike className="h-4 w-4 text-primary" />
      <AlertTitle>
        Repuestos para tu {selectedMoto.brand} {selectedMoto.model}
      </AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <span>
          Encuentra todos los repuestos compatibles con tu moto {selectedMoto.brand} {selectedMoto.model}{" "}
          {selectedMoto.year}
        </span>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="border-primary/30 hover:bg-primary/10">
            <Link
              href={`/products?motoBrand=${encodeURIComponent(selectedMoto.brand)}&motoModel=${encodeURIComponent(selectedMoto.model)}&motoYear=${encodeURIComponent(selectedMoto.year)}`}
            >
              Ver repuestos
            </Link>
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsVisible(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}

