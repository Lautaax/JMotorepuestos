import { type NextRequest, NextResponse } from "next/server"
import { importProductsFromExcel } from "@/lib/excel-processor"

export async function POST(request: NextRequest) {
  try {
    // Verificar que la solicitud es multipart/form-data
    const contentType = request.headers.get("content-type") || ""
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Se requiere un archivo Excel" }, { status: 400 })
    }

    // Obtener el archivo
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "Se requiere un archivo Excel" }, { status: 400 })
    }

    // Convertir el archivo a buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Importar productos desde Excel
    const result = await importProductsFromExcel(buffer)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error al importar productos desde Excel:", error)
    return NextResponse.json({ error: "Error al importar productos desde Excel" }, { status: 500 })
  }
}
