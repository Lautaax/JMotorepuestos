"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Star, StarHalf, MessageSquare, ThumbsUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { ProductReview } from "@/lib/types"

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: "",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/products/${productId}/reviews`)

        if (response.ok) {
          const data = await response.json()
          setReviews(data.reviews)
          setAverageRating(data.averageRating)
          setReviewCount(data.count)

          // Verificar si el usuario ya ha dejado una reseña
          if (session?.user?.id) {
            const userHasReviewed = data.reviews.some((review: ProductReview) => review.userId === session.user.id)
            setShowReviewForm(!userHasReviewed)
          } else {
            setShowReviewForm(false)
          }
        }
      } catch (error) {
        console.error("Error al cargar reseñas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId, session])

  const handleRatingChange = (rating: number) => {
    setUserReview((prev) => ({ ...prev, rating }))
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserReview((prev) => ({ ...prev, comment: e.target.value }))
  }

  const handleSubmitReview = async () => {
    if (!session) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para dejar una reseña",
        variant: "destructive",
      })
      return
    }

    if (!userReview.comment.trim()) {
      toast({
        title: "Comentario requerido",
        description: "Por favor escribe un comentario para tu reseña",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: userReview.rating,
          comment: userReview.comment,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al enviar la reseña")
      }

      const newReview = await response.json()

      // Actualizar la lista de reseñas
      setReviews((prev) => [newReview, ...prev])

      // Actualizar promedio y conteo
      setReviewCount((prev) => prev + 1)
      setAverageRating((averageRating * reviewCount + userReview.rating) / (reviewCount + 1))

      // Ocultar formulario
      setShowReviewForm(false)

      toast({
        title: "Reseña enviada",
        description: "Gracias por compartir tu opinión",
      })

      // Limpiar formulario
      setUserReview({
        rating: 5,
        comment: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al enviar la reseña",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Renderizar estrellas para una calificación
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reseñas de Clientes
          </h2>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">{renderStars(averageRating)}</div>
              <span className="text-sm text-muted-foreground">
                {averageRating.toFixed(1)} de 5 ({reviewCount} {reviewCount === 1 ? "reseña" : "reseñas"})
              </span>
            </div>
          )}
        </div>

        {session && showReviewForm && (
          <Button variant="outline" onClick={() => setShowReviewForm(true)} className="md:self-end">
            Escribir una reseña
          </Button>
        )}
      </div>

      {session && showReviewForm && (
        <div className="border rounded-lg p-4 bg-muted/30">
          <h3 className="font-medium mb-2">Tu opinión</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-1">Calificación</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(rating)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating <= userReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm mb-1">Comentario</p>
              <Textarea
                value={userReview.comment}
                onChange={handleCommentChange}
                placeholder="Comparte tu experiencia con este producto..."
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitReview} disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar reseña"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No hay reseñas para este producto</p>
          {session ? (
            showReviewForm ? (
              <p className="mt-1 text-sm">¡Sé el primero en dejar una reseña!</p>
            ) : (
              <p className="mt-1 text-sm">Ya has dejado una reseña para este producto</p>
            )
          ) : (
            <p className="mt-1 text-sm">
              <a href="/auth" className="text-primary hover:underline">
                Inicia sesión
              </a>{" "}
              para dejar una reseña
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{review.userName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">{renderStars(review.rating)}</div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

