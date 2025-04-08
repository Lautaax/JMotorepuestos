import { type NextRequest, NextResponse } from "next/server"
import { processPaymentNotification } from "../actions"

export async function POST(request: NextRequest) {
  try {
    // MercadoPago puede enviar los datos como query params o como body
    const searchParams = request.nextUrl.searchParams
    let topic = searchParams.get("topic") || searchParams.get("type") || ""
    let id = searchParams.get("id") || searchParams.get("data.id") || ""

    // Si no hay topic o id, intentamos obtenerlos del body
    if (!topic || !id) {
      const body = await request.json().catch(() => ({}))

      const topicFromBody = body.topic || body.type
      const idFromBody = body.id || (body.data && body.data.id)

      if (topicFromBody) topic = topicFromBody
      if (idFromBody) id = idFromBody
    }

    // Si aún no tenemos topic o id, es una solicitud inválida
    if (!topic || !id) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 })
    }

    // Procesar la notificación
    const result = await processPaymentNotification(id, topic)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error en el webhook de MercadoPago:", error)
    return NextResponse.json({ error: "Error al procesar la notificación" }, { status: 500 })
  }
}
