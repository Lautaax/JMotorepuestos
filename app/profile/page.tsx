import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth-options"
import { getUserLoyaltyProgram } from "@/lib/loyalty-db"
import { getUserOrders } from "@/lib/orders-db"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Package, User, Settings, CreditCard, LogOut } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth")
  }

  const [loyaltyProgram, orders] = await Promise.all([
    getUserLoyaltyProgram(session.user.id),
    getUserOrders(session.user.id),
  ])

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{session.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{session.user.email}</p>
                </div>
                {(session.user as any).phone && (
  <div>
    <p className="text-sm text-muted-foreground">Teléfono</p>
    <p className="font-medium">{(session.user as any).phone}</p>
  </div>
)}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Editar información
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Mis Pedidos
              </CardTitle>
              <CardDescription>
                {orders && orders.length > 0
                  ? `Has realizado ${orders.length} pedido${orders.length !== 1 ? "s" : ""}`
                  : "No has realizado ningún pedido aún"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order: any) => (
                    <div key={order.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Pedido #{order.id.substring(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt || "").toLocaleDateString("es-AR")} · {order.status}
                        </p>
                      </div>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No has realizado ningún pedido aún</p>
                </div>
              )}
            </CardContent>
            {orders && orders.length > 0 && (
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Ver todos los pedidos
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Programa de Fidelización
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loyaltyProgram ? (
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Nivel</p>
                    <p className="font-medium capitalize">{loyaltyProgram.tier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Puntos</p>
                    <p className="font-medium">{loyaltyProgram.points}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-muted-foreground text-sm">Aún no tienes un programa de fidelización</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href="/profile/loyalty">Ver detalles</a>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/products">
                  <Package className="mr-2 h-4 w-4" />
                  Explorar productos
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Métodos de pago
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
              <Separator />
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive"
                asChild
              >
                <a href="/api/auth/signout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
