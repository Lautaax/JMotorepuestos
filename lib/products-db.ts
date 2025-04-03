import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function getProducts(params: any = {}) {
  const { db } = await connectToDatabase()

  const query: any = {}

  // Filtros básicos
  if (params.category) {
    query.category = params.category
  }

  if (params.brand) {
    query.brand = params.brand
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    query.price = {}
    if (params.minPrice !== undefined) {
      query.price.$gte = params.minPrice
    }
    if (params.maxPrice !== undefined) {
      query.price.$lte = params.maxPrice
    }
  }

  // Filtros de compatibilidad de moto
  if (params.motoMarca || params.motoBrand) {
    const marca = params.motoMarca || params.motoBrand
    query["compatibility.brand"] = marca
  }

  if (params.motoModelo || params.motoModel) {
    const modelo = params.motoModelo || params.motoModel
    query["compatibility.model"] = modelo
  }

  if (params.motoAno || params.motoYear) {
    const ano = params.motoAno || params.motoYear
    query["compatibility.year"] = ano
  }

  // Búsqueda por texto
  if (params.query || params.q) {
    const searchTerm = params.query || params.q
    query.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { sku: { $regex: searchTerm, $options: "i" } },
    ]
  }

  // Ordenamiento
  let sortOptions = {}
  if (params.sort) {
    switch (params.sort) {
      case "price_asc":
        sortOptions = { price: 1 }
        break
      case "price_desc":
        sortOptions = { price: -1 }
        break
      case "newest":
        sortOptions = { createdAt: -1 }
        break
      case "popularity":
        sortOptions = { soldCount: -1 }
        break
      default:
        sortOptions = { createdAt: -1 }
    }
  } else {
    // Ordenamiento por defecto
    sortOptions = { createdAt: -1 }
  }

  try {
    const products = await db.collection("products").find(query).sort(sortOptions).limit(100).toArray()

    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getProductById(id: string) {
  const { db } = await connectToDatabase()

  try {
    const product = await db.collection("products").findOne({ _id: new ObjectId(id) })
    return product
  } catch (error) {
    console.error("Error fetching product by ID:", error)
    return null
  }
}

export async function getProductsByCategory(category: string) {
  const { db } = await connectToDatabase()

  try {
    const products = await db.collection("products").find({ category }).sort({ createdAt: -1 }).limit(20).toArray()

    return products
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

export async function getRelatedProducts(productId: string, category: string) {
  const { db } = await connectToDatabase()

  try {
    const products = await db
      .collection("products")
      .find({
        _id: { $ne: new ObjectId(productId) },
        category,
      })
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray()

    return products
  } catch (error) {
    console.error("Error fetching related products:", error)
    return []
  }
}

export async function getFeaturedProducts() {
  const { db } = await connectToDatabase()

  try {
    const products = await db.collection("products").find({ featured: true }).sort({ createdAt: -1 }).limit(8).toArray()

    return products
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}

export async function getNewArrivals() {
  const { db } = await connectToDatabase()

  try {
    const products = await db.collection("products").find({}).sort({ createdAt: -1 }).limit(8).toArray()

    return products
  } catch (error) {
    console.error("Error fetching new arrivals:", error)
    return []
  }
}

export async function getBestSellers() {
  const { db } = await connectToDatabase()

  try {
    const products = await db.collection("products").find({}).sort({ soldCount: -1 }).limit(8).toArray()

    return products
  } catch (error) {
    console.error("Error fetching best sellers:", error)
    return []
  }
}

