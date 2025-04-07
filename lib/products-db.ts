import { ObjectId, type SortDirection } from "mongodb"
import { connectToDatabase } from "./mongodb"
import type { Product } from "./types"

// Función para generar un slug a partir del nombre del producto
export function generateSlug(name: string): string {
  if (!name) return ""

  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Eliminar caracteres especiales
    .replace(/\s+/g, "-") // Reemplazar espacios con guiones
    .replace(/-+/g, "-") // Eliminar guiones duplicados
    .replace(/^-+|-+$/g, "") // Eliminar guiones al inicio y al final
}

// Función para formatear fechas de manera segura
function formatDate(date: any): string | null {
  if (!date) return null

  if (typeof date === "object" && date.toISOString) {
    return date.toISOString()
  }

  return date
}

// Función para serializar un producto
function serializeProduct(product: any): Product {
  if (!product) {
    // Devolver un producto vacío en lugar de null
    return {
      id: "",
      _id: "",
      name: "",
      price: 0,
      stock: 0,
      category: "",
      slug: "",
      createdAt: null,
      updatedAt: null,
    } as Product
  }

  return {
    ...product,
    id: product._id.toString(),
    _id: product._id.toString(),
    slug: product.slug || generateSlug(product.name),
    createdAt: formatDate(product.createdAt),
    updatedAt: formatDate(product.updatedAt),
  }
}

// Función para obtener productos por categoría
export async function getProductsByCategory(categoryName: string) {
  try {
    console.log(`Buscando productos en la categoría: ${categoryName}`)
    const { db } = await connectToDatabase()

    const products = await db.collection("products").find({ category: categoryName }).sort({ createdAt: -1 }).toArray()

    console.log(`Encontrados ${products.length} productos en la categoría ${categoryName}`)

    // Serializar los productos para evitar errores de serialización
    return products.map(serializeProduct)
  } catch (error) {
    console.error(`Error al obtener productos por categoría: ${error}`)
    return []
  }
}

// Función para obtener un producto por ID
export async function getProductById(idOrSlug: string) {
  try {
    console.log(`Buscando producto con ID o slug: ${idOrSlug}`)
    const { db } = await connectToDatabase()

    // Intentar buscar por ID como string primero
    let product = await db.collection("products").findOne({ _id: idOrSlug })

    // Si no se encuentra, intentar buscar por ObjectId
    if (!product) {
      try {
        // Usar ObjectId solo si es un ID válido
        if (ObjectId.isValid(idOrSlug)) {
          product = await db.collection("products").findOne({ _id: new ObjectId(idOrSlug) })
        }
      } catch (error) {
        console.log(`No es un ObjectId válido: ${idOrSlug}`)
      }
    }

    // Si aún no se encuentra, intentar buscar por slug
    if (!product) {
      product = await db.collection("products").findOne({ slug: idOrSlug })
    }

    if (product) {
      console.log(`Producto encontrado: ${product.name}`)
      return serializeProduct(product)
    } else {
      console.log(`Producto con ID o slug ${idOrSlug} no encontrado`)
      return null as unknown as Product // Forzar el tipo para evitar errores
    }
  } catch (error) {
    console.error(`Error al obtener producto por ID o slug: ${error}`)
    return null as unknown as Product // Forzar el tipo para evitar errores
  }
}

