import { MongoClient, type Db } from "mongodb"

// Verificar que la variable de entorno MONGODB_URI esté definida
if (!process.env.MONGODB_URI) {
  throw new Error("Por favor, define la variable de entorno MONGODB_URI")
}

// Asegurarnos de que el nombre de la base de datos esté en minúsculas
const dbName = (process.env.MONGODB_DB_NAME || "moto-repuestos").toLowerCase()

const uri = process.env.MONGODB_URI
const options = {}

// Declarar variables para el cliente y la promesa
let client: MongoClient
let clientPromise: Promise<MongoClient>
let db: Db

// Crear una instancia del cliente MongoDB
client = new MongoClient(uri, options)
clientPromise = client.connect()

// Inicializar la base de datos
clientPromise
  .then((connectedClient) => {
    console.log("MongoDB conectado exitosamente")
    db = connectedClient.db(dbName)
  })
  .catch((error) => {
    console.error("Error al conectar a MongoDB:", error)
  })

// Función para obtener una colección
export function getCollection(collectionName: string) {
  // Si db no está inicializada, inicializarla
  if (!db) {
    db = client.db(dbName)
  }
  return db.collection(collectionName)
}

// Función para asegurar que la conexión está lista
export async function ensureDbConnected() {
  if (!db) {
    await clientPromise
    db = client.db(dbName)
  }
  return db
}

// Exportar clientPromise para usar en otros archivos
export { clientPromise, db }

// Función para conectar a la base de datos
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (!clientPromise) {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }

  const connectedClient = await clientPromise
  const db = connectedClient.db(dbName)
  return { client: connectedClient, db }
}

