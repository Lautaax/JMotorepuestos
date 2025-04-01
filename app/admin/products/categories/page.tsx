"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { checkAdminAuth } from "@/lib/auth"

// Definir una interfaz para las categorías
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  productCount: number
}

// Datos de ejemplo para las categorías
const sampleCategories: Category[] = [
  {
    id: "1",
    name: "Motor",
    slug: "motor",
    description: "Partes y repuestos para el motor de tu motocicleta",
    productCount: 24,
  },
  {
    id: "2",
    name: "Frenos",
    slug: "frenos",
    description: "Sistema de frenos y componentes relacionados",
    productCount: 18,
  },
  {
    id: "3",
    name: "Suspensión",
    slug: "suspension",
    description: "Amortiguadores, horquillas y componentes de suspensión",
    productCount: 15,
  },
  {
    id: "4",
    name: "Eléctrico",
    slug: "electrico",
    description: "Componentes eléctricos y electrónicos",
    productCount: 20,
  },
  {
    id: "5",
    name: "Accesorios",
    slug: "accesorios",
    description: "Accesorios y complementos para tu motocicleta",
    productCount: 30,
  },
]

export default function CategoriesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>(sampleCategories)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Auto-generar slug a partir del nombre
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleAddCategory = () => {
    // Simulación de añadir categoría
    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      productCount: 0,
    }

    setCategories([...categories, newCategory])
    setIsAddDialogOpen(false)
    setFormData({ name: "", slug: "", description: "" })

    toast({
      title: "Categoría creada",
      description: "La categoría ha sido creada exitosamente",
    })
  }

  const handleEditCategory = () => {
    if (!currentCategory) return

    // Simulación de editar categoría
    const updatedCategories = categories.map((cat) =>
      cat.id === currentCategory.id
        ? { ...cat, name: formData.name, slug: formData.slug, description: formData.description }
        : cat,
    )

    setCategories(updatedCategories)
    setIsEditDialogOpen(false)
    setCurrentCategory(null)

    toast({
      title: "Categoría actualizada",
      description: "La categoría ha sido actualizada exitosamente",
    })
  }

  const handleDeleteCategory = () => {
    if (!currentCategory) return

    // Simulación de eliminar categoría
    const filteredCategories = categories.filter((cat) => cat.id !== currentCategory.id)
    setCategories(filteredCategories)
    setIsDeleteDialogOpen(false)
    setCurrentCategory(null)

    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada exitosamente",
    })
  }

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (category: Category) => {
    setCurrentCategory(category)
    setIsDeleteDialogOpen(true)
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Categorías de Productos</h1>
            <p className="text-muted-foreground">Gestiona las categorías de productos de la tienda</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de Categorías</CardTitle>
            <CardDescription>Administra las categorías para organizar tus productos</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                    <TableCell>{category.productCount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(category)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(category)}>
                            <Trash className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo para añadir categoría */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Añadir Nueva Categoría</DialogTitle>
            <DialogDescription>Crea una nueva categoría para organizar tus productos</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre de la Categoría</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Accesorios"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="Ej: accesorios"
              />
              <p className="text-sm text-muted-foreground">
                El slug se usa en las URLs. Se genera automáticamente a partir del nombre.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe brevemente esta categoría"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCategory}>Crear Categoría</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar categoría */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>Modifica los detalles de la categoría</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nombre de la Categoría</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input id="edit-slug" name="slug" value={formData.slug} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descripción</Label>
              <Input
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCategory}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar categoría */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Categoría</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la categoría "{currentCategory?.name}"? Esta acción no se puede
              deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

