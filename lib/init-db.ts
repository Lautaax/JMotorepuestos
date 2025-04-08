import { connectToDatabase } from "./mongodb"
import type { ObjectId } from "mongodb"
import type { Category, Product, User } from "./types"

// Datos iniciales para categorías
const initialCategories: Omit<Category, "_id">[] = [
  {
    id: "motor-category",
    name: "Motor",
    description: "Partes y componentes del motor",
    slug: "motor",
    image: "/images/categories/motor.svg",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "frenos-category",
    name: "Frenos",
    description: "Sistema de frenos y componentes",
    slug: "frenos",
    image: "/images/categories/frenos.svg",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "suspension-category",
    name: "Suspensión",
    description: "Componentes de suspensión",
    slug: "suspension",
    image: "/images/categories/suspension.svg",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "electrico-category",
    name: "Eléctrico",
    description: "Sistema eléctrico y componentes",
    slug: "electrico",
    image: "/images/categories/electrico.svg",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "accesorios-category",
    name: "Accesorios",
    description: "Accesorios para motocicletas",
    slug: "accesorios",
    image: "/images/categories/accesorios.svg",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Datos iniciales para productos
const initialProducts: Omit<Product, "_id">[] = [
  {
    id: "kit-pistones-product",
    name: "Kit de Pistones",
    description: "Kit completo de pistones de alta calidad",
    price: 12500,
    stock: 25,
    category: "motor", // Se reemplazará con el ID real
    brand: "MotoTech",
    sku: "MT-KP-001",
    slug: "kit-pistones",
    image: "/images/products/kit-pistones.svg",
    compatibleModels: [
      { brand: "Honda", model: "CBR 250", year: "2018-2023" },
      { brand: "Yamaha", model: "YZF R3", year: "2019-2023" },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "pastillas-freno-product",
    name: "Pastillas de Freno",
    description: "Pastillas de freno de alto rendimiento",
    price: 4500,
    stock: 40,
    category: "frenos", // Se reemplazará con el ID real
    brand: "BrakePro",
    sku: "BP-PF-002",
    slug: "pastillas-freno",
    image: "/images/products/pastillas-freno.svg",
    compatibleModels: [
      { brand: "Honda", model: "CBR 600", year: "2017-2023" },
      { brand: "Kawasaki", model: "Ninja 400", year: "2018-2023" },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "amortiguadores-product",
    name: "Amortiguadores",
    description: "Par de amortiguadores ajustables",
    price: 18900,
    stock: 15,
    category: "suspension", // Se reemplazará con el ID real
    brand: "SuspensionTech",
    sku: "ST-AM-003",
    slug: "amortiguadores",
    image: "/images/products/amortiguadores.svg",
    compatibleModels: [
      { brand: "Yamaha", model: "MT-07", year: "2019-2023" },
      { brand: "Suzuki", model: "GSX-S750", year: "2018-2023" },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "bateria-gel-product",
    name: "Batería de Gel",
    description: "Batería de gel de larga duración",
    price: 8900,
    stock: 30,
    category: "electrico", // Se reemplazará con el ID real
    brand: "PowerMax",
    sku: "PM-BG-004",
    slug: "bateria-gel",
    image: "/images/products/bateria-gel.svg",
    compatibleModels: [
      { brand: "Honda", model: "CB 500F", year: "2019-2023" },
      { brand: "Kawasaki", model: "Z650", year: "2020-2023" },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// Datos iniciales para usuarios
const initialUsers: Omit<User, "_id">[] = [
  {
    id: "admin-user",
    name: "Admin",
    email: "admin@motoparts.com",
    image: null,
    password: "$2a$10$GQH.xZOBjzLKaU5oZnKYz.6P2IrNvnF.FVNYER3XkzCUbVKzzkMbu", // 'admin123'
    role: "admin",
  },
  {
    id: "regular-user",
    name: "Usuario",
    email: "usuario@example.com",
    image: null,
    password: "$2a$10$GQH.xZOBjzLKaU5oZnKYz.6P2IrNvnF.FVNYER3XkzCUbVKzzkMbu", // 'usuario123'
    role: "user",
  },
]

/**
 * Inicializa la base de datos con datos de ejemplo
 */
export async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase()

    // Inicializar categorías
    const categoriesCollection = db.collection("categories")
    const existingCategories = await categoriesCollection.countDocuments()

    if (existingCategories === 0) {
      const result = await categoriesCollection.insertMany(initialCategories)
      console.log(`${result.insertedCount} categorías insertadas`)

      // Obtener IDs de categorías para referenciar en productos
      const categoryMap = new Map<string, ObjectId>()
      const categories = await categoriesCollection.find({}).toArray()

      categories.forEach((category) => {
        categoryMap.set(category.slug, category._id)
      })

      // Inicializar productos con referencias a categorías
      const productsCollection = db.collection("products")
      const existingProducts = await productsCollection.countDocuments()

      if (existingProducts === 0) {
        // Reemplazar strings de categoría con ObjectIds
        const productsWithCategoryIds = initialProducts.map((product) => {
          const categorySlug = product.category as string
          const categoryId = categoryMap.get(categorySlug)

          return {
            ...product,
            category: categoryId,
          }
        })

        const productResult = await productsCollection.insertMany(productsWithCategoryIds)
        console.log(`${productResult.insertedCount} productos insertados`)
      }
    }

    // Inicializar usuarios
    const usersCollection = db.collection("users")
    const existingUsers = await usersCollection.countDocuments()

    if (existingUsers === 0) {
      const userResult = await usersCollection.insertMany(initialUsers)
      console.log(`${userResult.insertedCount} usuarios insertados`)
    }

    return { success: true, message: "Base de datos inicializada correctamente" }
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error)
    return { success: false, message: "Error al inicializar la base de datos", error }
  }
}

// Exportación por defecto para asegurar que TypeScript reconozca este archivo como un módulo
export default initializeDatabase
