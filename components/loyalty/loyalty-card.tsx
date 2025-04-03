"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Award, Gift, CreditCard, ChevronRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import type { LoyaltyProgram } from "@/lib/types"

export default function LoyaltyCard() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [program, setProgram] = useState<LoyaltyProgram | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLoyaltyProgram = async () => {
      if (!session?.user?.id) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/loyalty/program`)

        if (response.ok) {
          const data = await response.json()
          setProgram(data.program)
        }
      } catch (error) {
        console.error("Error al cargar programa de fidelización:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLoyaltyProgram()
  }, [session])

  // Calcular progreso hacia el siguiente nivel
  const getNextTierProgress = () => {
    if (!program) return { progress: 0, nextTier: "silver", pointsNeeded: 500 }

    const { points, tier } = program

    switch (tier) {
      case "bronze":
        return {
          progress: Math.min(100, (points / 500) * 100),
          nextTier: "silver",
          pointsNeeded: 500 - points,
        }
      case "silver":
        return {
          progress: Math.min(100, ((points - 500) / 1500) * 100),
          nextTier: "gold",
          pointsNeeded: 2000 - points,
        }
      case "gold":
        return {
          progress: Math.min(100, ((points - 2000) / 3000) * 100),
          nextTier: "platinum",
          pointsNeeded: 5000 - points,
        }
      case "platinum":
        return {
          progress: 100,
          nextTier: "platinum",
          pointsNeeded: 0,
        }
    }
  }

  // Obtener color del tier
  const getTierColor = (tier?: "bronze" | "silver" | "gold" | "platinum") => {
    switch (tier) {
      case "platinum":
        return "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
      case "gold":
        return "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
      case "silver":
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800"
      default:
        return "bg-gradient-to-r from-amber-700 to-amber-800 text-white"
    }
  }

  // Obtener beneficios del tier
  const getTierBenefits = (tier?: "bronze" | "silver" | "gold" | "platinum") => {
    switch (tier) {
      case "platinum":
        return [
          "15% de descuento en todas las compras",
          "Envío gratis en todos los pedidos",
          "Soporte prioritario",
          "Acceso a ofertas exclusivas",
        ]
      case "gold":
        return ["10% de descuento en todas las compras", "Envío gratis en todos los pedidos", "Soporte prioritario"]
      case "silver":
        return ["7% de descuento en todas las compras"]
      default:
        return ["5% de descuento en todas las compras", "Acumula 1 punto por cada $100 en compras"]
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Programa de Fidelización</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!session) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Programa de Fidelización</CardTitle>
          <CardDescription>Acumula puntos y obtén beneficios exclusivos</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex flex-col items-center text-center gap-2 py-4">
            <Award className="h-12 w-12 text-muted-foreground" />
            <p>Inicia sesión para ver tu programa de fidelización</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" asChild>
            <a href="/auth">Iniciar sesión</a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (!program) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Programa de Fidelización</CardTitle>
          <CardDescription>Acumula puntos y obtén beneficios exclusivos</CardDescription>
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex flex-col items-center text-center gap-2 py-4">
            <Award className="h-12 w-12 text-muted-foreground" />
            <p>Aún no tienes un programa de fidelización</p>
            <p className="text-sm text-muted-foreground">Realiza tu primera compra para comenzar a acumular puntos</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { progress, nextTier, pointsNeeded } = getNextTierProgress()

  return (
    <Card>
      <div className={`rounded-t-lg p-4 ${getTierColor(program.tier)}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs font-medium uppercase opacity-80">Nivel</p>
            <h3 className="text-xl font-bold capitalize">{program.tier}</h3>
          </div>
          <CreditCard className="h-8 w-8 opacity-80" />
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Puntos</span>
            <span>{program.points}</span>
          </div>
          {program.tier !== "platinum" && (
            <>
              <Progress value={progress} className="h-2 bg-white/30" indicatorClassName="bg-white" />
              <p className="text-xs mt-1">
                {pointsNeeded} puntos más para nivel {nextTier}
              </p>
            </>
          )}
        </div>
      </div>
      <CardContent className="pt-4">
        <h4 className="font-medium mb-2">Tus beneficios</h4>
        <ul className="space-y-1">
          {getTierBenefits(program.tier).map((benefit, index) => (
            <li key={index} className="text-sm flex items-start gap-2">
              <Gift className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <a href="/profile/loyalty">
            Ver historial de puntos
            <ChevronRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

