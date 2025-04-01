import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    // Verificar si la solicitud viene de localhost o entorno de desarrollo
    const host = request.headers.get("host") || ""
    const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1")
    const isDevelopment = process.env.NODE_ENV === "development"

    if (!isLocalhost && !isDevelopment) {
      return NextResponse.json({ error: "Esta ruta solo está disponible en entorno de desarrollo" }, { status: 403 })
    }

    // Inicializar la base de datos
    await initializeDatabase()

    return NextResponse.json({
      success: true,
      message: "Base de datos inicializada correctamente",
    })
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    return NextResponse.json({ error: "Error al inicializar la base de datos" }, { status: 500 })
  }
}

