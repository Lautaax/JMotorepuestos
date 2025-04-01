import type { User } from "@/lib/types"

// Mock data for users
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin Usuario",
    email: "admin@motorepuestos.com",
    role: "admin",
    createdAt: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Juan Pérez",
    email: "juan@example.com",
    role: "customer",
    createdAt: "2023-02-20T14:45:00Z",
  },
  {
    id: "3",
    name: "María García",
    email: "maria@example.com",
    role: "customer",
    createdAt: "2023-03-10T09:15:00Z",
  },
  {
    id: "4",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    role: "customer",
    createdAt: "2023-04-05T16:20:00Z",
  },
]

// Function to get all users
export async function getUsers(): Promise<User[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return mockUsers.map((user) => {
    // Don't return passwords in the response
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  })
}

// Function to get a user by ID
export async function getUserById(id: string): Promise<User | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const user = mockUsers.find((u) => u.id === id)
  if (!user) return null

  // Don't return password in the response
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Function to add a new user
export async function addUser(user: User): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Check if email already exists
  if (mockUsers.some((u) => u.email === user.email)) {
    throw new Error("El email ya está registrado")
  }

  // Generate a new ID
  const newId = (Math.max(...mockUsers.map((u) => Number.parseInt(u.id))) + 1).toString()

  const newUser = {
    ...user,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // In a real app, you would hash the password before storing
  mockUsers.push(newUser)

  // Don't return password in the response
  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

// Function to update a user
export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const index = mockUsers.findIndex((u) => u.id === id)
  if (index === -1) {
    throw new Error("Usuario no encontrado")
  }

  // Check if email is being updated and already exists
  if (updates.email && updates.email !== mockUsers[index].email) {
    if (mockUsers.some((u) => u.email === updates.email)) {
      throw new Error("El email ya está registrado")
    }
  }

  const updatedUser = {
    ...mockUsers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  // In a real app, you would hash the password if it's being updated
  mockUsers[index] = updatedUser

  // Don't return password in the response
  const { password, ...userWithoutPassword } = updatedUser
  return userWithoutPassword
}

// Function to delete a user
export async function deleteUser(id: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const index = mockUsers.findIndex((u) => u.id === id)
  if (index === -1) {
    throw new Error("Usuario no encontrado")
  }

  mockUsers.splice(index, 1)
}

