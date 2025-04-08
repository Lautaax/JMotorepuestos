const { MongoClient } = require("mongodb")

// Obtener variables de entorno
require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME

if (!MONGODB_URI || !MONGODB_DB_NAME) {
  console.error("Error: Variables de entorno MONGODB_URI y MONGODB_DB_NAME son requeridas")
  process.exit(1)
}

// Función para generar un slug a partir de un nombre
function generateSlug(name) {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Reemplaza espacios con guiones
    .replace(/[^\w-]+/g, "") // Elimina caracteres no alfanuméricos
    .replace(/--+/g, "-") // Reemplaza múltiples guiones con uno solo
    .replace(/^-+/, "") // Elimina guiones al inicio
    .replace(/-+$/, "") // Elimina guiones al final
}

async function fixSlugs() {
  let client

  try {
    console.log("Conectando a la base de datos...")
    client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(MONGODB_DB_NAME)

    // Corregir el slug específico para "pastillas de freno cerámicas"
    const result = await db
      .collection("products")
      .updateOne(
        { name: { $regex: /pastillas.*freno.*cer[aá]micas/i } },
        { $set: { slug: "pastillas-freno-ceramicas" } },
      )

    console.log(`Producto actualizado: ${result.matchedCount} encontrado, ${result.modifiedCount} modificado`)

    // Regenerar slugs para productos que no tienen slug
    const products = await db
      .collection("products")
      .find({ slug: { $exists: false } })
      .toArray()

    console.log(`Se encontraron ${products.length} productos sin slug.`)

    let updatedCount = 0

    for (const product of products) {
      if (!product.name) {
        console.log(`Producto con ID ${product._id} no tiene nombre, saltando...`)
        continue
      }

      const slug = generateSlug(product.name)

      // Verificar si el slug ya existe
      const existingProduct = await db.collection("products").findOne({
        slug,
        _id: { $ne: product._id },
      })

      // Si el slug ya existe, añadir un sufijo numérico
      let finalSlug = slug
      let counter = 1

      while (existingProduct) {
        finalSlug = `${slug}-${counter}`
        counter++
        const checkAgain = await db.collection("products").findOne({
          slug: finalSlug,
          _id: { $ne: product._id },
        })
        if (!checkAgain) break
      }

      // Actualizar el producto con el nuevo slug
      await db.collection("products").updateOne({ _id: product._id }, { $set: { slug: finalSlug } })

      console.log(`Actualizado: ${product.name} -> ${finalSlug}`)
      updatedCount++
    }

    console.log(`Proceso completado. Se actualizaron ${updatedCount} productos.`)
  } catch (error) {
    console.error("Error al corregir slugs:", error)
  } finally {
    if (client) {
      await client.close()
    }
    process.exit(0)
  }
}

// Ejecutar la función
fixSlugs()
