import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import type { ProductNotification, UserPreference } from "./types"
import { getProductById } from "./products-db"

// Función para convertir _id de MongoDB a id string para notificaciones
function formatNotification(notification: any): ProductNotification {
  return {
    id: notification._id.toString(),
    userId: notification.userId,
    productId: notification.productId,
    motorcycleId: notification.motorcycleId,
    type: notification.type,
    isRead: notification.isRead,
    createdAt: notification.createdAt?.toISOString(),
    sentAt: notification.sentAt?.toISOString(),
  }
}

// Función para convertir _id de MongoDB a id string para preferencias
function formatPreference(preference: any): UserPreference {
  return {
    id: preference._id.toString(),
    userId: preference.userId,
    notifyNewCompatibleProducts: preference.notifyNewCompatibleProducts,
    notifyBackInStock: preference.notifyBackInStock,
    notifyPriceDrops: preference.notifyPriceDrops,
    savedMotorcycleIds: preference.savedMotorcycleIds || [],
    createdAt: preference.createdAt?.toISOString(),
    updatedAt: preference.updatedAt?.toISOString(),
  }
}

// Obtener notificaciones de un usuario
export async function getUserNotifications(userId: string): Promise<ProductNotification[]> {
  const notificationsCollection = getCollection("product_notifications")

  const notifications = await notificationsCollection.find({ userId }).sort({ createdAt: -1 }).toArray()

  return notifications.map(formatNotification)
}

// Obtener notificaciones no leídas de un usuario
export async function getUnreadNotifications(userId: string): Promise<ProductNotification[]> {
  const notificationsCollection = getCollection("product_notifications")

  const notifications = await notificationsCollection.find({ userId, isRead: false }).sort({ createdAt: -1 }).toArray()

  return notifications.map(formatNotification)
}

// Marcar notificación como leída
export async function markNotificationAsRead(id: string): Promise<void> {
  const notificationsCollection = getCollection("product_notifications")

  await notificationsCollection.updateOne({ _id: new ObjectId(id) }, { $set: { isRead: true } })
}

// Marcar todas las notificaciones de un usuario como leídas
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
  const notificationsCollection = getCollection("product_notifications")

  await notificationsCollection.updateMany({ userId, isRead: false }, { $set: { isRead: true } })
}

// Crear una nueva notificación
export async function createNotification(
  notification: Omit<ProductNotification, "id" | "isRead" | "createdAt" | "sentAt">,
): Promise<ProductNotification> {
  const notificationsCollection = getCollection("product_notifications")

  const notificationToInsert = {
    ...notification,
    isRead: false,
    createdAt: new Date(),
    sentAt: new Date(),
  }

  const result = await notificationsCollection.insertOne(notificationToInsert)

  return {
    id: result.insertedId.toString(),
    ...notification,
    isRead: false,
    createdAt: notificationToInsert.createdAt.toISOString(),
    sentAt: notificationToInsert.sentAt.toISOString(),
  }
}

// Eliminar una notificación
export async function deleteNotification(id: string): Promise<void> {
  const notificationsCollection = getCollection("product_notifications")

  await notificationsCollection.deleteOne({ _id: new ObjectId(id) })
}

// Eliminar todas las notificaciones de un usuario
export async function deleteAllUserNotifications(userId: string): Promise<void> {
  const notificationsCollection = getCollection("product_notifications")

  await notificationsCollection.deleteMany({ userId })
}

// Obtener preferencias de notificación de un usuario
export async function getUserPreferences(userId: string): Promise<UserPreference | null> {
  const preferencesCollection = getCollection("user_preferences")

  const preference = await preferencesCollection.findOne({ userId })

  if (!preference) return null

  return formatPreference(preference)
}

