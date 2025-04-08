import "next-auth"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Extender el tipo User para incluir propiedades adicionales
   */
  interface User {
    id: string
    role: string
  }

  /**
   * Extender el tipo Session para incluir propiedades adicionales
   */
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  /**
   * Extender el tipo JWT para incluir propiedades adicionales
   */
  interface JWT {
    id: string
    role: string
  }
}
