import { type NextRequest, NextResponse } from "next/server"
import { addSubscriber } from "@/lib/email-marketing-db"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 })
    }

    const subscriber = await addSubscriber(email, name)

    return NextResponse.json({
      success: true,
      message: "Suscripción exitosa",
      subscriber,
    })
  } catch (error) {
    console.error("Error al suscribir email:", error)
    return NextResponse.json({ error: "Error al procesar la suscripción" }, { status: 500 })
  }
}

