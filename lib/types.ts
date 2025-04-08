// Product types
export interface Product {
  _id: string
  id?: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  discount?: number
  image?: string
  images?: string[]
  category: string | { id: string; name: string }
  brand?: string
  stock: number
  sku?: string
  rating?: number
  reviewCount?: number
  tags?: string[]
  featured?: boolean
  compatibleModels?: CompatibleModel[]
  specifications?: string[]
  features?: string[]
  createdAt: string | Date
  updatedAt: string | Date
}


// Compatible model type
export interface CompatibleModel {
  brand: string
  model: string
  year: string | number
  notes?: string
}

// Cart types
export interface CartItem {
  product: Product
  quantity: number
}

// Category types
export interface Category {
  _id?: string | object
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  featured?: boolean
  createdAt: string
  updatedAt: string
}

// User types
export interface User {
  id: string
  name: string | null
  email: string | null
  phone?: string
  image?: string | null
  role?: string
  createdAt: string | Date
  updatedAt: string | Date
  emailVerified?: Date | null
}

// Database User (internal representation with MongoDB _id)
export interface DbUser {
  _id: string | object
  name: string | null
  email: string | null
  phone?: string
  password?: string
  image?: string | null
  role?: string
  createdAt: Date
  updatedAt: Date
  emailVerified?: Date | null
}

export interface ImportResult {
  imported: number
  updated: number
  errors: number
  errorDetails: string[]
}

// User with password for authentication
export interface UserWithPassword extends User {
  password: string
} 

// Interfaz para órdenes/pedidos
export interface Order {
  id: string
  customerName: string
  customerEmail?: string
  customerPhone: string
  customerAddress?: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "mercadopago" | "transferencia" | "whatsapp" | string
  shippingMethod: "retirar" | "envio" | string
  notes?: string
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface OrderItem {
  productId: string
  productName: string
  productSku?: string
  price: number
  quantity: number
}

// Interfaz para las estadísticas del dashboard
export interface DashboardStats {
  // Estadísticas generales
  totalSales?: number
  totalOrders?: number
  totalUsers?: number
  totalProducts?: number

  // Estadísticas de ventas
  salesByPeriod?: {
    period: string
    amount: number
    change: number
  }[]

  // Estadísticas de productos
  topProducts?: {
    id: string
    name: string
    sales: number
    revenue: number
  }[]

  // Estadísticas de clientes
  customerSegments?: {
    segment: string
    count: number
    percentage: number
  }[]

  // Métricas de rendimiento
  conversionRate?: number
  averageOrderValue?: number

  // Datos temporales
  timeRange?: string
  lastUpdated?: Date
}

// Tipos para el carrito de compras
export interface CartItem {
  product: Product
  quantity: number
}

export interface CartContextType {
  cart: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

// Interfaz para cupones de descuento
export interface Coupon {
  id: string
  code: string
  discount: number
  discountType: "percentage" | "fixed"
  minPurchase?: number
  maxUses?: number
  usedCount: number
  validFrom: Date | string
  validTo: Date | string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

// Interfaces para email marketing
export interface EmailSubscriber {
  id: string
  email: string
  name?: string
  isActive: boolean
  subscribedAt: Date
  unsubscribedAt?: Date
  lastEmailSent?: Date
  tags?: string[]
  metadata?: Record<string, any>
}

export interface EmailCampaign {
  id: string
  name: string
  subject: string
  content: string
  status: "draft" | "scheduled" | "sending" | "sent" | "cancelled"
  scheduledFor?: Date
  sentAt?: Date
  sentTo?: number // Número de destinatarios a los que se envió
  recipientCount?: number
  openCount?: number
  clickCount?: number
  createdAt: Date
  updatedAt: Date
  tags?: string[]
  metadata?: Record<string, any>
}

// Chat types
export interface ChatMessage {
  id: string
  sessionId: string
  userId?: string
  userName: string
  isAdmin: boolean
  message: string
  read: boolean
  createdAt: string
}

export interface ChatSession {
  id: string
  userId?: string
  userName: string
  email?: string
  status: "active" | "closed"
  createdAt: string
  updatedAt: string
  lastMessageAt?: string
}

// Loyalty program types
export interface LoyaltyProgram {
  _id: string
  userId: string
  points: number
  tier: "bronze" | "silver" | "gold" | "platinum"
  history: {
    date: string
    action: string
    points: number
  }[]
  createdAt: string
  updatedAt: string
}

