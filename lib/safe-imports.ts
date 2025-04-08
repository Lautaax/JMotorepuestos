// This file provides safe imports for client components

// Re-export types that are safe to use in client components
export type { Product, Category, User, CartItem, Order } from "./types"

// Client-safe fetch functions
export async function fetchProducts(filters?: Record<string, any>) {
  const queryString = filters ? `?${new URLSearchParams(filters as any).toString()}` : ""
  const response = await fetch(`/api/products${queryString}`)
  if (!response.ok) throw new Error("Failed to fetch products")
  return response.json()
}

export async function fetchProduct(id: string) {
  const response = await fetch(`/api/products/${id}`)
  if (!response.ok) throw new Error(`Failed to fetch product ${id}`)
  return response.json()
}

export async function fetchCategories() {
  const response = await fetch("/api/categories")
  if (!response.ok) throw new Error("Failed to fetch categories")
  return response.json()
}

// Add more fetch functions as needed for other data types