// Función para obtener un producto por slug con búsqueda flexible
export async function getProductBySlug(slug: string) {
  try {
    console.log(`Buscando producto con slug: ${slug}`)
    const { db } = await connectToDatabase()

    // Búsqueda exacta primero
    let product = await db.collection("products").findOne({ slug: slug })

    // Si no se encuentra, intentar búsqueda por regex (más flexible)
    if (!product) {
      console.log(`No se encontró producto con slug exacto, intentando búsqueda flexible...`)

      // Crear una expresión regular que sea más permisiva
      const slugRegex = new RegExp(slug.replace(/-/g, "[-]?").replace(/a/g, "[aá]?").replace(/e/g, "[eé]?"), "i")

      product = await db.collection("products").findOne({
        slug: { $regex: slugRegex },
      })

      if (product) {
        console.log(`Producto encontrado con búsqueda flexible: ${product.name} (slug: ${product.slug})`)
      }
    }

    if (product) {
      console.log(`Producto encontrado: ${product.name}`)
      return serializeProduct(product)
    } else {
      console.log(`Producto con slug ${slug} no encontrado`)
      return null as unknown as Product // Forzar el tipo para evitar errores
    }
  } catch (error) {
    console.error(`Error al obtener producto por slug: ${error}`)
    return null as unknown as Product // Forzar el tipo para evitar errores
  }
}

// Función para obtener productos relacionados
export async function getRelatedProducts(productId: string, category: string, limit = 3) {
  try {
    const { db } = await connectToDatabase()

    // Convertir productId a string para comparación segura
    const stringProductId = productId.toString()

    const products = await db
      .collection("products")
      .find({
        category,
        // Usar comparación de strings en lugar de ObjectId
        $expr: { $ne: ["$_id", stringProductId] },
      })
      .sort({ createdAt: -1 as SortDirection })
      .limit(limit)
      .toArray()

    // Serializar los productos para evitar errores de serialización
    return products.map(serializeProduct)
  } catch (error) {
    console.error(`Error al obtener productos relacionados: ${error}`)
    return []
  }
}

// Función para obtener productos con filtros
export async function getProducts(filters: any = {}) {
  try {
    console.log("Filtros recibidos:", filters)
    const { db } = await connectToDatabase()

    const query: any = {}

    // Aplicar filtros si existen
    if (filters.category) {
      query.category = filters.category
    }

    if (filters.brand) {
      query.brand = filters.brand
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {}
      if (filters.minPrice !== undefined) {
        query.price.$gte = Number.parseFloat(filters.minPrice)
      }
      if (filters.maxPrice !== undefined) {
        query.price.$lte = Number.parseFloat(filters.maxPrice)
      }
    }

    // Filtros de compatibilidad de moto
    if (filters.motoMarca || filters.motoBrand) {
      query["compatibility.brand"] = filters.motoMarca || filters.motoBrand
    }

    if (filters.motoModelo || filters.motoModel) {
      query["compatibility.model"] = filters.motoModelo || filters.motoModel
    }

    if (filters.motoAno || filters.motoYear) {
      query["compatibility.year"] = filters.motoAno || filters.motoYear
    }

    // Búsqueda por texto
    if (filters.query) {
      query.$or = [
        { name: { $regex: filters.query, $options: "i" } },
        { description: { $regex: filters.query, $options: "i" } },
        { sku: { $regex: filters.query, $options: "i" } },
      ]
    }

    console.log("Query final:", JSON.stringify(query, null, 2))

    // Definir las opciones de ordenación con el tipo correcto
    let sortOptions: Record<string, SortDirection> = { createdAt: -1 as SortDirection }

    if (filters.sort) {
      switch (filters.sort) {
        case "price-asc":
          sortOptions = { price: 1 as SortDirection }
          break
        case "price-desc":
          sortOptions = { price: -1 as SortDirection }
          break
        case "name-asc":
          sortOptions = { name: 1 as SortDirection }
          break
        case "name-desc":
          sortOptions = { name: -1 as SortDirection }
          break
      }
    }

    const products = await db.collection("products").find(query).sort(sortOptions).toArray()

    console.log(`Encontrados ${products.length} productos con los filtros aplicados`)

    // Serializar los productos para evitar errores de serialización
    return products.map(serializeProduct)
  } catch (error) {
    console.error(`Error al obtener productos: ${error}`)
    return []
  }
}

