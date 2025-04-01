"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { CartItem } from "@/lib/types"

interface MercadoPagoButtonProps {
  cart: CartItem[]
  customerData: {
    name: string
    email: string
    phone: string
    address?: string
  }
}

export default function MercadoPagoButton({ cart, customerData }: MercadoPagoButtonProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast({
        title: "Error",
        description: "El carrito está vacío",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Preparar los datos para la API
      const items = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }))

      // Llamar a la API para crear la preferencia de pago
      const response = await fetch("/api/mercadopago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          customer: customerData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al procesar el pago")
      }

      const { initPoint } = await response.json()

      // Redirigir al usuario a la página de pago de MercadoPago
      window.location.href = initPoint
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al procesar el pago",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} className="w-full" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        "Pagar con MercadoPago"
      )}
    </Button>
  )
}

