"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getProducts, addProduct, updateProduct, deleteProduct } from "@/lib/products"
import type { Product } from "@/lib/types"
import { useRouter } from "next/navigation"

interface ProductsTableProps {
  filters?: {
    search?: string
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    stockStatus?: string
    compatibleModel?: string
  }
}

export default function ProductsTable({ filters = {} }: ProductsTableProps) {
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
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

  const router = useRouter()

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const options: any = { ...filters }

        // Convert stockStatus to appropriate filter
        if (filters.stockStatus === "in-stock") {
          options.minStock = 1
        } else if (filters.stockStatus === "out-of-stock") {
          options.maxStock = 0
        } else if (filters.stockStatus === "low-stock") {
          options.minStock = 1
          options.maxStock = 5
        }

        const data = await getProducts(options)
        setProducts(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [filters, toast, router])

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

  const handleAddProduct = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.price || formData.price <= 0) {
        throw new Error("Por favor completa los campos obligatorios")
      }

      const newProduct = await addProduct(formData as Product)
      setProducts((prev) => [...prev, newProduct])
      setIsAddDialogOpen(false)
      setFormData({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        brand: "",
        sku: "",
        image: "",
      })

      toast({
        title: "Producto agregado",
        description: "El producto ha sido agregado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al agregar el producto",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = async () => {
    try {
      if (!currentProduct || !currentProduct.id) return

      // Validate form
      if (!formData.name || !formData.price || formData.price <= 0) {
        throw new Error("Por favor completa los campos obligatorios")
      }

      const updatedProduct = await updateProduct(currentProduct.id, formData as Product)
      setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
      setIsEditDialogOpen(false)

      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al actualizar el producto",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async () => {
    try {
      if (!currentProduct || !currentProduct.id) return

      await deleteProduct(currentProduct.id)
      setProducts((prev) => prev.filter((p) => p.id !== currentProduct.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al eliminar el producto",
        variant: "destructive",
      })
    }
  }

  // Modificar la función openEditDialog para redirigir a la página de edición en lugar de abrir un diálogo
  const openEditDialog = (product: Product) => {
    router.push(`/admin/products/${product.id}/edit`)
  }

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product)
    setIsDeleteDialogOpen(true)
  }

  if (isLoading) {
    return <div>Cargando productos...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Productos</h2>
          <p className="text-sm text-muted-foreground">{products.length} productos en total</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No hay productos disponibles
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-10 w-10 relative">
                      <Image
                        src={product.image || "/placeholder.svg?height=40&width=40"}
                        alt={product.name}
                        fill
                        className="rounded-md object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(product)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Agregar Producto</DialogTitle>
            <DialogDescription>Completa los detalles del nuevo producto</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" value={formData.sku} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
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
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category as string}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleccionar" />
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
              <div className="grid gap-2">
                <Label htmlFor="brand">Marca</Label>
                <Input id="brand" name="brand" value={formData.brand} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">URL de Imagen</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddProduct}>Agregar Producto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Producto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

