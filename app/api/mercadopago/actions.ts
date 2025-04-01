"use server"

import { Preference } from "mercadopago"
import { mercadopagoConfig } from "@/lib/mercadopago-config"

// Función para crear una preferencia de pago simplificada
export async function createPaymentPreference(totalAmount: number | string, customer: any, items: any[] = []) {
  try {
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      throw new Error("Configuración de MercadoPago no disponible")
    }

    if (!customer) {
      throw new Error("Datos de cliente inválidos")
    }

    // Convertir el monto total a número y validar
    const amount = Number.parseFloat(totalAmount as string)

    if (isNaN(amount) || amount <= 0) {
      throw new Error("El monto total del pedido es inválido")
    }

    console.log("Monto total recibido:", amount)

    // Crear un único item con el monto total
    const preferenceItem = {
      id: `order_${Date.now()}`,
      title: `Compra en MotoRepuestos`,
      description: `Pedido de ${customer.name}`,
      quantity: 1,
      unit_price: Number(amount.toFixed(2)), // Asegurar que sea un número con 2 decimales
      currency_id: "ARS", // Ajustar según tu moneda
    }

    // Crear preferencia de pago
    const preference = new Preference(mercadopagoConfig)
    const result = await preference.create({
      body: {
        items: [preferenceItem],
        payer: {
          name: customer.name,
          email: customer.email,
          phone: {
            number: customer.phone,
          },
          address: customer.address
            ? {
                street_name: customer.address,
              }
            : undefined,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/pending`,
        },
        auto_return: "approved",
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`,
        statement_descriptor: "MotoRepuestos",
        external_reference: `order_${Date.now()}`,
        // Eliminamos la expiración que podría causar problemas
        metadata: {
          order_items: JSON.stringify(items),
        },
        payment_methods: {
          // Eliminamos las exclusiones de métodos de pago
          installments: 12, // Permitir hasta 12 cuotas
          default_installments: 1,
        },
        binary_mode: false, // Permitir pagos pendientes
      },
    })

    // Devolver tanto el preferenceId como el initPoint
    return {
      preferenceId: result.id,
      publicKey: process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "",
      initPoint: result.init_point,
      sandboxInitPoint: result.sandbox_init_point,
    }
  } catch (error) {
    console.error("Error al crear preferencia de MercadoPago:", error)
    throw new Error("Error al procesar el pago")
  }
}

