import { type NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/products-db"

export async function GET(request: NextRequest) {
  try {
    // Obtener parámetros de consulta
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const category = searchParams.get("category") || ""
    const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
    const sort = searchParams.get("sort") || ""

    // Construir opciones de filtrado
    const options: any = {
      filters: {},
    }

    if (query) {
      options.filters.query = query
    }

    if (category) {
      options.filters.category = category
    }

    if (minPrice !== undefined) {
      options.filters.minPrice = minPrice
    }

    if (maxPrice !== undefined) {
      options.filters.maxPrice = maxPrice
    }

    // Configurar ordenamiento
    if (sort) {
      switch (sort) {
        case "price-asc":
          options.sort = { price: 1 }
          break
        case "price-desc":
          options.sort = { price: -1 }
          break
        case "newest":
          options.sort = { createdAt: -1 }
          break
        case "featured":
          options.sort = { featured: -1 }
          break
        default:
          break
      }
    }

    // Obtener productos
    const products = await getProducts(options)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}
