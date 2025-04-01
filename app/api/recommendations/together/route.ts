import { type NextRequest, NextResponse } from "next/server"
import { getFrequentlyBoughtTogether } from "@/lib/recommendations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const limit = Number(searchParams.get("limit") || "4")

    if (!productId) {
      return NextResponse.json({ error: "ID de producto requerido" }, { status: 400 })
    }

    const products = await getFrequentlyBoughtTogether(productId, limit)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error al obtener productos comprados juntos:", error)
    return NextResponse.json({ error: "Error al obtener productos comprados juntos" }, { status: 500 })
  }
}

