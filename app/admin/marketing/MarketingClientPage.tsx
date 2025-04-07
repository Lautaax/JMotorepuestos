"use client"

import Link from "next/link"
import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { checkAdminAuth } from "@/lib/auth"
import type { Coupon, EmailCampaign, EmailSubscriber } from "@/lib/types"

export default function MarketingClientPage() {
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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Marketing</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Cupones</h2>
          <p className="text-gray-600 mb-4">Crea y gestiona cupones de descuento para tus clientes.</p>
          <Link
            href="/admin/marketing/coupons"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Gestionar Cupones
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Newsletter</h2>
          <p className="text-gray-600 mb-4">Gestiona tus suscriptores y envía newsletters.</p>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
            <p className="text-yellow-700">Módulo en desarrollo. Estará disponible próximamente.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

