import { type NextRequest, NextResponse } from "next/server"
import { getProducts } from "@/lib/products-db"
import { getUsersCount } from "@/lib/users-db"
import { getAllOrders } from "@/lib/orders-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener productos y calcular estadísticas
    const allProducts = await getProducts()
    const totalProducts = allProducts.length
    const outOfStockProducts = allProducts.filter((product) => product.stock <= 0)

    // Obtener usuarios
    const totalUsers = await getUsersCount()

    // Obtener órdenes
    const orders = await getAllOrders()
    const totalOrders = orders.length
    const pendingOrders = orders.filter((order) => order.status === "pending").length

    // Calcular ingresos totales (de órdenes entregadas)
    const revenue = orders
      .filter((order) => order.status === "delivered")
      .reduce((total, order) => total + order.total, 0)

    return NextResponse.json({
      totalProducts,
      totalUsers,
      outOfStockCount: outOfStockProducts.length,
      totalOrders,
      pendingOrders,
      revenue,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas del dashboard:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas" }, { status: 500 })
  }
}
