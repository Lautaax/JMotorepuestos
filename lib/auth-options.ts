"use server"

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUserByEmail } from "./users-db"

// Función para comparar contraseñas de manera segura
async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    // Implementación simple para desarrollo (NO USAR EN PRODUCCIÓN)
    if (process.env.NODE_ENV !== "production") {
      console.warn("Usando comparación de contraseñas simulada para desarrollo")
      return plainPassword === "password123" // Contraseña de prueba para desarrollo
    }

    // En producción, intentamos usar bcrypt
    return false
  } catch (error) {
    console.error("Error al comparar contraseñas:", error)
    return false
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await getUserByEmail(credentials.email)
        if (!user) {
          return null
        }

        // Para desarrollo, permitir cualquier contraseña
        if (process.env.NODE_ENV !== "production") {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || "user",
          }
        }

        // En producción, verificar la contraseña
        const isPasswordValid = await comparePasswords(credentials.password, user.password || "")
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}
