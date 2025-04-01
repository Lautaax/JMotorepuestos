import { type NextRequest, NextResponse } from "next/server"
import { getRecommendedProductsForMotorcycle } from "@/lib/recommendations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const brand = searchParams.get("brand")
    const model = searchParams.get("model")
    const year = Number(searchParams.get("year"))
    const limit = Number(searchParams.get("limit") || "8")

    if (!brand || !model || !year) {
      return NextResponse.json({ error: "Parámetros incompletos" }, { status: 400 })
    }

    const products = await getRecommendedProductsForMotorcycle(brand, model, year, limit)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error al obtener recomendaciones para moto:", error)
    return NextResponse.json({ error: "Error al obtener recomendaciones para moto" }, { status: 500 })
  }
}

