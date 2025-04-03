import "next-auth"

// Extender la interfaz Session de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
      phone?: string
      image?: string
    }
  }

  interface User {
    id: string
    name: string
    email: string
    role: string
    phone?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    phone?: string
  }
}

export interface CompatibleModel {
  brand: string
  model: string
  year: string
  notes?: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  category: string
  brand?: string
  sku?: string
  image?: string
  compatibleModels?: CompatibleModel[]
  createdAt?: string
  updatedAt?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  productId: string
  productName: string
  productSku?: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  userId?: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress?: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "whatsapp" | "transferencia" | "mercadopago"
  shippingMethod: "retirar" | "envio"
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface Coupon {
  id: string
  code: string
  discount: number
  discountType: "percentage" | "fixed"
  minPurchase?: number
  maxUses?: number
  usedCount: number
  validFrom: string
  validTo: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface EmailSubscriber {
  id: string
  email: string
  name?: string
  isSubscribed: boolean
  subscribedAt?: string
  unsubscribedAt?: string
  lastEmailSentAt?: string
}

export interface EmailCampaign {
  id: string
  name: string
  subject: string
  content: string
  sentTo: number
  opened: number
  clicked: number
  status: "draft" | "scheduled" | "sending" | "sent"
  scheduledFor?: string
  sentAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: "customer" | "admin"
  createdAt?: string
  updatedAt?: string
  password?: string
}

export interface ImportResult {
  imported: number
  updated: number
  errors: number
  errorDetails: string[]
}

export interface DashboardStats {
  totalProducts: number
  totalUsers: number
  outOfStockCount: number
}

export interface ProductReview {
  id: string
  productId: string
  userId?: string
  userName: string
  rating: number
  comment: string
  createdAt?: string
  updatedAt?: string
}

export interface LoyaltyProgram {
  id: string
  userId: string
  points: number
  tier: "bronze" | "silver" | "gold" | "platinum"
  pointsHistory: LoyaltyPointsHistory[]
  createdAt?: string
  updatedAt?: string
}

export interface LoyaltyPointsHistory {
  id: string
  userId: string
  amount: number
  type: "earned" | "redeemed"
  description: string
  orderId?: string
  createdAt?: string
}

export interface ChatMessage {
  id: string
  sessionId: string
  userId?: string
  userName: string
  isAdmin: boolean
  message: string
  read: boolean
  createdAt?: string
}

export interface ChatSession {
  id: string
  userId?: string
  userName: string
  email?: string
  status: "active" | "closed"
  lastMessageAt?: string
  createdAt?: string
  closedAt?: string
}

