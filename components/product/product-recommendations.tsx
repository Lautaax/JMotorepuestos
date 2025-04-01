"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import ProductCard from "@/components/product-card"
import type { Product } from "@/lib/types"

interface ProductRecommendationsProps {
  productId?: string
  motorcycleBrand?: string
  motorcycleModel?: string
  motorcycleYear?: number
}

export default function ProductRecommendations({
  productId,
  motorcycleBrand,
  motorcycleModel,
  motorcycleYear,
}: ProductRecommendationsProps) {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<string>("popular")
  const [recommendations, setRecommendations] = useState<Record<string, Product[]>>({
    popular: [],
    motorcycle: [],
    history: [],
    together: [],
  })
  const [loading, setLoading] = useState<Record<string, boolean>>({
    popular: false,
    motorcycle: false,
    history: false,
    together: false,
  })

  // Cargar recomendaciones populares al inicio
  useEffect(() => {
    loadPopularProducts()
  }, [])

  // Cargar recomendaciones para moto cuando cambia la moto seleccionada
  useEffect(() => {
    if (motorcycleBrand && motorcycleModel && motorcycleYear) {
      loadMotorcycleRecommendations()
    }
  }, [motorcycleBrand, motorcycleModel, motorcycleYear])

  // Cargar recomendaciones basadas en historial cuando el usuario inicia sesión
  useEffect(() => {
    if (session?.user) {
      loadHistoryRecommendations()
    }
  }, [session])

  // Cargar productos comprados juntos cuando se proporciona un productId
  useEffect(() => {
    if (productId) {
      loadFrequentlyBoughtTogether()
    }
  }, [productId])

  // Cargar recomendaciones cuando se cambia de pestaña
  useEffect(() => {
    switch (activeTab) {
      case "popular":
        if (recommendations.popular.length === 0) {
          loadPopularProducts()
        }
        break
      case "motorcycle":
        if (recommendations.motorcycle.length === 0 && motorcycleBrand && motorcycleModel && motorcycleYear) {
          loadMotorcycleRecommendations()
        }
        break
      case "history":
        if (recommendations.history.length === 0 && session?.user) {
          loadHistoryRecommendations()
        }
        break
      case "together":
        if (recommendations.together.length === 0 && productId) {
          loadFrequentlyBoughtTogether()
        }
        break
    }
  }, [activeTab])

  const loadPopularProducts = async () => {
    setLoading((prev) => ({ ...prev, popular: true }))
    try {
      const response = await fetch(`/api/recommendations/popular`)
      if (response.ok) {
        const data = await response.json()
        setRecommendations((prev) => ({ ...prev, popular: data.products }))
      }
    } catch (error) {
      console.error("Error loading popular products:", error)
    } finally {
      setLoading((prev) => ({ ...prev, popular: false }))
    }
  }

  const loadMotorcycleRecommendations = async () => {
    if (!motorcycleBrand || !motorcycleModel || !motorcycleYear) return

    setLoading((prev) => ({ ...prev, motorcycle: true }))
    try {
      const response = await fetch(
        `/api/recommendations/motorcycle?brand=${encodeURIComponent(motorcycleBrand)}&model=${encodeURIComponent(motorcycleModel)}&year=${motorcycleYear}`,
      )
      if (response.ok) {
        const data = await response.json()
        setRecommendations((prev) => ({ ...prev, motorcycle: data.products }))
      }
    } catch (error) {
      console.error("Error loading motorcycle recommendations:", error)
    } finally {
      setLoading((prev) => ({ ...prev, motorcycle: false }))
    }
  }

  const loadHistoryRecommendations = async () => {
    if (!session?.user) return

    setLoading((prev) => ({ ...prev, history: true }))
    try {
      const response = await fetch(`/api/recommendations/history`)
      if (response.ok) {
        const data = await response.json()
        setRecommendations((prev) => ({ ...prev, history: data.products }))
      }
    } catch (error) {
      console.error("Error loading history recommendations:", error)
    } finally {
      setLoading((prev) => ({ ...prev, history: false }))
    }
  }

  const loadFrequentlyBoughtTogether = async () => {
    if (!productId) return

    setLoading((prev) => ({ ...prev, together: true }))
    try {
      const response = await fetch(`/api/recommendations/together?productId=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setRecommendations((prev) => ({ ...prev, together: data.products }))
      }
    } catch (error) {
      console.error("Error loading frequently bought together:", error)
    } finally {
      setLoading((prev) => ({ ...prev, together: false }))
    }
  }

  // Determinar qué pestañas mostrar
  const showMotorcycleTab = Boolean(motorcycleBrand && motorcycleModel && motorcycleYear)
  const showHistoryTab = Boolean(session?.user)
  const showTogetherTab = Boolean(productId)

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="popular">Más populares</TabsTrigger>
          {showMotorcycleTab && <TabsTrigger value="motorcycle">Para tu moto</TabsTrigger>}
          {showHistoryTab && <TabsTrigger value="history">Basado en tu historial</TabsTrigger>}
          {showTogetherTab && <TabsTrigger value="together">Comprados juntos</TabsTrigger>}
        </TabsList>

        <TabsContent value="popular" className="pt-4">
          {loading.popular ? (
            <RecommendationsSkeleton />
          ) : recommendations.popular.length > 0 ? (
            <ProductGrid products={recommendations.popular} />
          ) : (
            <EmptyState message="No hay productos populares disponibles" />
          )}
        </TabsContent>

        {showMotorcycleTab && (
          <TabsContent value="motorcycle" className="pt-4">
            {loading.motorcycle ? (
              <RecommendationsSkeleton />
            ) : recommendations.motorcycle.length > 0 ? (
              <ProductGrid products={recommendations.motorcycle} />
            ) : (
              <EmptyState message={`No hay productos recomendados para tu ${motorcycleBrand} ${motorcycleModel}`} />
            )}
          </TabsContent>
        )}

        {showHistoryTab && (
          <TabsContent value="history" className="pt-4">
            {loading.history ? (
              <RecommendationsSkeleton />
            ) : recommendations.history.length > 0 ? (
              <ProductGrid products={recommendations.history} />
            ) : (
              <EmptyState message="No hay recomendaciones basadas en tu historial" />
            )}
          </TabsContent>
        )}

        {showTogetherTab && (
          <TabsContent value="together" className="pt-4">
            {loading.together ? (
              <RecommendationsSkeleton />
            ) : recommendations.together.length > 0 ? (
              <ProductGrid products={recommendations.together} />
            ) : (
              <EmptyState message="No hay productos frecuentemente comprados juntos" />
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function RecommendationsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-background shadow-sm">
          <Skeleton className="aspect-square w-full rounded-t-lg" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-9 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}

