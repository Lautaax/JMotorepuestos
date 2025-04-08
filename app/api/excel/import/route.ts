import { type NextRequest, NextResponse } from "next/server"
import { importProductsFromExcel } from "@/lib/excel-processor"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se ha proporcionado ningún archivo" }, { status: 400 })
    }

    // Verificar tipo de archivo
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json({ error: "El archivo debe ser de tipo Excel (.xlsx o .xls)" }, { status: 400 })
    }

    const result = await importProductsFromExcel(file)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error al importar productos desde Excel:", error)
    return NextResponse.json({ error: "Error al procesar el archivo Excel" }, { status: 500 })
  }
}
