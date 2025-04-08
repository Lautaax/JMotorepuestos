"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Product } from "@/lib/types"

// Define el tipo para los elementos del carrito
export interface CartItem {
  id: string
  product: Product
  quantity: number
}

// Define el tipo para el contexto del carrito
export interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getTotal: () => number
  getDiscount: () => number
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  couponCode: string | null
  couponDiscount: number
}

// Crea el contexto con un valor inicial
const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getSubtotal: () => 0,
  getTotal: () => 0,
  getDiscount: () => 0,
  applyCoupon: () => {},
  removeCoupon: () => {},
  couponCode: null,
  couponDiscount: 0,
})

// Hook personalizado para usar el contexto del carrito
export const useCart = () => useContext(CartContext)

// Proveedor del contexto del carrito
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Estado para los elementos del carrito
  const [items, setItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState<number>(0)

  // Cargar el carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedCoupon = localStorage.getItem("coupon")
    const savedDiscount = localStorage.getItem("discount")

    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
        setItems([])
      }
    }

    if (savedCoupon) {
      setCouponCode(savedCoupon)
    }

    if (savedDiscount) {
      setCouponDiscount(Number(savedDiscount))
    }
  }, [])

  // Guardar el carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  // Guardar el cupón y descuento en localStorage cuando cambien
  useEffect(() => {
    if (couponCode) {
      localStorage.setItem("coupon", couponCode)
    } else {
      localStorage.removeItem("coupon")
    }

    localStorage.setItem("discount", couponDiscount.toString())
  }, [couponCode, couponDiscount])

  // Añadir un producto al carrito
  const addItem = (product: Product, quantity: number) => {
    setItems((prevItems) => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // Si el producto ya está en el carrito, actualizar la cantidad
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // Si el producto no está en el carrito, añadirlo
        return [...prevItems, { id: product.id, product, quantity }]
      }
    })
  }

  // Eliminar un producto del carrito
  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Actualizar la cantidad de un producto en el carrito
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  // Vaciar el carrito
  const clearCart = () => {
    setItems([])
    setCouponCode(null)
    setCouponDiscount(0)
    localStorage.removeItem("coupon")
    localStorage.removeItem("discount")
  }

  // Calcular el subtotal del carrito
  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  // Calcular el descuento
  const getDiscount = () => {
    const subtotal = getSubtotal()
    return subtotal * (couponDiscount / 100)
  }

  // Calcular el total del carrito
  const getTotal = () => {
    const subtotal = getSubtotal()
    const discount = getDiscount()
    return subtotal - discount
  }

  // Aplicar un cupón de descuento
  const applyCoupon = (code: string, discount: number) => {
    setCouponCode(code)
    setCouponDiscount(discount)
  }

  // Eliminar un cupón de descuento
  const removeCoupon = () => {
    setCouponCode(null)
    setCouponDiscount(0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getSubtotal,
        getTotal,
        getDiscount,
        applyCoupon,
        removeCoupon,
        couponCode,
        couponDiscount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
