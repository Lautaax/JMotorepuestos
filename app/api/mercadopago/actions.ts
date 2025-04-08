"use server"

import { getMercadoPago } from "@/lib/mercadopago-config"
import { revalidatePath } from "next/cache"

// Tipo para los items del carrito
interface CartItem {
  id: string
  title: string
  description?: string
  picture_url?: string
  category_id?: string
  quantity: number
  unit_price: number
}

// Tipo para la información del comprador
interface Payer {
  name: string
  surname: string
  email: string
  phone?: {
    area_code?: string
    number?: string
  }
  address?: {
    street_name?: string
    street_number?: number
    zip_code?: string
  }
}

// Tipo para la preferencia de pago
interface PreferenceRequest {
  items: CartItem[]
  payer?: Payer
  back_urls?: {
    success?: string
    failure?: string
    pending?: string
  }
  auto_return?: string
  notification_url?: string
  statement_descriptor?: string
  external_reference?: string
  expires?: boolean
  expiration_date_from?: string
  expiration_date_to?: string
}

/**
 * Crea una preferencia de pago en MercadoPago
 * @param preferenceData - Datos para la preferencia
 * @returns La preferencia creada
 */
export async function createPaymentPreference(preferenceData: PreferenceRequest) {
  try {
    const mercadopago = await getMercadoPago()

    // Asegurarse de que la URL de notificación esté configurada
    if (!preferenceData.notification_url && process.env.NEXT_PUBLIC_APP_URL) {
      preferenceData.notification_url = `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`
    }

    // Crear la preferencia
    const response = await mercadopago.preferences.create(preferenceData)

    return response.body
  } catch (error) {
    console.error("Error al crear preferencia de pago:", error)
    throw new Error("No se pudo crear la preferencia de pago")
  }
}

/**
 * Obtiene información de un pago por su ID
 * @param paymentId - ID del pago
 * @returns Información del pago
 */
export async function getPaymentInfo(paymentId: string) {
  try {
    const mercadopago = await getMercadoPago()
    const response = await mercadopago.payment.get(paymentId)

    return response.body
  } catch (error) {
    console.error("Error al obtener información del pago:", error)
    throw new Error("No se pudo obtener información del pago")
  }
}

/**
 * Procesa una notificación de pago de MercadoPago
 * @param paymentId - ID del pago
 * @param topic - Tipo de notificación
 * @returns Resultado del procesamiento
 */
export async function processPaymentNotification(paymentId: string, topic: string) {
  try {
    // Si el tema no es 'payment', no procesamos
    if (topic !== "payment") {
      return { success: false, message: "Tipo de notificación no soportado" }
    }

    // Obtener información del pago
    const paymentInfo = await getPaymentInfo(paymentId)

    // Aquí puedes implementar la lógica para actualizar el estado del pedido
    // según el estado del pago (approved, rejected, pending, etc.)

    // Revalidar las rutas que muestran información de pedidos
    revalidatePath("/orders")
    revalidatePath("/admin/orders")

    return {
      success: true,
      message: "Notificación procesada correctamente",
      paymentInfo,
    }
  } catch (error) {
    console.error("Error al procesar notificación de pago:", error)
    throw new Error("No se pudo procesar la notificación de pago")
  }
}
