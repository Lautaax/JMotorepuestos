import { type NextRequest, NextResponse } from "next/server"
import { MercadoPagoConfig, Payment } from "mercadopago"

// Configurar MercadoPago
const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
})

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const id = searchParams.get("id")

    // Solo procesar notificaciones de pagos
    if (type !== "payment") {
      return NextResponse.json({ message: "Notificación recibida" })
    }

    if (!id) {
      return NextResponse.json({ error: "ID de pago no proporcionado" }, { status: 400 })
    }

    // Obtener información del pago
    const payment = new Payment(mercadopago)
    const paymentInfo = await payment.get({ id: Number(id) })

    // Verificar si el pago fue aprobado
    if (paymentInfo.status === "approved") {
      // Actualizar stock de productos
      // En una implementación real, aquí deberías:
      // 1. Obtener los detalles del pedido asociado al pago
      // 2. Actualizar el stock de cada producto
      // 3. Registrar la venta en tu base de datos
      // 4. Enviar confirmación por email al cliente

      // Ejemplo simplificado:
      const externalReference = paymentInfo.external_reference
      console.log(`Pago aprobado para: ${externalReference}`)

      // Aquí deberías implementar la lógica para actualizar el stock
      // basándote en los productos comprados
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al procesar webhook de MercadoPago:", error)
    return NextResponse.json({ error: "Error al procesar la notificación" }, { status: 500 })
  }
}
