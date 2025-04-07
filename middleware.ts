import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirigir /products/[id] a /p/[id]
  if (pathname.startsWith("/products/")) {
    const segments = pathname.split("/")
    if (segments.length >= 3) {
      const idOrSlug = segments[2]

      // Si parece un ID de MongoDB (24 caracteres hexadecimales) o un ID numérico
      if (/^[0-9a-fA-F]{24}$/.test(idOrSlug) || /^\d+$/.test(idOrSlug)) {
        return NextResponse.redirect(new URL(`/p/${idOrSlug}`, request.url))
      }

      // Si parece un slug, redirigir a la nueva ruta
      return NextResponse.redirect(new URL(`/producto/${idOrSlug}`, request.url))
    }
  }

  // Redirigir /products a /productos
  if (pathname === "/products") {
    return NextResponse.redirect(new URL("/productos", request.url))
  }

  return NextResponse.next()
}

// Configurar el middleware para que solo se ejecute en las rutas especificadas
export const config = {
  matcher: ["/products", "/products/:path*"],
}

