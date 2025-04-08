import { NextResponse } from "next/server"

export function GET(request, { params }) {
  const { id } = params
  return NextResponse.json({
    message: "Estado de orden (simulación)",
    orderId: id,
    status: "pending",
  })
}

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const data = await request.json()
    return NextResponse.json({
      message: "Estado de orden actualizado (simulación)",
      orderId: id,
      status: data.status || "processing",
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 400 })
  }
}
