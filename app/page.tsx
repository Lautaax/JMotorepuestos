import Link from "next/link"
import { getFeaturedProducts } from "@/lib/products"
import { formatPrice } from "@/lib/utils"

export default async function HomePage() {
  // Obtener productos destacados
  const featuredProducts = await getFeaturedProducts(6)

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Repuestos de calidad para tu motocicleta</h1>
          <p className="text-xl mb-6">Encuentra todo lo que necesitas para mantener tu moto en perfectas condiciones</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Ver productos
            </Link>
            <Link
              href="/categories"
              className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 rounded-md font-medium transition-colors"
            >
              Explorar categorías
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Productos destacados</h2>
          <Link href="/products" className="text-blue-600 hover:underline">
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product._id.toString()} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={product.imageUrl || "/placeholder.svg?height=192&width=384"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                  <Link
                    href={`/products/${product._id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {featuredProducts.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-8">No hay productos destacados disponibles.</p>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">¿Por qué elegirnos?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Calidad garantizada</h3>
            <p className="text-gray-600">
              Todos nuestros productos son originales y cuentan con garantía del fabricante.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8 4-8-4V5l8 4 8-4v2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Envío rápido</h3>
            <p className="text-gray-600">Enviamos a todo el país con seguimiento en tiempo real de tu pedido.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Soporte técnico</h3>
            <p className="text-gray-600">
              Contamos con expertos que te ayudarán a elegir las piezas correctas para tu moto.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
