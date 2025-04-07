import type { Metadata } from "next"
import ProductsClient from "./products-client"

export const metadata: Metadata = {
  title: "Productos | MotoRepuestos Del Sur",
  description: "Explora nuestra amplia selección de repuestos para motocicletas de alta calidad.",
}

export default function ProductsPage() {
  return <ProductsClient />
}

