import { type NextRequest, NextResponse } from "next/server"
import { getUserById, updateUser, deleteUser } from "@/lib/users-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || typeof session !== "object" || !session.user || typeof session.user !== "object") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Solo permitir acceso al propio usuario o a administradores
    if (session.user.id !== params.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const user = await getUserById(params.id)

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || typeof session !== "object" || !session.user || typeof session.user !== "object") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userData = await request.json()

    // Solo permitir cambio de rol a administradores
    if (userData.role && session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado para cambiar el rol" }, { status: 403 })
    }

    // Solo permitir actualización al propio usuario o a administradores
    if (session.user.id !== params.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const updatedUser = await updateUser(params.id, userData)

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error al actualizar usuario:", error)

    // Manejar error específico de email duplicado
    if (error instanceof Error && error.message.includes("email ya está registrado")) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
    }

    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (
      !session ||
      typeof session !== "object" ||
      !session.user ||
      typeof session.user !== "object" ||
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Evitar que un administrador se elimine a sí mismo
    if (session.user.id === params.id) {
      return NextResponse.json({ error: "No puedes eliminar tu propia cuenta" }, { status: 400 })
    }

    await deleteUser(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
