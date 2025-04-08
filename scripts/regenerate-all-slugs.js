const { MongoClient } = require("mongodb")
require("dotenv").config()

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME

if (!MONGODB_URI || !MONGODB_DB_NAME) {
  console.error("Error: Variables de entorno MONGODB_URI y MONGODB_DB_NAME son requeridas")
  process.exit(1)
}

// Función para generar un slug a partir de un nombre
function generateSlug(name) {
  if (!name) return ""

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

async function regenerateAllSlugs() {
  let client

  try {
    console.log("Conectando a la base de datos...")
    client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(MONGODB_DB_NAME)
    const productsCollection = db.collection("products")

    // Obtener todos los productos
    console.log("Obteniendo todos los productos...")
    const products = await productsCollection.find({}).toArray()

    console.log(`Se encontraron ${products.length} productos en total.`)

    let updatedCount = 0
    let skippedCount = 0

    // Procesar cada producto
    for (const product of products) {
      if (!product.name) {
        console.log(`Producto con ID ${product._id} no tiene nombre, saltando...`)
        skippedCount++
        continue
      }

      // Generar el slug base a partir del nombre
      const baseSlug = generateSlug(product.name)

      // Inicializar con el slug base
      let slug = baseSlug
      let counter = 1

      // Verificar si este slug ya existe en otro producto
      let existingProduct = await productsCollection.findOne({
        slug: slug,
        _id: { $ne: product._id },
      })

      // Si el slug ya existe en otro producto, añadir un sufijo numérico
      while (existingProduct) {
        slug = `${baseSlug}-${counter}`
        counter++
        existingProduct = await productsCollection.findOne({
          slug: slug,
          _id: { $ne: product._id },
        })
      }

      // Actualizar el producto con el nuevo slug
      await productsCollection.updateOne({ _id: product._id }, { $set: { slug: slug } })

      // Mostrar el cambio
      const oldSlug = product.slug || "(ninguno)"
      if (oldSlug !== slug) {
        console.log(`Actualizado: ${product.name}`)
        console.log(`  Slug anterior: ${oldSlug}`)
        console.log(`  Nuevo slug: ${slug}`)
        updatedCount++
      } else {
        console.log(`Sin cambios: ${product.name} (slug: ${slug})`)
      }
    }

    console.log("\nResumen:")
    console.log(`Total de productos: ${products.length}`)
    console.log(`Productos actualizados: ${updatedCount}`)
    console.log(`Productos sin cambios: ${products.length - updatedCount - skippedCount}`)
    console.log(`Productos saltados (sin nombre): ${skippedCount}`)
  } catch (error) {
    console.error("Error al regenerar slugs:", error)
  } finally {
    if (client) {
      await client.close()
      console.log("Conexión a MongoDB cerrada.")
    }
    process.exit(0)
  }
}

// Ejecutar la función
regenerateAllSlugs()
