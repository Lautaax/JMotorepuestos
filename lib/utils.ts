import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un número como precio con el símbolo de moneda y formato adecuado
 * @param price - El precio a formatear
 * @param options - Opciones de formato (moneda, decimales, etc.)
 * @returns El precio formateado como string
 */
export function formatPrice(
  price: number,
  options: {
    currency?: string
    notation?: Intl.NumberFormatOptions["notation"]
    maximumFractionDigits?: number
  } = {},
) {
  const { currency = "USD", notation = "standard", maximumFractionDigits = 2 } = options

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits,
  }).format(price)
}

// Alias para formatPrice para mantener compatibilidad
export const formatCurrency = formatPrice

/**
 * Formatea una fecha en formato legible
 * @param date - La fecha a formatear
 * @returns La fecha formateada como string
 */
export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

/**
 * Trunca un texto a una longitud máxima
 * @param text - El texto a truncar
 * @param maxLength - La longitud máxima
 * @returns El texto truncado
 */
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}
