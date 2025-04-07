// Este script inicializa la base de datos con datos de prueba
const fs = require("fs")
const path = require("path")
const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

// Función para cargar variables de entorno desde .env.local
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), ".env.local")
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8")
      const envLines = envContent.split("\n")

      envLines.forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
        if (match) {
          const key = match[1]
          let value = match[2] || ""

          // Eliminar comillas si existen
          if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
            value = value.replace(/^"|"$/g, "")
          }

          process.env[key] = value
        }
      })

      console.log("Variables de entorno cargadas desde .env.local")
    } else {
      console.log("Archivo .env.local no encontrado. Usando variables de entorno del sistema.")
    }
  } catch (error) {
    console.error("Error al cargar variables de entorno:", error)
  }
}

// Cargar variables de entorno
loadEnv()

// Función principal para inicializar la base de datos
async function initDb() {
  console.log("Iniciando la inicialización de la base de datos...")

  // Verificar que tenemos las variables de entorno necesarias
  if (!process.env.MONGODB_URI) {
    console.error("Error: La variable de entorno MONGODB_URI no está definida")
    console.log("Por favor, crea un archivo .env.local con la variable MONGODB_URI")
    process.exit(1)
  }

  // Asegurarse de que el nombre de la base de datos esté en minúsculas
  const dbName = (process.env.MONGODB_DB_NAME || "moto-repuestos").toLowerCase()
  console.log(`Usando base de datos: ${dbName}`)

  // Conectar a MongoDB
  const client = new MongoClient(process.env.MONGODB_URI)

  try {
    await client.connect()
    console.log("Conexión a MongoDB establecida")

    const db = client.db(dbName)

    // Inicializar colecciones
    await initializeProducts(db)
    await initializeUsers(db)

    console.log("Base de datos inicializada correctamente")
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    throw error // Re-lanzar el error para que se maneje en el bloque catch exterior
  } finally {
    await client.close()
    console.log("Conexión a MongoDB cerrada")
  }
}

// Inicializar productos
async function initializeProducts(db) {
  const productsCollection = db.collection("products")

  // Verificar si ya hay productos
  const productsCount = await productsCollection.countDocuments()

  if (productsCount === 0) {
    console.log("Insertando productos iniciales...")

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

    console.log("Productos iniciales insertados correctamente")
  } else {
    console.log(`Ya existen ${productsCount} productos en la base de datos`)
  }
}

// Inicializar usuarios
async function initializeUsers(db) {
  const usersCollection = db.collection("users")

  // Verificar si ya hay usuarios
  const usersCount = await usersCollection.countDocuments()

  if (usersCount === 0) {
    console.log("Creando usuario administrador inicial...")

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash("admin123", 10)

    // Crear un usuario administrador inicial
    await usersCollection.insertOne({
      name: "Admin",
      email: "admin@motorepuestos.com",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("Usuario administrador creado correctamente")
  } else {
    console.log(`Ya existen ${usersCount} usuarios en la base de datos`)
  }
}

// Ejecutar la función si este archivo se ejecuta directamente
if (require.main === module) {
  initDb()
    .then(() => {
      console.log("Script de inicialización completado")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Error en el script de inicialización:", error)
      process.exit(1)
    })
}

// Exportar la función para que pueda ser llamada desde otros scripts
module.exports = { initDb }

