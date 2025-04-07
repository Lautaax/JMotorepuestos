const { MongoClient } = require("mongodb")
const readline = require("readline")
require("dotenv").config()

// Crear interfaz para leer entrada del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

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

// Función para preguntar al usuario
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

async function generateSlugsWithQuery() {
  let client

  try {
    // Obtener información de conexión
    console.log("=== GENERADOR DE SLUGS CON CONSULTA PERSONALIZADA ===\n")

    const uri = await askQuestion(
      "URI de MongoDB (presiona Enter para usar el valor predeterminado 'mongodb://localhost:27017'): ",
    )
    const MONGODB_URI = uri || process.env.MONGODB_URI || "mongodb://localhost:27017"

    const dbName = await askQuestion("Nombre de la base de datos (presiona Enter para usar 'delsur'): ")
    const MONGODB_DB_NAME = dbName || process.env.MONGODB_DB_NAME || "delsur"

    const collectionName = await askQuestion("Nombre de la colección (presiona Enter para usar 'products'): ")
    const COLLECTION_NAME = collectionName || "products"

    console.log("\nEjemplos de consultas:")
    console.log("1. Todos los productos: {}")
    console.log("2. Productos sin slug: { slug: { $exists: false } }")
    console.log("3. Productos por categoría: { category: 'frenos' }")
    console.log("4. Producto específico por nombre: { name: 'Pastillas de Freno Cerámicas' }")

    const queryStr = await askQuestion("\nIntroduce tu consulta (formato JSON): ")
    let query = {}

    try {
      if (queryStr.trim()) {
        query = JSON.parse(queryStr)
      }
    } catch (e) {
      console.error("Error al analizar la consulta JSON. Usando consulta vacía {}.")
    }

    console.log("\nConectando a la base de datos...")
    client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(MONGODB_DB_NAME)
    const productsCollection = db.collection(COLLECTION_NAME)

    console.log(`Ejecutando consulta en ${MONGODB_DB_NAME}.${COLLECTION_NAME}:`)
    console.log(JSON.stringify(query, null, 2))

    // Obtener productos según la consulta
    const products = await productsCollection.find(query).toArray()

    console.log(`\nSe encontraron ${products.length} productos con la consulta.`)

    if (products.length === 0) {
      console.log("\nNo se encontraron productos con esta consulta.")

      // Mostrar algunas colecciones y documentos de ejemplo
      console.log("\nColecciones disponibles en la base de datos:")
      const collections = await db.listCollections().toArray()
      collections.forEach((collection) => {
        console.log(` - ${collection.name}`)
      })

      // Preguntar si quiere ver un ejemplo de documento de alguna colección
      const showSample = await askQuestion("\n¿Quieres ver un ejemplo de documento de alguna colección? (s/n): ")

      if (showSample.toLowerCase() === "s") {
        const sampleCollection = await askQuestion("Nombre de la colección: ")
        if (sampleCollection) {
          try {
            const sample = await db.collection(sampleCollection).findOne({})
            if (sample) {
              console.log("\nEjemplo de documento:")
              console.log(JSON.stringify(sample, null, 2))
              console.log("\nCampos disponibles:")
              Object.keys(sample).forEach((key) => {
                console.log(` - ${key}: ${typeof sample[key]}`)
              })
            } else {
              console.log("No se encontraron documentos en esta colección.")
            }
          } catch (e) {
            console.error("Error al obtener el ejemplo:", e.message)
          }
        }
      }

      return
    }

    // Mostrar un ejemplo de producto encontrado
    console.log("\nEjemplo de producto encontrado:")
    console.log(JSON.stringify(products[0], null, 2))

    // Confirmar antes de continuar
    const confirm = await askQuestion("\n¿Quieres generar slugs para estos productos? (s/n): ")

    if (confirm.toLowerCase() !== "s") {
      console.log("Operación cancelada.")
      return
    }

    // Preguntar qué campo usar para el slug
    console.log("\nCampos disponibles en los productos:")
    const fields = Object.keys(products[0])
    fields.forEach((field) => {
      console.log(` - ${field}`)
    })

    const slugField = await askQuestion(
      "\n¿Qué campo quieres usar para generar los slugs? (presiona Enter para usar 'name'): ",
    )
    const fieldToUse = slugField || "name"

    if (!fields.includes(fieldToUse)) {
      console.log(`Advertencia: El campo '${fieldToUse}' no existe en todos los productos.`)
      const proceed = await askQuestion("¿Quieres continuar de todos modos? (s/n): ")
      if (proceed.toLowerCase() !== "s") {
        console.log("Operación cancelada.")
        return
      }
    }

    let updatedCount = 0
    let skippedCount = 0

    // Procesar cada producto
    for (const product of products) {
      if (!product[fieldToUse]) {
        console.log(`Producto con ID ${product._id} no tiene el campo '${fieldToUse}', saltando...`)
        skippedCount++
        continue
      }

      // Generar el slug base a partir del campo seleccionado
      const baseSlug = generateSlug(product[fieldToUse])

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
        console.log(`Actualizado: ${product[fieldToUse]}`)
        console.log(`  Slug anterior: ${oldSlug}`)
        console.log(`  Nuevo slug: ${slug}`)
        updatedCount++
      } else {
        console.log(`Sin cambios: ${product[fieldToUse]} (slug: ${slug})`)
      }
    }

    console.log("\nResumen:")
    console.log(`Total de productos procesados: ${products.length}`)
    console.log(`Productos actualizados: ${updatedCount}`)
    console.log(`Productos sin cambios: ${products.length - updatedCount - skippedCount}`)
    console.log(`Productos saltados: ${skippedCount}`)
  } catch (error) {
    console.error("Error:", error)
  } finally {
    if (client) {
      await client.close()
      console.log("Conexión a MongoDB cerrada.")
    }
    rl.close()
  }
}

// Ejecutar la función
generateSlugsWithQuery()

