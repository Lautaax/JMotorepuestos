import { type NextRequest, NextResponse } from "next/server"
import { getPopularProducts } from "@/lib/recommendations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get("limit") || "8")

    const products = await getPopularProducts(limit)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error al obtener productos populares:", error)
    return NextResponse.json({ error: "Error al obtener productos populares" }, { status: 500 })
  }
}

