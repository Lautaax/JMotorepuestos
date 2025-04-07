"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Star, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface Review {
  id: string
  _id?: string
  productId: string
  userId: string
  userName: string
  rating: number
  title?: string
  comment: string
  createdAt: string
}

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Cargar reseñas al montar el componente
  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true)
      try {
        console.log("Cargando reseñas para el producto:", productId)
        const response = await fetch(`/api/products/${productId}/reviews`)

        if (response.ok) {
          const data = await response.json()
          console.log("Datos recibidos de la API:", data)

          // Asegurarse de que data es un array
          if (Array.isArray(data)) {
            console.log(`Reseñas recibidas: ${data.length}`)
            setReviews(data)
          } else if (data && data.reviews && Array.isArray(data.reviews)) {
            // Si la API devuelve un objeto con una propiedad reviews que es un array
            console.log(`Reseñas recibidas del objeto: ${data.reviews.length}`)
            setReviews(data.reviews)
          } else {
            console.error("Las reseñas recibidas no son un array:", data)
            setReviews([])
          }
        } else {
          console.error("Error al cargar reseñas, status:", response.status)
          setReviews([])
        }
      } catch (error) {
        console.error("Error al cargar reseñas:", error)
        setReviews([])
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      loadReviews()
    } else {
      console.error("ProductId no proporcionado")
      setIsLoading(false)
    }
  }, [productId])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Inicia sesión para dejar una reseña",
        description: "Debes iniciar sesión para poder dejar una reseña",
        variant: "destructive",
      })
      return
    }

    if (!comment.trim()) {
      toast({
        title: "Comentario requerido",
        description: "Por favor escribe un comentario para tu reseña",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          title,
          comment,
        }),
      })

      if (response.ok) {
        const newReview = await response.json()
        setReviews((prevReviews) => (Array.isArray(prevReviews) ? [newReview, ...prevReviews] : [newReview]))
        setRating(5)
        setTitle("")
        setComment("")
        toast({
          title: "Reseña enviada",
          description: "Gracias por compartir tu opinión",
        })
      } else {
        const error = await response.json()
        toast({
          title: "Error al enviar la reseña",
          description: error.message || "Ha ocurrido un error al enviar tu reseña",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error al enviar la reseña",
        description: "Ha ocurrido un error al enviar tu reseña",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Asegurarse de que reviews es un array antes de calcular el promedio
  const reviewsArray = Array.isArray(reviews) ? reviews : []
  const averageRating = reviewsArray.length
    ? reviewsArray.reduce((acc, review) => acc + review.rating, 0) / reviewsArray.length
    : 0

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Reseñas de clientes</h3>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-muted-foreground">
            {averageRating.toFixed(1)} ({reviewsArray.length} reseñas)
          </span>
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-background p-6 rounded-lg">
        <h4 className="text-lg font-medium mb-4">Deja tu opinión</h4>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <Label htmlFor="rating">Calificación</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)} className="focus:outline-none">
                  <Star
                    className={`h-6 w-6 ${value <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Título (opcional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resumen de tu experiencia"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="comment">Comentario</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia con este producto"
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar reseña"}
          </Button>

          {!session && <p className="text-sm text-muted-foreground mt-2">Debes iniciar sesión para dejar una reseña</p>}
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">Cargando reseñas...</div>
        ) : !Array.isArray(reviews) || reviews.length === 0 ? (
          <div className="text-center py-8 bg-secondary rounded-lg">
            <p className="text-muted-foreground">Este producto aún no tiene reseñas</p>
            <p className="text-sm mt-2">¡Sé el primero en compartir tu experiencia!</p>
          </div>
        ) : (
          // Asegurarse de que reviews es un array antes de usar map
          reviews.map((review) => (
            <div key={review.id || review._id} className="bg-background p-6 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {review.title && <span className="font-medium">{review.title}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p>{review.comment}</p>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-sm">{review.userName}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

