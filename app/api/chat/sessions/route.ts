import { type NextRequest, NextResponse } from "next/server"
import { createChatSession } from "@/lib/chat-db"

export async function POST(request: NextRequest) {
  try {
    const { userName, email, userId } = await request.json()

    if (!userName) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    // Crear sesión de chat
    const session = await createChatSession(userName, email, userId)

    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    console.error("Error al crear sesión de chat:", error)
    return NextResponse.json({ error: "Error al crear sesión de chat" }, { status: 500 })
  }
}

