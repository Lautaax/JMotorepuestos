import { MercadoPagoConfig } from "mercadopago"

// Configuración de Mercado Pago
export const mercadopagoConfig = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
})
