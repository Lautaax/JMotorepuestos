import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto py-12 px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Página no encontrada</h2>
      <p className="mb-6 text-gray-600">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
      <Link href="/admin/marketing" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Volver a Marketing
      </Link>
    </div>
  )
}

