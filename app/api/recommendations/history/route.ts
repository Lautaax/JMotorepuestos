import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-db"
import { getRecommendedProductsFromHistory } from "@/lib/recommendations"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get("limit") || "8")

    const products = await getRecommendedProductsFromHistory(session.user.id, limit)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error al obtener recomendaciones de historial:", error)
    return NextResponse.json({ error: "Error al obtener recomendaciones de historial" }, { status: 500 })
  }
}

