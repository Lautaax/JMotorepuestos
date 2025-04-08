"use server"

import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"
import { revalidatePath } from "next/cache"

// Obtener todas las órdenes
export async function getAllOrders(filter = {}, limit = 10, page = 1) {
  const { db } = await connectToDatabase()
  const skip = (page - 1) * limit

  return await db.collection("orders").find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray()
}

// Obtener una orden por ID
export async function getOrderById(id) {
  if (!id || !ObjectId.isValid(id)) {
    return null
  }

  const { db } = await connectToDatabase()
  return await db.collection("orders").findOne({ _id: new ObjectId(id) })
}

// Crear una nueva orden
export async function createOrder(orderData) {
  const { db } = await connectToDatabase()

  // Asegurarse de que la orden tenga timestamps
  const orderWithTimestamps = {
    ...orderData,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: orderData.status || "pending",
  }

  const result = await db.collection("orders").insertOne(orderWithTimestamps)

  // Revalidar rutas relacionadas
  revalidatePath("/profile")
  revalidatePath("/admin/orders")

  return {
    _id: result.insertedId,
    ...orderWithTimestamps,
  }
}

// Actualizar el estado de una orden
export async function updateOrderStatus(id, status) {
  if (!id || !ObjectId.isValid(id)) {
    throw new Error("Invalid order ID")
  }

  const { db } = await connectToDatabase()
  const result = await db.collection("orders").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    },
  )

  // Revalidar rutas relacionadas
  revalidatePath("/profile")
  revalidatePath("/admin/orders")
  revalidatePath(`/orders/${id}`)

  return result.modifiedCount > 0
}

// Obtener las órdenes de un usuario
export async function getUserOrders(userId) {
  if (!userId) {
    return []
  }

  const { db } = await connectToDatabase()
  return await db.collection("orders").find({ userId }).sort({ createdAt: -1 }).toArray()
}
