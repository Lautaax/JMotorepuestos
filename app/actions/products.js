"use server"

import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"
import { revalidatePath } from "next/cache"

// Obtener un producto por SKU
export async function getProductBySku(sku) {
  const { db } = await connectToDatabase()
  return await db.collection("products").findOne({ sku })
}

// Obtener un producto por slug
export async function getProductBySlug(slug) {
  const { db } = await connectToDatabase()
  return await db.collection("products").findOne({ slug })
}

// Añadir un nuevo producto
export async function addProduct(productData) {
  const { db } = await connectToDatabase()

  // Verificar si ya existe un producto con el mismo SKU
  const existingProduct = await getProductBySku(productData.sku)
  if (existingProduct) {
    throw new Error(`Product with SKU ${productData.sku} already exists`)
  }

  const result = await db.collection("products").insertOne({
    ...productData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Revalidar rutas relacionadas
  revalidatePath("/products")
  revalidatePath("/admin/products")

  return {
    _id: result.insertedId,
    ...productData,
  }
}

// Reducir el stock de un producto
export async function reduceProductStock(productId, quantity) {
  const { db } = await connectToDatabase()

  if (!ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID")
  }

  const product = await db.collection("products").findOne({ _id: new ObjectId(productId) })

  if (!product) {
    throw new Error(`Product with ID ${productId} not found`)
  }

  if (product.stock < quantity) {
    throw new Error(`Insufficient stock for product ${product.name}`)
  }

  const result = await db.collection("products").updateOne(
    { _id: new ObjectId(productId) },
    {
      $inc: { stock: -quantity },
      $set: { updatedAt: new Date() },
    },
  )

  return result.modifiedCount > 0
}

// Reducir el stock de múltiples productos
export async function reduceMultipleProductsStock(items) {
  const results = []

  for (const item of items) {
    try {
      const result = await reduceProductStock(item.productId, item.quantity)
      results.push({ productId: item.productId, success: result })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      results.push({ productId: item.productId, success: false, error: errorMessage })
    }
  }

  return results
}

// Actualizar un producto
export async function updateProduct(id, productData) {
  const { db } = await connectToDatabase()

  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid product ID")
  }

  // Si se está actualizando el SKU, verificar que no exista otro producto con ese SKU
  if (productData.sku) {
    const existingProduct = await getProductBySku(productData.sku)
    if (existingProduct && existingProduct._id.toString() !== id) {
      throw new Error(`Another product with SKU ${productData.sku} already exists`)
    }
  }

  const result = await db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...productData,
        updatedAt: new Date(),
      },
    },
  )

  // Revalidar rutas relacionadas
  revalidatePath("/products")
  revalidatePath("/admin/products")
  revalidatePath(`/products/${id}`)

  return result.modifiedCount > 0
}

// Eliminar un producto
export async function deleteProduct(id) {
  const { db } = await connectToDatabase()

  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid product ID")
  }

  const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) })

  // Revalidar rutas relacionadas
  revalidatePath("/products")
  revalidatePath("/admin/products")

  return result.deletedCount > 0
}

// Obtener todos los productos
export async function getAllProducts(options = {}) {
  const { db } = await connectToDatabase()
  return await db.collection("products").find(options).toArray()
}

// Alias para getAllProducts
export async function getProducts(options = {}) {
  return await getAllProducts(options)
}

// Obtener un producto por ID
export async function getProductById(id) {
  const { db } = await connectToDatabase()

  if (!ObjectId.isValid(id)) {
    return null
  }

  return await db.collection("products").findOne({ _id: new ObjectId(id) })
}

// Obtener productos por categoría
export async function getProductsByCategory(categoryId) {
  const { db } = await connectToDatabase()
  return await db.collection("products").find({ categoryId }).toArray()
}

// Obtener productos relacionados
export async function getRelatedProducts(productId, categoryId, limit = 4) {
  const { db } = await connectToDatabase()

  // Excluir el producto actual y obtener productos de la misma categoría
  return await db
    .collection("products")
    .find({
      _id: { $ne: new ObjectId(productId) },
      categoryId: categoryId,
    })
    .limit(limit)
    .toArray()
}

// Obtener categorías
export async function getCategories() {
  const { db } = await connectToDatabase()
  return await db.collection("categories").find().toArray()
}

// Buscar productos
export async function searchProducts(query) {
  const { db } = await connectToDatabase()

  return await db
    .collection("products")
    .find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { sku: { $regex: query, $options: "i" } },
      ],
    })
    .toArray()
}

// Obtener productos destacados
export async function getFeaturedProducts(limit = 6) {
  const { db } = await connectToDatabase()

  return await db.collection("products").find({ featured: true }).limit(limit).toArray()
}
