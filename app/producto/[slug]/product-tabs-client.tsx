"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ProductReviews from "@/components/product-reviews"

export default function ProductTabsClient({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState("detalles")

  return (
    <Tabs defaultValue="detalles" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="border-b w-full justify-start rounded-none bg-transparent p-0">
        <TabsTrigger
          value="detalles"
          className={`rounded-none border-b-2 px-4 py-2 ${
            activeTab === "detalles"
              ? "border-primary font-medium text-foreground"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Detalles
        </TabsTrigger>
        <TabsTrigger
          value="especificaciones"
          className={`rounded-none border-b-2 px-4 py-2 ${
            activeTab === "especificaciones"
              ? "border-primary font-medium text-foreground"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Especificaciones
        </TabsTrigger>
        <TabsTrigger
          value="compatibilidad"
          className={`rounded-none border-b-2 px-4 py-2 ${
            activeTab === "compatibilidad"
              ? "border-primary font-medium text-foreground"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Compatibilidad
        </TabsTrigger>
        <TabsTrigger
          value="resenas"
          className={`rounded-none border-b-2 px-4 py-2 ${
            activeTab === "resenas"
              ? "border-primary font-medium text-foreground"
              : "border-transparent text-muted-foreground"
          }`}
        >
          Reseñas
        </TabsTrigger>
      </TabsList>

      <TabsContent value="detalles" className="mt-6">
        <div className="prose max-w-none">
          <p>{product.description}</p>
          {product.longDescription && <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />}
        </div>
      </TabsContent>

      <TabsContent value="especificaciones" className="mt-6">
        <div className="space-y-4">
          {product.specifications && Array.isArray(product.specifications) && product.specifications.length > 0 ? (
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Especificaciones</h2>
              <ul className="list-disc pl-5 space-y-1">
                {product.specifications.map((spec: string, index: number) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted-foreground">No hay especificaciones disponibles para este producto.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="compatibilidad" className="mt-6">
        <div className="space-y-4">
          {product.compatibleModels &&
          Array.isArray(product.compatibleModels) &&
          product.compatibleModels.length > 0 ? (
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Modelos compatibles</h2>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {product.compatibleModels.map((model: any, index: number) => (
                  <div key={index} className="rounded-lg border p-3">
                    <div className="font-medium">
                      {model.brand && model.model ? `${model.brand} ${model.model}` : "Modelo compatible"}
                    </div>
                    <div className="text-sm text-muted-foreground">{model.year ? `Año: ${model.year}` : ""}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No hay información de compatibilidad disponible para este producto.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="resenas" className="mt-6">
        <ProductReviews productId={product.id} />
      </TabsContent>
    </Tabs>
  )
}
