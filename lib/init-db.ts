import { getCollection } from "./mongodb"
import bcrypt from "bcryptjs"

export async function initializeDatabase() {
  console.log("Inicializando base de datos...")

  // Inicializar colección de productos
  await initializeProducts()

  // Inicializar colección de usuarios
  await initializeUsers()

  console.log("Base de datos inicializada correctamente")
}

async function initializeProducts() {
  const productsCollection = getCollection("products")

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

async function initializeUsers() {
  const usersCollection = getCollection("users")

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

