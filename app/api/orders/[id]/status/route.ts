import { type NextRequest, NextResponse } from "next/server"
import { getOrderById, updateOrderStatus } from "@/lib/orders-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { status } = await request.json()

    // Validar el estado
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Estado no válido" }, { status: 400 })
    }

    // Verificar que el pedido existe
    const order = await getOrderById(params.id)

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    // Actualizar el estado
    const updatedOrder = await updateOrderStatus(params.id, status)

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error al actualizar estado del pedido:", error)
    return NextResponse.json({ error: "Error al actualizar estado del pedido" }, { status: 500 })
  }
}
