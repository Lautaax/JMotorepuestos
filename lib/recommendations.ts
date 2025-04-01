import { getCollection } from "./mongodb"
import { ObjectId } from "mongodb"
import type { Product } from "./types"
import { formatProduct } from "./products-db"

// Obtener productos recomendados para una moto específica
export async function getRecommendedProductsForMotorcycle(
  brand: string,
  model: string,
  year: number,
  limit = 8,
): Promise<Product[]> {
  const productsCollection = getCollection("products")

  // Buscar productos compatibles con la moto
  const products = await productsCollection
    .find({
      compatibleWith: {
        $elemMatch: {
          brand,
          model,
          year,
        },
      },
      stock: { $gt: 0 },
    })
    .sort({ stock: -1 }) // Priorizar productos con más stock
    .limit(limit)
    .toArray()

  return products.map(formatProduct)
}

// Obtener productos recomendados basados en historial de compras
export async function getRecommendedProductsFromHistory(userId: string, limit = 8): Promise<Product[]> {
  const ordersCollection = getCollection("orders")
  const productsCollection = getCollection("products")

  // Obtener historial de compras del usuario
  const orders = await ordersCollection.find({ userId }).sort({ createdAt: -1 }).toArray()

  if (orders.length === 0) {
    return []
  }

  // Extraer categorías y marcas de productos comprados
  const purchasedItems = orders.flatMap((order) => order.items)
  const purchasedProductIds = purchasedItems.map((item) => item.productId)

  // Obtener detalles de productos comprados
  const purchasedProducts = await productsCollection
    .find({ _id: { $in: purchasedProductIds.map((id) => new ObjectId(id)) } })
    .toArray()

  // Extraer categorías y marcas más frecuentes
  const categories = new Map<string, number>()
  const brands = new Map<string, number>()

  purchasedProducts.forEach((product) => {
    // Contar categorías
    if (product.category) {
      const count = categories.get(product.category) || 0
      categories.set(product.category, count + 1)
    }

    // Contar marcas
    if (product.brand) {
      const count = brands.get(product.brand) || 0
      brands.set(product.brand, count + 1)
    }
  })

  // Ordenar por frecuencia
  const topCategories = [...categories.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((entry) => entry[0])

  const topBrands = [...brands.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((entry) => entry[0])

  // Buscar productos similares que no hayan sido comprados
  const recommendedProducts = await productsCollection
    .find({
      _id: { $nin: purchasedProductIds.map((id) => new ObjectId(id)) },
      $or: [{ category: { $in: topCategories } }, { brand: { $in: topBrands } }],
      stock: { $gt: 0 },
    })
    .sort({ stock: -1 })
    .limit(limit)
    .toArray()

  return recommendedProducts.map(formatProduct)
}

// Obtener productos frecuentemente comprados juntos
export async function getFrequentlyBoughtTogether(productId: string, limit = 4): Promise<Product[]> {
  const ordersCollection = getCollection("orders")
  const productsCollection = getCollection("products")

  // Encontrar órdenes que contienen el producto
  const orders = await ordersCollection
    .find({
      "items.productId": productId,
    })
    .toArray()

  if (orders.length === 0) {
    return []
  }

  // Contar productos que se compraron junto con el producto actual
  const productCounts = new Map<string, number>()

  orders.forEach((order) => {
    const items = order.items.filter((item) => item.productId !== productId)
    items.forEach((item) => {
      const count = productCounts.get(item.productId) || 0
      productCounts.set(item.productId, count + 1)
    })
  })

  // Ordenar por frecuencia
  const topProductIds = [...productCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map((entry) => entry[0])

  if (topProductIds.length === 0) {
    return []
  }

  // Obtener detalles de los productos
  const products = await productsCollection
    .find({
      _id: { $in: topProductIds.map((id) => new ObjectId(id)) },
      stock: { $gt: 0 },
    })
    .toArray()

  return products.map(formatProduct)
}

// Obtener productos populares
export async function getPopularProducts(limit = 8): Promise<Product[]> {
  const ordersCollection = getCollection("orders")
  const productsCollection = getCollection("products")

  // Agregar para encontrar productos más vendidos
  const pipeline = [
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit * 2 }, // Obtener más de los necesarios para filtrar por stock
  ]

  const popularProductsAgg = await ordersCollection.aggregate(pipeline).toArray()

  if (popularProductsAgg.length === 0) {
    // Si no hay datos de ventas, devolver productos con más stock
    const products = await productsCollection
      .find({ stock: { $gt: 0 } })
      .sort({ stock: -1 })
      .limit(limit)
      .toArray()

    return products.map(formatProduct)
  }

  // Obtener detalles de los productos populares
  const popularProductIds = popularProductsAgg.map((item) => item._id)

  const products = await productsCollection
    .find({
      _id: { $in: popularProductIds.map((id) => new ObjectId(id)) },
      stock: { $gt: 0 },
    })
    .limit(limit)
    .toArray()

  return products.map(formatProduct)
}

