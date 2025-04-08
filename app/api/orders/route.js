import { NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({
    message: "API de órdenes simplificada",
    orders: [
      {
        id: "1",
        userId: "user1",
        status: "pending",
        totalAmount: 100,
        items: [{ name: "Producto 1", price: 100, quantity: 1 }],
        createdAt: new Date().toISOString(),
      },
    ],
  })
}

export async function POST(request) {
  try {
    const data = await request.json()
    return NextResponse.json({
      message: "Orden creada (simulación)",
      order: {
        id: "new-order-" + Date.now(),
        ...data,
        createdAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 400 })
  }
}