// Crear o actualizar preferencias de notificación
export async function updateUserPreferences(
  userId: string,
  preferences: Partial<Omit<UserPreference, "id" | "userId" | "createdAt" | "updatedAt">>,
): Promise<UserPreference> {
  const preferencesCollection = getCollection("user_preferences")

  // Verificar si ya existen preferencias
  const existingPreferences = await preferencesCollection.findOne({ userId })

  if (existingPreferences) {
    // Actualizar preferencias existentes
    await preferencesCollection.updateOne(
      { userId },
      {
        $set: {
          ...preferences,
          updatedAt: new Date(),
        },
      },
    )

    const updatedPreferences = await preferencesCollection.findOne({ userId })
    return formatPreference(updatedPreferences!)
  } else {
    // Crear nuevas preferencias
    const defaultPreferences = {
      userId,
      notifyNewCompatibleProducts: true,
      notifyBackInStock: true,
      notifyPriceDrops: true,
      savedMotorcycleIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const preferencesToInsert = {
      ...defaultPreferences,
      ...preferences,
    }

    const result = await preferencesCollection.insertOne(preferencesToInsert)

    return {
      id: result.insertedId.toString(),
      ...preferencesToInsert,
      createdAt: preferencesToInsert.createdAt.toISOString(),
      updatedAt: preferencesToInsert.updatedAt.toISOString(),
    }
  }
}

// Notificar a usuarios sobre nuevos productos compatibles
export async function notifyNewCompatibleProduct(
  productId: string,
  compatibleMotorcycleIds: string[],
): Promise<number> {
  const preferencesCollection = getCollection("user_preferences")
  const notificationsCollection = getCollection("product_notifications")

  // Encontrar usuarios que quieren ser notificados y tienen motos compatibles guardadas
  const preferences = await preferencesCollection
    .find({
      notifyNewCompatibleProducts: true,
      savedMotorcycleIds: { $in: compatibleMotorcycleIds },
    })
    .toArray()

  if (preferences.length === 0) {
    return 0
  }

  // Crear notificaciones para cada usuario
  const notifications = preferences.map((pref) => ({
    userId: pref.userId,
    productId,
    type: "new_product" as const,
    isRead: false,
    createdAt: new Date(),
    sentAt: new Date(),
  }))

  if (notifications.length > 0) {
    await notificationsCollection.insertMany(notifications)
  }

  return notifications.length
}

// Notificar a usuarios sobre productos que vuelven a tener stock
export async function notifyBackInStock(productId: string): Promise<number> {
  const preferencesCollection = getCollection("user_preferences")
  const notificationsCollection = getCollection("product_notifications")

  // Encontrar usuarios que quieren ser notificados sobre productos de vuelta en stock
  const preferences = await preferencesCollection
    .find({
      notifyBackInStock: true,
    })
    .toArray()

  if (preferences.length === 0) {
    return 0
  }

  // Crear notificaciones para cada usuario
  const notifications = preferences.map((pref) => ({
    userId: pref.userId,
    productId,
    type: "back_in_stock" as const,
    isRead: false,
    createdAt: new Date(),
    sentAt: new Date(),
  }))

  if (notifications.length > 0) {
    await notificationsCollection.insertMany(notifications)
  }

  return notifications.length
}

// Notificar a usuarios sobre bajadas de precio
export async function notifyPriceDrop(productId: string): Promise<number> {
  const preferencesCollection = getCollection("user_preferences")
  const notificationsCollection = getCollection("product_notifications")

  // Encontrar usuarios que quieren ser notificados sobre bajadas de precio
  const preferences = await preferencesCollection
    .find({
      notifyPriceDrops: true,
    })
    .toArray()

  if (preferences.length === 0) {
    return 0
  }

  // Crear notificaciones para cada usuario
  const notifications = preferences.map((pref) => ({
    userId: pref.userId,
    productId,
    type: "price_drop" as const,
    isRead: false,
    createdAt: new Date(),
    sentAt: new Date(),
  }))

  if (notifications.length > 0) {
    await notificationsCollection.insertMany(notifications)
  }

  return notifications.length
}

// Obtener detalles enriquecidos de notificaciones
export async function getEnrichedNotifications(userId: string): Promise<any[]> {
  const notifications = await getUserNotifications(userId)

  const enrichedNotifications = []

  for (const notification of notifications) {
    const product = await getProductById(notification.productId)

    if (product) {
      enrichedNotifications.push({
        ...notification,
        product: {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          stock: product.stock,
        },
      })
    }
  }

  return enrichedNotifications
}

