import { type NextRequest, NextResponse } from "next/server"
import { createOrder, getAllOrders } from "@/lib/orders-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-db"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Validar datos mínimos del pedido
    if (!orderData.customerName || !orderData.customerPhone || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json({ error: "Datos de pedido incompletos" }, { status: 400 })
    }

    // Obtener el usuario autenticado si existe
    const session = await getServerSession(authOptions)

    // Si hay un usuario autenticado, asociar el pedido a ese usuario
    if (session?.user) {
      orderData.userId = session.user.id
    }

    // Crear el pedido
    const order = await createOrder(orderData)

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error al crear pedido:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear el pedido" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    // Obtener todas las órdenes
    const orders = await getAllOrders()

    // Aplicar límite si se especificó
    const limitedOrders = limit ? orders.slice(0, limit) : orders

    return NextResponse.json({ orders: limitedOrders })
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}

