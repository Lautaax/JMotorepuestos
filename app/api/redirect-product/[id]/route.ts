import { NextResponse } from "next/server"
import { getProductById } from "@/lib/products-db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const product = await getProductById(id)

    if (product && product.slug) {
      // Redirigir a la URL con slug
      return NextResponse.redirect(new URL(`/products/${product.slug}`, request.url))
    } else {
      // Si no se encuentra el producto o no tiene slug, redirigir a la lista de productos
      return NextResponse.redirect(new URL("/products", request.url))
    }
  } catch (error) {
    console.error("Error al redirigir:", error)
    return NextResponse.redirect(new URL("/products", request.url))
  }
}
