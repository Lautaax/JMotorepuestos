"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getProductById } from "@/lib/products"
import { checkAdminAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { EditProductForm } from "@/components/admin/edit-product-form"
import type { Product } from "@/lib/types"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        // Verificar autenticación de administrador
        const isAdmin = await checkAdminAuth()
        if (!isAdmin) {
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos para acceder al panel de administración",
            variant: "destructive",
          })
          router.push("/auth")
          return
        }

        // Cargar datos del producto
        const productData = await getProductById(params.id)
        if (!productData) {
          toast({
            title: "Producto no encontrado",
            description: "El producto que intentas editar no existe",
            variant: "destructive",
          })
          router.push("/admin/products")
          return
        }

        setProduct(productData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un error al cargar el producto",
          variant: "destructive",
        })
        router.push("/admin/products")
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [params.id, router, toast])

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Editar Producto</h1>
          <p className="text-muted-foreground">Actualiza los detalles del producto</p>
        </div>

        <EditProductForm product={product} />
      </div>
    </div>
  )
}
