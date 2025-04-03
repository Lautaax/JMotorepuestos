import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-db" // Corregido de @/lib/auth a @/lib/auth-db
import { createOrder, getAllOrders } from "@/lib/orders-db" // Cambiado getOrders por getAllOrders
import { addLoyaltyPoints } from "@/lib/loyalty-db"
import type { Order } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") as Order["status"] | null
    const userId = searchParams.get("userId")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit") as string) : undefined
    const skip = searchParams.get("skip") ? Number.parseInt(searchParams.get("skip") as string) : undefined

    const session = await getServerSession(authOptions)

    // Si no es admin y está intentando ver pedidos de otros usuarios
    if (session?.user.role !== "admin" && userId && userId !== session?.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const orders = await getAllOrders({ status, userId, limit, skip }) // Cambiado getOrders por getAllOrders
    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const data = await request.json()

    // Asignar userId si el usuario está autenticado
    if (session?.user) {
      data.userId = session.user.id
    }

    const order = await createOrder(data)

    // Añadir puntos de fidelidad si el usuario está autenticado y el pago es exitoso
    if (
      session?.user?.id &&
      (data.status === "processing" || data.status === "shipped" || data.status === "delivered")
    ) {
      try {
        // Calcular puntos: 1 punto por cada 100 pesos
        const pointsToAdd = Math.floor(order.total / 100)

        if (pointsToAdd > 0) {
          await addLoyaltyPoints(session.user.id, pointsToAdd, `Puntos por compra #${order.id}`, order.id)
        }
      } catch (loyaltyError) {
        console.error("Error al añadir puntos de fidelidad:", loyaltyError)
        // No interrumpimos el flujo si hay error en la fidelización
      }
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error al crear pedido:", error)
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 })
  }
}

