"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { checkAdminAuth } from "@/lib/auth"
import ProductsTable from "@/components/admin/products-table"
import ImportExportProducts from "@/components/admin/import-export-products"
import ProductFilters, { type ProductFilters as FilterType } from "@/components/admin/products-filters"

export default function ProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("list")

  const [filters, setFilters] = useState<FilterType>({
    search: "",
    category: "",
    brand: "",
    minPrice: 0,
    maxPrice: 100000,
    stockStatus: "",
    compatibleModel: "",
  })
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])

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

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        // Aquí normalmente harías una llamada a la API para obtener categorías y marcas
        // Por ahora usaremos valores estáticos
        setCategories(["motor", "frenos", "suspension", "electrico", "accesorios"])
        setBrands(["Honda", "Yamaha", "Suzuki", "Kawasaki", "Ducati", "BMW", "KTM"])
      } catch (error) {
        console.error("Error al cargar categorías y marcas:", error)
      }
    }

    fetchCategoriesAndBrands()
  }, [])

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
          <h1 className="text-3xl font-bold">Gestión de Productos</h1>
          <p className="text-muted-foreground">Administra el catálogo de productos de la tienda</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="list">Listado de Productos</TabsTrigger>
            <TabsTrigger value="import-export">Importar/Exportar</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4 mt-4">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() =>
                setFilters({
                  search: "",
                  category: "",
                  brand: "",
                  minPrice: 0,
                  maxPrice: 100000,
                  stockStatus: "",
                  compatibleModel: "",
                })
              }
              categories={categories}
              brands={brands}
              maxPriceValue={100000}
            />
            <ProductsTable filters={filters} />
          </TabsContent>

          <TabsContent value="import-export" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Importar y Exportar Productos</CardTitle>
                <CardDescription>Gestiona tu inventario de forma masiva mediante archivos Excel</CardDescription>
              </CardHeader>
              <CardContent>
                <ImportExportProducts />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