// Función para crear un nuevo producto
export async function createProduct(productData: Omit<Product, "id" | "_id" | "slug" | "createdAt" | "updatedAt">) {
  try {
    const { db } = await connectToDatabase()

    // Generar slug a partir del nombre
    const slug = generateSlug(productData.name)

    // Verificar si el slug ya existe
    const existingProduct = await db.collection("products").findOne({ slug })

    // Si existe, añadir un sufijo numérico
    let finalSlug = slug
    let counter = 1

    while (existingProduct) {
      finalSlug = `${slug}-${counter}`
      counter++
      const checkAgain = await db.collection("products").findOne({ slug: finalSlug })
      if (!checkAgain) break
    }

    const now = new Date()

    const newProduct = {
      ...productData,
      slug: finalSlug,
      createdAt: now,
      updatedAt: now,
    }

    const result = await db.collection("products").insertOne(newProduct)

    return {
      ...newProduct,
      _id: result.insertedId.toString(),
      id: result.insertedId.toString(),
    }
  } catch (error) {
    console.error(`Error al crear producto: ${error}`)
    throw error
  }
}

// Función para actualizar un producto
export async function updateProduct(id: string, productData: Partial<Product>) {
  try {
    const { db } = await connectToDatabase()

    // Si se actualiza el nombre, actualizar también el slug
    const updateData: any = {
      ...productData,
      updatedAt: new Date(),
    }

    if (productData.name) {
      const slug = generateSlug(productData.name)

      // Verificar si el slug ya existe y no pertenece a este producto
      const existingProduct = await db.collection("products").findOne({
        slug,
        _id: { $ne: ObjectId.isValid(id) ? new ObjectId(id) : id },
      })

      // Si existe, añadir un sufijo numérico
      let finalSlug = slug
      let counter = 1

      while (existingProduct) {
        finalSlug = `${slug}-${counter}`
        counter++
        const checkAgain = await db.collection("products").findOne({
          slug: finalSlug,
          _id: { $ne: ObjectId.isValid(id) ? new ObjectId(id) : id },
        })
        if (!checkAgain) break
      }

      updateData.slug = finalSlug
    }

    let productId: string | ObjectId = id
    if (ObjectId.isValid(id)) {
      productId = new ObjectId(id)
    } else {
      // Si no es un ObjectId válido, buscar por slug
      const product = await db.collection("products").findOne({ slug: id })
      if (product) {
        productId = product._id
      } else {
        throw new Error(`Producto con ID o slug ${id} no encontrado`)
      }
    }

    const result = await db.collection("products").updateOne({ _id: productId }, { $set: updateData })

    if (result.matchedCount === 0) {
      throw new Error(`Producto con ID ${id} no encontrado`)
    }

    const updatedProduct = await db.collection("products").findOne({ _id: productId })

    return serializeProduct(updatedProduct)
  } catch (error) {
    console.error(`Error al actualizar producto: ${error}`)
    throw error
  }
}

// Función para eliminar un producto
export async function deleteProduct(id: string) {
  try {
    const { db } = await connectToDatabase()

    let productId: string | ObjectId = id
    if (ObjectId.isValid(id)) {
      productId = new ObjectId(id)
    } else {
      // Si no es un ObjectId válido, buscar por slug
      const product = await db.collection("products").findOne({ slug: id })
      if (product) {
        productId = product._id
      } else {
        throw new Error(`Producto con ID o slug ${id} no encontrado`)
      }
    }

    const result = await db.collection("products").deleteOne({ _id: productId })

    if (result.deletedCount === 0) {
      throw new Error(`Producto con ID ${id} no encontrado`)
    }

    return { success: true, id }
  } catch (error) {
    console.error(`Error al eliminar producto: ${error}`)
    throw error
  }
}

