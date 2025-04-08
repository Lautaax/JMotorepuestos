"use server"

// Clase simple de caché como fallback si lru-cache no está disponible
class SimpleCache extends Map {
  private maxSize: number
  private ttl: number
  private timestamps: Map<any, number>

  constructor(options: { max?: number; ttl?: number } = {}) {
    super()
    this.maxSize = options.max || 100
    this.ttl = options.ttl || 1000 * 60 * 5 // 5 minutos por defecto
    this.timestamps = new Map()
  }

  set(key: any, value: any) {
    // Si alcanzamos el tamaño máximo, eliminar la entrada más antigua
    if (this.size >= this.maxSize) {
      const oldestKey = this.getOldestKey()
      if (oldestKey) {
        this.delete(oldestKey)
        this.timestamps.delete(oldestKey)
      }
    }

    // Guardar el timestamp
    this.timestamps.set(key, Date.now())

    // Guardar el valor
    return super.set(key, value)
  }

  get(key: any) {
    const timestamp = this.timestamps.get(key)

    // Si no hay timestamp o ha expirado, eliminar la entrada
    if (!timestamp || Date.now() - timestamp > this.ttl) {
      this.delete(key)
      this.timestamps.delete(key)
      return undefined
    }

    return super.get(key)
  }

  private getOldestKey() {
    let oldestKey = null
    let oldestTime = Number.POSITIVE_INFINITY

    for (const [key, time] of this.timestamps.entries()) {
      if (time < oldestTime) {
        oldestKey = key
        oldestTime = time
      }
    }

    return oldestKey
  }
}

// Función para obtener una instancia de caché
export async function getLRUCache(options = { max: 100, ttl: 1000 * 60 * 5 }) {
  try {
    // Intentar importar lru-cache dinámicamente
    const lruCacheModule = await import("lru-cache").catch(() => null)

    if (lruCacheModule && lruCacheModule.LRUCache) {
      return new lruCacheModule.LRUCache(options)
    }

    // Si no se pudo importar, usar la caché simple
    console.warn("Usando caché simple porque lru-cache no está disponible")
    return new SimpleCache(options)
  } catch (error) {
    console.warn("Error al cargar lru-cache, usando caché simple:", error)
    return new SimpleCache(options)
  }
}

// Caché para productos
let productsCache: any = null

// Función para obtener la caché de productos
export async function getProductsCache() {
  if (!productsCache) {
    productsCache = await getLRUCache({
      max: 500, // Máximo número de elementos
      ttl: 1000 * 60 * 15, // 15 minutos
    })
  }

  return productsCache
}

// Función para invalidar la caché de un producto específico
export async function invalidateProductCache(productId: string) {
  const cache = await getProductsCache()

  // Eliminar el producto específico
  cache.delete(productId)

  // También eliminar cualquier clave que contenga el ID del producto
  // (útil para listas filtradas, etc.)
  for (const key of cache.keys()) {
    if (typeof key === "string" && key.includes(productId)) {
      cache.delete(key)
    }
  }

  return true
}

// Caché para categorías
let categoriesCache: any = null

// Función para obtener la caché de categorías
export async function getCategoriesCache() {
  if (!categoriesCache) {
    categoriesCache = await getLRUCache({
      max: 50, // Máximo número de elementos
      ttl: 1000 * 60 * 60, // 1 hora
    })
  }

  return categoriesCache
}

// Caché para reseñas
let reviewsCache: any = null

// Función para obtener la caché de reseñas
export async function getReviewsCache() {
  if (!reviewsCache) {
    reviewsCache = await getLRUCache({
      max: 200, // Máximo número de elementos
      ttl: 1000 * 60 * 30, // 30 minutos
    })
  }

  return reviewsCache
}

// Función para invalidar la caché de reseñas de un producto
export async function invalidateReviewsCache(productId: string) {
  const cache = await getReviewsCache()

  // Eliminar las reseñas del producto
  cache.delete(`reviews-${productId}`)

  // También invalidar la caché del producto
  await invalidateProductCache(productId)

  return true
}
