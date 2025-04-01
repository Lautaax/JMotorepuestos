import { type NextRequest, NextResponse } from "next/server"
import { exportProductsToExcel } from "@/lib/excel-processor"
import { getProducts } from "@/lib/products-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-db"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener todos los productos
    const products = await getProducts({})

    // Generar el archivo Excel
    const excelBuffer = await exportProductsToExcel(products)

    // Configurar la respuesta
    const response = new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="productos.xlsx"',
      },
    })

    return response
  } catch (error) {
    console.error("Error al exportar productos a Excel:", error)
    return NextResponse.json({ error: "Error al generar el archivo Excel" }, { status: 500 })
  }
}

