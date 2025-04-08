import type { Metadata } from "next"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth-options"

export const metadata: Metadata = {
  title: "Mi Garage | Moto MotoRepuestos",
  description: "Gestiona tus motos y encuentra repuestos compatibles",
}

export default async function GaragePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?callbackUrl=/account/garage")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Mi Garage</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Mis Motos</h2>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">Agrega tus motos para encontrar repuestos compatibles más fácilmente.</p>

          <form className="grid gap-4 md:grid-cols-4">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium mb-1">
                Marca
              </label>
              <select id="brand" className="w-full p-2 border rounded">
                <option value="">Seleccionar marca</option>
                <option value="honda">Honda</option>
                <option value="yamaha">Yamaha</option>
                <option value="suzuki">Suzuki</option>
                <option value="kawasaki">Kawasaki</option>
              </select>
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium mb-1">
                Modelo
              </label>
              <input type="text" id="model" className="w-full p-2 border rounded" placeholder="Ej: CB 190R" />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium mb-1">
                Año
              </label>
              <input type="number" id="year" className="w-full p-2 border rounded" placeholder="Ej: 2020" />
            </div>

            <div className="flex items-end">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Agregar Moto
              </button>
            </div>
          </form>
        </div>

        <div className="border-t pt-4">
          <p className="text-gray-500 italic">No tienes motos registradas.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Repuestos Compatibles</h2>
        <p className="text-gray-500 italic">Agrega motos a tu garage para ver repuestos compatibles.</p>
      </div>
    </div>
  )
}

