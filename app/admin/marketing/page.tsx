"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash, Edit, Mail, Tag, MoreHorizontal, Percent, DollarSign, Users, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { checkAdminAuth } from "@/lib/auth"
import type { Coupon, EmailCampaign, EmailSubscriber } from "@/lib/types"

export default function MarketingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("coupons")

  // Estados para cupones
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false)
  const [isDeleteCouponDialogOpen, setIsDeleteCouponDialogOpen] = useState(false)
  const [currentCoupon, setCurrentCoupon] = useState<Coupon | null>(null)
  const [couponFormData, setCouponFormData] = useState({
    code: "",
    discount: 0,
    discountType: "percentage",
    minPurchase: 0,
    maxUses: 0,
    validFrom: new Date().toISOString().split("T")[0],
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isActive: true,
  })

  // Estados para email marketing
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([])
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false)
  const [isDeleteCampaignDialogOpen, setIsDeleteCampaignDialogOpen] = useState(false)
  const [currentCampaign, setCurrentCampaign] = useState<EmailCampaign | null>(null)
  const [campaignFormData, setCampaignFormData] = useState({
    name: "",
    subject: "",
    content: "",
    status: "draft",
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAdmin = await checkAdminAuth()
        if (!isAdmin) {
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos para acceder al panel de marketing",
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

    // Aquí se añadirían las funciones para obtener suscriptores y campañas

    checkAuth()
    fetchCoupons()
    // fetchSubscribers()
    // fetchCampaigns()
  }, [router, toast])

  // Funciones para manejar cupones
  const handleCouponInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCouponFormData((prev) => ({
      ...prev,
      [name]: name === "discount" || name === "minPurchase" || name === "maxUses" ? Number(value) : value,
    }))
  }

  const handleCouponSelectChange = (name: string, value: string) => {
    setCouponFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCouponSwitchChange = (name: string, checked: boolean) => {
    setCouponFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAddCoupon = async () => {
    try {
      const response = await fetch("/api/coupons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(couponFormData),
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
      setCouponFormData({
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

  // Funciones para manejar campañas de email
  const handleCampaignInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCampaignFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCampaignSelectChange = (name: string, value: string) => {
    setCampaignFormData((prev) => ({ ...prev, [name]: value }))
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
          <h1 className="text-3xl font-bold">Marketing</h1>
          <p className="text-muted-foreground">Gestiona cupones y campañas de email marketing</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="coupons" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Cupones
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Marketing
            </TabsTrigger>
          </TabsList>

          {/* Pestaña de Cupones */}
          <TabsContent value="coupons" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Cupones de Descuento</h2>
              <Button onClick={() => setIsCouponDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Cupón
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentCoupon(coupon)
                                    setCouponFormData({
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
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setCurrentCoupon(coupon)
                                    setIsDeleteCouponDialogOpen(true)
                                  }}
                                >
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
          </TabsContent>

          {/* Pestaña de Email Marketing */}
          <TabsContent value="email" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Suscriptores
                  </CardTitle>
                  <CardDescription>Gestiona tus suscriptores de email</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-bold">{subscribers.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Suscriptores activos</p>
                    </div>
                    <Button variant="outline">Exportar Lista</Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Últimos suscriptores</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Fecha</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subscribers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="h-24 text-center">
                                No hay suscriptores disponibles
                              </TableCell>
                            </TableRow>
                          ) : (
                            subscribers.slice(0, 5).map((subscriber) => (
                              <TableRow key={subscriber.id}>
                                <TableCell>{subscriber.email}</TableCell>
                                <TableCell>{new Date(subscriber.subscribedAt).toLocaleDateString()}</TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Campañas
                  </CardTitle>
                  <CardDescription>Crea y gestiona campañas de email</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-bold">{campaigns.length || 0}</p>
                      <p className="text-sm text-muted-foreground">Campañas enviadas</p>
                    </div>
                    <Button onClick={() => setIsCampaignDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nueva Campaña
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Campañas recientes</h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Enviados</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {campaigns.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} className="h-24 text-center">
                                No hay campañas disponibles
                              </TableCell>
                            </TableRow>
                          ) : (
                            campaigns.slice(0, 5).map((campaign) => (
                              <TableRow key={campaign.id}>
                                <TableCell>{campaign.name}</TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      campaign.status === "sent"
                                        ? "bg-green-100 text-green-800"
                                        : campaign.status === "sending"
                                          ? "bg-blue-100 text-blue-800"
                                          : campaign.status === "scheduled"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {campaign.status === "sent"
                                      ? "Enviada"
                                      : campaign.status === "sending"
                                        ? "Enviando"
                                        : campaign.status === "scheduled"
                                          ? "Programada"
                                          : "Borrador"}
                                  </span>
                                </TableCell>
                                <TableCell>{campaign.sentTo}</TableCell>
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
          </TabsContent>
        </Tabs>
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
                  value={couponFormData.code}
                  onChange={handleCouponInputChange}
                  placeholder="VERANO2023"
                  className="uppercase"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="discountType">Tipo de Descuento *</Label>
                <Select
                  value={couponFormData.discountType}
                  onValueChange={(value) => handleCouponSelectChange("discountType", value)}
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
                  {couponFormData.discountType === "percentage" ? "Porcentaje de Descuento *" : "Monto de Descuento *"}
                </Label>
                <div className="relative">
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    step={couponFormData.discountType === "percentage" ? "1" : "0.01"}
                    value={couponFormData.discount}
                    onChange={handleCouponInputChange}
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {couponFormData.discountType === "percentage" ? (
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
                    value={couponFormData.minPurchase}
                    onChange={handleCouponInputChange}
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
                  value={couponFormData.validFrom}
                  onChange={handleCouponInputChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="validTo">Válido Hasta *</Label>
                <Input
                  id="validTo"
                  name="validTo"
                  type="date"
                  value={couponFormData.validTo}
                  onChange={handleCouponInputChange}
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
                  value={couponFormData.maxUses}
                  onChange={handleCouponInputChange}
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="isActive"
                  checked={couponFormData.isActive}
                  onCheckedChange={(checked) => handleCouponSwitchChange("isActive", checked)}
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
                setCouponFormData({
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
            <Button onClick={handleAddCoupon}>{currentCoupon ? "Guardar Cambios" : "Crear Cupón"}</Button>
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
            <Button
              variant="destructive"
              onClick={() => {
                // Aquí iría la lógica para eliminar el cupón
                setIsDeleteCouponDialogOpen(false)
                setCurrentCoupon(null)
              }}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para crear/editar campaña */}
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentCampaign ? "Editar Campaña" : "Crear Nueva Campaña"}</DialogTitle>
            <DialogDescription>
              {currentCampaign
                ? "Actualiza los detalles de la campaña de email"
                : "Completa los detalles para crear una nueva campaña de email"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre de la Campaña *</Label>
              <Input
                id="name"
                name="name"
                value={campaignFormData.name}
                onChange={handleCampaignInputChange}
                placeholder="Promoción de Verano"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Asunto del Email *</Label>
              <Input
                id="subject"
                name="subject"
                value={campaignFormData.subject}
                onChange={handleCampaignInputChange}
                placeholder="¡Ofertas especiales solo por esta semana!"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Contenido del Email *</Label>
              <Textarea
                id="content"
                name="content"
                value={campaignFormData.content}
                onChange={handleCampaignInputChange}
                placeholder="Escribe aquí el contenido de tu email..."
                rows={8}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={campaignFormData.status}
                onValueChange={(value) => handleCampaignSelectChange("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="scheduled">Programar Envío</SelectItem>
                  <SelectItem value="sending">Enviar Ahora</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {campaignFormData.status === "scheduled" && (
              <div className="grid gap-2">
                <Label htmlFor="scheduledFor">Programar para</Label>
                <Input
                  id="scheduledFor"
                  name="scheduledFor"
                  type="datetime-local"
                  onChange={handleCampaignInputChange}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCampaignDialogOpen(false)
                setCurrentCampaign(null)
                setCampaignFormData({
                  name: "",
                  subject: "",
                  content: "",
                  status: "draft",
                })
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={() => {
                // Aquí iría la lógica para guardar la campaña
                setIsCampaignDialogOpen(false)
              }}
            >
              {currentCampaign ? "Guardar Cambios" : "Crear Campaña"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

