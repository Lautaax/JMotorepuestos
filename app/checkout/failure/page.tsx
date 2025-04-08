"use client"

import Link from "next/link"
import { AlertCircle, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutFailurePage() {
  return (
    <div className="container px-4 py-12 md:px-6 md:py-24 flex justify-center">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl">Pago fallido</CardTitle>
          <CardDescription>Hubo un problema con tu pago</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Lo sentimos, pero no pudimos procesar tu pago. Por favor, intenta nuevamente o utiliza otro método de pago.
          </p>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Si continúas teniendo problemas, no dudes en contactarnos por WhatsApp o correo electrónico.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Link href="/checkout">
            <Button className="w-full">Intentar nuevamente</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Seguir comprando
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
