export type User = {
  _id: string
  name: string
  email: string
  password?: string
  role: "user" | "admin" | "superadmin"
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  profileImage?: string
  address?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  phone?: string
}
