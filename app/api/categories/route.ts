import { type NextRequest, NextResponse } from "next/server"
import { getCategories } from "@/lib/categories-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

// GET: Obtener todas las categorías
export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 })
  }
}

// POST: Crear una nueva categoría (solo admin)
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()

    // Validar datos
    if (!data.name) {
      return NextResponse.json({ error: "El nombre de la categoría es obligatorio" }, { status: 400 })
    }

    // Crear la categoría en la base de datos
    const newCategory = await createCategory(data)

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("Error al crear categoría:", error)
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 })
  }
}

// Función para crear una categoría (si no existe en categories-db.ts)
async function createCategory(categoryData: any) {
  // Esta es una implementación temporal si la función no existe en categories-db.ts
  // Idealmente, esta función debería estar en categories-db.ts y ser importada

  const { connectToDatabase } = await import("@/lib/mongodb")
  const { db } = await connectToDatabase()

  const result = await db.collection("categories").insertOne({
    name: categoryData.name,
    slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, "-"),
    description: categoryData.description || "",
    parentId: categoryData.parentId || null,
    image: categoryData.image || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return {
    id: result.insertedId.toString(),
    ...categoryData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}
