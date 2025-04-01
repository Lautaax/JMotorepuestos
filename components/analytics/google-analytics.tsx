"use client"

import Script from "next/script"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"

// Reemplazar con tu ID de Google Analytics
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"

// Componente interno que usa hooks de navegación
function GoogleAnalyticsInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return

    // Enviar pageview cuando cambia la ruta
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ""),
    })
  }, [pathname, searchParams])

  return null
}

// Componente principal que renderiza los scripts y envuelve el componente interno en Suspense
export default function GoogleAnalytics() {
  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname + window.location.search,
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <GoogleAnalyticsInner />
      </Suspense>
    </>
  )
}

