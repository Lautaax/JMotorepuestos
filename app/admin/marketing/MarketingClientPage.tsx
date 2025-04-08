"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import type { EmailCampaign, EmailSubscriber } from "@/lib/types"

export default function MarketingClientPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([])
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (status === "loading") return

      if (!session) {
        router.push("/auth" as any)
        return
      }

      // @ts-ignore - Ignoramos el error de tipado para session.user.role
      if (session.user && session.user.role !== "admin") {
        router.push("/")
        return
      }

      // Cargar datos
      await loadData()
    }

    checkAuth()
  }, [session, status, router])

  const loadData = async () => {
    try {
      setLoading(true)

      // Aquí cargaríamos los datos reales de campañas y suscriptores
      // Por ahora usamos datos de ejemplo
      setCampaigns([
        {
          id: "1",
          name: "Campaña de Bienvenida",
          subject: "Bienvenido a nuestra tienda",
          content: "<p>Bienvenido a nuestra tienda de repuestos para motos</p>", // Agregar content
          status: "sent",
          recipientCount: 120,
          openCount: 85,
          clickCount: 42,
          sentAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(), // Agregar updatedAt
        },
        {
          id: "2",
          name: "Oferta de Verano",
          subject: "¡Descuentos de verano!",
          content: "<p>Aprovecha nuestras ofertas de temporada</p>", // Agregar content
          status: "scheduled",
          scheduledFor: new Date(Date.now() + 86400000),
          createdAt: new Date(),
          updatedAt: new Date(), // Agregar updatedAt
        },
      ])

      setSubscribers([
        {
          id: "1",
          email: "cliente1@example.com",
          name: "Cliente Uno",
          isActive: true,
          subscribedAt: new Date(),
        },
        {
          id: "2",
          email: "cliente2@example.com",
          name: "Cliente Dos",
          isActive: true,
          subscribedAt: new Date(),
        },
      ])

      setLoading(false)
    } catch (error) {
      console.error("Error al cargar datos de marketing:", error)
    }
  }

  return <div>{/* Contenido del componente */}</div>
}