// Función para reducir el stock de un producto
export async function reduceProductStock(id: string, quantity: number) {
  try {
    const { db } = await connectToDatabase()

    let productId: string | ObjectId = id
    if (ObjectId.isValid(id)) {
      productId = new ObjectId(id)
    } else {
      // Si no es un ObjectId válido, buscar por slug
      const product = await db.collection("products").findOne({ slug: id })
      if (product) {
        productId = product._id
      } else {
        throw new Error(`Producto con ID o slug ${id} no encontrado`)
      }
    }

    const result = await db.collection("products").updateOne(
      { _id: productId, stock: { $gte: quantity } },
      {
        $inc: { stock: -quantity },
        $set: { updatedAt: new Date() },
      },
    )

    if (result.matchedCount === 0) {
      const product = await db.collection("products").findOne({ _id: productId })
      if (!product) {
        throw new Error(`Producto con ID ${id} no encontrado`)
      } else {
        throw new Error(`Stock insuficiente para el producto ${product.name}`)
      }
    }

    const updatedProduct = await db.collection("products").findOne({ _id: productId })

    return serializeProduct(updatedProduct)
  } catch (error) {
    console.error(`Error al reducir stock: ${error}`)
    throw error
  }
}

// Función para obtener productos destacados
export async function getFeaturedProducts(limit = 4) {
  try {
    const { db } = await connectToDatabase()

    const products = await db
      .collection("products")
      .find({ featured: true })
      .sort({ createdAt: -1 as SortDirection })
      .limit(limit)
      .toArray()

    return products.map(serializeProduct)
  } catch (error) {
    console.error(`Error al obtener productos destacados: ${error}`)
    return []
  }
}

// Función para obtener productos nuevos
export async function getNewProducts(limit = 4) {
  try {
    const { db } = await connectToDatabase()

    const products = await db
      .collection("products")
      .find({})
      .sort({ createdAt: -1 as SortDirection })
      .limit(limit)
      .toArray()

    return products.map(serializeProduct)
  } catch (error) {
    console.error(`Error al obtener productos nuevos: ${error}`)
    return []
  }
}

// Función para obtener productos en oferta
export async function getDiscountedProducts(limit = 4) {
  try {
    const { db } = await connectToDatabase()

    const products = await db
      .collection("products")
      .find({ compareAtPrice: { $exists: true, $ne: null, $gt: 0 } })
      .sort({ createdAt: -1 as SortDirection })
      .limit(limit)
      .toArray()

    return products.map(serializeProduct)
  } catch (error) {
    console.error(`Error al obtener productos en oferta: ${error}`)
    return []
  }
}

// Función para buscar productos por texto
export async function searchProducts(query: string, limit = 10) {
  try {
    const { db } = await connectToDatabase()

    const products = await db
      .collection("products")
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { sku: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ createdAt: -1 as SortDirection })
      .limit(limit)
      .toArray()

    return products.map(serializeProduct)
  } catch (error) {
    console.error(`Error al buscar productos: ${error}`)
    return []
  }
}

// Función para generar slugs para todos los productos
export async function generateSlugsForAllProducts() {
  try {
    const { db } = await connectToDatabase()

    const products = await db
      .collection("products")
      .find({ slug: { $exists: false } })
      .toArray()

    console.log(`Encontrados ${products.length} productos sin slug`)

    for (const product of products) {
      if (!product.name) {
        console.log(`Producto con ID ${product._id} no tiene nombre, saltando...`)
        continue
      }

      const baseSlug = generateSlug(product.name)
      let slug = baseSlug
      let counter = 1

      // Verificar si el slug ya existe
      let existingProduct = await db.collection("products").findOne({
        slug,
        _id: { $ne: product._id },
      })

      // Si el slug ya existe, añadir un sufijo numérico
      while (existingProduct) {
        slug = `${baseSlug}-${counter}`
        counter++
        existingProduct = await db.collection("products").findOne({
          slug,
          _id: { $ne: product._id },
        })
      }

      // Actualizar el producto con el nuevo slug
      await db.collection("products").updateOne({ _id: product._id }, { $set: { slug } })

      console.log(`Actualizado: ${product.name} -> ${slug}`)
    }

    return { success: true, count: products.length }
  } catch (error) {
    console.error(`Error al generar slugs: ${error}`)
    throw error
  }
}

