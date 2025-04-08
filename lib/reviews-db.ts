import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import type { ProductReview } from "./types"
import { invalidateProductCache } from "./cache"
import { connectToDatabase } from "./mongodb" // Corregido: importar desde mongodb en lugar de db

// Función para convertir _id de MongoDB a id string
function formatReview(review: any): ProductReview {
  return {
    id: review._id.toString(),
    productId: review.productId,
    userId: review.userId,
    userName: review.userName,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt?.toISOString(),
    updatedAt: review.updatedAt?.toISOString(),
  }
}

// Obtener reseñas de un producto
export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  const reviewsCollection = getCollection("product_reviews")

  const reviews = await reviewsCollection.find({ productId }).sort({ createdAt: -1 }).toArray()

  return reviews.map(formatReview)
}

// Renombramos getProductReviews a getReviewsByProductId para mantener consistencia
// export async function getReviewsByProductId(productId: string): Promise<ProductReview[]> {
//   return getProductReviews(productId)
// }

// Función para obtener reseñas por ID de producto
export async function getReviewsByProductId(productId: string) {
  try {
    console.log(`Obteniendo reseñas para el producto: ${productId}`)
    const { db } = await connectToDatabase()

    const reviews = await db.collection("reviews").find({ productId }).sort({ createdAt: -1 }).toArray()

    console.log(`Encontradas ${reviews.length} reseñas para el producto ${productId}`)

    // Serializar las reseñas para evitar errores de serialización
    return reviews.map((review) => ({
      ...review,
      _id: review._id.toString(),
      createdAt: review.createdAt ? review.createdAt.toISOString() : null,
      updatedAt: review.updatedAt ? review.updatedAt.toISOString() : null,
    }))
  } catch (error) {
    console.error(`Error al obtener reseñas por ID de producto: ${error}`)
    return []
  }
}

// Obtener una reseña por ID
export async function getReviewById(id: string): Promise<ProductReview | null> {
  try {
    const reviewsCollection = getCollection("product_reviews")

    const review = await reviewsCollection.findOne({ _id: new ObjectId(id) })

    if (!review) return null

    return formatReview(review)
  } catch (error) {
    console.error("Error al obtener reseña por ID:", error)
    return null
  }
}

// Añadir una nueva reseña
export async function addReview(review: Omit<ProductReview, "id" | "createdAt" | "updatedAt">): Promise<ProductReview> {
  const reviewsCollection = getCollection("product_reviews")

  // Verificar si el usuario ya ha dejado una reseña para este producto
  if (review.userId) {
    const existingReview = await reviewsCollection.findOne({
      productId: review.productId,
      userId: review.userId,
    })

    if (existingReview) {
      throw new Error("Ya has dejado una reseña para este producto")
    }
  }

  const reviewToInsert = {
    ...review,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await reviewsCollection.insertOne(reviewToInsert)

  // Invalidar caché del producto
  invalidateProductCache(review.productId)

  return {
    id: result.insertedId.toString(),
    ...review,
    createdAt: reviewToInsert.createdAt.toISOString(),
    updatedAt: reviewToInsert.updatedAt.toISOString(),
  }
}

// Actualizar una reseña
export async function updateReview(id: string, updates: Partial<ProductReview>): Promise<ProductReview> {
  const reviewsCollection = getCollection("product_reviews")

  const updateData = {
    ...updates,
    updatedAt: new Date(),
  }

  await reviewsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

  const updatedReview = await reviewsCollection.findOne({ _id: new ObjectId(id) })

  if (!updatedReview) {
    throw new Error("Reseña no encontrada después de la actualización")
  }

  // Invalidar caché del producto
  invalidateProductCache(updatedReview.productId)

  return formatReview(updatedReview)
}

// Eliminar una reseña
export async function deleteReview(id: string): Promise<void> {
  const reviewsCollection = getCollection("product_reviews")

  // Obtener la reseña antes de eliminarla para invalidar la caché
  const review = await reviewsCollection.findOne({ _id: new ObjectId(id) })

  if (review) {
    await reviewsCollection.deleteOne({ _id: new ObjectId(id) })

    // Invalidar caché del producto
    invalidateProductCache(review.productId)
  }
}

// Obtener la calificación promedio de un producto
export async function getProductAverageRating(productId: string): Promise<{ average: number; count: number }> {
  const reviewsCollection = getCollection("product_reviews")

  const pipeline = [
    { $match: { productId } },
    {
      $group: {
        _id: null,
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]

  const result = await reviewsCollection.aggregate(pipeline).toArray()

  if (result.length === 0) {
    return { average: 0, count: 0 }
  }

  return {
    average: Math.round(result[0].average * 10) / 10, // Redondear a 1 decimal
    count: result[0].count,
  }
}
