import { getProducts } from "@/lib/products"
import { getCategories } from "@/lib/products"

export default async function CompatibilityGuidePage() {
  // Obtener productos y categorías
  const products = await getProducts()
  const categories = await getCategories()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Guía de Compatibilidad</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 mb-4">
          Esta página muestra la compatibilidad entre productos y modelos de motocicletas.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modelos Compatibles
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => {
                const category = categories.find((c) => c._id.toString() === product.categoryId)

                return (
                  <tr key={product._id.toString()}>
                    <td className="py-2 px-4 text-sm">{product.name}</td>
                    <td className="py-2 px-4 text-sm">{category?.name || "Sin categoría"}</td>
                    <td className="py-2 px-4 text-sm">
                      {product.compatibleModels && product.compatibleModels.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {product.compatibleModels.map((model, index) => (
                            <li key={index}>{model}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">No hay modelos compatibles especificados</span>
                      )}
                    </td>
                  </tr>
                )
              })}

              {products.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                    No hay productos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
