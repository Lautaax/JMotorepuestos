"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Loader2, ShoppingCart, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
// Actualizar la importación
import { useCart } from "@/components/providers/cart-provider"
import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

  if (!isClient) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (cart.length === 0) {
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

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1 container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Carrito de compras</h1>
            <Button variant="outline" size="sm" onClick={clearCart}>
              Vaciar carrito
            </Button>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="rounded-lg border bg-background shadow-sm">
                <div className="p-4 md:p-6">
                  <div className="grid gap-4">
                    {cart.map((item) => (
                      <div
                        key={item.product._id || item.product.id || `product-${Math.random()}`}
                        className="grid gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative aspect-square h-16 w-16 min-w-16 overflow-hidden rounded-lg border bg-muted">
                            <Image
                              src={item.product.image || "/placeholder.svg?height=64&width=64"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 grid gap-1">
                            <Link
                              href={`/products/${item.product._id || item.product.id}`}
                              className="font-medium hover:underline"
                            >
                              {item.product.name}
                            </Link>
                            <div className="text-sm text-muted-foreground">
                              ${item.product.price.toFixed(2)} x {item.quantity} = $
                              {(item.product.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateQuantity(
                                    item.product._id || item.product.id || "",
                                    Math.max(1, item.quantity - 1),
                                  )
                                }
                              >
                                -
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                max={item.product.stock}
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = Number.parseInt(e.target.value)
                                  if (!isNaN(value) && value >= 1 && value <= item.product.stock) {
                                    updateQuantity(item.product._id || item.product.id || "", value)
                                  }
                                }}
                                className="h-7 w-14 text-center"
                              />
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  updateQuantity(
                                    item.product._id || item.product.id || "",
                                    Math.min(item.product.stock, item.quantity + 1),
                                  )
                                }
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeFromCart(item.product._id || item.product.id || "")}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="rounded-lg border bg-background shadow-sm">
                <div className="p-4 md:p-6">
                  <h2 className="font-semibold">Resumen del pedido</h2>
                  <div className="mt-4 grid gap-2">
                    <div className="flex items-center justify-between">
                      <div>Subtotal</div>
                      <div>${subtotal.toFixed(2)}</div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-semibold">
                      <div>Total</div>
                      <div>${subtotal.toFixed(2)}</div>
                    </div>
                    <div className="mt-4 grid gap-2">
                      <Link href="/checkout">
                        <Button className="w-full">Finalizar compra</Button>
                      </Link>
                      <Link href="/products">
                        <Button variant="outline" className="w-full">
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Seguir comprando
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
