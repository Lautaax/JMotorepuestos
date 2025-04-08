"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash, MoreHorizontal, Percent, DollarSign } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { checkAdminAuth } from "@/lib/auth"
import type { Coupon } from "@/lib/types"

export default function CouponsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false)
  const [isDeleteCouponDialogOpen, setIsDeleteCouponDialogOpen] = useState(false)
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    discount: 0,
    discountType: "percentage",
    minPurchase: 0,
    maxUses: 0,
    validFrom: new Date().toISOString().split("T")[0],
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isActive: true,
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
          router.push("/auth" as any)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un error al verificar tu autenticación",
          variant: "destructive",
        })
        router.push("/auth" as any)
      } finally {
        setLoading(false)
      }
    }

    const fetchCoupons = async () => {
      try {
        const response = await fetch("/api/coupons")
        if (response.ok) {
          const data = await response.json()
          setCoupons(data.coupons)
        }
      } catch (error) {
        console.error("Error al obtener cupones:", error)
      }
    }

    checkAuth()
    fetchCoupons()
  }, [router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "discount" || name === "minPurchase" || name === "maxUses" ? Number(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddCoupon = async () => {
    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al crear cupón")
      }

      const newCoupon = await response.json()
      setCoupons((prev) => [...prev, newCoupon])
      setIsCouponDialogOpen(false)

      toast({
        title: "Cupón creado",
        description: `El cupón ${newCoupon.code} ha sido creado exitosamente`,
      })

      // Resetear formulario
      setFormData({
        code: "",
        discount: 0,
        discountType: "percentage",
        minPurchase: 0,
        maxUses: 0,
        validFrom: new Date().toISOString().split("T")[0],
        validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        isActive: true,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al crear el cupón",
        variant: "destructive",
      })
    }
  }

  const handleEditCoupon = async () => {
    if (!currentCoupon) return

    try {
      const response = await fetch(`/api/coupons/${currentCoupon.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al actualizar cupón")
      }

      const updatedCoupon = await response.json()
      setCoupons((prev) => prev.map((c) => (c.id === updatedCoupon.id ? updatedCoupon : c)))
      setIsCouponDialogOpen(false)
      setCurrentCoupon(null)

      toast({
        title: "Cupón actualizado",
        description: `El cupón ${updatedCoupon.code} ha sido actualizado exitosamente`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al actualizar el cupón",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCoupon = async () => {
    if (!currentCoupon) return

    try {
      const response = await fetch(`/api/coupons/${currentCoupon.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al eliminar cupón")
      }

      setCoupons((prev) => prev.filter((c) => c.id !== currentCoupon.id))
      setIsDeleteCouponDialogOpen(false)
      setCurrentCoupon(null)

      toast({
        title: "Cupón eliminado",
        description: `El cupón ha sido eliminado exitosamente`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al eliminar el cupón",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (coupon: Coupon) => {
    setCurrentCoupon(coupon)
    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      discountType: coupon.discountType,
      minPurchase: coupon.minPurchase || 0,
      maxUses: coupon.maxUses || 0,
      validFrom: new Date(coupon.validFrom).toISOString().split("T")[0],
      validTo: new Date(coupon.validTo).toISOString().split("T")[0],
      isActive: coupon.isActive,
    })
    setIsCouponDialogOpen(true)
  }

  const openDeleteDialog = (coupon: Coupon) => {
    setCurrentCoupon(coupon)
    setIsDeleteCouponDialogOpen(true)
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
            <h1 className="text-3xl font-bold">Cupones de Descuento</h1>
            <p className="text-muted-foreground">Gestiona los cupones de descuento para tu tienda</p>
          </div>
          <Button onClick={() => setIsCouponDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cupón
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listado de Cupones</CardTitle>
            <CardDescription>Administra los cupones de descuento disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Validez</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No hay cupones disponibles
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">{coupon.code}</TableCell>
                      <TableCell>
                        {coupon.discountType === "percentage"
                          ? `${coupon.discount}%`
                          : `$${coupon.discount.toFixed(2)}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-xs">Desde: {new Date(coupon.validFrom).toLocaleDateString()}</span>
                          <span className="text-xs">Hasta: {new Date(coupon.validTo).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {coupon.usedCount} {coupon.maxUses ? `/ ${coupon.maxUses}` : ""}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            coupon.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {coupon.isActive ? "Activo" : "Inactivo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(coupon)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDeleteDialog(coupon)}>
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
          </CardContent>
        </Card>
      </div>

      {/* Diálogo para crear/editar cupón */}
      <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentCoupon ? "Editar Cupón" : "Crear Nuevo Cupón"}</DialogTitle>
            <DialogDescription>
              {currentCoupon
                ? "Actualiza los detalles del cupón de descuento"
                : "Completa los detalles para crear un nuevo cupón de descuento"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="VERANO2023"
                  className="uppercase"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discountType">Tipo de Descuento *</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) => handleSelectChange("discountType", value)}
                >
                  <SelectTrigger id="discountType">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                    <SelectItem value="fixed">Monto Fijo ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="discount">
                  {formData.discountType === "percentage" ? "Porcentaje de Descuento *" : "Monto de Descuento *"}
                </Label>
                <div className="relative">
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    step={formData.discountType === "percentage" ? "1" : "0.01"}
                    value={formData.discount}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {formData.discountType === "percentage" ? (
                      <Percent className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minPurchase">Compra Mínima (opcional)</Label>
                <div className="relative">
                  <Input
                    id="minPurchase"
                    name="minPurchase"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.minPurchase}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="validFrom">Válido Desde *</Label>
                <Input
                  id="validFrom"
                  name="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="validTo">Válido Hasta *</Label>
                <Input
                  id="validTo"
                  name="validTo"
                  type="date"
                  value={formData.validTo}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="maxUses">Usos Máximos (opcional)</Label>
                <Input
                  id="maxUses"
                  name="maxUses"
                  type="number"
                  min="0"
                  value={formData.maxUses}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleSwitchChange("isActive", checked)}
                />
                <Label htmlFor="isActive">Cupón Activo</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCouponDialogOpen(false)
                setCurrentCoupon(null)
                setFormData({
                  code: "",
                  discount: 0,
                  discountType: "percentage",
                  minPurchase: 0,
                  maxUses: 0,
                  validFrom: new Date().toISOString().split("T")[0],
                  validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                  isActive: true,
                })
              }}
            >
              Cancelar
            </Button>
            <Button onClick={currentCoupon ? handleEditCoupon : handleAddCoupon}>
              {currentCoupon ? "Guardar Cambios" : "Crear Cupón"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar cupón */}
      <Dialog open={isDeleteCouponDialogOpen} onOpenChange={setIsDeleteCouponDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Cupón</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el cupón {currentCoupon?.code}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCouponDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteCoupon}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
