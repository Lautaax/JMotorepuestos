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

// Función para inicializar la base de datos con datos iniciales si está vacía
export async function initializeDatabase() {
  // Asegurar que la conexión está lista
  await ensureDbConnected()

  const productsCollection = getCollection("products")
  const usersCollection = getCollection("users")

  // Verificar si ya hay productos
  const productsCount = await productsCollection.countDocuments()

  if (productsCount === 0) {
    // Insertar productos iniciales
    await productsCollection.insertMany([
      {
        name: "Kit de Pistones Premium",
        description:
          "Kit completo de pistones de alta resistencia para motores de 150cc a 250cc. Incluye anillos y pasadores.",
        price: 89.99,
        stock: 15,
        category: "motor",
        brand: "MotorTech",
        sku: "PT-150-250",
        image: "/images/products/kit-pistones.svg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Pastillas de Freno Cerámicas",
        description:
          "Pastillas de freno cerámicas de alto rendimiento con baja generación de polvo y excelente capacidad de frenado.",
        price: 34.5,
        stock: 28,
        category: "frenos",
        brand: "BrakeMaster",
        sku: "BM-PF-C200",
        image: "/images/products/pastillas-freno.svg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Amortiguadores Ajustables",
        description:
          "Par de amortiguadores traseros ajustables en precarga y rebote para una conducción personalizada.",
        price: 129.99,
        stock: 8,
        category: "suspension",
        brand: "RideSoft",
        sku: "RS-AM-ADJ",
        image: "/images/products/amortiguadores.svg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Batería de Gel 12V",
        description: "Batería de gel de 12V con alta capacidad de arranque y larga vida útil. Libre de mantenimiento.",
        price: 75.0,
        stock: 12,
        category: "electrico",
        brand: "PowerCell",
        sku: "PC-BAT-12G",
        image: "/images/products/bateria-gel.svg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Kit de Carburación",
        description: "Kit completo para reconstrucción de carburador, incluye jets, agujas, flotadores y juntas.",
        price: 45.99,
        stock: 20,
        category: "motor",
        brand: "FuelPro",
        sku: "FP-CARB-KIT",
        image: "/placeholder.svg?height=300&width=300&text=Kit+Carburación",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Disco de Freno Flotante",
        description: "Disco de freno flotante de acero inoxidable con diseño ventilado para mejor disipación de calor.",
        price: 89.5,
        stock: 10,
        category: "frenos",
        brand: "BrakeMaster",
        sku: "BM-DF-F300",
        image: "/placeholder.svg?height=300&width=300&text=Disco+Freno",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Horquillas Delanteras",
        description: "Par de horquillas delanteras reforzadas con tratamiento anticorrosión y sellos de alta calidad.",
        price: 199.99,
        stock: 5,
        category: "suspension",
        brand: "RideSoft",
        sku: "RS-HD-PRO",
        image: "/placeholder.svg?height=300&width=300&text=Horquillas",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Regulador de Voltaje",
        description: "Regulador rectificador de voltaje con protección contra sobrecarga y cortocircuito.",
        price: 29.99,
        stock: 18,
        category: "electrico",
        brand: "PowerCell",
        sku: "PC-REG-12V",
        image: "/placeholder.svg?height=300&width=300&text=Regulador",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  }

  // Verificar si ya hay usuarios
  const usersCount = await usersCollection.countDocuments()

  if (usersCount === 0) {
    // Crear un usuario administrador inicial
    await usersCollection.insertOne({
      name: "Admin",
      email: "admin@motorepuestos.com",
      // En producción, esta contraseña debería estar hasheada
      // Esta es solo para la configuración inicial
      password: "$2b$10$GQl8xK9hLH5RQWGOXlZIQOEeIxkFGhB2Hx5/pKzuVZEqFZgXNi.Iy", // "admin123"
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
}

