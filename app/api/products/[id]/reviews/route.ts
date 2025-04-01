import { type NextRequest, NextResponse } from "next/server"
import { getProductReviews, addReview, getProductAverageRating } from "@/lib/reviews-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    // Obtener reseñas
    const reviews = await getProductReviews(productId)

    // Obtener calificación promedio
    const { average, count } = await getProductAverageRating(productId)

    return NextResponse.json({
      reviews,
      averageRating: average,
      count,
    })
  } catch (error) {
    console.error("Error al obtener reseñas:", error)
    return NextResponse.json({ error: "Error al obtener reseñas" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Debes iniciar sesión para dejar una reseña" }, { status: 401 })
    }

    const productId = params.id
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

