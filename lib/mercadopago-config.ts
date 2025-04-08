"use server"

// Clase simulada de MercadoPago para desarrollo/testing
class MockMercadoPago {
  private config: any = {}

  configure(options: any) {
    this.config = options
    console.warn("Usando MercadoPago simulado porque el módulo no está disponible")
    return true
  }

  get preferences() {
    return {
      create: async (preference: any) => {
        console.log("Simulando creación de preferencia:", preference)
        return {
          body: {
            id: "mock_preference_" + Date.now(),
            init_point: "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock",
            sandbox_init_point: "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock",
            items: preference.items,
          },
        }
      },
    }
  }

  get payment() {
    return {
      get: async (id: string) => {
        console.log("Simulando obtención de pago:", id)
        return {
          body: {
            id,
            status: "approved",
            status_detail: "accredited",
            transaction_amount: 100,
            date_created: new Date().toISOString(),
            date_approved: new Date().toISOString(),
          },
        }
      },
    }
  }
}

// Variable para almacenar la instancia de MercadoPago
let mercadopago: any = null

// Función para inicializar MercadoPago
export async function initMercadoPago() {
  if (!mercadopago) {
    try {
      // Intentar importar mercadopago dinámicamente
      const mpModule = await import("mercadopago").catch(() => null)

      if (mpModule && mpModule.default) {
        mercadopago = mpModule.default

        // Configurar con el token de acceso
        mercadopago.configure({
          access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
        })
      } else {
        // Si no se pudo importar, usar el mock
        console.warn("Usando MercadoPago simulado porque el módulo no está disponible")
        mercadopago = new MockMercadoPago()
        mercadopago.configure({
          access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
        })
      }
    } catch (error) {
      console.warn("Error al inicializar MercadoPago, usando simulación:", error)
      mercadopago = new MockMercadoPago()
      mercadopago.configure({
        access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
      })
    }
  }

  return mercadopago
}

// Obtener la instancia de MercadoPago ya configurada
export async function getMercadoPago() {
  return await initMercadoPago()
}

// Obtener la clave pública de MercadoPago
export async function getPublicKey() {
  return (
    process.env.MERCADO_PAGO_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY ||
    "TEST-0000000-0000-0000-0000-000000000000"
  )
}
