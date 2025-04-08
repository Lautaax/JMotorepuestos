import { type NextRequest, NextResponse } from "next/server"

/**
 * GET: Obtener información del programa de lealtad
 */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Funcionalidad de programa de lealtad desactivada temporalmente",
  })
}

/**
 * PUT: Actualizar configuración del programa de lealtad
 */
export async function PUT(request: NextRequest) {
  return NextResponse.json({
    message: "Funcionalidad de programa de lealtad desactivada temporalmente",
  })
}
