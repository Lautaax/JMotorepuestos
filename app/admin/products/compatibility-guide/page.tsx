"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { checkAdminAuth } from "@/lib/auth"
import { getProducts } from "@/lib/products"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export default function CompatibilityGuidePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    year: "",
  })

  // Extraer marcas, modelos y años únicos de los productos
  const brands = Array.from(new Set(products.flatMap((p) => p.compatibleModels?.map((c) => c.brand) || [])))
    .filter(Boolean)
    .sort()

  const models = Array.from(
    new Set(
      products.flatMap(
        (p) => p.compatibleModels?.filter((c) => !filters.brand || c.brand === filters.brand).map((c) => c.model) || [],
      ),
    ),
  )
    .filter(Boolean)
    .sort()

  const years = Array.from(
    new Set(
      products.flatMap(
        (p) =>
          p.compatibleModels
            ?.filter(
              (c) => (!filters.brand || c.brand === filters.brand) && (!filters.model || c.model === filters.model),
            )
            .map((c) => c.year) || [],
      ),
    ),
  )
    .filter(Boolean)
    .sort()

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
      }
    }

    const fetchProducts = async () => {
      try {
        const data = await getProducts({})
        // Filtrar solo productos con compatibilidades
        const productsWithCompatibility = data.filter((p) => p.compatibleModels && p.compatibleModels.length > 0)
        setProducts(productsWithCompatibility)
        setFilteredProducts(productsWithCompatibility)
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
    fetchProducts()
  }, [router, toast])

  // Filtrar productos cuando cambian los filtros
  useEffect(() => {
    const filtered = products.filter((product) => {
      // Si no hay compatibilidades, no incluir el producto
      if (!product.compatibleModels || product.compatibleModels.length === 0) {
        return false
      }

      // Verificar si alguna compatibilidad coincide con los filtros
      return product.compatibleModels.some((compat) => {
        const brandMatch = !filters.brand || compat.brand === filters.brand
        const modelMatch = !filters.model || compat.model === filters.model
        const yearMatch = !filters.year || compat.year === filters.year

        return brandMatch && modelMatch && yearMatch
      })
    })

    setFilteredProducts(filtered)
  }, [filters, products])

  const handleFilterChange = (field: string, value: string) => {
    // Si cambiamos la marca, reseteamos el modelo y el año
    if (field === "brand" && value !== filters.brand) {
      setFilters({
        brand: value,
        model: "",
        year: "",
      })
    }
    // Si cambiamos el modelo, reseteamos el año
    else if (field === "model" && value !== filters.model) {
      setFilters({
        ...filters,
        model: value,
        year: "",
      })
    }
    // De lo contrario, solo actualizamos el campo correspondiente
    else {
      setFilters({
        ...filters,
        [field]: value,
      })
    }
  }

  const resetFilters = () => {
    setFilters({
      brand: "",
      model: "",
      year: "",
    })
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
          <h1 className="text-3xl font-bold">Guía de Compatibilidad</h1>
          <p className="text-muted-foreground">Encuentra productos compatibles con diferentes modelos de motos</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtrar por Moto</CardTitle>
            <CardDescription>
              Selecciona la marca, modelo y año de la moto para ver los productos compatibles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Select value={filters.brand} onValueChange={(value) => handleFilterChange("brand", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={filters.model}
                  onValueChange={(value) => handleFilterChange("model", value)}
                  disabled={!filters.brand}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={filters.year}
                  onValueChange={(value) => handleFilterChange("year", value)}
                  disabled={!filters.model}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar año" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline">
              Limpiar filtros
            </button>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">{filteredProducts.length} productos compatibles encontrados</h3>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Compatibilidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No se encontraron productos compatibles con los filtros seleccionados
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            <a href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:underline">
                              {product.name}
                            </a>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {product.compatibleModels
                                ?.filter((compat) => {
                                  const brandMatch = !filters.brand || compat.brand === filters.brand
                                  const modelMatch = !filters.model || compat.model === filters.model
                                  const yearMatch = !filters.year || compat.year === filters.year
                                  return brandMatch && modelMatch && yearMatch
                                })
                                .map((compat, i) => (
                                  <div key={i} className="mb-1">
                                    {compat.brand} {compat.model} {compat.year}
                                    {compat.notes && <span className="text-gray-500"> ({compat.notes})</span>}
                                  </div>
                                ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
