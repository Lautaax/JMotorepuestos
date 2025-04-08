"use server"

import { getProductBySku, addProduct } from "@/app/actions/products"
import type { Product } from "@/types/product"

/**
 * Genera una plantilla de Excel para importar productos
 * @returns Buffer con la plantilla de Excel
 */
export async function generateExcelTemplate() {
  try {
    // Importación dinámica de xlsx
    const XLSX = await import("xlsx")

    // Definir las columnas de la plantilla
    const columns = [
      "SKU",
      "Name",
      "Description",
      "Price",
      "Stock",
      "CategoryId",
      "ImageUrl",
      "Featured",
      "CompatibleModels",
    ]

    // Crear un libro de trabajo y una hoja
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([columns])

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

    // Convertir el libro a un buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    return buffer
  } catch (error) {
    console.error("Error al generar plantilla de Excel:", error)
    throw new Error("No se pudo generar la plantilla de Excel")
  }
}

/**
 * Importa productos desde un archivo Excel
 * @param buffer - Buffer con el archivo Excel
 * @returns Resultado de la importación
 */
export async function importProductsFromExcel(buffer: Buffer) {
  try {
    // Importación dinámica de xlsx
    const XLSX = await import("xlsx")

    // Leer el archivo Excel
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(worksheet)

    const results = {
      total: data.length,
      imported: 0,
      errors: [] as { row: number; error: string }[],
    }

    // Procesar cada fila
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as any
      try {
        // Validar datos requeridos
        if (!row.SKU || !row.Name || !row.Price) {
          throw new Error("Missing required fields: SKU, Name, or Price")
        }

        // Convertir datos
        const product: Omit<Product, "_id"> = {
          sku: row.SKU,
          name: row.Name,
          description: row.Description || "",
          price: Number(row.Price),
          stock: Number(row.Stock || 0),
          categoryId: row.CategoryId || "",
          imageUrl: row.ImageUrl || "",
          featured: row.Featured === "true" || row.Featured === true,
          compatibleModels: row.CompatibleModels ? row.CompatibleModels.split(",").map((m: string) => m.trim()) : [],
          specifications: {},
        }

        // Verificar si el producto ya existe
        const existingProduct = await getProductBySku(product.sku)
        if (existingProduct) {
          throw new Error(`Product with SKU ${product.sku} already exists`)
        }

        // Añadir el producto
        await addProduct(product)
        results.imported++
      } catch (error: any) {
        results.errors.push({
          row: i + 2, // +2 porque la fila 1 es el encabezado y las filas de Excel empiezan en 1
          error: error.message,
        })
      }
    }

    return results
  } catch (error) {
    console.error("Error al importar productos desde Excel:", error)
    throw new Error("No se pudo importar productos desde Excel")
  }
}

/**
 * Exporta productos a un archivo Excel
 * @param products - Lista de productos
 * @returns Buffer con el archivo Excel
 */
export async function exportProductsToExcel(products: Product[]) {
  try {
    // Importación dinámica de xlsx
    const XLSX = await import("xlsx")

    // Definir las columnas
    const columns = [
      "SKU",
      "Name",
      "Description",
      "Price",
      "Stock",
      "CategoryId",
      "ImageUrl",
      "Featured",
      "CompatibleModels",
    ]

    // Convertir productos a filas
    const rows = products.map((product) => [
      product.sku,
      product.name,
      product.description,
      product.price,
      product.stock,
      product.categoryId,
      product.imageUrl,
      product.featured ? "true" : "false",
      product.compatibleModels.join(", "),
    ])

    // Crear un libro de trabajo y una hoja
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([columns, ...rows])

    // Añadir la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

    // Convertir el libro a un buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" })

    return buffer
  } catch (error) {
    console.error("Error al exportar productos a Excel:", error)
    throw new Error("No se pudo exportar productos a Excel")
  }
}
