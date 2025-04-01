"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Store, Truck, CreditCard, Percent, Mail, Search, Settings, Shield, Save } from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    // Simulamos una operación de guardado
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast({
      title: "Configuración guardada",
      description: "Los cambios han sido guardados exitosamente.",
    })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">Administra la configuración de tu tienda</p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>Guardando...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar cambios
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden md:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span className="hidden md:inline">Envíos</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Pagos</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <Percent className="h-4 w-4" />
            <span className="hidden md:inline">Impuestos</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden md:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Seguridad</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden md:inline">Avanzado</span>
          </TabsTrigger>
        </TabsList>

        {/* Configuración General */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Tienda</CardTitle>
              <CardDescription>Configura la información básica de tu tienda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Nombre de la tienda</Label>
                  <Input id="store-name" defaultValue="Moto Parts Store" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-email">Email de contacto</Label>
                  <Input id="store-email" type="email" defaultValue="contacto@motoparts.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Teléfono</Label>
                  <Input id="store-phone" defaultValue="+54 11 1234-5678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-currency">Moneda</Label>
                  <Select defaultValue="ARS">
                    <SelectTrigger id="store-currency">
                      <SelectValue placeholder="Selecciona una moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                      <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="store-description">Descripción de la tienda</Label>
                <Textarea
                  id="store-description"
                  defaultValue="Tienda especializada en repuestos y accesorios para motocicletas de todas las marcas y modelos."
                  rows={4}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dirección física</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="store-address">Dirección</Label>
                    <Input id="store-address" defaultValue="Av. Libertador 1234" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-city">Ciudad</Label>
                    <Input id="store-city" defaultValue="Buenos Aires" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-state">Provincia</Label>
                    <Input id="store-state" defaultValue="CABA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-zip">Código Postal</Label>
                    <Input id="store-zip" defaultValue="C1425" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-country">País</Label>
                    <Select defaultValue="AR">
                      <SelectTrigger id="store-country">
                        <SelectValue placeholder="Selecciona un país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AR">Argentina</SelectItem>
                        <SelectItem value="CL">Chile</SelectItem>
                        <SelectItem value="UY">Uruguay</SelectItem>
                        <SelectItem value="BR">Brasil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Envíos */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Envíos</CardTitle>
              <CardDescription>Configura las opciones de envío para tus productos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch id="shipping-enabled" defaultChecked />
                <Label htmlFor="shipping-enabled">Habilitar envíos</Label>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Métodos de envío</h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 border rounded-md">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Envío estándar</h4>
                        <Switch id="standard-shipping" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Entrega en 3-5 días hábiles</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="standard-price" className="w-20">
                            Precio:
                          </Label>
                          <Input id="standard-price" defaultValue="500" className="max-w-[120px]" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="standard-free" className="w-20">
                            Gratis desde:
                          </Label>
                          <Input id="standard-free" defaultValue="10000" className="max-w-[120px]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 border rounded-md">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Envío express</h4>
                        <Switch id="express-shipping" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Entrega en 24-48 horas</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="express-price" className="w-20">
                            Precio:
                          </Label>
                          <Input id="express-price" defaultValue="1200" className="max-w-[120px]" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="express-free" className="w-20">
                            Gratis desde:
                          </Label>
                          <Input id="express-free" defaultValue="20000" className="max-w-[120px]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 border rounded-md">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Retiro en tienda</h4>
                        <Switch id="pickup-shipping" defaultChecked />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">El cliente retira el pedido en la tienda</p>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="pickup-price" className="w-20">
                            Precio:
                          </Label>
                          <Input id="pickup-price" defaultValue="0" className="max-w-[120px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Pagos */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Pagos</CardTitle>
              <CardDescription>Configura los métodos de pago disponibles para tus clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 border rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">MercadoPago</h4>
                      <Switch id="mercadopago-enabled" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Acepta pagos con tarjetas, transferencias y otros métodos
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor="mp-public-key">Clave Pública</Label>
                        <Input
                          id="mp-public-key"
                          type="password"
                          defaultValue="TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mp-access-token">Access Token</Label>
                        <Input
                          id="mp-access-token"
                          type="password"
                          defaultValue="TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Transferencia Bancaria</h4>
                      <Switch id="transfer-enabled" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Los clientes pueden pagar mediante transferencia bancaria
                    </p>
                    <div className="mt-4 space-y-2">
                      <div className="space-y-2">
                        <Label htmlFor="bank-name">Nombre del banco</Label>
                        <Input id="bank-name" defaultValue="Banco Nación" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-number">Número de cuenta</Label>
                        <Input id="account-number" defaultValue="0000000000000000000000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-name">Titular de la cuenta</Label>
                        <Input id="account-name" defaultValue="Moto Parts S.A." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bank-instructions">Instrucciones</Label>
                        <Textarea
                          id="bank-instructions"
                          defaultValue="Una vez realizada la transferencia, envía el comprobante a pagos@motoparts.com"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Pago contra entrega</h4>
                      <Switch id="cod-enabled" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">El cliente paga al recibir el producto</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Impuestos */}
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Impuestos</CardTitle>
              <CardDescription>Configura los impuestos aplicables a tus productos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch id="tax-enabled" defaultChecked />
                <Label htmlFor="tax-enabled">Habilitar cálculo de impuestos</Label>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 border rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">IVA</h4>
                      <Switch id="iva-enabled" defaultChecked />
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="iva-rate" className="w-20">
                          Tasa:
                        </Label>
                        <div className="flex items-center">
                          <Input id="iva-rate" defaultValue="21" className="max-w-[80px]" />
                          <span className="ml-2">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border rounded-md">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Impuesto provincial</h4>
                      <Switch id="provincial-tax-enabled" />
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="provincial-tax-rate" className="w-20">
                          Tasa:
                        </Label>
                        <div className="flex items-center">
                          <Input id="provincial-tax-rate" defaultValue="1.5" className="max-w-[80px]" />
                          <span className="ml-2">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax-display">Mostrar precios en la tienda</Label>
                <Select defaultValue="with_tax">
                  <SelectTrigger id="tax-display">
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="with_tax">Con impuestos incluidos</SelectItem>
                    <SelectItem value="without_tax">Sin impuestos incluidos</SelectItem>
                    <SelectItem value="both">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Email</CardTitle>
              <CardDescription>Configura las notificaciones por email para ti y tus clientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Servidor SMTP</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">Servidor SMTP</Label>
                    <Input id="smtp-host" defaultValue="smtp.gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">Puerto</Label>
                    <Input id="smtp-port" defaultValue="587" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-user">Usuario</Label>
                    <Input id="smtp-user" defaultValue="notificaciones@motoparts.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Contraseña</Label>
                    <Input id="smtp-password" type="password" defaultValue="********" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-from">Email remitente</Label>
                    <Input id="smtp-from" defaultValue="notificaciones@motoparts.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-name">Nombre remitente</Label>
                    <Input id="smtp-name" defaultValue="Moto Parts Store" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificaciones para clientes</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-order-confirmation">Confirmación de pedido</Label>
                      <p className="text-sm text-muted-foreground">Enviar email cuando un cliente realiza un pedido</p>
                    </div>
                    <Switch id="email-order-confirmation" defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-shipping-confirmation">Confirmación de envío</Label>
                      <p className="text-sm text-muted-foreground">Enviar email cuando un pedido es enviado</p>
                    </div>
                    <Switch id="email-shipping-confirmation" defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-order-status">Cambios de estado del pedido</Label>
                      <p className="text-sm text-muted-foreground">Enviar email cuando cambia el estado de un pedido</p>
                    </div>
                    <Switch id="email-order-status" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificaciones para administradores</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-admin-new-order">Nuevo pedido</Label>
                      <p className="text-sm text-muted-foreground">Recibir email cuando un cliente realiza un pedido</p>
                    </div>
                    <Switch id="email-admin-new-order" defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-admin-low-stock">Stock bajo</Label>
                      <p className="text-sm text-muted-foreground">Recibir email cuando un producto tiene stock bajo</p>
                    </div>
                    <Switch id="email-admin-low-stock" defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-emails">Emails de administradores</Label>
                  <Textarea
                    id="admin-emails"
                    defaultValue="admin@motoparts.com, ventas@motoparts.com"
                    placeholder="Ingresa los emails separados por comas"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de SEO */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de SEO</CardTitle>
              <CardDescription>Optimiza tu tienda para los motores de búsqueda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Metadatos generales</h3>
                <div className="space-y-2">
                  <Label htmlFor="meta-title">Título de la página</Label>
                  <Input id="meta-title" defaultValue="Moto Parts Store - Repuestos y Accesorios para Motos" />
                  <p className="text-xs text-muted-foreground">Recomendado: 50-60 caracteres</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-description">Descripción</Label>
                  <Textarea
                    id="meta-description"
                    defaultValue="Tienda online especializada en repuestos y accesorios para motocicletas. Encuentra todo lo que necesitas para tu moto con envío a todo el país y los mejores precios."
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">Recomendado: 150-160 caracteres</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-keywords">Palabras clave</Label>
                  <Textarea
                    id="meta-keywords"
                    defaultValue="repuestos moto, accesorios moto, partes moto, repuestos motocicletas, tienda motos"
                    rows={2}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Redes sociales</h3>
                <div className="space-y-2">
                  <Label htmlFor="og-title">Título Open Graph</Label>
                  <Input id="og-title" defaultValue="Moto Parts Store - Todo para tu Moto" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="og-description">Descripción Open Graph</Label>
                  <Textarea
                    id="og-description"
                    defaultValue="Encuentra los mejores repuestos y accesorios para tu moto en nuestra tienda online. Envíos a todo el país."
                    rows={2}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configuración avanzada</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="canonical-urls">URLs canónicas</Label>
                      <p className="text-sm text-muted-foreground">Generar URLs canónicas automáticamente</p>
                    </div>
                    <Switch id="canonical-urls" defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="structured-data">Datos estructurados</Label>
                      <p className="text-sm text-muted-foreground">Incluir datos estructurados para productos</p>
                    </div>
                    <Switch id="structured-data" defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="xml-sitemap">Sitemap XML</Label>
                      <p className="text-sm text-muted-foreground">Generar sitemap XML automáticamente</p>
                    </div>
                    <Switch id="xml-sitemap" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Seguridad */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>Configura las opciones de seguridad de tu tienda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Autenticación</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor">Autenticación de dos factores</Label>
                      <p className="text-sm text-muted-foreground">
                        Requerir autenticación de dos factores para administradores
                      </p>
                    </div>
                    <Switch id="two-factor" defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="password-policy">Política de contraseñas</Label>
                      <p className="text-sm text-muted-foreground">
                        Requerir contraseñas seguras (mínimo 8 caracteres, mayúsculas, números)
                      </p>
                    </div>
                    <Switch id="password-policy" defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Tiempo de expiración de sesión</Label>
                  <Select defaultValue="60">
                    <SelectTrigger id="session-timeout">
                      <SelectValue placeholder="Selecciona un tiempo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="240">4 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Protección contra fraudes</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="captcha">CAPTCHA</Label>
                      <p className="text-sm text-muted-foreground">Habilitar CAPTCHA en formularios públicos</p>
                    </div>
                    <Switch id="captcha" defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ip-blocking">Bloqueo de IP</Label>
                      <p className="text-sm text-muted-foreground">
                        Bloquear IPs después de múltiples intentos fallidos de inicio de sesión
                      </p>
                    </div>
                    <Switch id="ip-blocking" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">SSL/HTTPS</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="force-ssl">Forzar SSL</Label>
                      <p className="text-sm text-muted-foreground">Redirigir todo el tráfico HTTP a HTTPS</p>
                    </div>
                    <Switch id="force-ssl" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración Avanzada */}
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Avanzada</CardTitle>
              <CardDescription>Opciones avanzadas para usuarios experimentados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Caché</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cache-enabled">Habilitar caché</Label>
                      <p className="text-sm text-muted-foreground">
                        Mejorar el rendimiento mediante el almacenamiento en caché
                      </p>
                    </div>
                    <Switch id="cache-enabled" defaultChecked />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cache-ttl">Tiempo de vida de la caché</Label>
                  <Select defaultValue="3600">
                    <SelectTrigger id="cache-ttl">
                      <SelectValue placeholder="Selecciona un tiempo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">5 minutos</SelectItem>
                      <SelectItem value="900">15 minutos</SelectItem>
                      <SelectItem value="1800">30 minutos</SelectItem>
                      <SelectItem value="3600">1 hora</SelectItem>
                      <SelectItem value="86400">1 día</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline">Limpiar caché</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Base de datos</h3>
                <div className="space-y-2">
                  <Button variant="outline">Optimizar base de datos</Button>
                </div>
                <div className="space-y-2">
                  <Button variant="outline">Exportar base de datos</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Mantenimiento</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenance-mode">Modo mantenimiento</Label>
                      <p className="text-sm text-muted-foreground">Mostrar página de mantenimiento a los visitantes</p>
                    </div>
                    <Switch id="maintenance-mode" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance-message">Mensaje de mantenimiento</Label>
                  <Textarea
                    id="maintenance-message"
                    defaultValue="Estamos realizando tareas de mantenimiento. Por favor, vuelve más tarde."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

