import { type NextRequest, NextResponse } from "next/server"
import { getProductById, reduceProductStock } from "@/lib/products-db"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { quantity } = await request.json()

    if (!quantity || quantity <= 0) {
      return NextResponse.json({ error: "La cantidad debe ser mayor que cero" }, { status: 400 })
    }

    // Verificar que el producto existe
    const product = await getProductById(params.id)

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    // Verificar que hay suficiente stock
    if (product.stock < quantity) {
      return NextResponse.json({ error: "No hay suficiente stock disponible" }, { status: 400 })
    }

    // Reducir el stock
    const success = await reduceProductStock(params.id, quantity)

    if (!success) {
      return NextResponse.json({ error: "No se pudo actualizar el stock" }, { status: 500 })
    }

    return NextResponse.json({ success: true, newStock: product.stock - quantity })
  } catch (error) {
    console.error("Error al reducir stock:", error)
    return NextResponse.json({ error: "Error al reducir el stock" }, { status: 500 })
  }
}

