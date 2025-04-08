"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/providers/cart-provider"

interface MercadoPagoCheckoutProps {
  customerData: {
    name: string
    email: string
    phone: string
    address?: string
  }
}

export default function MercadoPagoCheckout({ customerData }: MercadoPagoCheckoutProps) {
  const { toast } = useToast()
  const router = useRouter()
  const { cart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
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
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }))

      // Calcular el monto total
      const totalAmount = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

      // Llamar a la API para crear la preferencia de pago
      const response = await fetch("/api/mercadopago", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          customer: customerData,
          totalAmount: totalAmount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al procesar el pago")
      }

      const data = await response.json()

      // Verificar si tenemos initPoint para redirección directa
      if (data.initPoint) {
        console.log("Redirigiendo a:", data.initPoint)
        window.location.href = data.initPoint
      } else {
        throw new Error("No se recibió la URL de pago")
      }
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
    <Button onClick={handleCheckout} className="w-full" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          Pagar con MercadoPago
        </>
      )}
    </Button>
  )
}
