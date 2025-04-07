"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductReviews from "@/components/product-reviews"
import { Badge } from "@/components/ui/badge"

// Definir el tipo CompatibleModel directamente aquí para evitar problemas de importación
interface CompatibleModel {
  brand: string
  model: string
  year: string
}

// Definir un tipo Product simplificado para este componente
interface Product {
  _id: string
  id?: string
  description: string
  longDescription?: string
  features?: string[]
  compatibleModels?: CompatibleModel[]
}

interface ProductDetailTabsProps {
  product: Product
}

export default function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("detalles")

  return (
    <Tabs defaultValue="detalles" className="mt-8" onValueChange={setActiveTab}>
      <TabsList className="border-b w-full justify-start rounded-none pb-0">
        <TabsTrigger
          value="detalles"
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Detalles
        </TabsTrigger>
        <TabsTrigger
          value="especificaciones"
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Especificaciones
        </TabsTrigger>
        <TabsTrigger
          value="compatibilidad"
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Compatibilidad
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
        >
          Reseñas
        </TabsTrigger>
      </TabsList>

      <TabsContent value="detalles" className="py-4">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Descripción del Producto</h3>
          <p>{product.description}</p>
          {product.longDescription && (
            <div className="mt-4">
              <p>{product.longDescription}</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="especificaciones" className="py-4">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Especificaciones Técnicas</h3>
          <ul className="list-disc pl-5 space-y-2">
            {product.features && product.features.length > 0 ? (
              product.features.map((feature, index) => <li key={index}>{feature}</li>)
            ) : (
              <p>No hay especificaciones disponibles para este producto.</p>
            )}
          </ul>
        </div>
      </TabsContent>

      <TabsContent value="compatibilidad" className="py-4">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Modelos Compatibles</h3>
          {product.compatibleModels && product.compatibleModels.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {product.compatibleModels.map((model, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1 text-sm">
                  {model.brand} {model.model} {model.year}
                </Badge>
              ))}
            </div>
          ) : (
            <p>No hay información de compatibilidad disponible para este producto.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="py-4">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Reseñas de Clientes</h3>
          <ProductReviews productId={product._id || product.id || ""} />
        </div>
      </TabsContent>
    </Tabs>
  )
}

