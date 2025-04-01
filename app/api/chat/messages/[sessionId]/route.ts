import { type NextRequest, NextResponse } from "next/server"
import { addChatMessage, getChatMessages, getChatSession } from "@/lib/chat-db"

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const sessionId = params.sessionId

    // Verificar si la sesión existe
    const session = await getChatSession(sessionId)

    if (!session) {
      return NextResponse.json({ error: "Sesión de chat no encontrada" }, { status: 404 })
    }

    // Obtener mensajes
    const messages = await getChatMessages(sessionId)

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error al obtener mensajes:", error)
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const sessionId = params.sessionId
    const { message, isAdmin, userName, userId } = await request.json()

    if (!message || !userName) {
      return NextResponse.json({ error: "Mensaje y nombre son requeridos" }, { status: 400 })
    }

    // Verificar si la sesión existe
    const session = await getChatSession(sessionId)

    if (!session) {
      return NextResponse.json({ error: "Sesión de chat no encontrada" }, { status: 404 })
    }

    // Añadir mensaje
    const newMessage = await addChatMessage(sessionId, message, isAdmin, userName, userId)

    return NextResponse.json({ message: newMessage }, { status: 201 })
  } catch (error) {
    console.error("Error al añadir mensaje:", error)

    if (error instanceof Error && error.message.includes("Sesión cerrada")) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Error al añadir mensaje" }, { status: 500 })
  }
}

