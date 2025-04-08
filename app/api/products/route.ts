import { type NextRequest, NextResponse } from "next/server"
import { getFilteredProducts } from "@/lib/products"

export async function GET(request: NextRequest) {
  try {
    // Get search params from the request URL
    const { searchParams } = new URL(request.url)

    // Convert searchParams to a regular object
    const params: Record<string, string | number> = {}
    searchParams.forEach((value, key) => {
      // Convert numeric values
      if (!isNaN(Number(value)) && key !== "q" && !key.startsWith("moto")) {
        params[key] = Number(value)
      } else {
        params[key] = value
      }
    })

    console.log("API Request params:", params)

    // Get products with filters
    const products = await getFilteredProducts(params)

    console.log(`Found ${products.length} products`)

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error in products API:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
