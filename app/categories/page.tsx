import { getCategories } from "@/lib/products"
import { getProductsByCategory } from "@/app/actions/products"
import type { Product, Category } from "@/types/product"
import Link from "next/link"

export default async function CategoriesPage() {
  // Obtener las categorías
  const categories = await getCategories()

  // Objeto para almacenar los productos por categoría
  const productsByCategory: Record<string, Product[]> = {}

  // Obtener productos para cada categoría
  for (const category of categories) {
    const products = await getProductsByCategory(category._id.toString())
    productsByCategory[category._id.toString()] = products
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Categorías de Productos</h1>

      {categories.map((category: Category) => (
        <div key={category._id.toString()} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
          <p className="text-gray-600 mb-6">{category.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsByCategory[category._id.toString()]?.map((product: Product) => (
              <div key={product._id.toString()} className="border rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={product.imageUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium">{product.name}</h3>
                  <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                    <Link
                      href={`/products/${product._id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {(!productsByCategory[category._id.toString()] ||
              productsByCategory[category._id.toString()].length === 0) && (
              <p className="text-gray-500 col-span-full text-center py-8">
                No hay productos disponibles en esta categoría.
              </p>
            )}
          </div>
        </div>
      ))}

      {categories.length === 0 && <p className="text-gray-500 text-center py-12">No hay categorías disponibles.</p>}
    </div>
  )
}
