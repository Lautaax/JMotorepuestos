import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-db"
import { markNotificationAsRead } from "@/lib/notifications-db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Marcar notificación como leída
    await markNotificationAsRead(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error)
    return NextResponse.json({ error: "Error al marcar notificación como leída" }, { status: 500 })
  }
}

