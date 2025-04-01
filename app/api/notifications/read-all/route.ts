import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-db"
import { markAllNotificationsAsRead } from "@/lib/notifications-db"

export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Marcar todas las notificaciones como leídas
    await markAllNotificationsAsRead(session.user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al marcar notificaciones como leídas:", error)
    return NextResponse.json({ error: "Error al marcar notificaciones como leídas" }, { status: 500 })
  }
}

