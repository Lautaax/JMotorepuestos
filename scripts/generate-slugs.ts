import { connectToDatabase } from "../lib/mongodb"
import { generateSlug } from "../lib/products-db"

async function generateSlugsForProducts() {
  try {
    console.log("Conectando a la base de datos...")
    const { db } = await connectToDatabase()

    console.log("Obteniendo productos sin slug...")
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
      const existingProduct = await db.collection("products").findOne({ slug })

      // Si el slug ya existe, añadir un sufijo numérico
      let finalSlug = slug
      let counter = 1

      while (existingProduct && existingProduct._id.toString() !== product._id.toString()) {
        finalSlug = `${slug}-${counter}`
        counter++
        const checkAgain = await db.collection("products").findOne({ slug: finalSlug })
        if (!checkAgain || checkAgain._id.toString() === product._id.toString()) {
          break
        }
      }

      // Actualizar el producto con el nuevo slug
      await db.collection("products").updateOne({ _id: product._id }, { $set: { slug: finalSlug } })

      console.log(`Actualizado: ${product.name} -> ${finalSlug}`)
      updatedCount++
    }

    console.log(`Proceso completado. Se actualizaron ${updatedCount} productos.`)
  } catch (error) {
    console.error("Error al generar slugs:", error)
  } finally {
    process.exit(0)
  }
}

// Ejecutar la función
generateSlugsForProducts()

