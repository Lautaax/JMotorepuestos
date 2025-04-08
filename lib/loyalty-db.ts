import { getCollection } from "./mongodb"
import type { LoyaltyProgram, LoyaltyPointsHistory } from "./types"

// Función para convertir _id de MongoDB a id string para programa de fidelización
function formatLoyaltyProgram(program: any): LoyaltyProgram {
  return {
    id: program._id.toString(),
    userId: program.userId,
    points: program.points,
    tier: program.tier,
    pointsHistory: program.pointsHistory || [],
    createdAt: program.createdAt?.toISOString(),
    updatedAt: program.updatedAt?.toISOString(),
  }
}

// Función para convertir _id de MongoDB a id string para historial de puntos
function formatPointsHistory(history: any): LoyaltyPointsHistory {
  return {
    id: history._id.toString(),
    userId: history.userId,
    amount: history.amount,
    type: history.type,
    description: history.description,
    orderId: history.orderId,
    createdAt: history.createdAt?.toISOString(),
  }
}

// Obtener programa de fidelización de un usuario
export async function getUserLoyaltyProgram(userId: string): Promise<LoyaltyProgram | null> {
  const loyaltyCollection = getCollection("loyalty_programs")

  const program = await loyaltyCollection.findOne({ userId })

  if (!program) return null

  // Obtener historial de puntos
  const historyCollection = getCollection("loyalty_points_history")
  const history = await historyCollection.find({ userId }).sort({ createdAt: -1 }).toArray()

  return {
    ...formatLoyaltyProgram(program),
    pointsHistory: history.map(formatPointsHistory),
  }
}

// Crear o actualizar programa de fidelización
export async function createOrUpdateLoyaltyProgram(userId: string): Promise<LoyaltyProgram> {
  const loyaltyCollection = getCollection("loyalty_programs")

  // Verificar si ya existe un programa para este usuario
  const existingProgram = await loyaltyCollection.findOne({ userId })

  if (existingProgram) {
    // Calcular el tier basado en los puntos
    const tier = calculateTier(existingProgram.points)

    // Actualizar si el tier ha cambiado
    if (tier !== existingProgram.tier) {
      await loyaltyCollection.updateOne(
        { _id: existingProgram._id },
        {
          $set: {
            tier,
            updatedAt: new Date(),
          },
        },
      )

      existingProgram.tier = tier
      existingProgram.updatedAt = new Date()
    }

    // Obtener historial de puntos
    const historyCollection = getCollection("loyalty_points_history")
    const history = await historyCollection.find({ userId }).sort({ createdAt: -1 }).toArray()

    return {
      ...formatLoyaltyProgram(existingProgram),
      pointsHistory: history.map(formatPointsHistory),
    }
  }

  // Crear nuevo programa
  const newProgram = {
    userId,
    points: 0,
    tier: "bronze" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await loyaltyCollection.insertOne(newProgram)

  return {
    id: result.insertedId.toString(),
    ...newProgram,
    pointsHistory: [],
    createdAt: newProgram.createdAt.toISOString(),
    updatedAt: newProgram.updatedAt.toISOString(),
  }
}

// Añadir puntos a un usuario
export async function addLoyaltyPoints(
  userId: string,
  amount: number,
  description: string,
  orderId?: string,
): Promise<LoyaltyProgram> {
  if (amount <= 0) {
    throw new Error("La cantidad de puntos debe ser mayor que cero")
  }

  const loyaltyCollection = getCollection("loyalty_programs")
  const historyCollection = getCollection("loyalty_points_history")

  // Obtener o crear programa de fidelización
  let program = await getUserLoyaltyProgram(userId)

  if (!program) {
    program = await createOrUpdateLoyaltyProgram(userId)
  }

  // Actualizar puntos
  const newPoints = program.points + amount
  const tier = calculateTier(newPoints)

  await loyaltyCollection.updateOne(
    { userId },
    {
      $set: {
        points: newPoints,
        tier,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  )

  // Registrar en historial
  const historyEntry = {
    userId,
    amount,
    type: "earned" as const,
    description,
    orderId,
    createdAt: new Date(),
  }

  await historyCollection.insertOne(historyEntry)

  // Obtener programa actualizado
  return (await getUserLoyaltyProgram(userId)) as LoyaltyProgram
}

// Canjear puntos
export async function redeemLoyaltyPoints(
  userId: string,
  amount: number,
  description: string,
): Promise<LoyaltyProgram> {
  if (amount <= 0) {
    throw new Error("La cantidad de puntos debe ser mayor que cero")
  }

  const loyaltyCollection = getCollection("loyalty_programs")
  const historyCollection = getCollection("loyalty_points_history")

  // Obtener programa de fidelización
  const program = await getUserLoyaltyProgram(userId)

  if (!program) {
    throw new Error("El usuario no tiene un programa de fidelización")
  }

  // Verificar si tiene suficientes puntos
  if (program.points < amount) {
    throw new Error("Puntos insuficientes para canjear")
  }

  // Actualizar puntos
  const newPoints = program.points - amount
  const tier = calculateTier(newPoints)

  await loyaltyCollection.updateOne(
    { userId },
    {
      $set: {
        points: newPoints,
        tier,
        updatedAt: new Date(),
      },
    },
  )

  // Registrar en historial
  const historyEntry = {
    userId,
    amount,
    type: "redeemed" as const,
    description,
    createdAt: new Date(),
  }

  await historyCollection.insertOne(historyEntry)

  // Obtener programa actualizado
  return (await getUserLoyaltyProgram(userId)) as LoyaltyProgram
}

// Calcular tier basado en puntos
function calculateTier(points: number): "bronze" | "silver" | "gold" | "platinum" {
  if (points >= 5000) return "platinum"
  if (points >= 2000) return "gold"
  if (points >= 500) return "silver"
  return "bronze"
}

// Obtener beneficios por tier
export function getTierBenefits(tier: "bronze" | "silver" | "gold" | "platinum"): {
  discountPercentage: number
  freeShipping: boolean
  prioritySupport: boolean
  exclusiveOffers: boolean
} {
  switch (tier) {
    case "platinum":
      return {
        discountPercentage: 15,
        freeShipping: true,
        prioritySupport: true,
        exclusiveOffers: true,
      }
    case "gold":
      return {
        discountPercentage: 10,
        freeShipping: true,
        prioritySupport: true,
        exclusiveOffers: false,
      }
    case "silver":
      return {
        discountPercentage: 7,
        freeShipping: false,
        prioritySupport: false,
        exclusiveOffers: false,
      }
    default:
      return {
        discountPercentage: 5,
        freeShipping: false,
        prioritySupport: false,
        exclusiveOffers: false,
      }
  }
}
