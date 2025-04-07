import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/mongodb"
import { generateSlug } from "@/lib/products-db" // Importamos la función de generación de slugs

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // Generar slug a partir del nombre del producto
    if (productData.name && !productData.slug) {
      productData.slug = generateSlug(productData.name)

      // Verificar si el slug ya existe
      const productsCollection = getCollection("products")
      const existingProduct = await productsCollection.findOne({ slug: productData.slug })

      // Si el slug ya existe, añadir un sufijo numérico
      let counter = 1
      let finalSlug = productData.slug

      while (existingProduct) {
        finalSlug = `${productData.slug}-${counter}`
        counter++
        const checkAgain = await productsCollection.findOne({ slug: finalSlug })
        if (!checkAgain) break
      }

      productData.slug = finalSlug
    }

    // Añadir fechas de creación y actualización
    productData.createdAt = new Date()
    productData.updatedAt = new Date()

    const productsCollection = getCollection("products")
    const result = await productsCollection.insertOne(productData)

    return NextResponse.json(
      {
        success: true,
        id: result.insertedId,
        product: { ...productData, _id: result.insertedId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al crear el producto",
      },
      { status: 500 },
    )
  }
}

