const { MongoClient } = require("mongodb")
require("dotenv").config()

// Obtener variables de entorno o usar valores predeterminados
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "delsur"
const COLLECTION_NAME = "products" // Nombre de la colección

console.log("Configuración:")
console.log(`URI: ${MONGODB_URI}`)
console.log(`Base de datos: ${MONGODB_DB_NAME}`)
console.log(`Colección: ${COLLECTION_NAME}`)

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
    const productsCollection = db.collection(COLLECTION_NAME)

    // Listar todas las colecciones para verificar
    const collections = await db.listCollections().toArray()
    console.log("Colecciones disponibles:")
    collections.forEach((collection) => {
      console.log(` - ${collection.name}`)
    })

    // Obtener todos los productos
    console.log(`\nBuscando productos en ${MONGODB_DB_NAME}.${COLLECTION_NAME}...`)
    const products = await productsCollection.find({}).toArray()

    console.log(`Se encontraron ${products.length} productos en total.`)

    if (products.length === 0) {
      console.log("\nNo se encontraron productos. Verificando otras colecciones...")

      // Buscar en todas las colecciones para encontrar productos
      for (const collection of collections) {
        if (collection.name !== COLLECTION_NAME) {
          const otherCollection = db.collection(collection.name)
          const sampleDocs = await otherCollection.find({}).limit(5).toArray()

          if (sampleDocs.length > 0) {
            console.log(`\nEncontrados ${sampleDocs.length} documentos en la colección ${collection.name}`)
            console.log("Muestra del primer documento:")
            console.log(JSON.stringify(sampleDocs[0], null, 2))

            // Verificar si parece ser una colección de productos
            if (sampleDocs[0].name || sampleDocs[0].price) {
              console.log(`\n¡ATENCIÓN! La colección ${collection.name} parece contener productos.`)
              console.log(`Intenta ejecutar el script con esta colección:`)
              console.log(`COLLECTION_NAME=${collection.name} node scripts/regenerate-all-slugs-fixed.js`)
            }
          }
        }
      }

      console.log("\nSugerencias para solucionar el problema:")
      console.log("1. Verifica que las variables de entorno MONGODB_URI y MONGODB_DB_NAME sean correctas")
      console.log("2. Asegúrate de que la colección 'products' existe y contiene documentos")
      console.log("3. Si tus productos están en otra colección, especifícala en el script")

      return
    }

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
