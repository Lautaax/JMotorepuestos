import { type NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/app/actions/products"
import { exportProductsToExcel } from "@/lib/excel-processor"

export async function GET(request: NextRequest) {
  try {
    // Obtener todos los productos
    const products = await getProducts()

    // Exportar productos a Excel
    const excelBuffer = await exportProductsToExcel(products)

    // Configurar la respuesta
    const response = new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=productos.xlsx",
      },
    })

    return response
  } catch (error) {
    console.error("Error al exportar productos a Excel:", error)
    return NextResponse.json({ error: "Error al exportar productos a Excel" }, { status: 500 })
  }
}
