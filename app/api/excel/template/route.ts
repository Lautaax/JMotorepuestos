import { type NextRequest, NextResponse } from "next/server"
import { generateExcelTemplate } from "@/lib/excel-processor"

export async function GET(request: NextRequest) {
  try {
    // Generar plantilla de Excel
    const excelBuffer = await generateExcelTemplate()

    // Configurar la respuesta
    const response = new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=plantilla_productos.xlsx",
      },
    })

    return response
  } catch (error) {
    console.error("Error al generar plantilla de Excel:", error)
    return NextResponse.json({ error: "Error al generar plantilla de Excel" }, { status: 500 })
  }
}
