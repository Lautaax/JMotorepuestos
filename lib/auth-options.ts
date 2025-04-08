import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUserByEmail } from "./users-db"
// Usamos una alternativa a bcrypt para evitar problemas de instalación
import { createHash } from "crypto"

// Función simple para comparar contraseñas (reemplaza a bcrypt.compare)
const comparePasswords = (plainPassword: string, hashedPassword: string): boolean => {
  const hash = createHash("sha256").update(plainPassword).digest("hex")
  return hash === hashedPassword
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

        if (!user || !user.password) {
          return null
        }

        // Usar nuestra función de comparación en lugar de bcrypt
        const isPasswordValid = comparePasswords(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id || user._id?.toString() || "",
          name: user.name || "",
          email: user.email || "",
          role: user.role || "user",
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
