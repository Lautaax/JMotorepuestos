import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { formatDate, formatPrice } from "@/lib/utils"
import { mockOrders } from "@/lib/mock-data"

export default async function ProfilePage() {
  // Obtener usuario actual
  const user = await getCurrentUser()

  // Redirigir si no hay usuario autenticado
  if (!user) {
    redirect("/auth/login?callbackUrl=/profile")
  }

  // Usar datos de ejemplo
  const orders = mockOrders

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Información del usuario */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Nombre</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Miembro desde</p>
                <p className="font-medium">{formatDate(new Date())}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Órdenes recientes */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Mis Pedidos</h2>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id.toString()} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-medium">Pedido #{order._id.toString().slice(-6)}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(order.totalAmount)}</p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : order.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-2">Productos:</p>
                      <ul className="space-y-2">
                        {order.items.map((item, index) => (
                          <li key={index} className="flex justify-between text-sm">
                            <span>
                              {item.name} x {item.quantity}
                            </span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No has realizado ningún pedido aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
