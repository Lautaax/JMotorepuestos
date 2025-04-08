"use server"

import { MongoClient, type Collection, type Db, type Document } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB_NAME || process.env.MONGODB_DB

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

if (!dbName) {
  throw new Error("Please define the MONGODB_DB_NAME environment variable inside .env.local")
}

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

/**
 * Conecta a la base de datos MongoDB
 * @returns Cliente y base de datos MongoDB
 */
export async function connectToDatabase() {
  // Si ya tenemos una conexión, la reutilizamos
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    }
  }

  // Crear un nuevo cliente MongoDB
  const client = new MongoClient(uri!)

  // Conectar al servidor
  await client.connect()

  // Obtener la base de datos
  const db = client.db(dbName)

  // Guardar en caché para futuras conexiones
  cachedClient = client
  cachedDb = db

  return {
    client,
    db,
  }
}

/**
 * Asegura que la conexión a la base de datos está establecida
 * @returns La instancia de la base de datos
 */
export async function ensureDbConnected() {
  const { db } = await connectToDatabase()
  return db
}

/**
 * Obtiene una colección de la base de datos
 * @param collectionName - Nombre de la colección
 * @returns La colección solicitada
 */
export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
  const db = await ensureDbConnected()
  return db.collection<T>(collectionName)
}
