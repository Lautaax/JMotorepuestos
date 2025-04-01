import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"

import SiteHeader from "@/components/layout/site-header"
import SiteFooter from "@/components/layout/site-footer"
import MyGarage from "@/components/moto-selector/my-garage"

export const metadata: Metadata = {
  title: "Mi Garaje | Moto Parts",
  description: "Gestiona tus motos para encontrar repuestos compatibles",
}

export default async function GaragePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/account/garage")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Mi Garaje</h1>
            <p className="text-muted-foreground mb-8">
              Gestiona tus motos para encontrar repuestos compatibles rápidamente
            </p>

            <MyGarage />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

