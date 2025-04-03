import type React from "react"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth-db"

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth")
  }

  return <main className="min-h-screen bg-muted/30">{children}</main>
}

