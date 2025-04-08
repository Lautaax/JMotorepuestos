"use client"

import { signIn, signOut } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth-options"

// Función auxiliar para obtener la sesión del servidor
export async function getServerAuthSession() {
  return await getServerSession(authOptions)
}

// Función para iniciar sesión
export async function login(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (!result) {
      throw new Error("Error de autenticación")
    }

    if (result.error) {
      throw new Error(result.error)
    }

    return result
  } catch (error) {
    console.error("Error en login:", error)
    throw error
  }
}

// Función para registrar un nuevo usuario
export async function register(name: string, email: string, password: string) {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        role: "customer", // Por defecto, todos los usuarios nuevos son clientes
      }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "Error al registrar usuario")
    }

    return await response.json()
  } catch (error) {
    console.error("Error en registro:", error)
    throw error
  }
}

// Función para cerrar sesión
export async function logout() {
  try {
    await signOut({ redirect: false })
  } catch (error) {
    console.error("Error en logout:", error)
    throw error
  }
}

// Función para verificar si el usuario es administrador
export async function checkAdminAuth() {
  try {
    const response = await fetch("/api/dashboard/stats")

    if (response.ok) {
      return true
    }

    return false
  } catch (error) {
    console.error("Error al verificar permisos de administrador:", error)
    return false
  }
}

// Exportamos authOptions para uso en el servidor
export { authOptions }
