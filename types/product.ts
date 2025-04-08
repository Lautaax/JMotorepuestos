export type Product = {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  sku: string
  categoryId: string
  imageUrl: string
  featured: boolean
  compatibleModels: string[]
  specifications: Record<string, any>
  createdAt?: Date
  updatedAt?: Date
}

export type Category = {
  _id: string
  name: string
  description: string
}
