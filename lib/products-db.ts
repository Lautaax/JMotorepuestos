import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import type { Product } from "./types"
import { invalidateProductCache, invalidateProductsCache } from "./cache"

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
    compatibleWith: product.compatibleWith || [],
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

// Obtener el número total de productos que coinciden con los filtros
export async function getProductsCount(filter: any = {}): Promise<number> {
  const productsCollection = getCollection("products")
  return await productsCollection.countDocuments(filter)
}

// Obtener productos con stock bajo o agotado
export async function getOutOfStockProducts(): Promise<Product[]> {
  const productsCollection = getCollection("products")
  const products = await productsCollection.find({ stock: { $lte: 5 } }).toArray()
  return products.map(formatProduct)
}

// Obtener productos relacionados
export async function getRelatedProducts(category: string, excludeId: string): Promise<Product[]> {
  const productsCollection = getCollection("products")
  const products = await productsCollection
    .find({ category, _id: { $ne: new ObjectId(excludeId) } })
    .limit(4)
    .toArray()
  return products.map(formatProduct)
}

// Obtener un producto por ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const productsCollection = getCollection("products")
    const product = await productsCollection.findOne({ _id: new ObjectId(id) })

    if (!product) return null

    return formatProduct(product)
  } catch (error) {
    console.error("Error al obtener producto por ID:", error)
    return null
  }
}

// Obtener un producto por SKU
export async function getProductBySku(sku: string): Promise<Product | null> {
  const productsCollection = getCollection("products")
  const product = await productsCollection.findOne({ sku })

  if (!product) return null

  return formatProduct(product)
}

// Añadir un nuevo producto
export async function addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  const productsCollection = getCollection("products")

  const productToInsert = {
    ...product,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await productsCollection.insertOne(productToInsert)

  // Invalidate cache
  invalidateProductsCache()

  return {
    id: result.insertedId.toString(),
    ...product,
    createdAt: productToInsert.createdAt.toISOString(),
    updatedAt: productToInsert.updatedAt.toISOString(),
  }
}

// Actualizar un producto existente
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const productsCollection = getCollection("products")

  const updateData = {
    ...updates,
    updatedAt: new Date(),
  }

  await productsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

  const updatedProduct = await productsCollection.findOne({ _id: new ObjectId(id) })

  if (!updatedProduct) {
    throw new Error("Producto no encontrado después de la actualización")
  }

  // Invalidate cache
  invalidateProductCache(id)

  return formatProduct(updatedProduct)
}

// Eliminar un producto
export async function deleteProduct(id: string): Promise<void> {
  const productsCollection = getCollection("products")

  await productsCollection.deleteOne({ _id: new ObjectId(id) })

  // Invalidate cache
  invalidateProductCache(id)
}

// Reducir el stock de un producto
export async function reduceProductStock(productId: string, quantity: number): Promise<boolean> {
  const productsCollection = getCollection("products")

  const result = await productsCollection.updateOne(
    { _id: new ObjectId(productId) },
    { $inc: { stock: -quantity }, $set: { updatedAt: new Date() } },
  )

  // Invalidate cache
  invalidateProductCache(productId)

  return result.modifiedCount === 1
}

// Reducir el stock de múltiples productos
export async function reduceMultipleProductsStock(
  items: { productId: string; quantity: number }[],
): Promise<{ success: boolean; failedProducts: string[] }> {
  const productsCollection = getCollection("products")
  const failedProducts: string[] = []

  for (const item of items) {
    const product = await productsCollection.findOne({ _id: new ObjectId(item.productId) })
    if (!product || product.stock < item.quantity) {
      failedProducts.push(item.productId)
    }
  }

  if (failedProducts.length > 0) {
    return { success: false, failedProducts }
  }

  for (const item of items) {
    await productsCollection.updateOne(
      { _id: new ObjectId(item.productId) },
      { $inc: { stock: -item.quantity }, $set: { updatedAt: new Date() } },
    )

    // Invalidate cache
    invalidateProductCache(item.productId)
  }

  return { success: true, failedProducts: [] }
}

