const { MongoClient } = require("mongodb")
require("dotenv").config()

// Configuración directa - modifica estos valores según tu configuración
const MONGODB_URI = "mongodb://localhost:27017"
const DB_NAME = "delsur" // Cambia esto al nombre de tu base de datos
const COLLECTION_NAME = "products" // Cambia esto al nombre de tu colección

async function directQuery() {
  console.log("=== CONSULTA DIRECTA A MONGODB ===\n")
  console.log(`URI: ${MONGODB_URI}`)
  console.log(`Base de datos: ${DB_NAME}`)
  console.log(`Colección: ${COLLECTION_NAME}`)

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Conexión exitosa")

    const db = client.db(DB_NAME)

    // Verificar si la colección existe
    const collections = await db.listCollections({ name: COLLECTION_NAME }).toArray()

    if (collections.length === 0) {
      console.log(`\n❌ La colección '${COLLECTION_NAME}' no existe en la base de datos '${DB_NAME}'`)

      // Listar todas las colecciones disponibles
      const allCollections = await db.listCollections().toArray()
      console.log("\nColecciones disponibles:")
      allCollections.forEach((coll) => {
        console.log(`- ${coll.name}`)
      })

      return
    }

    // Contar documentos en la colección
    const count = await db.collection(COLLECTION_NAME).countDocuments()
    console.log(`\nDocumentos en ${COLLECTION_NAME}: ${count}`)

    if (count === 0) {
      console.log(`\n⚠️ La colección '${COLLECTION_NAME}' existe pero está vacía.`)
      return
    }

    // Obtener un ejemplo de documento
    const sampleDoc = await db.collection(COLLECTION_NAME).findOne()
    console.log("\nEjemplo de documento:")
    console.log(JSON.stringify(sampleDoc, null, 2))

    // Mostrar los campos disponibles
    console.log("\nCampos disponibles:")
    Object.keys(sampleDoc).forEach((key) => {
      console.log(`- ${key}: ${typeof sampleDoc[key]}`)
    })

    // Generar y actualizar slugs
    console.log("\nGenerando slugs para todos los documentos...")

    const products = await db.collection(COLLECTION_NAME).find().toArray()
    let updatedCount = 0

    for (const product of products) {
      if (!product.name) {
        console.log(`Producto con ID ${product._id} no tiene nombre, saltando...`)
        continue
      }

      // Generar slug
      const baseSlug = product.name
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "")

      let slug = baseSlug
      let counter = 1

      // Verificar si el slug ya existe
      let existingProduct = await db.collection(COLLECTION_NAME).findOne({
        slug: slug,
        _id: { $ne: product._id },
      })

      while (existingProduct) {
        slug = `${baseSlug}-${counter}`
        counter++
        existingProduct = await db.collection(COLLECTION_NAME).findOne({
          slug: slug,
          _id: { $ne: product._id },
        })
      }

      // Actualizar el producto
      await db.collection(COLLECTION_NAME).updateOne({ _id: product._id }, { $set: { slug: slug } })

      console.log(`Actualizado: ${product.name} -> ${slug}`)
      updatedCount++
    }

    console.log(`\n✅ Proceso completado. Se actualizaron ${updatedCount} productos.`)
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await client.close()
    console.log("\nConexión cerrada.")
  }
}

directQuery().catch(console.error)
