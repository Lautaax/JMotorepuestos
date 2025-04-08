const { MongoClient } = require("mongodb")
const slugify = require("slugify")

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
  if (!name) return ""

  // Usar slugify si está disponible, o implementación manual si no
  try {
    return slugify(name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    })
  } catch (error) {
    // Implementación manual de fallback
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
}

async function fixSlugs() {
  let client

  try {
    console.log("Conectando a la base de datos...")
    client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db(MONGODB_DB_NAME)
    const productsCollection = db.collection("products")

    // 1. Corregir el slug específico para "pastillas de freno cerámicas"
    console.log("Buscando producto 'pastillas de freno cerámicas'...")

    const targetProduct = await productsCollection.findOne({
      name: { $regex: /pastillas.*freno.*cer[aá]micas/i },
    })

    if (targetProduct) {
      console.log(`Producto encontrado: ${targetProduct.name}`)
      const result = await productsCollection.updateOne(
        { _id: targetProduct._id },
        { $set: { slug: "pastillas-freno-ceramicas" } },
      )
      console.log(`Slug actualizado a "pastillas-freno-ceramicas". Modificados: ${result.modifiedCount}`)
    } else {
      console.log("No se encontró el producto 'pastillas de freno cerámicas'")

      // Buscar productos con nombres similares para sugerir
      const similarProducts = await productsCollection
        .find({
          name: { $regex: /pastillas|freno|cer[aá]micas/i },
        })
        .toArray()

      if (similarProducts.length > 0) {
        console.log("Productos similares encontrados:")
        similarProducts.forEach((p) => console.log(`- ${p.name} (ID: ${p._id})`))
      }
    }

    // 2. Regenerar slugs para productos que no tienen slug
    console.log("\nBuscando productos sin slug...")
    const products = await productsCollection.find({ slug: { $exists: false } }).toArray()

    console.log(`Se encontraron ${products.length} productos sin slug.`)

    let updatedCount = 0

    for (const product of products) {
      if (!product.name) {
        console.log(`Producto con ID ${product._id} no tiene nombre, saltando...`)
        continue
      }

      const slug = generateSlug(product.name)

      // Verificar si el slug ya existe
      const existingProduct = await productsCollection.findOne({
        slug,
        _id: { $ne: product._id },
      })

      // Si el slug ya existe, añadir un sufijo numérico
      let finalSlug = slug
      let counter = 1

      while (existingProduct) {
        finalSlug = `${slug}-${counter}`
        counter++
        const checkAgain = await productsCollection.findOne({
          slug: finalSlug,
          _id: { $ne: product._id },
        })
        if (!checkAgain) break
      }

      // Actualizar el producto con el nuevo slug
      await productsCollection.updateOne({ _id: product._id }, { $set: { slug: finalSlug } })

      console.log(`Actualizado: ${product.name} -> ${finalSlug}`)
      updatedCount++
    }

    console.log(`\nProceso completado. Se actualizaron ${updatedCount} productos.`)

    // 3. Verificar productos con slugs incorrectos o malformados
    console.log("\nVerificando productos con slugs potencialmente problemáticos...")

    const allProducts = await productsCollection.find({}).toArray()
    let fixedSlugsCount = 0

    for (const product of allProducts) {
      if (!product.name || !product.slug) continue

      const correctSlug = generateSlug(product.name)

      // Si el slug actual es muy diferente del correcto, corregirlo
      if (
        product.slug !== correctSlug &&
        (product.slug.length < correctSlug.length * 0.7 || product.slug.length > correctSlug.length * 1.3)
      ) {
        // Verificar si el slug correcto ya existe
        const existingProduct = await productsCollection.findOne({
          slug: correctSlug,
          _id: { $ne: product._id },
        })

        let finalSlug = correctSlug
        let counter = 1

        while (existingProduct) {
          finalSlug = `${correctSlug}-${counter}`
          counter++
          const checkAgain = await productsCollection.findOne({
            slug: finalSlug,
            _id: { $ne: product._id },
          })
          if (!checkAgain) break
        }

        await productsCollection.updateOne({ _id: product._id }, { $set: { slug: finalSlug } })

        console.log(`Corregido slug malformado: ${product.slug} -> ${finalSlug} (${product.name})`)
        fixedSlugsCount++
      }
    }

    console.log(`Se corrigieron ${fixedSlugsCount} slugs malformados.`)
  } catch (error) {
    console.error("Error al corregir slugs:", error)
  } finally {
    if (client) {
      await client.close()
      console.log("Conexión a MongoDB cerrada.")
    }
    process.exit(0)
  }
}

// Ejecutar la función
fixSlugs()
