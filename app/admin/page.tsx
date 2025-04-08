"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Package, Users, ShoppingBag, DollarSign, TrendingUp, AlertCircle, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { checkAdminAuth } from "@/lib/auth"
import type { Order } from "@/lib/types"

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    outOfStockCount: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

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
          // Usar router.push sin type casting
          router.push("/auth" as any)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un error al verificar tu autenticación",
          variant: "destructive",
        })
        // Usar router.push sin type casting
        router.push("/auth" as any)
      } finally {
        setLoading(false)
      }
    }

    const fetchDashboardData = async () => {
      try {
        // Obtener estadísticas
        const statsResponse = await fetch("/api/dashboard/stats")
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        // Obtener órdenes recientes
        const ordersResponse = await fetch("/api/orders?limit=5")
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          setRecentOrders(ordersData.orders || [])
        }
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error)
      }
    }

    checkAuth()
    fetchDashboardData()
  }, [router, toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  // Función para formatear fecha
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "N/A"
    if (dateString instanceof Date) {
      return dateString.toLocaleDateString()
    }
    return new Date(dateString).toLocaleDateString()
  }

  // Función para obtener el badge de estado
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>
      case "processing":
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Procesando</span>
      case "shipped":
        return <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Enviado</span>
      case "delivered":
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Entregado</span>
      case "cancelled":
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelado</span>
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al panel de administración</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+12%</span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingOrders} pendientes de procesar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.outOfStockCount > 0 ? (
                <>
                  <AlertCircle className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{stats.outOfStockCount} sin stock</span>
                </>
              ) : (
                <span>Todos con stock</span>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+5%</span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Recent Orders and Low Stock */}
      <Tabs defaultValue="recent-orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent-orders">Pedidos Recientes</TabsTrigger>
          <TabsTrigger value="low-stock">Productos con Bajo Stock</TabsTrigger>
        </TabsList>

        <TabsContent value="recent-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recientes</CardTitle>
              <CardDescription>Los últimos 5 pedidos recibidos en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">ID</th>
                      <th className="text-left py-3 px-2">Cliente</th>
                      <th className="text-left py-3 px-2">Fecha</th>
                      <th className="text-left py-3 px-2">Total</th>
                      <th className="text-left py-3 px-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-muted-foreground">
                          No hay pedidos recientes
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-3 px-2 font-medium">{order.id.substring(0, 8)}...</td>
                          <td className="py-3 px-2">{order.customerName}</td>
                          <td className="py-3 px-2">{formatDate(order.createdAt)}</td>
                          <td className="py-3 px-2">${order.total.toFixed(2)}</td>
                          <td className="py-3 px-2">{getStatusBadge(order.status)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/admin/orders")}>
                Ver todos los pedidos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="low-stock" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Productos con Bajo Stock</CardTitle>
              <CardDescription>Productos que necesitan reabastecimiento pronto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Producto</th>
                      <th className="text-left py-3 px-2">SKU</th>
                      <th className="text-left py-3 px-2">Categoría</th>
                      <th className="text-left py-3 px-2">Stock</th>
                      <th className="text-left py-3 px-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Amortiguadores Ajustables</td>
                      <td className="py-3 px-2">RS-AM-ADJ</td>
                      <td className="py-3 px-2">suspension</td>
                      <td className="py-3 px-2 text-red-500">3</td>
                      <td className="py-3 px-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-2 font-medium">Horquillas Delanteras</td>
                      <td className="py-3 px-2">RS-HD-PRO</td>
                      <td className="py-3 px-2">suspension</td>
                      <td className="py-3 px-2 text-red-500">5</td>
                      <td className="py-3 px-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/admin/products")}>
                Gestionar inventario
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Accesos directos a acciones comunes</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => router.push("/admin/products/new")}
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
          >
            <Package className="h-5 w-5" />
            <span>Añadir Producto</span>
          </Button>
          <Button
            onClick={() => router.push("/admin/orders")}
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            <span>Ver Pedidos</span>
          </Button>
          <Button
            onClick={() => router.push("/admin/marketing/coupons")}
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
          >
            <Tag className="h-5 w-5" />
            <span>Crear Cupón</span>
          </Button>
          <Button
            onClick={() => router.push("/admin/analytics")}
            className="h-auto py-4 flex flex-col items-center justify-center gap-2"
          >
            <TrendingUp className="h-5 w-5" />
            <span>Ver Analíticas</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
