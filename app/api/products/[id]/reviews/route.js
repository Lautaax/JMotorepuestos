import { NextResponse } from "next/server"

// GET: Obtener reseñas de un producto
export function GET(request, { params }) {
  const productId = params.id

  // Datos simulados de reseñas
  const reviews = [
    {
      _id: "review1",
      productId,
      userId: "user1",
      userName: "Usuario Demo",
      rating: 5,
      comment: "Excelente producto, muy recomendable",
      createdAt: new Date("2023-04-10"),
    },
    {
      _id: "review2",
      productId,
      userId: "user2",
      userName: "Otro Usuario",
      rating: 4,
      comment: "Buen producto, pero un poco caro",
      createdAt: new Date("2023-05-15"),
    },
  ]

  return NextResponse.json(reviews)
}

// POST: Añadir una nueva reseña
export async function POST(request, { params }) {
  try {
    const productId = params.id
    const body = await request.json()

    // Simular la creación de una reseña
    const newReview = {
      _id: "review" + Date.now(),
      productId,
      userId: "user-demo",
      userName: "Usuario Demo",
      rating: body.rating || 5,
      comment: body.comment || "Comentario de ejemplo",
      createdAt: new Date(),
    }

    return NextResponse.json(newReview)
  } catch (error) {
    return NextResponse.json({ error: "Error al añadir reseña" }, { status: 500 })
  }
}

// PUT: Actualizar una reseña
export async function PUT(request, { params }) {
  try {
    const productId = params.id
    const body = await request.json()

    if (!body.reviewId) {
      return NextResponse.json({ error: "Falta el ID de la reseña" }, { status: 400 })
    }

    // Simular la actualización de una reseña
    const updatedReview = {
      _id: body.reviewId,
      productId,
      userId: "user-demo",
      userName: "Usuario Demo",
      rating: body.rating || 5,
      comment: body.comment || "Comentario actualizado",
      updatedAt: new Date(),
    }

    return NextResponse.json({ success: true, review: updatedReview })
  } catch (error) {
    return NextResponse.json({ error: "Error al actualizar reseña" }, { status: 500 })
  }
}

// DELETE: Eliminar una reseña
export async function DELETE(request, { params }) {
  try {
    const url = new URL(request.url)
    const reviewId = url.searchParams.get("reviewId")

    if (!reviewId) {
      return NextResponse.json({ error: "Falta el ID de la reseña" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Error al eliminar reseña" }, { status: 500 })
  }
}
