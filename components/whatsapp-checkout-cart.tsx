"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { CartItem } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/components/providers/cart-provider"

interface WhatsAppCheckoutCartProps {
  cart: CartItem[]
}

export default function WhatsAppCheckoutCart({ cart }: WhatsAppCheckoutCartProps) {
  const { toast } = useToast()
  const router = useRouter()
  const { clearCart } = useCart()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    paymentMethod: "efectivo",
    shipping: "retirar",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate form
    if (!formData.name || !formData.phone) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      // Crear el pedido en la base de datos
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerAddress: formData.shipping === "envio" ? formData.address : undefined,
          items: cart.map((item) => ({
            productId: item.product.id,
            productName: item.product.name,
            productSku: item.product.sku,
            price: item.product.price,
            quantity: item.quantity,
          })),
          total: subtotal,
          paymentMethod: "whatsapp",
          shippingMethod: formData.shipping,
          notes: formData.notes,
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || "Error al crear el pedido")
      }

      // Construct WhatsApp message
      let message = `
*Nuevo Pedido*

*Productos:*
`

      // Add each product to the message
      cart.forEach((item) => {
        message += `
- ${item.product.name} (${item.product.sku || item.product.id})
Cantidad: ${item.quantity}
Precio unitario: $${item.product.price.toFixed(2)}
Subtotal: $${(item.product.price * item.quantity).toFixed(2)}
`
      })

      // Add customer info and total
      message += `
*Total: $${subtotal.toFixed(2)}*

*Datos del Cliente*
Nombre: ${formData.name}
Teléfono: ${formData.phone}
${formData.email ? `Email: ${formData.email}` : ""}

*Método de Pago*: ${formData.paymentMethod === "efectivo" ? "Efectivo" : "Transferencia"}

*Envío*: ${formData.shipping === "retirar" ? "Retiro en tienda" : "Envío a domicilio"}
${formData.shipping === "envio" && formData.address ? `Dirección: ${formData.address}` : ""}

${formData.notes ? `*Notas*: ${formData.notes}` : ""}
`.trim()

      // Encode message for WhatsApp URL
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/+5491112345678?text=${encodedMessage}`

      // Abrir WhatsApp
      window.open(whatsappUrl, "_blank")
      setOpen(false)

      // Limpiar el carrito
      clearCart()

      toast({
        title: "Pedido enviado",
        description: "Te redirigimos a WhatsApp para finalizar tu compra",
      })

      // Actualizar la UI
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al procesar el pedido",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Finalizar compra</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Finalizar compra por WhatsApp</DialogTitle>
            <DialogDescription>Completa tus datos para generar el pedido y enviarlo por WhatsApp</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre completo *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentMethod">Método de pago</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleSelectChange("paymentMethod", value)}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shipping">Modalidad de envío</Label>
              <Select value={formData.shipping} onValueChange={(value) => handleSelectChange("shipping", value)}>
                <SelectTrigger id="shipping">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retirar">Retirar en tienda</SelectItem>
                  <SelectItem value="envio">Envío a domicilio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.shipping === "envio" && (
              <div className="grid gap-2">
                <Label htmlFor="address">Dirección de envío</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle, número, piso, departamento, ciudad, código postal"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Instrucciones especiales, consultas, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Enviar pedido
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
