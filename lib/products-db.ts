import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import type { Product } from "./types"

// Función para convertir _id de MongoDB a id string
function formatProduct(product: any): Product {
  return {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    brand: product.brand,
    sku: product.sku,
    image: product.image,
    compatibleModels: product.compatibleModels,
    createdAt: product.createdAt?.toISOString(),
    updatedAt: product.updatedAt?.toISOString(),
  }
}

// Función para convertir id string a _id de MongoDB
function prepareProductForDb(product: Partial<Product>) {
  const { id, ...rest } = product
  return rest
}

interface GetProductsOptions {
  category?: string
  sort?: string
  query?: string
  limit?: number
  skip?: number
}

// Obtener productos con filtros y paginación
export async function getProducts(options: GetProductsOptions): Promise<Product[]> {
  const productsCollection = getCollection("products")

  // Construir el filtro
  const filter: any = {}

  if (options.category) {
    filter.category = options.category
  }

  if (options.query) {
    filter.$or = [
      { name: { $regex: options.query, $options: "i" } },
      { description: { $regex: options.query, $options: "i" } },
      { brand: { $regex: options.query, $options: "i" } },
      { sku: { $regex: options.query, $options: "i" } },
    ]
  }

  // Construir las opciones de ordenación
  const sortOptions: any = {}

  if (options.sort) {
    switch (options.sort) {
      case "price-asc":
        sortOptions.price = 1
        break
      case "price-desc":
        sortOptions.price = -1
        break
      case "newest":
        sortOptions.createdAt = -1
        break
      default:
        // 'featured' o cualquier otro valor - sin ordenación específica
        sortOptions.createdAt = -1
        break
    }
  } else {
    // Por defecto, ordenar por fecha de creación descendente
    sortOptions.createdAt = -1
  }

  // Ejecutar la consulta
  const products = await productsCollection
    .find(filter)
    .sort(sortOptions)
    .skip(options.skip || 0)
    .limit(options.limit || 100)
    .toArray()

  // Formatear los productos
  return products.map(formatProduct)
}

// Obtener productos destacados
export async function getFeaturedProducts(): Promise<Product[]> {
  const productsCollection = getCollection("products")

  // En una aplicación real, podrías tener un campo 'featured' en los productos
  // Aquí simplemente obtenemos los productos más recientes
  const products = await productsCollection.find({}).sort({ createdAt: -1 }).limit(4).toArray()

  return products.map(formatProduct)
}

// Obtener un producto por ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    // Verificar si el ID es válido para MongoDB
    if (!ObjectId.isValid(id)) {
      console.error(`ID inválido: ${id}`)
      return null
    }

    const productsCollection = getCollection("products")
    const product = await productsCollection.findOne({ _id: new ObjectId(id) })

    if (!product) return null

    return formatProduct(product)
  } catch (error) {
    console.error("Error al obtener producto por ID:", error)
    return null
  }
}

// Obtener productos relacionados
export async function getRelatedProducts(category?: string, excludeId?: string): Promise<Product[]> {
  const productsCollection = getCollection("products")

  const filter: any = {}

  if (category) {
    filter.category = category
  }

  if (excludeId && ObjectId.isValid(excludeId)) {
    filter._id = { $ne: new ObjectId(excludeId) }
  }

  const products = await productsCollection.find(filter).limit(4).toArray()

  return products.map(formatProduct)
}

// Añadir un nuevo producto
export async function addProduct(product: Omit<Product, "id">): Promise<Product> {
  const productsCollection = getCollection("products")

  const productToInsert = {
    ...prepareProductForDb(product),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await productsCollection.insertOne(productToInsert)

  return {
    id: result.insertedId.toString(),
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Actualizar un producto existente
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const productsCollection = getCollection("products")

  const productToUpdate = {
    ...prepareProductForDb(updates),
    updatedAt: new Date(),
  }

  await productsCollection.updateOne({ _id: new ObjectId(id) }, { $set: productToUpdate })

  const updatedProduct = await productsCollection.findOne({ _id: new ObjectId(id) })

  if (!updatedProduct) {
    throw new Error("Producto no encontrado después de la actualización")
  }

  return formatProduct(updatedProduct)
}

// Eliminar un producto
export async function deleteProduct(id: string): Promise<void> {
  const productsCollection = getCollection("products")

  await productsCollection.deleteOne({ _id: new ObjectId(id) })
}

// Actualizar el stock de un producto
export async function updateProductStock(id: string, newStock: number): Promise<void> {
  const productsCollection = getCollection("products")

  await productsCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        stock: newStock,
        updatedAt: new Date(),
      },
    },
  )
}

// Obtener el conteo total de productos
export async function getProductsCount(filter: any = {}): Promise<number> {
  const productsCollection = getCollection("products")

  return await productsCollection.countDocuments(filter)
}

// Obtener productos sin stock
export async function getOutOfStockProducts(): Promise<Product[]> {
  const productsCollection = getCollection("products")

  const products = await productsCollection.find({ stock: { $lte: 0 } }).toArray()

  return products.map(formatProduct)
}

// Buscar productos por SKU exacto
export async function getProductBySku(sku: string): Promise<Product | null> {
  const productsCollection = getCollection("products")

  const product = await productsCollection.findOne({ sku })

  if (!product) return null

  return formatProduct(product)
}

// Reducir el stock de un producto
export async function reduceProductStock(id: string, quantity: number): Promise<boolean> {
  if (!ObjectId.isValid(id)) {
    console.error(`ID inválido para reducir stock: ${id}`)
    return false
  }

  const productsCollection = getCollection("products")

  // Primero verificamos que haya suficiente stock
  const product = await productsCollection.findOne({ _id: new ObjectId(id) })

  if (!product || product.stock < quantity) {
    return false
  }

  // Actualizamos el stock
  await productsCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $inc: { stock: -quantity },
      $set: { updatedAt: new Date() },
    },
  )

  return true
}

// Reducir el stock de múltiples productos (para pedidos con varios productos)
export async function reduceMultipleProductsStock(
  items: { productId: string; quantity: number }[],
): Promise<{ success: boolean; failedProducts: string[] }> {
  const failedProducts: string[] = []

  // Verificamos primero que todos los productos tengan suficiente stock
  for (const item of items) {
    const product = await getProductById(item.productId)
    if (!product || product.stock < item.quantity) {
      failedProducts.push(item.productId)
    }
  }

  // Si algún producto no tiene suficiente stock, no actualizamos ninguno
  if (failedProducts.length > 0) {
    return { success: false, failedProducts }
  }

  // Si todos tienen suficiente stock, actualizamos todos
  for (const item of items) {
    await reduceProductStock(item.productId, item.quantity)
  }

  return { success: true, failedProducts: [] }
}

