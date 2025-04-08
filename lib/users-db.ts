import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import type { User } from "@/types/user"

const COLLECTION_NAME = "users"

/**
 * Obtiene un usuario por su ID
 * @param id - ID del usuario
 * @returns El usuario encontrado o null si no existe
 */
export async function getUserById(id: string) {
  if (!ObjectId.isValid(id)) {
    return null
  }

  const collection = await getCollection<User>(COLLECTION_NAME)
  return await collection.findOne({ _id: new ObjectId(id) })
}

/**
 * Obtiene un usuario por su email
 * @param email - Email del usuario
 * @returns El usuario encontrado o null si no existe
 */
export async function getUserByEmail(email: string) {
  const collection = await getCollection<User>(COLLECTION_NAME)
  return await collection.findOne({ email })
}

/**
 * Crea un nuevo usuario
 * @param userData - Datos del usuario a crear
 * @returns El usuario creado
 */
export async function createUser(userData: Omit<User, "_id">) {
  const collection = await getCollection<User>(COLLECTION_NAME)

  // Verificar si ya existe un usuario con el mismo email
  const existingUser = await getUserByEmail(userData.email)
  if (existingUser) {
    throw new Error(`User with email ${userData.email} already exists`)
  }

  const result = await collection.insertOne({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any)

  return {
    _id: result.insertedId,
    ...userData,
  }
}

// Alias para createUser para mantener compatibilidad
export const addUser = createUser

/**
 * Actualiza un usuario existente
 * @param id - ID del usuario a actualizar
 * @param userData - Datos a actualizar
 * @returns true si se actualizó correctamente, false en caso contrario
 */
export async function updateUser(id: string, userData: Partial<User>) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid user ID")
  }

  const collection = await getCollection<User>(COLLECTION_NAME)

  // Si se está actualizando el email, verificar que no exista otro usuario con ese email
  if (userData.email) {
    const existingUser = await getUserByEmail(userData.email)
    if (existingUser && existingUser._id.toString() !== id) {
      throw new Error(`Another user with email ${userData.email} already exists`)
    }
  }

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...userData,
        updatedAt: new Date(),
      },
    },
  )

  return result.modifiedCount > 0
}

/**
 * Elimina un usuario
 * @param id - ID del usuario a eliminar
 * @returns true si se eliminó correctamente, false en caso contrario
 */
export async function deleteUser(id: string) {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid user ID")
  }

  const collection = await getCollection<User>(COLLECTION_NAME)
  const result = await collection.deleteOne({ _id: new ObjectId(id) })

  return result.deletedCount > 0
}

/**
 * Obtiene todos los usuarios
 * @param options - Opciones de filtrado
 * @returns Lista de usuarios
 */
export async function getAllUsers(options = {}) {
  const collection = await getCollection<User>(COLLECTION_NAME)
  return await collection.find(options).toArray()
}

// Alias para getAllUsers para mantener compatibilidad
export const getUsers = getAllUsers

/**
 * Obtiene el número total de usuarios
 * @param filter - Filtro opcional
 * @returns Número total de usuarios
 */
export async function getUsersCount(filter = {}) {
  const collection = await getCollection<User>(COLLECTION_NAME)
  return await collection.countDocuments(filter)
}
