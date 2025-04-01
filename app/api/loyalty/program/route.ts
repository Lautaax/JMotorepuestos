import { type NextRequest, NextResponse } from "next/server"
import { getUserLoyaltyProgram, createOrUpdateLoyaltyProgram } from "@/lib/loyalty-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-db"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener programa de fidelización
    let program = await getUserLoyaltyProgram(session.user.id)

    // Si no existe, crear uno nuevo
    if (!program) {
      program = await createOrUpdateLoyaltyProgram(session.user.id)
    }

    return NextResponse.json({ program })
  } catch (error) {
    console.error("Error al obtener programa de fidelización:", error)
    return NextResponse.json({ error: "Error al obtener programa de fidelización" }, { status: 500 })
  }
}

