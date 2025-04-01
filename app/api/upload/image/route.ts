import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-db"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ninguna imagen" }, { status: 400 })
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 })
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "La imagen no debe superar los 5MB" }, { status: 400 })
    }

    // Generar nombre único para el archivo
    const fileExtension = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExtension}`

    // Crear directorio si no existe
    const publicDir = join(process.cwd(), "public")
    const uploadsDir = join(publicDir, "uploads")
    const productsDir = join(uploadsDir, "products")

    // Leer el archivo como ArrayBuffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Guardar el archivo
    const filePath = join(productsDir, fileName)
    await writeFile(filePath, buffer)

    // Devolver la URL relativa
    const imageUrl = `/uploads/products/${fileName}`

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error al subir imagen:", error)
    return NextResponse.json({ error: "Error al procesar la imagen" }, { status: 500 })
  }
}

