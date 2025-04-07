import { type NextRequest, NextResponse } from "next/server"
import { getCategoryById, updateCategory, deleteCategory } from "@/lib/categories-db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const category = await getCategoryById(params.id)

    if (!category) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error(`Error al obtener categoría con ID ${params.id}:`, error)
    return NextResponse.json({ error: "Error al obtener categoría" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación y rol de administrador
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const data = await request.json()

    // Actualizar la categoría
    const updatedCategory = await updateCategory(params.id, data)

    if (!updatedCategory) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error(`Error al actualizar categoría con ID ${params.id}:`, error)
    return NextResponse.json({ error: "Error al actualizar categoría" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación y rol de administrador
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Eliminar la categoría
    await deleteCategory(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error al eliminar categoría con ID ${params.id}:`, error)
    return NextResponse.json({ error: "Error al eliminar categoría" }, { status: 500 })
  }
}

