import type { ObjectId } from "mongodb"

export type OrderItem = {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

export type ShippingAddress = {
  fullName: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export type PaymentInfo = {
  method: "mercadopago" | "transfer" | "cash"
  status: "pending" | "approved" | "rejected" | "refunded"
  transactionId?: string
  paymentDate?: Date
}

export type Order = {
  _id?: string | ObjectId
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: ShippingAddress
  paymentInfo: PaymentInfo
  notes?: string
  createdAt: Date
  updatedAt?: Date
  shippedAt?: Date
  deliveredAt?: Date
}
