import { MongoClient, type Collection, type Document } from "mongodb"

// Obtener las variables de entorno con fallbacks
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const dbName = process.env.MONGODB_DB || process.env.MONGODB_DB_NAME || "moto-parts-store"

// Validar las variables de entorno en tiempo de ejecución
if (!uri) {
  console.error("MONGODB_URI no está definido en las variables de entorno")
}

if (!dbName) {
  console.error("MONGODB_DB o MONGODB_DB_NAME no está definido en las variables de entorno")
}

let cachedClient = null
let cachedDb = null

/**
 * Conecta a la base de datos MongoDB
 * @returns Cliente y base de datos MongoDB
 */
export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    }
  }

  try {
    const client = new MongoClient(uri)
    await client.connect()
    const db = client.db(dbName)

    cachedClient = client
    cachedDb = db

    return {
      client: client,
      db: db,
    }
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error)
    throw new Error("No se pudo conectar a la base de datos")
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
