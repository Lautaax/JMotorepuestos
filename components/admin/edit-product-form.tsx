"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Product, Category, CompatibleModel } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"
import { Trash, Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import OptimizedImage from "@/components/optimized-image"

interface EditProductFormProps {
  product?: Product
  categories: Category[]
}

export default function EditProductForm({ product, categories }: EditProductFormProps) {
  const router = useRouter()
  const isEditing = !!product

  const defaultCompatModel: CompatibleModel = {
    brand: "",
    model: "",
    year: "",
    notes: "",
  }

  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      brand: "",
      sku: "",
      image: "",
      compatibleModels: [],
    },
  )

  const [compatibilityForm, setCompatibilityForm] = useState<CompatibleModel>(defaultCompatModel)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCompatibilityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompatibilityForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addCompatibleModel = () => {
    if (!compatibilityForm.brand || !compatibilityForm.model || !compatibilityForm.year) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos de compatibilidad",
        variant: "destructive",
      })
      return
    }

    setFormData((prev) => {
      const currentModels = prev.compatibleModels || []
      return {
        ...prev,
        compatibleModels: [...currentModels, { ...compatibilityForm }],
      }
    })

    setCompatibilityForm(defaultCompatModel)
  }

  const removeCompatibleModel = (index: number) => {
    setFormData((prev) => {
      if (!prev.compatibleModels) return prev

      const updatedModels = [...prev.compatibleModels]
      updatedModels.splice(index, 1)

      return {
        ...prev,
        compatibleModels: updatedModels,
      }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData((prev) => ({
          ...prev,
          image: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validaciones básicas
      if (!formData.name || !formData.description || !formData.price || !formData.category) {
        toast({
          title: "Error",
          description: "Por favor complete todos los campos requeridos",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // Generar slug si no existe
      if (!formData.slug) {
        const slug = formData.name
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-")
        formData.slug = slug
      }

      const url = isEditing ? `/api/products/${product._id}` : "/api/products"

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al guardar el producto")
      }

      toast({
        title: "Éxito",
        description: isEditing ? "Producto actualizado correctamente" : "Producto creado correctamente",
      })

      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al guardar el producto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper function to check if a model is a CompatibleModel object
  const isCompatibleModelObject = (model: any): model is CompatibleModel => {
    return typeof model === "object" && "brand" in model && "model" in model && "year" in model
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Información Básica</TabsTrigger>
          <TabsTrigger value="compatibility">Compatibilidad</TabsTrigger>
          <TabsTrigger value="images">Imágenes</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
              <CardDescription>Ingrese la información básica del producto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input id="name" name="name" value={formData.name || ""} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" name="sku" value={formData.sku || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price || ""}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock || ""}
                    onChange={handleChange}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={typeof formData.category === "string" ? formData.category : formData.category?.id || ""}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id || category._id?.toString()} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" name="brand" value={formData.brand || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ""}
                  onChange={handleChange}
                  placeholder="Generado automáticamente si se deja en blanco"
                />
                <p className="text-xs text-muted-foreground">
                  El slug se usa para la URL del producto. Si lo deja en blanco, se generará automáticamente.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compatibility" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compatibilidad</CardTitle>
              <CardDescription>Agregue los modelos de motocicletas compatibles con este producto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Marca</Label>
                  <Input id="brand" name="brand" value={compatibilityForm.brand} onChange={handleCompatibilityChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Modelo</Label>
                  <Input id="model" name="model" value={compatibilityForm.model} onChange={handleCompatibilityChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Año</Label>
                  <Input id="year" name="year" value={compatibilityForm.year} onChange={handleCompatibilityChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={compatibilityForm.notes || ""}
                    onChange={handleCompatibilityChange}
                  />
                </div>
              </div>

              <Button type="button" onClick={addCompatibleModel} className="mt-2" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Agregar Modelo Compatible
              </Button>

              {formData.compatibleModels && formData.compatibleModels.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Modelos Compatibles:</h3>
                  <div className="border rounded-md p-4">
                    <div className="grid grid-cols-4 gap-4 font-medium text-sm mb-2">
                      <div>Marca</div>
                      <div>Modelo</div>
                      <div>Año</div>
                      <div>Acciones</div>
                    </div>
                    <Separator className="my-2" />
                    {formData.compatibleModels.map((model, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 py-2 text-sm items-center">
                        <div>{isCompatibleModelObject(model) ? model.brand : "N/A"}</div>
                        <div>{isCompatibleModelObject(model) ? model.model : "N/A"}</div>
                        <div>
                          {isCompatibleModelObject(model) ? model.year : "N/A"}
                          {isCompatibleModelObject(model) && model.notes && `(${model.notes})`}
                        </div>
                        <div>
                          <Button
                            type="button"
                            onClick={() => removeCompatibleModel(index)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Imágenes del Producto</CardTitle>
              <CardDescription>Suba imágenes para mostrar el producto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Imagen Principal</Label>
                <Input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} />
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Vista previa:</h3>
                  <div className="border rounded-md p-4 flex justify-center">
                    <div className="relative w-64 h-64">
                      <OptimizedImage src={imagePreview} alt="Vista previa" fill className="object-contain" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : isEditing ? "Actualizar Producto" : "Crear Producto"}
        </Button>
      </div>
    </form>
  )
}
