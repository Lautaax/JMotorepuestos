import { type NextRequest, NextResponse } from "next/server"
import { createPaymentPreference } from "./actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customer, totalAmount } = body

    if (!items || !customer || !totalAmount) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 })
    }

    const result = await createPaymentPreference(totalAmount, customer, items)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error en la API de MercadoPago:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al procesar el pago" },
      { status: 500 },
    )
  }
}

