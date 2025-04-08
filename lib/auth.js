import { getServerSession } from "next-auth"
import { authOptions } from "./auth-options"
import { redirect } from "next/navigation"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}

export async function isAdmin() {
  const session = await getSession()
  return session?.user?.role === "admin" || session?.user?.role === "superadmin"
}

export async function isSuperAdmin() {
  const session = await getSession()
  return session?.user?.role === "superadmin"
}

// Función para verificar si el usuario es administrador y redirigir si no lo es
export async function checkAdminAuth() {
  const session = await getSession()

  if (!session || (session.user.role !== "admin" && session.user.role !== "superadmin")) {
    redirect("/auth/login?callbackUrl=/admin")
  }

  return session.user
}
