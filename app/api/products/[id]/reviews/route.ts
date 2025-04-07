import { type NextRequest, NextResponse } from "next/server"
import { getProductReviews, addReview, getProductAverageRating } from "@/lib/reviews-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before accessing id
    const resolvedParams = await params
    const productId = resolvedParams.id
    console.log(`API: Obteniendo reseñas para el producto ${productId}`)

    // Obtener reseñas
    const reviews = await getProductReviews(productId)
    console.log(`API: Encontradas ${reviews.length} reseñas`)

    // Obtener calificación promedio
    const { average, count } = await getProductAverageRating(productId)

    // Devolver solo el array de reseñas, no un objeto
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error al obtener reseñas:", error)
    // Devolver un array vacío en caso de error
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await params before accessing id
    const resolvedParams = await params
    const productId = resolvedParams.id

    // Verificar autenticación
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Debes iniciar sesión para dejar una reseña" }, { status: 401 })
    }

    const { rating, comment } = await request.json()

    // Validar datos
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "La calificación debe estar entre 1 y 5" }, { status: 400 })
    }

    if (!comment || comment.trim().length < 3) {
      return NextResponse.json({ error: "El comentario es demasiado corto" }, { status: 400 })
    }

    // Crear reseña
    const review = await addReview({
      productId,
      userId: session.user.id,
      userName: session.user.name || "Usuario",
      rating,
      comment,
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error al crear reseña:", error)

    if (error instanceof Error && error.message.includes("Ya has dejado una reseña")) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json({ error: "Error al crear reseña" }, { status: 500 })
  }
}

