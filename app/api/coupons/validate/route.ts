import { type NextRequest, NextResponse } from "next/server"
import { validateCoupon } from "@/lib/coupons-db"

export async function POST(request: NextRequest) {
  try {
    const { code, amount } = await request.json()

    if (!code || !amount) {
      return NextResponse.json({ error: "Código de cupón y monto son requeridos" }, { status: 400 })
    }

    const coupon = await validateCoupon(code, amount)

    if (!coupon) {
      return NextResponse.json({ valid: false, message: "Cupón inválido o expirado" }, { status: 200 })
    }

    // Calcular el descuento
    let discountAmount = 0
    if (coupon.discountType === "percentage") {
      discountAmount = (amount * coupon.discount) / 100
    } else {
      discountAmount = coupon.discount
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
        discountAmount,
      },
    })
  } catch (error) {
    console.error("Error al validar cupón:", error)
    return NextResponse.json({ error: "Error al validar cupón" }, { status: 500 })
  }
}

