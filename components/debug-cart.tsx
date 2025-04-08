"use client"

import { useCart } from "@/components/providers/cart-provider"
import { useEffect, useState } from "react"

export default function DebugCart() {
  const { cart } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded-md text-xs z-50">
      Productos en carrito: {cart.length}
    </div>
  )
}
