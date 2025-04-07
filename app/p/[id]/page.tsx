import { redirect } from "next/navigation"
import { getProductById } from "@/lib/products-db"

interface ProductRedirectProps {
  params: {
    id: string
  }
}

export default async function ProductRedirect({ params }: ProductRedirectProps) {
  try {
    const product = await getProductById(params.id)

    if (product && product.slug) {
      redirect(`/producto/${product.slug}`)
    } else {
      redirect("/productos")
    }
  } catch (error) {
    console.error("Error al redirigir:", error)
    redirect("/productos")
  }
}

