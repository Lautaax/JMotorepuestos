import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Obtener el token de autenticación
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Rutas protegidas para administradores
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Si no hay token o el usuario no es admin, redirigir al login
    if (!token || (token.role !== "admin" && token.role !== "superadmin")) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Rutas protegidas para usuarios autenticados
  if (request.nextUrl.pathname.startsWith("/profile")) {
    // Si no hay token, redirigir al login
    if (!token) {
      const url = new URL("/auth/login", request.url)
      url.searchParams.set("callbackUrl", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Configurar las rutas que deben ser procesadas por el middleware
export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
}
