"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { updateProduct } from "@/lib/products"
import type { Product, CompatibleModel } from "@/lib/types"

interface EditProductFormProps {
  product: Product
}

export function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<Product>({
    ...product,
    compatibleModels: product.compatibleModels || [],
  })

  // Estado para el formulario de compatibilidad
  const [compatibilityForm, setCompatibilityForm] = useState<CompatibleModel>({
    brand: "",
    model: "",
    year: "",
    notes: "",
  })

  // Marcas comunes de motos
  const motoBrands = [
    "Honda",
    "Yamaha",
    "Suzuki",
    "Kawasaki",
    "Harley-Davidson",
    "BMW",
    "Ducati",
    "KTM",
    "Triumph",
    "Aprilia",
    "Bajaj",
    "Benelli",
    "Motomel",
    "Zanella",
    "Corven",
    "Gilera",
    "Kymco",
    "Otra",
  ]

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

  const handleCompatibilityChange = (field: keyof CompatibleModel, value: string) => {
    setCompatibilityForm((prev) => ({ ...prev, [field]: value }))
  }

  const addCompatibility = () => {
    // Validar que al menos tengamos marca y modelo
    if (!compatibilityForm.brand || !compatibilityForm.model) {
      toast({
        title: "Datos incompletos",
        description: "Por favor ingresa al menos la marca y modelo de la moto",
        variant: "destructive",
      })
      return
    }

    // Añadir la compatibilidad a la lista
    const newCompatibility = { ...compatibilityForm }
    setFormData((prev) => ({
      ...prev,
      compatibleModels: [...(prev.compatibleModels || []), newCompatibility],
    }))

    // Limpiar el formulario de compatibilidad
    setCompatibilityForm({
      brand: "",
      model: "",
      year: "",
      notes: "",
    })
  }

  const removeCompatibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      compatibleModels: prev.compatibleModels?.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Validar formulario
      if (!formData.name || !formData.price || formData.price <= 0) {
        throw new Error("Por favor completa los campos obligatorios")
      }

      await updateProduct(product.id, formData)

      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado exitosamente",
      })

      router.push("/admin/products")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al actualizar el producto",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Editar Producto</CardTitle>
          <CardDescription>Actualiza los detalles del producto</CardDescription>
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
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
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
              <Label htmlFor="brand">Marca del Producto</Label>
              <Input
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                placeholder="Marca del producto (ej: NGK, Brembo)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">URL de Imagen</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Sección de compatibilidad con motos */}
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <h3 className="text-lg font-medium">Compatibilidad con Motos</h3>
              <p className="text-sm text-muted-foreground">Agrega las motos con las que este producto es compatible</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="moto-brand">Marca de la Moto</Label>
                <Select
                  value={compatibilityForm.brand}
                  onValueChange={(value) => handleCompatibilityChange("brand", value)}
                >
                  <SelectTrigger id="moto-brand">
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {motoBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="moto-model">Modelo</Label>
                <Input
                  id="moto-model"
                  value={compatibilityForm.model}
                  onChange={(e) => handleCompatibilityChange("model", e.target.value)}
                  placeholder="Ej: CBR 600RR, YZF-R1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="moto-year">Año o Rango de Años</Label>
                <Input
                  id="moto-year"
                  value={compatibilityForm.year}
                  onChange={(e) => handleCompatibilityChange("year", e.target.value)}
                  placeholder="Ej: 2019, 2015-2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moto-notes">Notas Adicionales</Label>
                <Input
                  id="moto-notes"
                  value={compatibilityForm.notes}
                  onChange={(e) => handleCompatibilityChange("notes", e.target.value)}
                  placeholder="Ej: Solo para versión ABS"
                />
              </div>
            </div>

            <Button type="button" variant="outline" onClick={addCompatibility} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Compatibilidad
            </Button>

            {/* Lista de compatibilidades */}
            {formData.compatibleModels && formData.compatibleModels.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Compatibilidades agregadas:</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.compatibleModels.map((compat, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1 px-3 py-1.5">
                      <span>
                        {compat.brand} {compat.model} {compat.year}
                        {compat.notes && ` (${compat.notes})`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCompatibility(index)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Eliminar</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/products")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

