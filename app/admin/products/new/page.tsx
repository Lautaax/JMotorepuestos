"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { checkAdminAuth } from "@/lib/auth"
import { addProduct } from "@/lib/products"
import type { Product } from "@/lib/types"
import ImageUpload from "@/components/admin/image-upload"

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    brand: "",
    sku: "",
    image: "",
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAdmin = await checkAdminAuth()
        if (!isAdmin) {
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos para acceder al panel de administración",
            variant: "destructive",
          })
          router.push("/auth")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un error al verificar tu autenticación",
          variant: "destructive",
        })
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let parsedValue: string | number = value

    if (name === "price" || name === "stock") {
      parsedValue = Number.parseFloat(value) || 0
    }

    setFormData((prev) => ({ ...prev, [name]: parsedValue }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage(file)
    setImagePreview(preview)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Validar formulario
      if (!formData.name || !formData.price || formData.price <= 0) {
        throw new Error("Por favor completa los campos obligatorios")
      }

      let imageUrl = formData.image

      // Si hay una imagen seleccionada, subirla primero
      if (selectedImage) {
        const imageFormData = new FormData()
        imageFormData.append("image", selectedImage)

        const uploadResponse = await fetch("/api/upload/image", {
          method: "POST",
          body: imageFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Error al subir la imagen")
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.imageUrl
      }

      // Crear el producto con la URL de la imagen
      await addProduct({
        ...formData,
        image: imageUrl,
      } as Product)

      toast({
        title: "Producto creado",
        description: "El producto ha sido creado exitosamente",
      })

      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al crear el producto",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Añadir Nuevo Producto</h1>
          <p className="text-muted-foreground">Completa el formulario para crear un nuevo producto</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
              <CardDescription>Ingresa los detalles del nuevo producto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Código único de producto"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Describe el producto detalladamente"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={formData.category as string}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="motor">Motor</SelectItem>
                      <SelectItem value="frenos">Frenos</SelectItem>
                      <SelectItem value="suspension">Suspensión</SelectItem>
                      <SelectItem value="electrico">Eléctrico</SelectItem>
                      <SelectItem value="accesorios">Accesorios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Marca del producto"
                  />
                </div>
              </div>

              <ImageUpload onImageSelect={handleImageSelect} currentImage={formData.image} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push("/admin/products")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar Producto"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}

