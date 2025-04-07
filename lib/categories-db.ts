import { getCollection, connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"


export interface Category {
  _id?: ObjectId
  id?: string
  name: string
  slug: string
  description: string
  image: string
  subcategories: string[]
  productCount: number
  createdAt: Date
  updatedAt: Date
}

// Función para obtener todas las categorías
export async function getCategories() {
  try {
    const { db } = await connectToDatabase()

    const categories = await db.collection("categories").find({}).sort({ name: 1 }).toArray()

    // Serializar las categorías para evitar errores de serialización
    return categories.map((category) => ({
      ...category,
      _id: category._id.toString(),
      createdAt: category.createdAt ? category.createdAt.toISOString() : null,
      updatedAt: category.updatedAt ? category.updatedAt.toISOString() : null,
    }))
  } catch (error) {
    console.error(`Error al obtener categorías: ${error}`)
    return []
  }
}

// Función para obtener una categoría por su ID
export async function getCategoryById(id: string) {
  try {
    const { db } = await connectToDatabase()

    // Intentar buscar por ID como string primero
    let category = await db.collection("categories").findOne({ _id: id })

    // Si no se encuentra, intentar buscar por ObjectId
    if (!category) {
      try {
        category = await db.collection("categories").findOne({ _id: new ObjectId(id) })
      } catch (error) {
        console.error(`Error al convertir ID a ObjectId: ${error}`)
      }
    }

    if (category) {
      return {
        ...category,
        _id: category._id.toString(),
        createdAt: category.createdAt ? category.createdAt.toISOString() : null,
        updatedAt: category.updatedAt ? category.updatedAt.toISOString() : null,
      }
    } else {
      return null
    }
  } catch (error) {
    console.error(`Error al obtener categoría por ID: ${error}`)
    return null
  }
}

// Función para obtener una categoría por su slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const categoriesCollection = getCollection("categories")
    const category = await categoriesCollection.findOne({ slug })

    if (!category) return null

    return {
      ...category,
      id: category._id.toString(),
      _id: category._id,
    } as Category
  } catch (error) {
    console.error(`Error al obtener categoría con slug ${slug}:`, error)
    return null
  }
}

// Función para crear una nueva categoría
export async function createCategory(
  categoryData: Omit<Category, "_id" | "id" | "createdAt" | "updatedAt">,
): Promise<Category> {
  try {
    const categoriesCollection = getCollection("categories")

    const newCategory = {
      ...categoryData,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await categoriesCollection.insertOne(newCategory)

    return {
      ...newCategory,
      _id: result.insertedId,
      id: result.insertedId.toString(),
    } as Category
  } catch (error) {
    console.error("Error al crear categoría:", error)
    throw error
  }
}

// Función para actualizar una categoría existente
export async function updateCategory(
  id: string,
  categoryData: Partial<Omit<Category, "_id" | "id" | "createdAt" | "updatedAt">>,
): Promise<Category | null> {
  try {
    const categoriesCollection = getCollection("categories")

    const updatedCategory = {
      ...categoryData,
      updatedAt: new Date(),
    }

    await categoriesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedCategory })

    return await getCategoryById(id)
  } catch (error) {
    console.error(`Error al actualizar categoría con ID ${id}:`, error)
    throw error
  }
}

// Función para eliminar una categoría
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const categoriesCollection = getCollection("categories")
    await categoriesCollection.deleteOne({ _id: new ObjectId(id) })
    return true
  } catch (error) {
    console.error(`Error al eliminar categoría con ID ${id}:`, error)
    throw error
  }
}

// Función para incrementar el contador de productos de una categoría
export async function incrementCategoryProductCount(categorySlug: string): Promise<boolean> {
  try {
    const categoriesCollection = getCollection("categories")
    await categoriesCollection.updateOne({ slug: categorySlug }, { $inc: { productCount: 1 } })
    return true
  } catch (error) {
    console.error(`Error al incrementar contador de productos para categoría ${categorySlug}:`, error)
    return false
  }
}

// Función para decrementar el contador de productos de una categoría
export async function decrementCategoryProductCount(categorySlug: string): Promise<boolean> {
  try {
    const categoriesCollection = getCollection("categories")
    await categoriesCollection.updateOne({ slug: categorySlug }, { $inc: { productCount: -1 } })
    return true
  } catch (error) {
    console.error(`Error al decrementar contador de productos para categoría ${categorySlug}:`, error)
    return false
  }
}

// Función para inicializar categorías por defecto si no existen
export async function initializeDefaultCategories(): Promise<void> {
  try {
    const categoriesCollection = getCollection("categories")
    const count = await categoriesCollection.countDocuments()

    if (count > 0) {
      console.log(`Ya existen ${count} categorías en la base de datos`)
      return
    }

    console.log("Inicializando categorías por defecto...")

    const defaultCategories = [
      {
        name: "Motor",
        slug: "motor",
        description: "Repuestos y componentes para el motor de tu motocicleta",
        image: "/images/categories/motor.svg",
        subcategories: ["Pistones", "Cilindros", "Juntas", "Válvulas"],
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Frenos",
        slug: "frenos",
        description: "Sistema de frenos y componentes relacionados",
        image: "/images/categories/frenos.svg",
        subcategories: ["Pastillas", "Discos", "Bombas", "Cables"],
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Suspensión",
        slug: "suspension",
        description: "Componentes de suspensión para una conducción suave",
        image: "/images/categories/suspension.svg",
        subcategories: ["Amortiguadores", "Horquillas", "Resortes", "Bujes"],
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Eléctrico",
        slug: "electrico",
        description: "Componentes eléctricos y electrónicos para tu moto",
        image: "/images/categories/electrico.svg",
        subcategories: ["Baterías", "Luces", "CDI", "Bobinas"],
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Accesorios",
        slug: "accesorios",
        description: "Accesorios y complementos para personalizar tu moto",
        image: "/images/categories/accesorios.svg",
        subcategories: ["Espejos", "Puños", "Manillares", "Protectores"],
        productCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    await categoriesCollection.insertMany(defaultCategories)
    console.log("Categorías por defecto inicializadas correctamente")
  } catch (error) {
    console.error("Error al inicializar categorías por defecto:", error)
  }
}

