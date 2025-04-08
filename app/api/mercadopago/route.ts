import { type NextRequest, NextResponse } from "next/server"
import { createPaymentPreference } from "./actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar que el cuerpo tenga los datos necesarios
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Se requieren items para crear la preferencia" }, { status: 400 })
    }

    // Crear la preferencia de pago
    const preference = await createPaymentPreference(body)

    return NextResponse.json(preference)
  } catch (error) {
    console.error("Error en la ruta de MercadoPago:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
