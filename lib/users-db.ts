import { ObjectId } from "mongodb"
import { getCollection, ensureDbConnected } from "./mongodb"
import type { User } from "./types"
import bcrypt from "bcryptjs"

// Función para convertir _id de MongoDB a id string
function formatUser(user: any): User {
  const { password, ...userWithoutPassword } = user

  return {
    id: user._id.toString(),
    ...userWithoutPassword,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  }
}

// Obtener todos los usuarios
export async function getUsers(): Promise<User[]> {
  await ensureDbConnected()
  const usersCollection = getCollection("users")

  const users = await usersCollection.find({}).toArray()

  return users.map(formatUser)
}

// Obtener un usuario por ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    await ensureDbConnected()
    const usersCollection = getCollection("users")

    const user = await usersCollection.findOne({ _id: new ObjectId(id) })

    if (!user) return null

    return formatUser(user)
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error)
    return null
  }
}

// Obtener un usuario por email
export async function getUserByEmail(email: string): Promise<(User & { password?: string }) | null> {
  await ensureDbConnected()
  const usersCollection = getCollection("users")

  const user = await usersCollection.findOne({ email })

  if (!user) return null

  // Aquí devolvemos el password para poder verificarlo en el login
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    password: user.password,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  }
}

// Añadir un nuevo usuario
export async function addUser(user: Omit<User, "id"> & { password: string }): Promise<User> {
  try {
    await ensureDbConnected()
    const usersCollection = getCollection("users")

    // Verificar si el email ya existe
    const existingUser = await usersCollection.findOne({ email: user.email })
    if (existingUser) {
      throw new Error("El email ya está registrado")
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(user.password, 10)

    const userToInsert = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: hashedPassword,
      role: user.role || "customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(userToInsert)

    return {
      id: result.insertedId.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role || "customer",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error al crear usuario:", error)

    // Re-lanzar el error para que pueda ser manejado por el controlador
    throw error
  }
}

// Actualizar un usuario existente
export async function updateUser(id: string, updates: Partial<User> & { password?: string }): Promise<User> {
  await ensureDbConnected()
  const usersCollection = getCollection("users")

  const updateData: any = {
    ...updates,
    updatedAt: new Date(),
  }

  // Si se proporciona una nueva contraseña, hashearla
  if (updates.password) {
    updateData.password = await bcrypt.hash(updates.password, 10)
  }

  // Eliminar el id si está presente en las actualizaciones
  delete updateData.id

  await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

  const updatedUser = await usersCollection.findOne({ _id: new ObjectId(id) })

  if (!updatedUser) {
    throw new Error("Usuario no encontrado después de la actualización")
  }

  return formatUser(updatedUser)
}

// Eliminar un usuario
export async function deleteUser(id: string): Promise<void> {
  await ensureDbConnected()
  const usersCollection = getCollection("users")

  await usersCollection.deleteOne({ _id: new ObjectId(id) })
}

// Verificar credenciales de usuario
export async function verifyUserCredentials(email: string, password: string): Promise<User | null> {
  try {
    await ensureDbConnected()
    const user = await getUserByEmail(email)

    if (!user || !user.password) return null

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) return null

    // No devolver la contraseña
    const { password: _, ...userWithoutPassword } = user

    return userWithoutPassword
  } catch (error) {
    console.error("Error al verificar credenciales:", error)
    return null
  }
}

// Obtener el conteo total de usuarios
export async function getUsersCount(): Promise<number> {
  await ensureDbConnected()
  const usersCollection = getCollection("users")

  return await usersCollection.countDocuments()
}

// Obtener usuarios recientes
export async function getRecentUsers(limit = 5): Promise<User[]> {
  await ensureDbConnected()
  const usersCollection = getCollection("users")

  const users = await usersCollection.find({}).sort({ createdAt: -1 }).limit(limit).toArray()

  return users.map(formatUser)
}

