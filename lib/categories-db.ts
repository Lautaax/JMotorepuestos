import { ObjectId } from "mongodb"
import { connectToDatabase } from "./mongodb"
import type { Category } from "./types"

// Actualizar la interfaz Category para incluir parentId
declare module "./types" {
  interface Category {
    parentId?: string | null
  }
}

// Función para obtener todas las categorías
export async function getCategories(): Promise<Category[]> {
  try {
    const { db } = await connectToDatabase()
    const categories = await db.collection("categories").find({}).toArray()

    return categories.map((cat: any) => ({
      id: cat._id.toString(),
      _id: cat._id.toString(),
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      image: cat.image || "",
      parentId: cat.parentId || null,
      createdAt: cat.createdAt || new Date(),
      updatedAt: cat.updatedAt || new Date(),
    }))
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return []
  }
}

// Función para obtener una categoría por ID
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { db } = await connectToDatabase()

    // Convertir string a ObjectId si es posible, o usar el string directamente
    let query = {}
    try {
      query = { _id: new ObjectId(id) }
    } catch (e) {
      query = { _id: id }
    }

    const category = await db.collection("categories").findOne(query)

    if (!category) return null

    return {
      id: category._id.toString(),
      _id: category._id.toString(),
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image: category.image || "",
      parentId: category.parentId || null,
      createdAt: category.createdAt || new Date(),
      updatedAt: category.updatedAt || new Date(),
    }
  } catch (error) {
    console.error("Error al obtener categoría por ID:", error)
    return null
  }
}

// Función para obtener una categoría por slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { db } = await connectToDatabase()
    const category = await db.collection("categories").findOne({ slug })

    if (!category) return null

    return {
      id: category._id.toString(),
      _id: category._id.toString(),
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      image: category.image || "",
      parentId: category.parentId || null,
      createdAt: category.createdAt || new Date(),
      updatedAt: category.updatedAt || new Date(),
    }
  } catch (error) {
    console.error("Error al obtener categoría por slug:", error)
    return null
  }
}

// Función para actualizar una categoría por ID
export async function updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
  try {
    const { db } = await connectToDatabase()

    // Convertir string a ObjectId si es posible, o usar el string directamente
    let query = {}
    try {
      query = { _id: new ObjectId(id) }
    } catch (e) {
      query = { _id: id }
    }

    const updatedAt = new Date()

    const result = await db
      .collection("categories")
      .findOneAndUpdate(query, { $set: { ...data, updatedAt } }, { returnDocument: "after" })

    if (!result || !result.value) return null

    const updatedCategory = result.value

    return {
      id: updatedCategory._id.toString(),
      _id: updatedCategory._id.toString(),
      name: updatedCategory.name || "",
      slug: updatedCategory.slug || "",
      description: updatedCategory.description || "",
      image: updatedCategory.image || "",
      parentId: updatedCategory.parentId || null,
      createdAt: updatedCategory.createdAt || new Date(),
      updatedAt: updatedCategory.updatedAt || new Date(),
    }
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    return null
  }
}

// Función para eliminar una categoría por ID
export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()

    // Convertir string a ObjectId si es posible, o usar el string directamente
    let query = {}
    try {
      query = { _id: new ObjectId(id) }
    } catch (e) {
      query = { _id: id }
    }

    const result = await db.collection("categories").deleteOne(query)

    return result.deletedCount > 0
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    return false
  }
}

// Función para obtener categorías relacionadas
export async function getRelatedCategories(categoryId: string): Promise<Category[]> {
  try {
    const category = await getCategoryById(categoryId)
    if (!category) return []

    const { db } = await connectToDatabase()
    const relatedCats: Category[] = []

    // Si la categoría tiene un padre, obtener categorías hermanas
    if (category.parentId) {
      const siblings = await db
        .collection("categories")
        .find({
          parentId: category.parentId,
          _id: { $ne: new ObjectId(categoryId) },
        })
        .toArray()

      relatedCats.push(
        ...siblings.map((cat: any) => ({
          id: cat._id.toString(),
          _id: cat._id.toString(),
          name: cat.name || "",
          slug: cat.slug || "",
          description: cat.description || "",
          image: cat.image || "",
          parentId: cat.parentId || null,
          createdAt: cat.createdAt || new Date(),
          updatedAt: cat.updatedAt || new Date(),
        })),
      )
    }

    // Obtener categorías hijas
    const children = await db
      .collection("categories")
      .find({
        parentId: categoryId,
      })
      .toArray()

    relatedCats.push(
      ...children.map((cat: any) => ({
        id: cat._id.toString(),
        _id: cat._id.toString(),
        name: cat.name || "",
        slug: cat.slug || "",
        description: cat.description || "",
        image: cat.image || "",
        parentId: cat.parentId || null,
        createdAt: cat.createdAt || new Date(),
        updatedAt: cat.updatedAt || new Date(),
      })),
    )

    return relatedCats
  } catch (error) {
    console.error("Error en getRelatedCategories:", error)
    return []
  }
}
