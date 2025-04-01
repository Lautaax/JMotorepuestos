import { type NextRequest, NextResponse } from "next/server"
import { unsubscribe } from "@/lib/email-marketing-db"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    await unsubscribe(email)

    return NextResponse.json({
      success: true,
      message: "Has sido desuscrito exitosamente",
    })
  } catch (error) {
    console.error("Error al desuscribir email:", error)
    return NextResponse.json({ error: "Error al procesar la desuscripción" }, { status: 500 })
  }
}

