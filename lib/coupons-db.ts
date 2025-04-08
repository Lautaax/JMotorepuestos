import { ObjectId } from "mongodb"
import { getCollection } from "./mongodb"
import type { Coupon } from "./types"

// Función para convertir _id de MongoDB a id string
function formatCoupon(coupon: any): Coupon {
  return {
    id: coupon._id.toString(),
    code: coupon.code,
    discount: coupon.discount,
    discountType: coupon.discountType,
    minPurchase: coupon.minPurchase,
    maxUses: coupon.maxUses,
    usedCount: coupon.usedCount,
    validFrom: coupon.validFrom,
    validTo: coupon.validTo,
    isActive: coupon.isActive,
    createdAt: coupon.createdAt?.toISOString(),
    updatedAt: coupon.updatedAt?.toISOString(),
  }
}

// Obtener todos los cupones
export async function getCoupons(): Promise<Coupon[]> {
  const couponsCollection = getCollection("coupons")
  const coupons = await couponsCollection.find({}).toArray()
  return coupons.map(formatCoupon)
}

// Obtener un cupón por ID
export async function getCouponById(id: string): Promise<Coupon | null> {
  try {
    const couponsCollection = getCollection("coupons")
    const coupon = await couponsCollection.findOne({ _id: new ObjectId(id) })
    if (!coupon) return null
    return formatCoupon(coupon)
  } catch (error) {
    console.error("Error al obtener cupón por ID:", error)
    return null
  }
}

// Obtener un cupón por código
export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const couponsCollection = getCollection("coupons")
  const coupon = await couponsCollection.findOne({ code: code.toUpperCase() })
  if (!coupon) return null
  return formatCoupon(coupon)
}

// Crear un nuevo cupón
export async function createCoupon(coupon: Omit<Coupon, "id" | "usedCount" | "createdAt">): Promise<Coupon> {
  const couponsCollection = getCollection("coupons")

  // Verificar si ya existe un cupón con el mismo código
  const existingCoupon = await couponsCollection.findOne({ code: coupon.code.toUpperCase() })
  if (existingCoupon) {
    throw new Error("Ya existe un cupón con este código")
  }

  const couponToInsert = {
    ...coupon,
    code: coupon.code.toUpperCase(),
    usedCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await couponsCollection.insertOne(couponToInsert)

  return {
    id: result.insertedId.toString(),
    ...couponToInsert,
    createdAt: couponToInsert.createdAt.toISOString(),
    updatedAt: couponToInsert.updatedAt.toISOString(),
  } as Coupon
}

// Actualizar un cupón
export async function updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
  const couponsCollection = getCollection("coupons")

  // Si se está actualizando el código, verificar que no exista otro cupón con ese código
  if (updates.code) {
    const existingCoupon = await couponsCollection.findOne({
      code: updates.code.toUpperCase(),
      _id: { $ne: new ObjectId(id) },
    })

    if (existingCoupon) {
      throw new Error("Ya existe otro cupón con este código")
    }

    updates.code = updates.code.toUpperCase()
  }

  const updateData = {
    ...updates,
    updatedAt: new Date(),
  }

  await couponsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

  const updatedCoupon = await couponsCollection.findOne({ _id: new ObjectId(id) })
  if (!updatedCoupon) {
    throw new Error("Cupón no encontrado después de la actualización")
  }

  return formatCoupon(updatedCoupon)
}

// Eliminar un cupón
export async function deleteCoupon(id: string): Promise<void> {
  const couponsCollection = getCollection("coupons")
  await couponsCollection.deleteOne({ _id: new ObjectId(id) })
}

// Validar un cupón
export async function validateCoupon(code: string, purchaseAmount: number): Promise<Coupon | null> {
  const coupon = await getCouponByCode(code)

  if (!coupon) return null

  const now = new Date()
  const validFrom = new Date(coupon.validFrom)
  const validTo = new Date(coupon.validTo)

  // Verificar si el cupón está activo y dentro del periodo de validez
  if (!coupon.isActive || now < validFrom || now > validTo) {
    return null
  }

  // Verificar si se ha alcanzado el número máximo de usos
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return null
  }

  // Verificar si se cumple el monto mínimo de compra
  if (coupon.minPurchase && purchaseAmount < coupon.minPurchase) {
    return null
  }

  return coupon
}

// Registrar uso de un cupón
export async function useCoupon(id: string): Promise<void> {
  const couponsCollection = getCollection("coupons")
  await couponsCollection.updateOne(
    { _id: new ObjectId(id) },
    {
      $inc: { usedCount: 1 },
      $set: { updatedAt: new Date() },
    },
  )
}
