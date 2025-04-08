"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface LoyaltyLevel {
  name: string
  minPoints: number
  maxPoints: number
  discount: number
  freeShipping: boolean
  color: string
}

interface LoyaltyTransaction {
  id: string
  userId: string
  points: number
  description: string
  createdAt: string
  orderId?: string
}

export default function LoyaltyPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [points, setPoints] = useState(0)
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([])
  const [loading, setLoading] = useState(true)

  const loyaltyLevels: LoyaltyLevel[] = [
    { name: "Bronce", minPoints: 0, maxPoints: 499, discount: 5, freeShipping: false, color: "bg-amber-700" },
    { name: "Plata", minPoints: 500, maxPoints: 999, discount: 7, freeShipping: false, color: "bg-gray-400" },
    { name: "Oro", minPoints: 1000, maxPoints: 1999, discount: 10, freeShipping: true, color: "bg-yellow-500" },
    {
      name: "Platino",
      minPoints: 2000,
      maxPoints: Number.POSITIVE_INFINITY,
      discount: 15,
      freeShipping: true,
      color: "bg-slate-700",
    },
  ]

  useEffect(() => {
    if (!session) {
      router.push("/login?callbackUrl=/profile/loyalty" as any)
      return
    }

    const fetchLoyaltyData = async () => {
      try {
        const response = await fetch("/api/loyalty/program")
        const data = await response.json()

        if (data.points !== undefined) {
          setPoints(data.points)
        }

        if (data.transactions) {
          setTransactions(data.transactions)
        }
      } catch (error) {
        console.error("Error fetching loyalty data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLoyaltyData()
  }, [session, router])

  const getCurrentLevel = () => {
    return loyaltyLevels.find((level) => points >= level.minPoints && points <= level.maxPoints) || loyaltyLevels[0]
  }

  const getNextLevel = () => {
    const currentLevelIndex = loyaltyLevels.findIndex((level) => points >= level.minPoints && points <= level.maxPoints)
    return currentLevelIndex < loyaltyLevels.length - 1 ? loyaltyLevels[currentLevelIndex + 1] : null
  }

  const getProgressToNextLevel = () => {
    const currentLevel = getCurrentLevel()
    const nextLevel = getNextLevel()

    if (!nextLevel) return 100 // Ya está en el nivel máximo

    const pointsInCurrentLevel = points - currentLevel.minPoints
    const pointsNeededForNextLevel = nextLevel.minPoints - currentLevel.minPoints

    return Math.min(Math.round((pointsInCurrentLevel / pointsNeededForNextLevel) * 100), 100)
  }

  const currentLevel = getCurrentLevel()
  const nextLevel = getNextLevel()
  const progress = getProgressToNextLevel()

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center text-sm text-muted-foreground">
            <Link href="/profile" className="hover:underline">
              Perfil
            </Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="font-medium text-foreground">Programa de Fidelización</span>
          </div>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-pulse h-8 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="animate-pulse h-4 w-48 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link href="/profile" className="hover:underline">
            Perfil
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="font-medium text-foreground">Programa de Fidelización</span>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tu nivel de fidelidad</CardTitle>
            <CardDescription>Acumula puntos con tus compras y disfruta de beneficios exclusivos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">{currentLevel.name}</h3>
                <p className="text-muted-foreground">{points} puntos acumulados</p>
              </div>
              <div className={`px-4 py-2 rounded-full ${currentLevel.color} text-white font-medium mt-2 md:mt-0`}>
                {currentLevel.discount}% de descuento
              </div>
            </div>

            {nextLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso hacia {nextLevel.name}</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Te faltan {nextLevel.minPoints - points} puntos para alcanzar el nivel {nextLevel.name}
                </p>
              </div>
            )}

            <div className="mt-6">
              <h4 className="font-medium mb-2">Beneficios de tu nivel actual:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>{currentLevel.discount}% de descuento en todas tus compras</li>
                {currentLevel.freeShipping && <li>Envío gratis en todos tus pedidos</li>}
                <li>Acceso a promociones exclusivas</li>
                <li>Atención prioritaria</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <p className="text-sm text-muted-foreground mb-2">Acumulas 1 punto por cada $100 en compras</p>
            <Button variant="outline" asChild>
              <Link href="/products">Ver productos</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de puntos</CardTitle>
            <CardDescription>Registro de tus puntos acumulados y utilizados</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`font-medium ${transaction.points > 0 ? "text-green-600" : "text-red-600"}`}>
                      {transaction.points > 0 ? "+" : ""}
                      {transaction.points} pts
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">Aún no tienes transacciones de puntos</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Niveles del programa</CardTitle>
            <CardDescription>Conoce todos los niveles y beneficios de nuestro programa de fidelidad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loyaltyLevels.map((level, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${level.color} mr-2`}></div>
                      <h3 className="font-medium">{level.name}</h3>
                    </div>
                    <div className="text-sm">
                      {level.minPoints} - {level.maxPoints === Number.POSITIVE_INFINITY ? "+" : level.maxPoints} pts
                    </div>
                  </div>
                  <div className="pl-5 mt-1 text-sm">
                    <ul className="list-disc list-inside space-y-1">
                      <li>{level.discount}% de descuento en todas tus compras</li>
                      {level.freeShipping && <li>Envío gratis en todos tus pedidos</li>}
                    </ul>
                  </div>
                  {index < loyaltyLevels.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
