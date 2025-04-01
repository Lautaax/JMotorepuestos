import { type NextRequest, NextResponse } from "next/server"
import { getCoupons, createCoupon } from "@/lib/coupons-db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-db"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const coupons = await getCoupons()

    return NextResponse.json({ coupons })
  } catch (error) {
    console.error("Error al obtener cupones:", error)
    return NextResponse.json({ error: "Error al obtener cupones" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y permisos
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const couponData = await request.json()

    // Validar datos del cupón
    if (
      !couponData.code ||
      !couponData.discount ||
      !couponData.discountType ||
      !couponData.validFrom ||
      !couponData.validTo
    ) {
      return NextResponse.json({ error: "Datos de cupón inválidos" }, { status: 400 })
    }

    const newCoupon = await createCoupon(couponData)

    return NextResponse.json(newCoupon, { status: 201 })
  } catch (error) {
    console.error("Error al crear cupón:", error)

    if (error instanceof Error && error.message.includes("Ya existe un cupón con este código")) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json({ error: "Error al crear cupón" }, { status: 500 })
  }
}

