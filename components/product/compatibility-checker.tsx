"use client"

import { useState, useEffect } from "react"
import { Check, X, AlertTriangle, Bike } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Product } from "@/lib/types"

interface CompatibilityCheckerProps {
  product: Product
}

interface SelectedMoto {
  brand: string
  model: string
  year: string
}

export default function CompatibilityChecker({ product }: CompatibilityCheckerProps) {
  const [selectedMoto, setSelectedMoto] = useState<SelectedMoto | null>(null)
  const [isCompatible, setIsCompatible] = useState<boolean | null>(null)
  const [compatibilityMessage, setCompatibilityMessage] = useState<string>("")

  // Cargar la moto seleccionada desde localStorage al iniciar
  useEffect(() => {
    const savedMoto = localStorage.getItem("selectedMoto")
    if (savedMoto) {
      try {
        const moto = JSON.parse(savedMoto)
        setSelectedMoto(moto)
        checkCompatibility(moto)
      } catch (e) {
        console.error("Error parsing saved moto", e)
      }
    }
  }, [])

  const checkCompatibility = (moto: SelectedMoto) => {
    if (!product.compatibleWith || product.compatibleWith.length === 0) {
      setIsCompatible(null)
      setCompatibilityMessage("No hay información de compatibilidad disponible para este producto.")
      return
    }

    // Verificar si la moto seleccionada es compatible con el producto
    const isExactMatch = product.compatibleWith.some(
      (compat) => compat.brand === moto.brand && compat.model === moto.model && compat.year.toString() === moto.year,
    )

    // Verificar si hay una coincidencia parcial (misma marca y modelo)
    const isPartialMatch = product.compatibleWith.some(
      (compat) => compat.brand === moto.brand && compat.model === moto.model,
    )

    if (isExactMatch) {
      setIsCompatible(true)
      setCompatibilityMessage(`¡Este producto es compatible con tu ${moto.brand} ${moto.model} ${moto.year}!`)
    } else if (isPartialMatch) {
      setIsCompatible(null)
      setCompatibilityMessage(
        `Este producto podría ser compatible con tu ${moto.brand} ${moto.model}, pero no está verificado para el año ${moto.year}.`,
      )
    } else {
      setIsCompatible(false)
      setCompatibilityMessage(`Este producto no es compatible con tu ${moto.brand} ${moto.model} ${moto.year}.`)
    }
  }

  if (!selectedMoto) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bike className="h-5 w-5" />
            Verificar compatibilidad
          </CardTitle>
          <CardDescription>Selecciona tu moto para verificar si este producto es compatible</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Button variant="outline" onClick={() => document.getElementById("moto-selector-trigger")?.click()}>
              Seleccionar mi moto
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bike className="h-5 w-5" />
          Compatibilidad con tu moto
        </CardTitle>
        <CardDescription>
          {selectedMoto.brand} {selectedMoto.model} {selectedMoto.year}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isCompatible === true && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle>Compatible</AlertTitle>
            <AlertDescription>{compatibilityMessage}</AlertDescription>
          </Alert>
        )}

        {isCompatible === false && (
          <Alert className="bg-red-50 border-red-200 text-red-800">
            <X className="h-4 w-4 text-red-600" />
            <AlertTitle>No compatible</AlertTitle>
            <AlertDescription>{compatibilityMessage}</AlertDescription>
          </Alert>
        )}

        {isCompatible === null && (
          <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle>Compatibilidad no verificada</AlertTitle>
            <AlertDescription>{compatibilityMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => document.getElementById("moto-selector-trigger")?.click()}
        >
          Cambiar moto
        </Button>
      </CardFooter>
    </Card>
  )
}

