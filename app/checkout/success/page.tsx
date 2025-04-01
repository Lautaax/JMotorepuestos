"use client"

import { useEffect } from "react"
import Link from "next/link"
import { CheckCircle, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart()

  // Limpiar el carrito cuando se carga la página de éxito
  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="container px-4 py-12 md:px-6 md:py-24 flex justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">¡Pago exitoso!</CardTitle>
          <CardDescription>Tu pedido ha sido procesado correctamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Hemos enviado un correo electrónico con los detalles de tu compra. Te contactaremos pronto para coordinar la
            entrega.
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

