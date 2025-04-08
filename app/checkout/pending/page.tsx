"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Clock, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/components/providers/cart-provider"

export default function CheckoutPendingPage() {
  const { clearCart } = useCart()

  // Limpiar el carrito cuando se carga la página de pago pendiente
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24 flex justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Clock className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Pago en proceso</CardTitle>
          <CardDescription>Tu pago está siendo procesado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Tu pago está pendiente de confirmación. Te notificaremos por correo electrónico cuando se complete.
          </p>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos por WhatsApp o correo electrónico.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/products">
            <Button className="w-full">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Seguir comprando
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="w-full">
              Contactar
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
