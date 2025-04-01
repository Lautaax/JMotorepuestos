const { MongoClient } = require("mongodb")
const fs = require("fs")
const path = require("path")
const bcrypt = require("bcryptjs")

// Función para cargar variables de entorno desde .env.local
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), ".env.local")
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8")
      const envVars = envContent.split("\n")

      envVars.forEach((line) => {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
          const key = match[1].trim()
          const value = match[2].trim()
          if (!process.env[key]) {
            process.env[key] = value
          }
        }
      })

      console.log("Variables de entorno cargadas correctamente")
    } else {
      console.log("No se encontró el archivo .env.local")
    }
  } catch (error) {
    console.error("Error al cargar variables de entorno:", error)
  }
}

// Cargar variables de entorno
loadEnv()

// Verificar que tenemos la URI de MongoDB
if (!process.env.MONGODB_URI) {
  console.error("Error: La variable de entorno MONGODB_URI no está definida")
  process.exit(1)
}

// Asegurarnos de que el nombre de la base de datos esté en minúsculas
const dbName = (process.env.MONGODB_DB_NAME || "moto-repuestos").toLowerCase()

async function initializeDatabase() {
  let client

  try {
    console.log("Conectando a MongoDB...")
    client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
    console.log("Conexión exitosa a MongoDB")

    const db = client.db(dbName)

    // Inicializar colecciones
    await initializeProducts(db)
    await initializeUsers(db)
    await initializeOrders(db)

    console.log("Base de datos inicializada correctamente")
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
  } finally {
    if (client) {
      await client.close()
      console.log("Conexión a MongoDB cerrada")
    }
  }
}

async function initializeProducts(db) {
  const productsCollection = db.collection("products")

  // Verificar si ya hay productos
  const productsCount = await productsCollection.countDocuments()

  if (productsCount > 0) {
    console.log(`Ya existen ${productsCount} productos en la base de datos. Omitiendo inicialización.`)
    return
  }

  console.log("Inicializando productos...")

  const products = [
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
      description: "Par de amortiguadores traseros ajustables en precarga y rebote para una conducción personalizada.",
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
  ]

  const result = await productsCollection.insertMany(products)
  console.log(`${result.insertedCount} productos insertados correctamente`)
}

async function initializeUsers(db) {
  const usersCollection = db.collection("users")

  // Verificar si ya hay usuarios
  const usersCount = await usersCollection.countDocuments()

  if (usersCount > 0) {
    console.log(`Ya existen ${usersCount} usuarios en la base de datos. Omitiendo inicialización.`)
    return
  }

  console.log("Inicializando usuarios...")

  // Crear un usuario administrador
  const adminPassword = await bcrypt.hash("admin123", 10)

  await usersCollection.insertOne({
    name: "Admin",
    email: "admin@motorepuestos.com",
    password: adminPassword,
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  console.log("Usuario administrador creado correctamente")
}

async function initializeOrders(db) {
  const ordersCollection = db.collection("orders")

  // Verificar si ya hay órdenes
  const ordersCount = await ordersCollection.countDocuments()

  if (ordersCount > 0) {
    console.log(`Ya existen ${ordersCount} órdenes en la base de datos. Omitiendo inicialización.`)
    return
  }

  // No creamos órdenes de ejemplo por ahora
  console.log("No se crearon órdenes de ejemplo")
}

// Ejecutar la inicialización
initializeDatabase()
  .then(() => {
    console.log("Proceso de inicialización completado")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error en el proceso de inicialización:", error)
    process.exit(1)
  })

