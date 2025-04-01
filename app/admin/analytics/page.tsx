"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { checkAdminAuth } from "@/lib/auth"
import type { DashboardStats } from "@/lib/types"

// Componente para gráfico de barras
const BarChartComponent = () => (
  <div className="h-[300px] w-full flex items-end justify-between gap-2 pb-2">
    {Array.from({ length: 12 }).map((_, i) => {
      const height = Math.floor(Math.random() * 70) + 30
      return (
        <div key={i} className="relative w-full">
          <div className="bg-primary rounded-t-md w-full" style={{ height: `${height}%` }}></div>
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs">
            {["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
          </span>
        </div>
      )
    })}
  </div>
)

// Componente para gráfico de línea
const LineChartComponent = () => {
  // Simulación de datos para el gráfico
  const points = Array.from({ length: 10 }).map((_, i) => ({
    x: i * 10,
    y: Math.floor(Math.random() * 50) + 50,
  }))

  // Crear el path para el gráfico
  const pathData = points.map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${100 - point.y}`).join(" ")

  return (
    <div className="h-[300px] w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path d={pathData} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
        {points.map((point, i) => (
          <circle key={i} cx={point.x} cy={100 - point.y} r="2" fill="hsl(var(--primary))" />
        ))}
      </svg>
    </div>
  )
}

// Componente para gráfico circular
const PieChartComponent = () => {
  // Datos simulados para el gráfico
  const data = [
    { value: 35, color: "hsl(var(--primary))" },
    { value: 25, color: "hsl(var(--primary) / 0.8)" },
    { value: 20, color: "hsl(var(--primary) / 0.6)" },
    { value: 15, color: "hsl(var(--primary) / 0.4)" },
    { value: 5, color: "hsl(var(--primary) / 0.2)" },
  ]

  // Calcular ángulos para el gráfico
  let cumulativePercent = 0
  const segments = data.map((segment) => {
    const startPercent = cumulativePercent
    cumulativePercent += segment.value
    return {
      ...segment,
      startAngle: (startPercent / 100) * Math.PI * 2 - Math.PI / 2,
      endAngle: (cumulativePercent / 100) * Math.PI * 2 - Math.PI / 2,
    }
  })

  return (
    <div className="h-[300px] w-full flex items-center justify-center">
      <svg viewBox="-1 -1 2 2" className="h-full w-full" style={{ transform: "rotate(-90deg)" }}>
        {segments.map((segment, i) => {
          const x1 = Math.cos(segment.startAngle)
          const y1 = Math.sin(segment.startAngle)
          const x2 = Math.cos(segment.endAngle)
          const y2 = Math.sin(segment.endAngle)

          // Determinar si el arco es mayor a 180 grados
          const largeArcFlag = segment.endAngle - segment.startAngle > Math.PI ? 1 : 0

          const pathData = [`M ${x1} ${y1}`, `A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2}`, `L 0 0`].join(" ")

          return <path key={i} d={pathData} fill={segment.color} />
        })}
      </svg>
    </div>
  )
}

export default function AnalyticsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [timeRange, setTimeRange] = useState("30d")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAdmin = await checkAdminAuth()
        if (!isAdmin) {
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos para acceder al panel de análisis",
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

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Error al obtener estadísticas:", error)
      }
    }

    checkAuth()
    fetchStats()
  }, [router, toast])

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Análisis y Métricas</h1>
            <p className="text-muted-foreground">Monitorea el rendimiento de tu tienda</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
                <SelectItem value="1y">Último año</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,345</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+12%</span>
                <span className="ml-1">vs periodo anterior</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+8%</span>
                <span className="ml-1">vs periodo anterior</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 45}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+15%</span>
                <span className="ml-1">vs periodo anterior</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">324</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">-3%</span>
                <span className="ml-1">vs periodo anterior</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales">Ventas</TabsTrigger>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
          </TabsList>
          <TabsContent value="sales" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Periodo</CardTitle>
                <CardDescription>Análisis de ventas en los últimos meses</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChartComponent />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="products" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento de Productos</CardTitle>
                <CardDescription>Productos más vendidos y tendencias</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChartComponent />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="customers" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Clientes</CardTitle>
                <CardDescription>Segmentación de clientes por categoría</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChartComponent />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

