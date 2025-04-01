"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Package, ArrowDown, RotateCw, Check, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

interface Notification {
  id: string
  type: "new_product" | "back_in_stock" | "price_drop"
  isRead: boolean
  createdAt: string
  product: {
    id: string
    name: string
    image: string
    price: number
    stock: number
  }
}

export default function NotificationsDropdown() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Cargar notificaciones cuando se abre el dropdown
  useEffect(() => {
    if (open && session?.user) {
      fetchNotifications()
    }
  }, [open, session])

  const fetchNotifications = async () => {
    if (!session?.user) return

    setLoading(true)
    try {
      const response = await fetch(`/api/notifications`)
      if (!response.ok) throw new Error("Error al cargar notificaciones")

      const notificationData = await response.json()
      setNotifications(notificationData.notifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las notificaciones",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "PUT",
      })

      if (!response.ok) throw new Error("Error al marcar notificación como leída")

      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`/api/notifications/read-all`, {
        method: "PUT",
      })

      if (!response.ok) throw new Error("Error al marcar notificaciones como leídas")

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))

      toast({
        title: "Notificaciones leídas",
        description: "Todas las notificaciones han sido marcadas como leídas",
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast({
        title: "Error",
        description: "No se pudieron marcar las notificaciones como leídas",
        variant: "destructive",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_product":
        return <Package className="h-4 w-4 text-blue-500" />
      case "back_in_stock":
        return <RotateCw className="h-4 w-4 text-green-500" />
      case "price_drop":
        return <ArrowDown className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case "new_product":
        return `Nuevo producto compatible: ${notification.product.name}`
      case "back_in_stock":
        return `${notification.product.name} está nuevamente en stock`
      case "price_drop":
        return `¡Bajó el precio de ${notification.product.name}!`
      default:
        return "Nueva notificación"
    }
  }

  if (!session?.user) {
    return null
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notificaciones</span>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
              <Check className="mr-1 h-3 w-3" />
              Marcar todo como leído
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <div className="p-4 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Cargando notificaciones...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center">
            <Bell className="mx-auto h-6 w-6 text-muted-foreground opacity-50" />
            <p className="mt-2 text-sm text-muted-foreground">No tienes notificaciones</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-0">
                <div className={`w-full p-3 flex gap-3 ${notification.isRead ? "opacity-70" : "bg-muted/50"}`}>
                  <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-grow">
                    <Link
                      href={`/products/${notification.product.id}`}
                      className="text-sm font-medium hover:underline"
                      onClick={() => markAsRead(notification.id)}
                    >
                      {getNotificationText(notification)}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => markAsRead(notification.id)}>
                      <X className="h-3 w-3" />
                      <span className="sr-only">Marcar como leída</span>
                    </Button>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="justify-center">
              <Link href="/account/notifications" className="w-full text-center text-sm">
                Ver todas las notificaciones
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

