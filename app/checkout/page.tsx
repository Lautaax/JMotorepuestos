"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, CreditCard, Loader2, ShoppingBag, Truck, ShoppingCart, Shield } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/providers/cart-provider"
import WhatsAppCheckoutCart from "@/components/whatsapp-checkout-cart"
import MercadoPagoCheckout from "@/components/payment/mercado-pago-checkout"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import LoginModal from "@/components/auth/login-modal"

export default function CheckoutPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { data: session } = useSession()
  const [isClient, setIsClient] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    shippingMethod: "pickup",
    paymentMethod: "whatsapp",
  })

  useEffect(() => {
    setIsClient(true)
    // Verificar si el carrito está realmente vacío después de la hidratación
    if (isClient && cart.length === 0) {
      console.log("Carrito vacío detectado en checkout")
    }

    // Autocompletar datos del usuario si está logueado
    if (session?.user) {
      setCustomerData((prev) => ({
        ...prev,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
        phone: session.user.phone || prev.phone,
      }))
    }
  }, [cart.length, isClient, session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomerData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setCustomerData((prev) => ({ ...prev, [name]: value }))
  }

  if (!isClient) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Asegurarnos de que solo mostramos el mensaje de carrito vacío cuando estamos seguros
  if (isClient && cart.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
            <p className="text-muted-foreground">No hay productos en tu carrito de compras</p>
            <Link href="/products">
              <Button>Ver productos</Button>
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-center">
            <Link href="/cart" className="inline-flex items-center gap-1 text-sm font-medium hover:underline">
              <ChevronLeft className="h-4 w-4" />
              Volver al carrito
            </Link>
            <h1 className="text-2xl font-bold ml-auto">Finalizar compra</h1>
          </div>

          {!session && (
            <div className="bg-secondary/50 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="font-medium">¿Ya tienes una cuenta?</h2>
                  <p className="text-sm text-muted-foreground">Inicia sesión para completar tu compra más rápido</p>
                </div>
                <Button onClick={() => setIsLoginModalOpen(true)}>Iniciar sesión</Button>
              </div>
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de contacto</CardTitle>
                  <CardDescription>Ingresa tus datos para completar la compra</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo *</Label>
                    <Input id="name" name="name" value={customerData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={customerData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input id="phone" name="phone" value={customerData.phone} onChange={handleInputChange} required />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Método de envío</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={customerData.shippingMethod}
                    onValueChange={(value) => handleRadioChange("shippingMethod", value)}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="pickup" className="flex items-center gap-2">
                          <ShoppingBag className="h-4 w-4" />
                          Retiro en tienda
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Retira tu pedido en nuestra tienda sin costo adicional
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="delivery" className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Envío a domicilio
                        </Label>
                        <p className="text-sm text-muted-foreground">Recibe tu pedido en la dirección que indiques</p>
                      </div>
                    </div>
                  </RadioGroup>

                  {customerData.shippingMethod === "delivery" && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="address">Dirección de envío *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={customerData.address}
                        onChange={handleInputChange}
                        placeholder="Calle, número, piso, departamento, ciudad, código postal"
                        required
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Método de pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={customerData.paymentMethod}
                    onValueChange={(value) => handleRadioChange("paymentMethod", value)}
                    className="space-y-3"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="whatsapp" id="whatsapp" className="mt-1" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="whatsapp">WhatsApp</Label>
                        <p className="text-sm text-muted-foreground">
                          Coordina el pago por WhatsApp (efectivo o transferencia)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="transferencia" id="transferencia" className="mt-1" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="transferencia">Transferencia Bancaria</Label>
                        <p className="text-sm text-muted-foreground">
                          Realiza una transferencia bancaria a nuestra cuenta
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="mercadopago" id="mercadopago" className="mt-1" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="mercadopago" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          MercadoPago
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Paga con tarjeta de crédito, débito o saldo en MercadoPago
                        </p>
                      </div>
                    </div>
                  </RadioGroup>

                  {customerData.paymentMethod === "transferencia" && (
                    <div className="mt-4 p-4 border rounded-md bg-muted/30">
                      <h4 className="font-medium mb-2">Datos bancarios para transferencia</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Banco:</strong> Banco Nación
                        </p>
                        <p>
                          <strong>Titular:</strong> MotoRepuestos S.A.
                        </p>
                        <p>
                          <strong>CUIT:</strong> 30-12345678-9
                        </p>
                        <p>
                          <strong>CBU:</strong> 0110000400000000000000
                        </p>
                        <p>
                          <strong>Alias:</strong> MOTO.REPUESTOS.SA
                        </p>
                        <p className="mt-2 text-muted-foreground">
                          Una vez realizada la transferencia, envíanos el comprobante por WhatsApp o email.
                        </p>
                      </div>
                    </div>
                  )}

                  {customerData.paymentMethod === "mercadopago" && (
                    <div className="mt-4 p-4 border rounded-md bg-primary/5 flex items-center gap-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <p className="text-sm">Pago seguro procesado por MercadoPago. Tus datos están protegidos.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumen del pedido</CardTitle>
                  <CardDescription>
                    {cart.length} {cart.length === 1 ? "producto" : "productos"} en tu carrito
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-h-[300px] overflow-auto space-y-4 pr-2">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-start gap-3">
                        <div className="relative aspect-square h-16 w-16 min-w-16 overflow-hidden rounded-lg border bg-muted">
                          <Image
                            src={item.product.image || "/placeholder.svg?height=64&width=64"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 grid gap-1">
                          <h3 className="font-medium">{item.product.name}</h3>
                          <div className="text-sm text-muted-foreground">
                            ${item.product.price.toFixed(2)} x {item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Envío</span>
                      <span>{customerData.shippingMethod === "pickup" ? "Gratis" : "A calcular"}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-medium">
                      <span>Total</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  {customerData.paymentMethod === "whatsapp" ? (
                    <WhatsAppCheckoutCart cart={cart} />
                  ) : customerData.paymentMethod === "mercadopago" ? (
                    <MercadoPagoCheckout
                      customerData={{
                        name: customerData.name,
                        email: customerData.email,
                        phone: customerData.phone,
                        address: customerData.shippingMethod === "delivery" ? customerData.address : undefined,
                      }}
                    />
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => {
                        toast({
                          title: "Pedido recibido",
                          description:
                            "Te hemos enviado un email con los detalles de tu compra y los datos para realizar la transferencia.",
                        })
                        router.push("/checkout/pending")
                      }}
                    >
                      Confirmar pedido
                    </Button>
                  )}
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Seguir comprando
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </div>
  )
}

