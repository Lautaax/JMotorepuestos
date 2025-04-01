import { type NextRequest, NextResponse } from "next/server"
import { generateExcelTemplate } from "@/lib/excel-processor"

export async function GET(request: NextRequest) {
  try {
    // Generar la plantilla de Excel
    const templateBuffer = generateExcelTemplate()

    // Configurar la respuesta
    const response = new NextResponse(templateBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="plantilla_productos.xlsx"',
      },
    })

    return response
  } catch (error) {
    console.error("Error al generar plantilla de Excel:", error)
    return NextResponse.json({ error: "Error al generar la plantilla de Excel" }, { status: 500 })
  }
}

