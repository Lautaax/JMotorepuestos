import { type NextRequest, NextResponse } from "next/server"
import { getUsers, addUser, getUsersCount } from "@/lib/users-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-db"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const users = await getUsers()
    const total = await getUsersCount()

    return NextResponse.json({
      users,
      total,
    })
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Para registro de usuarios normales no se requiere autenticación
    // Para crear usuarios admin sí se requiere ser admin
    const userData = await request.json()

    // Si se intenta crear un usuario admin, verificar permisos
    if (userData.role === "admin") {
      const session = await getServerSession(authOptions)

      if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "No autorizado para crear usuarios administradores" }, { status: 401 })
      }
    }

    // Validar datos del usuario
    if (!userData.name || !userData.email || !userData.password) {
      return NextResponse.json({ error: "Datos de usuario inválidos" }, { status: 400 })
    }

    try {
      const newUser = await addUser(userData)
      return NextResponse.json(newUser, { status: 201 })
    } catch (error) {
      // Manejar error específico de email duplicado
      if (error instanceof Error && error.message.includes("email ya está registrado")) {
        return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 })
      }

      // Re-lanzar otros errores para que sean manejados por el catch externo
      throw error
    }
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}

