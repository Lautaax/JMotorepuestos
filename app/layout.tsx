import type React from "react"
import { Suspense } from "react"
import { CartProvider } from "@/components/providers/cart-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import GoogleAnalytics from "@/components/analytics/google-analytics"
import AuthProvider from "@/components/providers/session-provider"
import DebugCart from "@/components/debug-cart"
import WhatsAppContactButton from "@/components/whatsapp-contact-button"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <title>MotoRepuestos - Tienda de Repuestos para Motocicletas</title>
        <meta name="description" content="Encuentra los mejores repuestos para tu motocicleta" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <CartProvider>
              <div className="flex flex-col min-h-screen">{children}</div>
              <Toaster />
              <Suspense fallback={null}>
                <GoogleAnalytics />
              </Suspense>
              <DebugCart />
              <WhatsAppContactButton />
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
