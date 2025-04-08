import { type NextRequest, NextResponse } from "next/server"

/**
 * GET: Obtener puntos del usuario actual
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Funcionalidad de puntos de lealtad desactivada temporalmente",
  })
}

/**
 * POST: Añadir puntos al usuario
 */
export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: "Funcionalidad de puntos de lealtad desactivada temporalmente",
  })
}
