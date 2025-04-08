import * as XLSX from "xlsx"
import type { Product } from "./types"
import { getProductBySku, addProduct, updateProduct } from "./products-db"

interface ImportResult {
  imported: number
  updated: number
  errors: number
  errorDetails: string[]
}

// Interfaz para las filas del Excel
interface ProductRow {
  name: string
  description?: string
  price: number | string
  stock: number | string
  category?: string
  brand?: string
  sku?: string
  image?: string
  [key: string]: any // Para cualquier otra propiedad que pueda tener la fila
}

// Función para validar un producto del Excel
function validateProductRow(row: ProductRow): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validar campos obligatorios
  if (!row.name) {
    errors.push("El nombre del producto es obligatorio")
  }

  if (row.price === undefined || row.price === null || isNaN(Number(row.price)) || Number(row.price) <= 0) {
    errors.push("El precio debe ser un número mayor que cero")
  }

  if (row.stock === undefined || row.stock === null || isNaN(Number(row.stock)) || Number(row.stock) < 0) {
    errors.push("El stock debe ser un número mayor o igual a cero")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Función para importar productos desde un archivo Excel
export async function importProductsFromExcel(file: File): Promise<ImportResult> {
  const result: ImportResult = {
    imported: 0,
    updated: 0,
    errors: 0,
    errorDetails: [],
  }

  try {
    // Leer el archivo Excel
    const data = await file.arrayBuffer()
    const workbook = XLSX.read(data)

    // Obtener la primera hoja
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]

    // Convertir a JSON
    const rows = XLSX.utils.sheet_to_json(worksheet) as ProductRow[]

    // Procesar cada fila
    for (const row of rows) {
      try {
        // Validar la fila
        const { isValid, errors } = validateProductRow(row)

        if (!isValid) {
          result.errors++
          result.errorDetails.push(`Error en fila ${rows.indexOf(row) + 2}: ${errors.join(", ")}`)
          continue
        }

        // Preparar el objeto de producto
        const product: Omit<Product, "id"> = {
          name: row.name,
          description: row.description || "",
          price: Number(row.price),
          stock: Number(row.stock),
          category: row.category || "",
          brand: row.brand || "",
          sku: row.sku || "",
          image: row.image || "",
        }

        // Verificar si el producto ya existe por SKU
        if (row.sku) {
          const existingProduct = await getProductBySku(row.sku)

          if (existingProduct) {
            // Actualizar producto existente
            await updateProduct(existingProduct.id, product)
            result.updated++
            continue
          }
        }

        // Añadir nuevo producto
        await addProduct(product)
        result.imported++
      } catch (error) {
        console.error("Error al procesar fila:", error)
        result.errors++
        result.errorDetails.push(
          `Error en fila ${rows.indexOf(row) + 2}: ${error instanceof Error ? error.message : "Error desconocido"}`,
        )
      }
    }

    return result
  } catch (error) {
    console.error("Error al importar productos desde Excel:", error)
    throw new Error("Error al procesar el archivo Excel")
  }
}

// Función para exportar productos a un archivo Excel
export async function exportProductsToExcel(products: Product[]): Promise<Uint8Array> {
  try {
    // Preparar los datos para el Excel
    const data = products.map((product) => ({
      SKU: product.sku || "",
      Nombre: product.name,
      Descripción: product.description || "",
      Precio: product.price,
      Stock: product.stock,
      Categoría: product.category || "",
      Marca: product.brand || "",
      "URL de imagen": product.image || "",
    }))

    // Crear una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Crear un libro de trabajo y añadir la hoja
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Productos")

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" })

    return new Uint8Array(excelBuffer)
  } catch (error) {
    console.error("Error al exportar productos a Excel:", error)
    throw new Error("Error al generar el archivo Excel")
  }
}

// Función para generar una plantilla de Excel para importación
export function generateExcelTemplate(): Uint8Array {
  try {
    // Crear datos de ejemplo
    const data = [
      {
        SKU: "PT-150-250",
        Nombre: "Kit de Pistones Premium",
        Descripción: "Kit completo de pistones de alta resistencia",
        Precio: 89.99,
        Stock: 15,
        Categoría: "motor",
        Marca: "MotorTech",
        "URL de imagen": "",
      },
      {
        SKU: "BM-PF-C200",
        Nombre: "Pastillas de Freno Cerámicas",
        Descripción: "Pastillas de freno cerámicas de alto rendimiento",
        Precio: 34.5,
        Stock: 28,
        Categoría: "frenos",
        Marca: "BrakeMaster",
        "URL de imagen": "",
      },
    ]

    // Crear una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(data)

    // Crear un libro de trabajo y añadir la hoja
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Plantilla")

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" })

    return new Uint8Array(excelBuffer)
  } catch (error) {
    console.error("Error al generar plantilla de Excel:", error)
    throw new Error("Error al generar la plantilla de Excel")
  }
}
