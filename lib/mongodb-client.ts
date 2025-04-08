// This file is for client-side safe imports
// It doesn't import the actual MongoDB driver

export type { ObjectId } from "mongodb"

// Define safe types that can be used on the client
export interface MongoDBDocument {
  _id: string
  [key: string]: any
}

// Client-safe fetch wrapper for MongoDB operations
export async function fetchFromMongoDB<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, options)

  if (!response.ok) {
    throw new Error(`MongoDB operation failed: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}
