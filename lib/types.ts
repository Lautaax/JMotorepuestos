export interface Product {
  id: string
  _id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  stock: number
  category: string
  brand: string
  sku: string
  image: string
  images?: string[]
  featured?: boolean
  specifications?: Record<string, string>
  features?: string[]
  compatibility?: {
    brand: string
    model: string
    year: string
  }[]
  compatibleModels?: string[]
  rating?: number
  reviewCount?: number
  createdAt: string | null
  updatedAt: string | null
}

export interface User {
  id: string
  _id: string
  name: string
  email: string
  password?: string
  role: "admin" | "user"
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  _id: string
  userId: string
  items: {
    productId: string
    quantity: number
    price: number
    name: string
  }[]
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed"
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  createdAt: string
  updatedAt: string
}

export interface Review {
  id: string
  _id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}

export interface Coupon {
  id: string
  _id: string
  code: string
  discount: number
  type: "percentage" | "fixed"
  minPurchase?: number
  maxDiscount?: number
  startDate: string
  endDate: string
  usageLimit?: number
  usageCount: number
  createdAt: string
  updatedAt: string
}

export interface EmailSubscriber {
  id: string
  _id: string
  email: string
  name?: string
  subscribed: boolean
  createdAt: string
  updatedAt: string
}

export interface LoyaltyProgram {
  id: string
  _id: string
  userId: string
  points: number
  tier: "bronze" | "silver" | "gold" | "platinum"
  createdAt: string
  updatedAt: string
}

export interface ChatSession {
  id: string
  _id: string
  userId?: string
  sessionId: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  _id: string
  sessionId: string
  content: string
  role: "user" | "assistant"
  createdAt: string
  updatedAt: string
}

