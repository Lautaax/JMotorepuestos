import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import { reduceMultipleProductsStock } from "./products-db"
import type { Order, OrderStatus } from "./types"

// Función para convertir _id de MongoDB a id string
function formatOrder(order: any): Order {
  return {
    id: order._id.toString(),
    userId: order.userId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    customerAddress: order.customerAddress,
    items: order.items,
    total: order.total,
    status: order.status as OrderStatus,
    paymentMethod: order.paymentMethod,
    shippingMethod: order.shippingMethod,
    notes: order.notes,
    createdAt: order.createdAt?.toISOString(),
    updatedAt: order.updatedAt?.toISOString(),
  }
}

// Crear un nuevo pedido
export async function createOrder(orderData: Omit<Order, "id" | "status" | "createdAt" | "updatedAt">): Promise<Order> {
  const ordersCollection = getCollection("orders")

  // Preparar el pedido para insertar
  const orderToInsert = {
    ...orderData,
    status: "pending" as OrderStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Reducir el stock de los productos
  const stockResult = await reduceMultipleProductsStock(
    orderData.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  )

  // Si no se pudo reducir el stock de algún producto, lanzar error
  if (!stockResult.success) {
    throw new Error(`No hay suficiente stock para algunos productos: ${stockResult.failedProducts.join(", ")}`)
  }

  // Insertar el pedido
  const result = await ordersCollection.insertOne(orderToInsert)

  return {
    id: result.insertedId.toString(),
    ...orderToInsert,
    createdAt: orderToInsert.createdAt.toISOString(),
    updatedAt: orderToInsert.updatedAt.toISOString(),
  }
}

// Obtener un pedido por ID
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const ordersCollection = getCollection("orders")
    const order = await ordersCollection.findOne({ _id: new ObjectId(id) })

    if (!order) return null

    return formatOrder(order)
  } catch (error) {
    console.error("Error al obtener pedido por ID:", error)
    return null
  }
}

// Obtener pedidos de un usuario
export async function getUserOrders(userId: string): Promise<Order[]> {
  const ordersCollection = getCollection("orders")

  const orders = await ordersCollection.find({ userId }).sort({ createdAt: -1 }).toArray()

  return orders.map(formatOrder)
}

// Actualizar el estado de un pedido
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const ordersCollection = getCollection("orders")

  await ordersCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
  )

  const updatedOrder = await ordersCollection.findOne({ _id: new ObjectId(id) })

  if (!updatedOrder) {
    throw new Error("Pedido no encontrado después de la actualización")
  }

  return formatOrder(updatedOrder)
}

// Obtener todos los pedidos (para administradores)
export async function getAllOrders(
  options: {
    status?: OrderStatus
    userId?: string
    limit?: number
    skip?: number
  } = {},
): Promise<Order[]> {
  const { status, userId, limit, skip } = options
  const ordersCollection = getCollection("orders")

  // Construir el filtro basado en los parámetros proporcionados
  const filter: any = {}
  if (status) filter.status = status
  if (userId) filter.userId = userId

  // Crear la consulta con el filtro
  let query = ordersCollection.find(filter).sort({ createdAt: -1 })

  // Aplicar paginación si se proporcionan los parámetros
  if (skip) query = query.skip(skip)
  if (limit) query = query.limit(limit)

  const orders = await query.toArray()

  return orders.map(formatOrder)
}
