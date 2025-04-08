import { NextResponse } from "next/server"
import { getCategoryById, updateCategory, deleteCategory } from "@/lib/categories-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const category = await getCategoryById(id)

    if (!category) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error al obtener categoría:", error)
    return NextResponse.json({ error: "Error al obtener categoría" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Verificación de tipo para session con verificación de nulidad
    if (
      !session ||
      typeof session !== "object" ||
      !session.user ||
      typeof session.user !== "object" ||
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const id = params.id
    const data = await request.json()

    // Validar datos
    if (!data.name) {
      return NextResponse.json({ error: "Nombre de categoría requerido" }, { status: 400 })
    }

    const updatedCategory = await updateCategory(id, data)

    if (!updatedCategory) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error al actualizar categoría:", error)
    return NextResponse.json({ error: "Error al actualizar categoría" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Verificación de tipo para session con verificación de nulidad
    if (
      !session ||
      typeof session !== "object" ||
      !session.user ||
      typeof session.user !== "object" ||
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const id = params.id
    const result = await deleteCategory(id)

    if (!result) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar categoría:", error)
    return NextResponse.json({ error: "Error al eliminar categoría" }, { status: 500 })
  }
}
