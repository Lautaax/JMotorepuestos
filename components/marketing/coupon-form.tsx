"use client"

import type React from "react"

import { useState } from "react"
import { Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface CouponFormProps {
  onApply: (couponData: {
    id: string
    code: string
    discount: number
    discountType: string
    discountAmount: number
  }) => void
  subtotal: number
}

export default function CouponForm({ onApply, subtotal }: CouponFormProps) {
  const { toast } = useToast()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code) {
      toast({
        title: "Error",
        description: "Por favor ingresa un código de cupón",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, amount: subtotal }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al validar cupón")
      }

      if (!data.valid) {
        toast({
          title: "Cupón inválido",
          description: data.message || "El cupón ingresado no es válido o ha expirado",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "¡Cupón aplicado!",
        description: `Se ha aplicado un descuento de $${data.coupon.discountAmount.toFixed(2)}`,
      })

      onApply(data.coupon)
      setCode("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al validar el cupón",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Tag className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Código de cupón"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="pl-8"
        />
      </div>
      <Button type="submit" variant="outline" disabled={loading}>
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          "Aplicar"
        )}
      </Button>
    </form>
  )
}
