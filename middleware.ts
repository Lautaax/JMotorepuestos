import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar token de autenticación
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  console.log("Middleware token:", token) // Agregar log para depuración

  // Rutas protegidas para administradores
  if (pathname.startsWith("/admin")) {
    if (!token) {
      // Redirigir a la página principal si no hay sesión
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Verificar si el usuario es administrador
    if (token.role !== "admin") {
      // Redirigir a la página principal si no es administrador
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Rutas protegidas para usuarios autenticados
  if (pathname.startsWith("/profile")) {
    if (!token) {
      // Redirigir a la página principal si no hay sesión
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

// Configurar las rutas que deben ser procesadas por el middleware
export const config = {
  matcher: ["/admin/:path*", "/profile/:path*"],
}

