"use server"

import { ObjectId } from "mongodb"
import { connectToDatabase } from "./mongodb"
import { getReviewsCache, invalidateProductCache, invalidateReviewsCache } from "./cache"

const COLLECTION_NAME = "reviews"

// Tipo para las reseñas
export type Review = {
  _id?: string | ObjectId
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt?: Date
}

/**
 * Obtiene todas las reseñas de un producto
 * @param productId - ID del producto
 * @returns Lista de reseñas
 */
export async function getProductReviews(productId: string) {
  // Intentar obtener de la caché primero
  const cache = await getReviewsCache()
  const cacheKey = `reviews-${productId}`
  const cachedReviews = cache.get(cacheKey)

  if (cachedReviews) {
    return cachedReviews
  }

  // Si no está en caché, obtener de la base de datos
  const { db } = await connectToDatabase()
  const reviews = await db.collection(COLLECTION_NAME).find({ productId }).sort({ createdAt: -1 }).toArray()

  // Guardar en caché
  cache.set(cacheKey, reviews)

  return reviews
}

/**
 * Añade una nueva reseña
 * @param reviewData - Datos de la reseña
 * @returns La reseña creada
 */
export async function addReview(reviewData: Omit<Review, "_id">) {
  const { db } = await connectToDatabase()

  // Añadir timestamps
  const reviewWithTimestamps = {
    ...reviewData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection(COLLECTION_NAME).insertOne(reviewWithTimestamps)

  // Invalidar cachés
  await invalidateReviewsCache(reviewData.productId)
  await invalidateProductCache(reviewData.productId)

  return {
    _id: result.insertedId,
    ...reviewWithTimestamps,
  }
}

/**
 * Actualiza una reseña existente
 * @param id - ID de la reseña
 * @param reviewData - Datos a actualizar
 * @returns true si se actualizó correctamente, false en caso contrario
 */
export async function updateReview(id: string, reviewData: Partial<Review>) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid review ID")
  }

  const { db } = await connectToDatabase()

  // Obtener la reseña actual para conocer el productId
  const currentReview = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  if (!currentReview) {
    throw new Error("Review not found")
  }

  const result = await db.collection(COLLECTION_NAME).updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...reviewData,
        updatedAt: new Date(),
      },
    },
  )

  // Invalidar cachés
  await invalidateReviewsCache(currentReview.productId)
  await invalidateProductCache(currentReview.productId)

  return result.modifiedCount > 0
}

/**
 * Elimina una reseña
 * @param id - ID de la reseña
 * @returns true si se eliminó correctamente, false en caso contrario
 */
export async function deleteReview(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid review ID")
  }

  const { db } = await connectToDatabase()

  // Obtener la reseña actual para conocer el productId
  const currentReview = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
  if (!currentReview) {
    throw new Error("Review not found")
  }

  const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })

  // Invalidar cachés
  await invalidateReviewsCache(currentReview.productId)
  await invalidateProductCache(currentReview.productId)

  return result.deletedCount > 0
}

/**
 * Obtiene el promedio de calificaciones de un producto
 * @param productId - ID del producto
 * @returns Promedio de calificaciones
 */
export async function getProductRatingAverage(productId: string) {
  const { db } = await connectToDatabase()

  const result = await db
    .collection(COLLECTION_NAME)
    .aggregate([{ $match: { productId } }, { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } }])
    .toArray()

  if (result.length === 0) {
    return { average: 0, count: 0 }
  }

  return {
    average: Math.round(result[0].average * 10) / 10, // Redondear a 1 decimal
    count: result[0].count,
  }
}

/**
 * Verifica si un usuario ya ha reseñado un producto
 * @param productId - ID del producto
 * @param userId - ID del usuario
 * @returns true si el usuario ya ha reseñado el producto, false en caso contrario
 */
export async function hasUserReviewedProduct(productId: string, userId: string) {
  const { db } = await connectToDatabase()

  const review = await db.collection(COLLECTION_NAME).findOne({ productId, userId })

  return !!review
}
