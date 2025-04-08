import { NextResponse } from "next/server"

export function GET(request, { params }) {
  const { id } = params
  return NextResponse.json({
    message: "Detalles de orden (simulación)",
    order: {
      id,
      status: "pending",
      totalAmount: 100,
      items: [{ name: "Producto 1", price: 100, quantity: 1 }],
      createdAt: new Date().toISOString(),
    },
  })
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()
    return NextResponse.json({
      message: "Orden actualizada (simulación)",
      order: {
        id,
        ...data,
        updatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 400 })
  }
}
