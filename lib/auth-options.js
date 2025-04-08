import CredentialsProvider from "next-auth/providers/credentials"

// Función para comparar contraseñas de manera segura
async function comparePasswords(plainPassword, hashedPassword) {
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

// Función para obtener un usuario por email (simulada)
async function getUserByEmail(email) {
  // Simulación de usuario para desarrollo
  if (email === "admin@example.com") {
    return {
      _id: "user1",
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      password: "password123", // En producción, esto sería un hash
    }
  }

  if (email === "user@example.com") {
    return {
      _id: "user2",
      email: "user@example.com",
      name: "Regular User",
      role: "user",
      password: "password123", // En producción, esto sería un hash
    }
  }

  return null
}

export const authOptions = {
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
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
}
