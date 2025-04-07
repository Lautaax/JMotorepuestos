import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Marketing por Email | Moto MotoRepuestos",
  description: "Gestiona tus campañas de email marketing",
}

export default function EmailMarketingPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Marketing por Email</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Enviar Campaña</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Asunto
              </label>
              <input type="text" id="subject" className="w-full p-2 border rounded" placeholder="Asunto del email" />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-1">
                Contenido
              </label>
              <textarea
                id="content"
                rows={6}
                className="w-full p-2 border rounded"
                placeholder="Contenido del email"
              ></textarea>
            </div>

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Enviar Campaña
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Estadísticas</h2>
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span>Total de suscriptores:</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Emails enviados:</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span>Tasa de apertura:</span>
              <span className="font-semibold">0%</span>
            </div>
            <div className="flex justify-between">
              <span>Tasa de clics:</span>
              <span className="font-semibold">0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

