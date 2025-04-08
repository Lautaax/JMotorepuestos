import type { DefaultUser } from "next-auth"

// Extender la interfaz Session para incluir el rol del usuario
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }

  interface User extends DefaultUser {
    id: string
    role?: string
  }
}
