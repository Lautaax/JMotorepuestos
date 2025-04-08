import { LRUCache } from "lru-cache"
import type { Product } from "./types"

// Configuración de caché con tiempo de expiración
const options = {
  max: 500, // Máximo número de elementos en caché
  ttl: 1000 * 60 * 5, // 5 minutos en milisegundos
  allowStale: false,
}

// Caché para productos
export const productsCache = new LRUCache<string, Product[]>(options)

// Caché para categorías
export const categoriesCache = new LRUCache<string, string[]>(options)

// Caché para productos individuales
export const productCache = new LRUCache<string, Product>(options)

// Función para invalidar todas las cachés
export function invalidateAllCaches() {
  productsCache.clear()
  categoriesCache.clear()
  productCache.clear()
}

// Función para invalidar caché de productos
export function invalidateProductsCache() {
  productsCache.clear()
}

// Función para invalidar caché de un producto específico
export function invalidateProductCache(id: string) {
  productCache.delete(id)
  // También invalidamos la caché de productos ya que la lista podría cambiar
  productsCache.clear()
}
